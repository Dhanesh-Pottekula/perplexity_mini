import os
from dotenv import load_dotenv
from typing import Optional

# Load environment variables from .env file
load_dotenv()


class EnvironmentConfig:
    """Environment configuration class to manage all environment variables"""

    # OpenRouter API Configuration
    OPENROUTER_API_KEY: Optional[str] = os.getenv("OPENROUTER_API_KEY")
    OPENROUTER_BASE_URL: str = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")

    # Qdrant Configuration
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")


    NGINX_URL: str = os.getenv("NGINX_URL", "http://localhost:8000")
    MAX_CONCURRENT_LLM_CALLS: int = int(os.getenv("MAX_CONCURRENT_LLM_CALLS", "3"))
    # Embedding Model Configuration
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "paraphrase-MiniLM-L12-v2")
    VECTOR_SIZE: int = int(os.getenv("VECTOR_SIZE", "384"))

    # Application Configuration
    APP_NAME: str = os.getenv("APP_NAME", "Embedding Service")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    # API Configuration
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))

    # Logging Configuration
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    @classmethod
    def validate_required_vars(cls) -> None:
        """Validate that all required environment variables are set"""
        required_vars = {
            "OPENROUTER_API_KEY": cls.OPENROUTER_API_KEY,
        }
        missing_vars = [var for var, value in required_vars.items() if not value]

        if missing_vars:
            raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

    @classmethod
    def get_all_config(cls) -> dict:
        """Get all configuration as a dictionary"""
        return {
            "openrouter_api_key": cls.OPENROUTER_API_KEY,
            "openrouter_base_url": cls.OPENROUTER_BASE_URL,
            "qdrant_url": cls.QDRANT_URL,
            "embedding_model": cls.EMBEDDING_MODEL,
            "vector_size": cls.VECTOR_SIZE,
            "app_name": cls.APP_NAME,
            "debug": cls.DEBUG,
            "api_host": cls.API_HOST,
            "api_port": cls.API_PORT,
            "log_level": cls.LOG_LEVEL,
        }


# Create a global instance for easy access
config = EnvironmentConfig()
