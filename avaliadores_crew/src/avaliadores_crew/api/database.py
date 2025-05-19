"""
Configuração do banco de dados usando SQLAlchemy.
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from avaliadores_crew.api.config import settings

# Criar engine do SQLAlchemy
engine = create_engine(
    settings.DATABASE_URL, connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)

# Criar sessão
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os modelos
Base = declarative_base()

# Função para obter uma sessão do banco de dados
def get_db():
    """
    Função para obter uma sessão do banco de dados.
    Deve ser usada como dependência nas rotas da API.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
