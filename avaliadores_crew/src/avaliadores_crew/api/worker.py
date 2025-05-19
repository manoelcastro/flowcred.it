"""
Worker do Celery para processamento assíncrono.
"""
import os
import logging
from avaliadores_crew.api.celery_app import celery_app

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Iniciando worker do Celery")
    celery_app.worker_main(["worker", "--loglevel=info"])
