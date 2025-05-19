# API para Análise de Documentos

Esta API permite acesso ao serviço de análise de documentos do Avaliadores Crew. Como o serviço de análise é demorado, a API utiliza um sistema de fila para gerenciar as solicitações.

## Tecnologias Utilizadas

- **FastAPI**: Framework para criação da API RESTful
- **Celery**: Sistema de fila para processamento assíncrono
- **Redis**: Broker de mensagens para o Celery
- **SQLAlchemy**: ORM para persistência de dados
- **Pydantic**: Validação de dados e serialização
- **Uvicorn**: Servidor ASGI para executar a aplicação FastAPI

## Configuração

1. Copie o arquivo `.env.example` para `.env` e ajuste as configurações conforme necessário:

```bash
cp .env.example .env
```

2. Instale as dependências:

```bash
pip install -e .
```

3. Inicie o Redis (necessário para o Celery):

```bash
# Usando Docker
docker run -d -p 6379:6379 redis

# Ou instale e execute o Redis localmente
# sudo apt-get install redis-server
# redis-server
```

## Execução

### Iniciar a API

```bash
# Usando o script de entrada
api

# Ou diretamente
python -m avaliadores_crew.api.main
```

A API estará disponível em `http://localhost:8000`.

### Iniciar o Worker do Celery

```bash
# Em outro terminal
cd avaliadores_crew
celery -A avaliadores_crew.api.celery_app worker --loglevel=info
```

## Endpoints da API

### Status da API

- `GET /`: Verifica se a API está online
- `GET /health`: Verifica a saúde dos serviços

### Análise de Documentos

- `POST /api/v1/documents/upload`: Envia um documento para análise
  - Parâmetros:
    - `file`: Arquivo a ser analisado (PDF, DOCX, DOC, TXT)
    - `tipo_documento`: Tipo de documento (`contrato_social`, `balanco_patrimonial`, `dre`)

- `GET /api/v1/documents/solicitacoes`: Lista todas as solicitações
  - Parâmetros opcionais:
    - `skip`: Número de registros para pular (padrão: 0)
    - `limit`: Número máximo de registros para retornar (padrão: 100)

- `GET /api/v1/documents/solicitacoes/{uuid}`: Obtém detalhes de uma solicitação
  - Parâmetros:
    - `uuid`: UUID da solicitação

- `GET /api/v1/documents/resultados/{uuid}`: Obtém o resultado da análise de uma solicitação
  - Parâmetros:
    - `uuid`: UUID da solicitação

## Documentação da API

- Swagger UI: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`
- OpenAPI JSON: `http://localhost:8000/api/openapi.json`

## Fluxo de Trabalho

1. O cliente envia um documento para análise através do endpoint `/api/v1/documents/upload`
2. A API salva o documento, cria uma solicitação no banco de dados e adiciona a tarefa à fila do Celery
3. O worker do Celery processa a solicitação em segundo plano
4. O cliente pode verificar o status da solicitação através do endpoint `/api/v1/documents/solicitacoes/{uuid}`
5. Quando a análise for concluída, o cliente pode obter o resultado através do endpoint `/api/v1/documents/resultados/{uuid}`

## Status das Solicitações

- `pendente`: A solicitação foi criada, mas ainda não foi processada
- `em_processamento`: A solicitação está sendo processada
- `concluido`: A solicitação foi processada com sucesso
- `erro`: Ocorreu um erro durante o processamento da solicitação
