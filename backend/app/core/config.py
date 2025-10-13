from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    # This now correctly tells Pydantic to look for the .env file
    # in the same directory that the 'uvicorn' command is run from.
    model_config = SettingsConfigDict(env_file="./.env") 

    DATABASE_URL: str
    GEMINI_API_KEY: str 

@lru_cache()
def get_settings():
    return Settings()

# Create a single instance that the rest of our app can import
settings = get_settings()
