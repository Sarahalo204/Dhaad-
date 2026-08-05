from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import analyze, speech, relationships, explain, game, tashkeel
from app.core.config import settings

app = FastAPI(
    title="Dhaad AI API",
    description="Backend for Bayan AI - Arabic NLP and LLM platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api")
app.include_router(speech.router, prefix="/api")
app.include_router(relationships.router, prefix="/api")
app.include_router(explain.router, prefix="/api")
app.include_router(game.router, prefix="/api")
app.include_router(tashkeel.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Bayan AI API"}
