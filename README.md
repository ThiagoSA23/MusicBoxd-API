# 🎵 MusicBoxd — API RESTful (Node.js + Express + MongoDB)

Uma API acadêmica para avaliação e gerenciamento de álbuns e músicas, com autenticação JWT, permissões por usuário e testes automatizados.

---


## Resumo

O MusicBoxd é um backend RESTful que permite:

- Registro e login de usuários com JWT
- CRUD de álbuns e músicas
- Testes automatizados com Jest e cobertura

## Pré-requisitos

- Node.js 14+ (recomendado LTS)
- npm 6+
- MongoDB

## Instalação & Configuração

1. Clone o repositório e entre na pasta do projeto:

bash
git clone <seu-repositorio>
cd MusicBoxd


2. Instale dependências:

bash
npm install


3. Crie um arquivo .env na raiz com as variáveis necessárias (exemplo):

env
# Variáveis de Ambiente .ENV
MONGODB_USER=
MONGODB_PASS
MONGODB_HOST=
MONGO_URI=
JWT_SECRET=
PORT=
NODE_ENV=

Observações:

- Para usar o MongoDB Atlas, configure a rede/usuário no painel do Atlas e copie a MONGO_URI.
- Nunca comite o .env com segredos para o repositório público.

## Execução

- Em desenvolvimento (com nodemon / recarregamento automático):

bash
npm run dev


- Em produção:

bash
npm start


Endpoints úteis após iniciar a API:

- API base: http://localhost:3000/api
- Swagger UI: http://localhost:3000/api-docs

## Testes & Cobertura

- Executar todos os testes:

bash
npm run test


- Gerar relatório de cobertura:

bash
npm run test:coverage


Meta de cobertura: ≥ 80% nas rotas, controllers e validações.

## Documentação (Swagger)

O projeto inclui um arquivo swagger.yaml. O swagger-ui-express serve a interface em /api-docs.

Para acessar: http://localhost:3000/api-docs (após iniciar a API).

## Estrutura do Repositório


MusicBoxd/
├── bin/                     # Entrypoint HTTP (ex.: www)
├── controllers/             # Lógica dos endpoints
├── middlewares/             # JWT, validações, etc.
├── models/                  # Schemas Mongoose
├── routes/                  # Declaração de rotas
├── tests/                   # Testes Jest + Supertest
├── swagger.yaml             # OpenAPI spec
├── app.js                   # Configuração Express
├── package.json             # Scripts & dependências
└── README.md


## API — Endpoints Principais (resumo)

- POST /api/auth/register — Registrar usuário (public)
- POST /api/auth/login — Login e retorno do token (public)

- GET /api/albums — Listar álbuns (public)
- GET /api/albums/:id — Obter álbum (public)
- POST /api/albums — Criar álbum (autenticado)
- PUT /api/albums/:id — Atualizar álbum (autor somente)
- DELETE /api/albums/:id — Deletar álbum (autor somente)

- GET /api/musicas — Listar músicas (public)
- GET /api/musicas/:id — Obter música (public)
- POST /api/musicas — Criar música (autenticado)
- PUT /api/musicas/:id — Atualizar música (autor somente)
- DELETE /api/musicas/:id — Deletar música (autor somente)

Use o header Authorization: Bearer <token> nas rotas protegidas.

## Exemplos de Uso (curl)

- Registrar usuário:

bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@mail.com","senha":"senha123456"}'


- Fazer login:

bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@mail.com","senha":"senha123456"}'


- Criar álbum (exemplo, autenticado):

bash
curl -X POST http://localhost:3000/api/albums \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SEU_TOKEN_AQUI>" \
  -d '{"titulo":"Nevermind","artista":"Nirvana","genero":"Rock","dataLancamento":"1991-09-24"}'


## Equipe & Divisão de Tarefas

| Integrante | Issue(s) | Responsabilidade |
|------------|----------|-----------------|
| Thiago SA23 | #1, #2 | CRUD — Álbuns & Músicas |
| David       | #3     | Autenticação & Autorização (JWT) |
| Daniel      | #4, #6 | Documentação (Swagger) & Deploy |
| Davy        | #5     | Testes unitários (Jest) |


## Dependências Principais

- express, mongoose, bcryptjs, jsonwebtoken, express-validator, cors
- Dev: jest, supertest, nodemon (para dev)

## Scripts úteis (em package.json)

- npm run dev — Inicia em modo desenvolvimento (nodemon)
- npm test — Executa testes
- npm run test:coverage — Gera relatório de cobertura


# 🎵 MusicBoxd AP