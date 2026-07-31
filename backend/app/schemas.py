"""Request / response models shared across endpoints.

These mirror the frontend contract in `frontend/src/services/api.js`:
    { messages: [{role, content}], image?, mode? }  ->  { reply, followUp? }
"""

from typing import Literal, Optional

from pydantic import BaseModel, Field

Role = Literal["system", "user", "assistant"]


class Message(BaseModel):
    role: Role
    content: str


class ChatRequest(BaseModel):
    messages: list[Message] = Field(default_factory=list)
    # Optional base64 data URL (e.g. "data:image/jpeg;base64,...") for vision.
    image: Optional[str] = None
    mode: Literal["chat", "live"] = "chat"
    # "en", "ne", or "auto" (let the model mirror the user's language).
    language: Literal["en", "ne", "auto"] = "auto"


class ChatResponse(BaseModel):
    reply: str
    followUp: Optional[str] = None
    mode: str = "chat"


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str
    version: str
    model: str
    mock_mode: bool
    speech_enabled: bool = False
