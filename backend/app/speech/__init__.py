"""
Optional local speech pipeline (ASR + TTS).

Wraps the prebuilt faster-whisper (Nepali) and Piper voice models. Heavy ML
dependencies are imported lazily inside the engines so the base API can run
(and deploy) without them; import them via requirements-speech.txt when you
want real voice locally.
"""

from .asr import ASREngine, get_asr
from .tts import TTSEngine, get_tts

__all__ = ["ASREngine", "get_asr", "TTSEngine", "get_tts"]
