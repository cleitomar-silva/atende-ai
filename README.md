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

### 2. Rodar as migrations e o seed (primeira vez)

```powershell
docker compose exec backend php artisan migrate
docker compose exec backend php artisan db:seed
```

O seed cria uma empresa de demonstração com dados padrão (ver [Dados de demonstração](#dados-de-demonstração)).

### 3. Acessar

- Frontend: http://localhost:5173
- Backend: http://localhost:9000
- PostgreSQL: `localhost:5432`

## Dados de demonstração

| Campo | Valor |
| ----- | ----- |
| Empresa | CNPJ `11.222.333/0001-81` — "Empresa Demonstração" |
| Admin   | `admin@atendeai.com` / `password` |
| Colaborador | `colaborador@atendeai.com` / `password` |

Para cada empresa cadastrada (inclusive via `/api/register`), o sistema cria automaticamente:

- Grupo **"Suporte"**
- Categorias **"Incidente"**, **"Melhoria"** e **"Requisição"**
- Classificações **"Processos Internos"** (Incidente) e **"Acesso"** (Requisição)
- Situações **"Não iniciado"**, **"Em atendimento"**, **"Aguardando validação"**, **"Concluído"** e **"Cancelar"**

## API

A API é autenticada por token (tabela `api_tokens`). Use o header `Authorization: Bearer <token>`, obtido em `POST /api/login`.

Rotas principais (`/api`):

| Grupo | Rotas |
|----------------------|-----------------------------------------------------------------------|
| Autenticação | `POST /login`, `POST /register`, `POST /register/company`, `POST /register/sector`, `POST /register/user`, `GET /me`, `PUT /me`, `POST /logout` |
| Empresa | `GET/PUT /company` |
| Setores | `GET /sectors`, `POST/PUT/DELETE /sectors/{id}` (escrita admin) |
| Usuários | `GET /users`, `POST/PUT/DELETE /users/{id}` (escrita admin) |
| Grupos | `GET /groups`, `POST/PUT/DELETE /groups/{id}` (escrita admin) |
| Categorias | `GET /categories`, `POST/PUT/DELETE /categories/{id}` (escrita admin) |
| Classificações | `GET /classifications`, `POST/PUT/DELETE /classifications/{id}` (escrita admin) |
| Situações | `GET /situations`, `POST/PUT/DELETE /situations/{id}` (escrita admin) |
| Chamados | `GET/POST /tickets`, `GET/PUT/DELETE /tickets/{id}`, `POST /tickets/{id}/comments`, `POST /tickets/{id}/situation` |
| Relatórios/Indicadores | `GET /reports`, `GET /indicators` |
| Auditoria/Operações | `GET /audits`, `POST /audits/{id}/undo` (admin) |
| Notificações | `GET /notifications`, `POST /notifications/read-all` |
| Busca | `GET /search?q=` |

> A lista (`GET`) de setores, situações, categorias, grupos e classificações fica acessível a todos os usuários autenticados para uso em filtros e abertura de chamados; as operações de escrita ficam restritas a administradores.

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




## TODO

Na pagina de situações

Ao cadastrar ou editar acrescentar mais uma opção no formulário de situações. incluir a opção 'Permitir Comentario' a baixo do campo Ativo.

Ao criar uma conta alterar as situações padrões que são criadas automáticas. Ao criar a conta as situações automáticas que devem ser geradas são: 
Cancelado ( SLA desativado, status Ativo e Permitir Comentário desativado ) ,
Concluído ( SLA desativado,status Ativo e Permitir Comentário desativado ), 
Em atendimento ( SLA ativo, status Ativo e Permitir Comentário ativo ),
Não iniciado ( SLA desativado, status Ativo e Permitir Comentário ativo )

obs: os comentarios sao para ombos usuarios, solicitante e demandado.

para as situações geradas automáticas  inserir as transições : 

. para a situação 'Cancelado' com a transição 'Em atendimento' ( a opção marcada demandado )'

. para a situação 'Concluído' com a transição 'Em atendimento' ( a opção marcada demandado )'

. para a situação 'Em atendimento' com transição 'Cancelado' ( com as opções marcadas solicitante e demandado ), 'Concluído' ( com a opção marcada demandado )

. para a situação 'Não iniciado' com a transição 'Cancelado' ( com as opções marcadas solicitante e demandado ), 'Em atendimento' ( a opção marcada demandado )'


A pagina de chamados devera ser acrescentado essa regra de comentarios, so devera permitir comentar caso a situação esteja com Permitir Comentário ativo 


