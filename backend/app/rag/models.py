"""
NEVA RAG — Pydantic models.
Contract between: chunker → ChromaDB → retriever → Gemma prompt builder.
"""

from __future__ import annotations
from typing import Literal, Optional
from pydantic import BaseModel, Field


# ── Type aliases ──────────────────────────────────────────────────────────────

StepType     = Literal["overview", "assessment", "action", "warning", "do_not"]
AgeGroup     = Literal["adult", "paediatric", "both"]
LanguageCode = Literal["en", "ne"]
Source       = Literal[
    "WHO_BEC_2016",
    "Nepal_MoHP_2078",
    "WHO_PHEC_2026",
    "NEVA_SEED",
]


# ── Chunk metadata ────────────────────────────────────────────────────────────

class ChunkMetadata(BaseModel):
    chunk_id:       str
    condition:      str
    condition_tags: list[str]       = Field(default_factory=list)
    urgency_level:  int             = Field(..., ge=1, le=5)
    age_group:      AgeGroup
    language:       LanguageCode
    source:         Source
    step_type:      StepType
    section:        str
    page_ref:       Optional[str]   = None
    keywords:       list[str]       = Field(default_factory=list)

    def to_chroma_meta(self) -> dict:
        """
        ChromaDB Rust backend only accepts: str, int, float, bool.
        Rules applied here:
          - list[str]    → pipe-joined str
          - None         → empty string ""
          - everything else passes through as-is
        """
        d = self.model_dump()

        # Flatten lists
        d["condition_tags"] = "|".join(d["condition_tags"]) if d["condition_tags"] else ""
        d["keywords"]       = "|".join(d["keywords"])       if d["keywords"]       else ""

        # Replace ANY remaining None with ""
        sanitised = {}
        for k, v in d.items():
            if v is None:
                sanitised[k] = ""
            elif isinstance(v, list):
                # Safety net: should not reach here, but flatten anyway
                sanitised[k] = "|".join(str(x) for x in v)
            else:
                sanitised[k] = v

        return sanitised


# ── Protocol chunk ────────────────────────────────────────────────────────────

class ProtocolChunk(BaseModel):
    metadata: ChunkMetadata
    text:     str


# ── Retrieval request ─────────────────────────────────────────────────────────

class RetrievalRequest(BaseModel):
    query:         str
    condition:     Optional[str]      = None
    urgency_level: Optional[int]      = Field(None, ge=1, le=5)
    age_group:     Optional[AgeGroup] = None
    language:      LanguageCode       = "en"
    top_k:         int                = Field(5, ge=1, le=15)


# ── Retrieval result ──────────────────────────────────────────────────────────

class RetrievedChunk(BaseModel):
    chunk_id:      str
    condition:     str
    urgency_level: int
    step_type:     StepType
    source:        str
    text:          str
    score:         float

class RetrievalResult(BaseModel):
    query:    str
    chunks:   list[RetrievedChunk]
    grounded: bool
