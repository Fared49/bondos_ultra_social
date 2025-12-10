import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://appuser:apppassword@db:5432/appdb")
    REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    SECRET_KEY = os.getenv("SECRET_KEY", "change-this-in-production")
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

config = Config()
