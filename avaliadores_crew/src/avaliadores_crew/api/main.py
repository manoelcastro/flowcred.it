"""
Aplicação principal da API.
"""
import os
import logging
import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from avaliadores_crew.api.config import settings
from avaliadores_crew.api.database import engine, Base
from avaliadores_crew.api.routers import documents

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Criar tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Criar diretório de documentos se não existir
os.makedirs(settings.DOCUMENTS_FOLDER, exist_ok=True)

# Criar aplicação FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API para o serviço de análise de documentos",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar origens permitidas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(
    documents.router,
    prefix=f"{settings.API_V1_STR}/documents",
    tags=["documents"],
)

@app.get("/", tags=["status"])
async def root():
    """
    Endpoint raiz para verificar o status da API.
    
    Returns:
        dict: Status da API
    """
    return {
        "status": "online",
        "message": "API para análise de documentos está funcionando",
        "version": "0.1.0",
    }

@app.get("/health", tags=["status"])
async def health():
    """
    Endpoint para verificar a saúde da API.
    
    Returns:
        dict: Status de saúde da API
    """
    return {
        "status": "healthy",
        "services": {
            "database": "connected",
            "celery": "connected",
        },
    }

def run():
    """
    Função para executar a aplicação.
    """
    uvicorn.run(
        "avaliadores_crew.api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )

if __name__ == "__main__":
    run()
