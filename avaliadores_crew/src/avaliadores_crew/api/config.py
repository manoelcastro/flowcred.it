"""
Configurações da API e do sistema de fila.
"""
import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

class Settings(BaseSettings):
    """Configurações da aplicação."""
    
    # Configurações da API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Avaliadores Crew API"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Configurações do banco de dados
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./avaliadores_crew.db")
    
    # Configurações do Celery/Redis
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
    
    # Configurações do serviço de análise de documentos
    DOCUMENTS_FOLDER: str = os.getenv("DOCUMENTS_FOLDER", "documentos")
    
    # Configurações de segurança
    SECRET_KEY: str = os.getenv("SECRET_KEY", "insecure-secret-key-for-dev")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    class Config:
        case_sensitive = True

settings = Settings()
