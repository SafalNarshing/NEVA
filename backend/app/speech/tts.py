"""
Text-to-speech via Piper ONNX voices.

Auto-selects the Nepali voice when the text contains Devanagari, otherwise the
English voice — matching the prebuilt pipeline. Voices load lazily and are
cached per language. Output is 16-bit PCM WAV at 22.05 kHz.
"""

import io
import wave
from functools import lru_cache
from pathlib import Path

from ..config import Settings, get_settings
from .asr import SpeechUnavailable

SAMPLE_RATE = 22050


def _is_nepali(text: str) -> bool:
    """True if the text contains any Devanagari character."""
    return any("ऀ" <= ch <= "ॿ" for ch in text)


class TTSEngine:
    def __init__(self, settings: Settings):
        self._settings = settings
        base = Path(settings.tts_model_dir)
        self._ne_model = base / settings.tts_ne_model
        self._en_model = base / settings.tts_en_model
        self._ne_voice = None
        self._en_voice = None

    def _load_voice(self, model_path: Path):
        try:
            from piper import PiperVoice
        except ImportError as exc:  # pragma: no cover - env dependent
            raise SpeechUnavailable(
                "piper-tts is not installed. Run: "
                "pip install -r requirements-speech.txt"
            ) from exc

        config_path = model_path.with_suffix(model_path.suffix + ".json")
        if not model_path.exists():
            raise SpeechUnavailable(
                f"TTS model not found: {model_path}. Set TTS_MODEL_DIR to the "
                "folder holding the Piper .onnx voices."
            )
        return PiperVoice.load(str(model_path), config_path=str(config_path))

    def _voice_for(self, text: str):
        if _is_nepali(text):
            if self._ne_voice is None:
                self._ne_voice = self._load_voice(self._ne_model)
            return self._ne_voice
        if self._en_voice is None:
            self._en_voice = self._load_voice(self._en_model)
        return self._en_voice

    def synthesize(self, text: str) -> bytes:
        """Synthesize ``text`` and return WAV bytes."""
        import numpy as np

        voice = self._voice_for(text)
        samples = []
        for chunk in voice.synthesize(text):
            samples.append((chunk.audio_float_array * 32767).astype(np.int16))
        audio = (
            np.concatenate(samples) if samples else np.array([], dtype=np.int16)
        )

        buffer = io.BytesIO()
        with wave.open(buffer, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(SAMPLE_RATE)
            wf.writeframes(audio.tobytes())
        return buffer.getvalue()


@lru_cache
def get_tts() -> TTSEngine:
    return TTSEngine(get_settings())
