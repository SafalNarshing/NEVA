"""
NEVA RAG — Build (or rebuild) the ChromaDB vector store.
Loads seed chunks (EN + NE) + any JSON files in data/chunks/.
Embedding model: BAAI/bge-m3
"""

import json
import os
import sys
from pathlib import Path

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

from app.rag.seed_protocols    import SEED_CHUNKS
from app.rag.seed_protocols_ne import SEED_CHUNKS_NE
from app.rag.models import ProtocolChunk, ChunkMetadata

CHROMA_PATH     = os.environ.get(
    "NEVA_CHROMA_PATH", str(Path(__file__).resolve().parent / "chroma_db")
)
COLLECTION_NAME = "neva_protocols"
EMBED_MODEL     = os.environ.get("NEVA_EMBED_MODEL", "BAAI/bge-m3")
QUERY_PREFIX    = "Represent this sentence for searching relevant passages: "
CHUNK_DIR       = Path(__file__).resolve().parent / "data" / "chunks"
BATCH_SIZE      = 32


def build(force_rebuild: bool = False):
    client = chromadb.PersistentClient(
        path     = CHROMA_PATH,
        settings = Settings(anonymized_telemetry=False),
    )

    if force_rebuild:
        try:
            client.delete_collection(COLLECTION_NAME)
            print(f"[build_db] Deleted existing collection")
        except Exception:
            pass

    collection = client.get_or_create_collection(
        name     = COLLECTION_NAME,
        metadata = {"hnsw:space": "cosine"},
    )

    all_chunks: list[ProtocolChunk] = []
    all_chunks.extend(SEED_CHUNKS)
    all_chunks.extend(SEED_CHUNKS_NE)

    if CHUNK_DIR.exists():
        for json_file in CHUNK_DIR.glob("*.json"):
            with open(json_file, encoding="utf-8") as f:
                raw = json.load(f)
            for item in raw:
                try:
                    meta  = ChunkMetadata(**{k: v for k, v in item.items() if k != "text"})
                    chunk = ProtocolChunk(metadata=meta, text=item["text"])
                    all_chunks.append(chunk)
                except Exception as e:
                    print(f"[build_db] Skipping malformed chunk: {e}")

    existing_ids = set(collection.get(include=[])["ids"])
    new_chunks   = [c for c in all_chunks if c.metadata.chunk_id not in existing_ids]

    print(f"[build_db] Total chunks : {len(all_chunks)}")
    print(f"[build_db] New chunks   : {len(new_chunks)}")

    if not new_chunks:
        print(f"[build_db] Nothing new. Collection has {collection.count()} chunks.")
        return collection

    model  = SentenceTransformer(EMBED_MODEL)
    texts  = [c.text for c in new_chunks]
    embeddings = model.encode(
        texts,
        normalize_embeddings = True,
        show_progress_bar    = True,
        batch_size           = 16,
    ).tolist()

    for i, (chunk, emb) in enumerate(zip(new_chunks, embeddings)):
        flat = chunk.metadata.to_chroma_meta()
        collection.add(
            ids        = [chunk.metadata.chunk_id],
            embeddings = [emb],
            documents  = [chunk.text],
            metadatas  = [flat],
        )

    print(f"[build_db] ✓ Collection now has {collection.count()} chunks.")
    return collection


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--rebuild", action="store_true")
    args = parser.parse_args()
    build(force_rebuild=args.rebuild)
