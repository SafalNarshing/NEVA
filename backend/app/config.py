"""
Application configuration.

All sensitive / environment-specific values are loaded from environment
variables (or a local .env file) via pydantic-settings. This keeps secrets out
of the code and makes switching model providers (Llama -> Hugging Face -> Groq)
a config-only change.
"""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- App ---------------------------------------------------------------
    app_name: str = "NEVA API"
    environment: str = Field(default="development")

    # --- Model provider (OpenAI-compatible) --------------------------------
    # Base URL of the provider, WITHOUT the trailing /chat/completions.
    #   Groq:        https://api.groq.com/openai/v1
    #   HF Router:   https://router.huggingface.co/v1
    #   Ollama:      http://localhost:11434/v1
    #   Together:    https://api.together.xyz/v1
    model_api_url: str = Field(default="", alias="MODEL_API_URL")
    model_api_key: str = Field(default="", alias="MODEL_API_KEY")
    model_name: str = Field(default="llama-3.1-8b-instant", alias="MODEL_NAME")

    # "openai" for any OpenAI-compatible provider (Groq, HF, Together, OpenAI),
    # or "ollama" to use Ollama's native /api/chat (needed to reliably suppress
    # reasoning on models like gemma4:12b). With "ollama", MODEL_API_URL may be
    # the /v1 base or the root — both are handled.
    llm_provider: str = Field(default="openai", alias="LLM_PROVIDER")

    # Generation defaults
    request_timeout: float = Field(default=45.0, alias="REQUEST_TIMEOUT")
    temperature: float = Field(default=0.4, alias="TEMPERATURE")
    max_tokens: int = Field(default=512, alias="MAX_TOKENS")

    # If the provider is a true vision model (e.g. Gemma 3), enable image parts.
    vision_enabled: bool = Field(default=False, alias="VISION_ENABLED")

    # Reasoning models (e.g. gemma4:12b on Ollama) spend tokens on hidden
    # "thinking" before answering, which can swallow the whole budget and leave
    # an empty reply. When true we send {"think": false} to suppress it. Only
    # enable for providers that accept this field (Ollama) — OpenAI/Groq reject
    # unknown body params, so keep it off for those.
    disable_thinking: bool = Field(default=False, alias="DISABLE_THINKING")

    # NOTE: ASR + TTS are handled by a separate local speech service (see the
    # prebuilt repo's server.py). The frontend calls it directly via
    # VITE_SPEECH_URL. This orchestrator stays LLM-only.

    # --- RAG (WHO / MoHP protocol grounding) -------------------------------
    # Off by default so the base API runs without the heavy embedding stack.
    # Enable after: pip install -r requirements-rag.txt && python -m app.rag.build_db
    rag_enabled: bool = Field(default=False, alias="RAG_ENABLED")
    rag_top_k: int = Field(default=5, alias="RAG_TOP_K")
    rag_max_chunks: int = Field(default=4, alias="RAG_MAX_CHUNKS")
    # When True, a query with no grounded protocol injects a hard "no verified
    # protocol → call 102" block. When False, RAG is simply skipped for that
    # turn (keeps casual/follow-up chat flowing). Safety-first deployments may
    # prefer True.
    rag_strict: bool = Field(default=False, alias="RAG_STRICT")

    # --- CORS --------------------------------------------------------------
    # Comma-separated list of allowed origins, or "*" for all.
    allowed_origins: str = Field(default="*", alias="ALLOWED_ORIGINS")

    # --- Fallback ----------------------------------------------------------
    # When true, or when no API key is configured, endpoints return canned
    # first-aid guidance so the full pipeline works with zero external setup.
    use_mock: bool = Field(default=False, alias="USE_MOCK")

    @property
    def cors_origins(self) -> list[str]:
        if self.allowed_origins.strip() == "*":
            return ["*"]
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def mock_mode(self) -> bool:
        """Mock when explicitly requested or when no credentials are present."""
        return self.use_mock or not (self.model_api_url and self.model_api_key)


@lru_cache
def get_settings() -> Settings:
    """Cached settings singleton."""
    return Settings()
