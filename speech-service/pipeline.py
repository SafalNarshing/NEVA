import os
import wave
from pathlib import Path

import httpx
import numpy as np
from faster_whisper import WhisperModel
from piper import PiperVoice


MODEL_DIR = Path("models")
TTS_NE_MODEL_PATH = MODEL_DIR / "TTS" / "ne_NP-google-medium.onnx"
TTS_NE_CONFIG_PATH = MODEL_DIR / "TTS" / "ne_NP-google-medium.onnx.json"
TTS_EN_MODEL_PATH = MODEL_DIR / "TTS" / "en_US-lessac-medium.onnx"
TTS_EN_CONFIG_PATH = MODEL_DIR / "TTS" / "en_US-lessac-medium.onnx.json"
# ASR model — override with ASR_MODEL_NAME. For lowest latency on CPU use a
# small model (e.g. "small" ≈ 0.5s), trading a little Nepali accuracy for speed.
ASR_MODEL_NAME = os.getenv("ASR_MODEL_NAME", "Dragneel/whisper-medium-nepali-openslr-ct2")
ASR_COMPUTE_TYPE = os.getenv("ASR_COMPUTE_TYPE", "int8")
OLLAMA_MODEL = "gemma4:12b"
OLLAMA_API = "http://localhost:11434/api/generate"


class ASREngine:
    def __init__(self, model_name=ASR_MODEL_NAME, device="cpu", compute_type="int8"):
        self.model_name = model_name
        self.device = device
        self.compute_type = compute_type
        self._model = None

    def _load_model(self):
        if self._model is None:
            self._model = WhisperModel(
                self.model_name, device=self.device, compute_type=self.compute_type
            )

    def transcribe(self, audio_path: str, language=None) -> str:
        self._load_model()
        segments, _ = self._model.transcribe(audio_path, beam_size=5, language=language)
        return " ".join(segment.text.strip() for segment in segments)


class LLMEngine:
    def __init__(self, model=OLLAMA_MODEL, api_url=OLLAMA_API):
        self.model = model
        self.api_url = api_url

    def generate(self, prompt: str, system_prompt: str = None) -> str:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
        }
        if system_prompt:
            payload["system"] = system_prompt

        with httpx.Client(timeout=120) as client:
            resp = client.post(self.api_url, json=payload)
            resp.raise_for_status()
            return resp.json().get("response", "").strip()


def _is_nepali(text: str) -> bool:
    return any("ऀ" <= ch <= "ॿ" for ch in text)


class TTSEngine:
    def __init__(self, ne_model_path=TTS_NE_MODEL_PATH, ne_config_path=TTS_NE_CONFIG_PATH,
                 en_model_path=TTS_EN_MODEL_PATH, en_config_path=TTS_EN_CONFIG_PATH):
        self.ne_model_path = str(ne_model_path)
        self.ne_config_path = str(ne_config_path)
        self.en_model_path = str(en_model_path)
        self.en_config_path = str(en_config_path)
        self._ne_voice = None
        self._en_voice = None

    def _voice_for(self, text: str):
        if _is_nepali(text):
            if self._ne_voice is None:
                self._ne_voice = PiperVoice.load(self.ne_model_path, config_path=self.ne_config_path)
            return self._ne_voice
        if self._en_voice is None:
            self._en_voice = PiperVoice.load(self.en_model_path, config_path=self.en_config_path)
        return self._en_voice

    def synthesize(self, text: str, output_path: str) -> str:
        voice = self._voice_for(text)
        samples = []
        for chunk in voice.synthesize(text):
            audio_int16 = (chunk.audio_float_array * 32767).astype(np.int16)
            samples.append(audio_int16)
        audio = np.concatenate(samples) if samples else np.array([], dtype=np.int16)
        with wave.open(output_path, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(22050)
            wf.writeframes(audio.tobytes())
        return output_path
