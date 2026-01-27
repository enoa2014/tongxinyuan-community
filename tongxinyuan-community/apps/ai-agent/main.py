from fastapi import FastAPI
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Tongxinyuan AI Agent")

@app.get("/")
def read_root():
    return {
        "service": "Tongxinyuan AI Agent",
        "status": "active",
        "brand": "Spring Green",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    # TODO: Add DB check
    return {"status": "ok", "db": "unknown"}
