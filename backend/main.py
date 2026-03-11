"""
Sales Insight Automator - FastAPI Backend
==========================================
Production-ready API for AI-powered sales data analysis.
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from routers.analyze import router as analyze_router


def get_allowed_origins() -> list[str]:
    """Build the list of allowed CORS origins from environment."""
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    origins = [
        frontend_url,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    return list(set(origins))


limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager – startup / shutdown hooks."""
    # --- startup ---
    print("Sales Insight Automator API is starting ...")
    yield
    # --- shutdown ---
    print("Sales Insight Automator API is shutting down ...")


app = FastAPI(
    title="Sales Insight Automator API",
    description=(
        "Upload CSV / XLSX sales datasets and receive AI-generated "
        "executive summaries delivered straight to your inbox."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# --- Rate limiting ---
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
app.include_router(analyze_router)


@app.get("/", tags=["Health"])
async def health_check():
    """Health-check endpoint for uptime monitors."""
    return {"status": "healthy", "service": "Sales Insight Automator API"}
