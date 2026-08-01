# Atende AI

Plataforma de gestão de chamados com frontend em React, backend em Laravel (PHP) e banco de dados PostgreSQL, orquestrada via Docker.

## Pré-requisitos

- [Docker](https://www.docker.com/products/docker-desktop/) (com Docker Compose)
- Node.js e PHP apenas se for rodar sem Docker (opcional)

## Estrutura do projeto

```
.
├── docker-compose.yml
├── backend/              # API Laravel (PHP 8.4)
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/             # SPA React (Vite + Tailwind)│   ├── Dockerfile
│   ├── package.json
│   └── src/
└── README.md
```

## Serviços

| Serviço   | Tecnologia      | Porta |
| --------- | --------------- | ----- |
| `db`      | PostgreSQL 16   | 5432  |
| `backend` | PHP 8.4 + Laravel | 9000  |
| `frontend`| Node 20 + Vite  | 5173  |

## Como rodar

### 1. Subir os containers

```powershell
docker compose up --build
```

Para rodar em segundo plano:

```powershell
docker compose up --build -d
```

> No primeiro start, o `entrypoint` do backend instala as dependências do Composer e gera o `.env` com a `APP_KEY` automaticamente. Não é preciso executar nada manualmente.

### 2. Rodar as migrations (primeira vez)

```powershell
docker compose exec backend php artisan migrate
```

### 3. Acessar

- Frontend: http://localhost:5173
- Backend: http://localhost:9000
- PostgreSQL: `localhost:5432`

## Rodar sem os projetos escafoldados

As pastas `backend/` e `frontend/` já contêm o projeto, mas caso queira recriar do zero:

**Backend (Laravel):**

```powershell
docker run --rm -v "$(pwd)/backend:/app" composer create-project laravel/laravel .
```

**Frontend (React + Vite):**

```powershell
docker run --rm -v "$(pwd)/frontend:/app" node:20 sh -c "npm create vite@latest . -- --template react"
```

## Configuração do banco

O `.env` do Laravel aponta para o serviço `db` com os valores padrão:

```
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=atendeai
DB_USERNAME=atendeai
DB_PASSWORD=atendeai
```

> Para alterar usuário/senha, defina as variáveis `POSTGRES_DB`, `POSTGRES_USER` e `POSTGRES_PASSWORD` em um arquivo `.env` na raiz do projeto (o `docker-compose.yml` as lê automaticamente).

## Comandos úteis

```powershell
docker compose ps                 # status dos serviços
docker compose logs -f backend    # logs do backend
docker compose logs -f frontend   # logs do frontend
docker compose down               # parar os containers
docker compose down -v            # parar e apagar os volumes (banco)
```

## Notas

- Em desenvolvimento, o código é montado como volume nos containers, então alterações nos arquivos são refletidas automaticamente (hot-reload no frontend e `artisan serve` no backend).
- O `entrypoint` do backend só roda `composer install` quando `vendor/` não existe (primeiro clone); depois disso ele inicia direto.
- O container do banco aguarda ficar saudável antes de o backend subir (`healthcheck`).
