"""
Configuração do Celery para processamento assíncrono.
"""
from celery import Celery
from avaliadores_crew.api.config import settings

# Criar aplicação Celery
celery_app = Celery(
    "avaliadores_crew",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["avaliadores_crew.api.tasks"]
)

# Configurações do Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600 * 2,  # 2 horas
    worker_max_tasks_per_child=10,
    broker_connection_retry_on_startup=True
)
