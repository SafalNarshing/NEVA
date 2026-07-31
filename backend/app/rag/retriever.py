"""
NEVA RAG — Core retrieval module.
This is the ONLY module the rest of NEVA imports from the RAG layer.
"""

from __future__ import annotations
import os
from functools import lru_cache
from pathlib import Path

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

from app.rag.models import RetrievalRequest, RetrievalResult, RetrievedChunk

# ── Config (env-overridable; keep in sync with build_db.py) ───────────────────

CHROMA_PATH     = os.environ.get(
    "NEVA_CHROMA_PATH", str(Path(__file__).resolve().parent / "chroma_db")
)
COLLECTION_NAME = "neva_protocols"
EMBED_MODEL     = os.environ.get("NEVA_EMBED_MODEL", "BAAI/bge-m3")
QUERY_PREFIX    = "Represent this sentence for searching relevant passages: "
SCORE_THRESHOLD = float(os.environ.get("NEVA_RAG_THRESHOLD", "0.75"))  # cosine distance


# ── Lazy singletons ───────────────────────────────────────────────────────────

@lru_cache(maxsize=1)
def _get_model() -> SentenceTransformer:
    print(f"[retriever] Loading {EMBED_MODEL} ...")
    return SentenceTransformer(EMBED_MODEL)


@lru_cache(maxsize=1)
def _get_collection():
    client = chromadb.PersistentClient(
        path     = CHROMA_PATH,
        settings = Settings(anonymized_telemetry=False),
    )
    return client.get_collection(COLLECTION_NAME)


# ── Main retrieval function ───────────────────────────────────────────────────

def retrieve(request: RetrievalRequest) -> RetrievalResult:
    """
    Core retrieval function called by the Gemma reasoning stage.

    1. Embeds the query with bge-m3.
    2. Applies metadata filters (language, age_group, urgency_level).
    3. Returns top-k chunks ranked by cosine similarity.
    4. Sets grounded=True if at least one chunk is below SCORE_THRESHOLD.
    """
    model      = _get_model()
    collection = _get_collection()

    # ── Embed query ───────────────────────────────────────────────────────────
    query_vec = model.encode(
        QUERY_PREFIX + request.query,
        normalize_embeddings = True,
    ).tolist()

    # ── Build metadata filter ─────────────────────────────────────────────────
    filters = []

    if request.language:
        filters.append({"language": {"$eq": request.language}})

    if request.age_group and request.age_group != "both":
        filters.append({"age_group": {"$in": [request.age_group, "both"]}})

    if request.urgency_level is not None:
        filters.append({"urgency_level": {"$gte": request.urgency_level}})

    where = (
        {"$and": filters} if len(filters) > 1
        else filters[0]   if len(filters) == 1
        else None
    )

    # ── Query ChromaDB ────────────────────────────────────────────────────────
    def _query(where_clause):
        kwargs = dict(
            query_embeddings = [query_vec],
            n_results        = request.top_k,
            include          = ["documents", "metadatas", "distances"],
        )
        if where_clause:
            kwargs["where"] = where_clause
        return collection.query(**kwargs)

    try:
        results = _query(where)
    except Exception as e:
        # Filter may yield 0 results in ChromaDB — fall back to unfiltered
        print(f"[retriever] Filter failed ({e}), falling back to unfiltered query")
        results = _query(None)

    # ── Parse results ─────────────────────────────────────────────────────────
    docs      = results["documents"][0]
    metas     = results["metadatas"][0]
    distances = results["distances"][0]

    chunks = [
        RetrievedChunk(
            chunk_id      = m["chunk_id"],
            condition     = m["condition"],
            urgency_level = int(m["urgency_level"]),
            step_type     = m["step_type"],
            source        = m["source"],
            text          = doc,
            score         = round(dist, 4),
        )
        for doc, m, dist in zip(docs, metas, distances)
    ]

    grounded = any(c.score < SCORE_THRESHOLD for c in chunks)

    return RetrievalResult(
        query    = request.query,
        chunks   = chunks,
        grounded = grounded,
    )


# ── Prompt formatter ──────────────────────────────────────────────────────────

def format_for_prompt(result: RetrievalResult, max_chunks: int = 4) -> str:
    """
    Formats retrieved chunks into the block injected into Gemma\'s system prompt.
    Only includes chunks that passed the score threshold (verified retrieval).
    If no chunk passes: returns a hard refusal block.
    """
    verified = [c for c in result.chunks if c.score < SCORE_THRESHOLD][:max_chunks]

    if not verified:
        return (
            "[PROTOCOL RETRIEVAL FAILED: No verified protocol matched this query.\n"
            "DO NOT provide medical advice.\n"
            "Tell the user: I do not have a verified protocol for this situation. "
            "Please call emergency services immediately — dial 102.]"
        )

    lines = [
        "══════════════════════════════════════════════════════",
        "VERIFIED MEDICAL PROTOCOLS — Use ONLY the information",
        "below. Do not add, invent, or infer beyond this.     ",
        "══════════════════════════════════════════════════════",
        "",
    ]

    for i, chunk in enumerate(verified, 1):
        lines += [
            f"--- Protocol {i} of {len(verified)} ---",
            f"Condition     : {chunk.condition}",
            f"Urgency       : {chunk.urgency_level}/5",
            f"Type          : {chunk.step_type}",
            f"Source        : {chunk.source}",
            f"Match score   : {chunk.score:.4f} (lower = better)",
            "",
            chunk.text,
            "",
        ]

    lines += [
        "══════════════════════════════════════════════════════",
        "END OF VERIFIED PROTOCOLS",
        "══════════════════════════════════════════════════════",
    ]

    return "\n".join(lines)
