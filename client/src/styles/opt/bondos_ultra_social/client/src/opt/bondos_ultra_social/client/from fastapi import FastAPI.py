from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from .config import config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Bondos Ultra Social API", version="0.1.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "ok",
        "environment": config.ENVIRONMENT,
        "debug": config.DEBUG
    }

@app.get("/api/status")
async def api_status():
    """API status endpoint"""
    return {
        "message": "Bondos Ultra Social - Backend is running",
        "version": "0.1.0"
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "Bondos Ultra Social",
        "description": "Enterprise Social Platform",
        "api_docs": "/docs"
    }

@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting app in {config.ENVIRONMENT} mode")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down app")
