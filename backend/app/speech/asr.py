"""
Speech-to-text via faster-whisper (CTranslate2).

Mirrors the prebuilt pipeline: a Nepali-tuned Whisper model that also handles
English. The model is downloaded once (from the HF hub) and cached; loading is
lazy so importing this module is cheap.
"""

from functools import lru_cache

from ..config import Settings, get_settings


class SpeechUnavailable(RuntimeError):
    """Raised when speech deps aren't installed or a model can't load."""


class ASREngine:
    def __init__(self, settings: Settings):
        self._settings = settings
        self._model = None

    def _load(self):
        if self._model is not None:
            return
        try:
            from faster_whisper import WhisperModel
        except ImportError as exc:  # pragma: no cover - env dependent
            raise SpeechUnavailable(
                "faster-whisper is not installed. Run: "
                "pip install -r requirements-speech.txt"
            ) from exc

        self._model = WhisperModel(
            self._settings.asr_model_name,
            device=self._settings.asr_device,
            compute_type=self._settings.asr_compute_type,
        )

    def transcribe(self, audio_path: str, language: str | None = None) -> str:
        """Return the transcript text for a WAV file at ``audio_path``."""
        self._load()
        segments, _ = self._model.transcribe(
            audio_path, beam_size=5, language=language
        )
        return " ".join(seg.text.strip() for seg in segments).strip()


@lru_cache
def get_asr() -> ASREngine:
    return ASREngine(get_settings())
