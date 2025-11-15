# 🎬 Golden Movie Studio (GMS)

Plataforma de treinamento QA da EBAC com integração completa entre Frontend e Backend.

## 📋 O que é este projeto?

GMS é uma aplicação de exemplo para **ensinar QA prático** com:
- ✅ **API REST** com validação de dados (Backend em Node.js)
- ✅ **Formulário de Cadastro** integrado com API (Frontend em HTML/CSS/JS)
- ✅ **Testes E2E** com Cypress (automatizados)
- ✅ **Containerização** com Docker & Docker Compose
- ✅ **Banco de Dados** SQLite para persistência

**Ideal para**: Aulas de QA, testes de API, testes web, testes em Docker

---

## 🚀 Quick Start (3 opções)

### Opção 1: Manual (Recomendado para Desenvolvimento)

```bash
# Terminal 1 - Backend
cd golden-movie-studio-backend
npm install
npm start

# Terminal 2 - Frontend (em outro terminal)
cd golden-movie-studio-frontend
npm install
npm start

# Terminal 3 - Testes (opcional)
cd tests
npm install
npx cypress open
```

**Acesso:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- Swagger API: http://localhost:3000/api-docs

---

### Opção 2: Docker Compose (Recomendado para Produção/Classroom)

```bash
# Na raiz do projeto (GMS/)
docker-compose up --build
```

Isso inicia automaticamente:
- Backend (porta 3000)
- Frontend (porta 8080)
- Testes Cypress (roda após ambos estarem prontos)

**Parar os containers:**
```bash
docker-compose down
```

**Limpar volumes (banco de dados):**
```bash
docker-compose down -v
```

---

### Opção 3: NPM Scripts (da raiz do projeto)

```bash
npm run start:backend   # Inicia apenas backend
npm run start:frontend  # Inicia apenas frontend
npm run test:api        # Roda testes com Cypress
```

---

## 📂 Estrutura do Projeto

```
GMS/
├── golden-movie-studio-backend/      # API REST (Node.js + Express + SQLite)
│   ├── server.js                     # Servidor principal
│   ├── cadastros.db                  # Banco de dados (criado automaticamente)
│   ├── package.json
│   └── Dockerfile
│
├── golden-movie-studio-frontend/     # Site estático (HTML/CSS/JS)
│   ├── index.html                    # Página principal
│   ├── script.js                     # Lógica de integração com API
│   ├── styles.css
│   ├── server-simple.js              # Servidor HTTP simples
│   ├── package.json
│   └── Dockerfile
│
├── tests/                            # Testes E2E com Cypress
│   ├── cypress/
│   │   ├── e2e/
│   │   │   └── cadastro.cy.js       # Testes do formulário
│   │   └── support/
│   │       └── commands.js           # Comandos customizados
│   ├── cypress.config.js
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml                # Orquestração dos containers ( você vai criar em aula)
├── README.md                         # Este arquivo
```

---

## 🧪 Testando a Integração

### Via Browser (Manual)

1. Acesse http://localhost:8080
2. Preencha o formulário "SEJA MEMBRO":
   - **Nome**: Fabio
   - **Sobrenome**: Araújo
   - **Email**: teste@exemplo.com
   - **Telefone**: 11999999999
   - **Senha**: Senha@123

3. Clique em "Cadastrar"
4. Veja a mensagem de sucesso/erro

### Via cURL (API Testing)

```bash
# Registrar novo usuário
curl -X POST http://localhost:3000/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Fabio",
    "sobrenome": "Araújo",
    "email": "teste@exemplo.com",
    "telefone": "11999999999",
    "senha": "Senha@123"
  }'

# Buscar usuário por ID
curl http://localhost:3000/usuario/id/1

# Buscar usuário por Email
curl http://localhost:3000/usuario/email/teste@exemplo.com
```

### Via Cypress (Testes Automatizados)

**Modo interativo (Dashboard):**
```bash
cd tests
npx cypress open
```

**Modo headless (CI/CD):**
```bash
cd tests
npx cypress run
```

**Via Docker:**
```bash
docker-compose up cypress
```

---

## 📋 Regras de Validação

O backend valida todos os campos usando **Joi**. Aqui estão as regras:

| Campo | Regra | Exemplo Válido | Exemplo Inválido |
|-------|-------|---|---|
| **Nome** | Apenas letras + acentos + espaços | Fabio Araújo | Fabio123 |
| **Sobrenome** | Apenas letras + acentos + espaços | Silva | Silva@2024 |
| **Email** | Formato de email válido | teste@exemplo.com | teste@.com |
| **Telefone** | Apenas dígitos (opcional) | 11999999999 | 119-99999999 |
| **Senha** | Min 8 chars, 1 maiúscula, 1 número, 1 especial | Senha@123 | senha123 |

**Especial**: `!@#$&*`

---

## 🔌 Endpoints da API

### POST /cadastro
Registra novo usuário

**Request:**
```json
{
  "nome": "Fabio",
  "sobrenome": "Araújo",
  "email": "fabio@exemplo.com",
  "telefone": "11999999999",
  "senha": "Senha@123"
}
```

**Response (Sucesso):**
```json
{
  "message": "Cadastro realizado com sucesso!"
}
```

**Response (Erro de validação):**
```json
{
  "message": "Nome deve conter apenas caracteres alfabéticos, acentuados e espaços"
}
```

---

### GET /usuario/id/:id
Busca usuário por ID (não retorna senha)

**Request:**
```bash
GET /usuario/id/1
```

**Response:**
```json
{
  "id": 1,
  "nome": "Fabio",
  "sobrenome": "Araújo",
  "email": "fabio@exemplo.com",
  "telefone": "11999999999"
}
```

---

### GET /usuario/email/:email
Busca usuário por email (não retorna senha)

**Request:**
```bash
GET /usuario/email/fabio@exemplo.com
```

**Response:**
```json
{
  "id": 1,
  "nome": "Fabio",
  "sobrenome": "Araújo",
  "email": "fabio@exemplo.com",
  "telefone": "11999999999"
}
```

---

## 🐳 Docker & Docker Compose

### Imagens utilizadas

- **Backend**: `node:18-alpine` (Node.js + Express + SQLite)
- **Frontend**: `node:18-alpine` (Node.js + Servidor HTTP)
- **Tests**: `cypress/included:latest` (Cypress + Chrome + dependências)

### Volumes

Quando rodando via Docker Compose, os seguintes volumes são criados:

- `./tests/cypress/videos/` - Vídeos dos testes (se habilitado em cypress.config.js)
- `./tests/cypress/screenshots/` - Screenshots dos testes

### Networking

Os containers se comunicam através da rede `gms-network` (bridge):

```
┌─────────────────────────────────────────────┐
│           gms-network (bridge)              │
├─────────────────────────────────────────────┤
│ • gms-backend   (http://backend:3000)       │
│ • gms-frontend  (http://frontend:8080)      │
│ • gms-cypress   (acessa ambos via rede)     │
└─────────────────────────────────────────────┘
```

---

## 🎓 Cenários de Teste para Aulas de QA

### 1. Happy Path (Fluxo Feliz)
**Objetivo**: Validar cadastro bem-sucedido

```javascript
// Dados válidos
nome: "Fabio"
sobrenome: "Araújo"
email: "fabio@exemplo.com"
telefone: "11999999999"
senha: "Senha@123"

// Esperado: Mensagem "Cadastro realizado com sucesso!"
```

### 2. Validação de Nome
**Objetivo**: Rejeitar nome com números

```javascript
nome: "Fabio123"  // ❌ Inválido

// Esperado: "Nome deve conter apenas caracteres alfabéticos..."
```

### 3. Validação de Senha Fraca
**Objetivo**: Rejeitar senha sem requisitos mínimos

```javascript
senha: "abc123"  // ❌ Sem maiúscula e especial

// Esperado: "Senha deve conter..."
```

### 4. Email Duplicado
**Objetivo**: Rejeitar cadastro com email já registrado

```javascript
// Primeiro cadastro com email: teste@exemplo.com ✅
// Segundo cadastro com mesmo email ❌

// Esperado: "Este email já está cadastrado."
```

### 5. Campo Obrigatório Vazio
**Objetivo**: Rejeitar formulário com campos vazios

```javascript
// Deixar um campo em branco e submeter

// Esperado: Validação de campo obrigatório
```

---

## 🛠️ Troubleshooting

### ❌ "Failed to fetch" / ECONNREFUSED

**Causa**: Backend não está rodando

**Solução**:
```bash
# Terminal 1
cd golden-movie-studio-backend
npm start

# Verificar se respondendo
curl http://localhost:3000/usuario/id/1
```

---

### ❌ "Container name already in use"

**Causa**: Container anterior não foi removido

**Solução**:
```bash
docker-compose down -v
docker-compose up --build
```

---

### ❌ Email já cadastrado (mesmo após restart)

**Causa**: Banco de dados SQLite persiste entre restarts

**Solução** (limpar dados):
```bash
# Via Docker Compose
docker-compose down -v

# Manual
rm golden-movie-studio-backend/cadastros.db
```

---

### ❌ Cypress não consegue acessar API (só em Docker)

**Causa**: Hostname `localhost` não resolve dentro do container

**Solução**: Script detecta automaticamente e usa `http://backend:3000` em Docker

---

## 📚 Documentação Adicional

- **GUIA-RAPIDO.md**: Guia rápido em português para iniciantes
- **.github/copilot-instructions.md**: Documentação técnica detalhada para desenvolvedores
- **DOCKER-README.md**: Guia específico de Docker

---

## 🤝 Contribuições

Este é um projeto de educação da EBAC. Para sugestões ou melhorias:

1. Faça um fork
2. Crie uma branch (`git checkout -b feature/melhoria`)
3. Commit suas mudanças (`git commit -am 'Adiciona melhoria'`)
4. Push para a branch (`git push origin feature/melhoria`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto é fornecido como material educacional da EBAC.

---

## 👨‍🏫 Créditos

Desenvolvido como plataforma de treinamento QA para a **EBAC - Escola Britânica de Artes Criativas & Tecnologia**

**Instrutor**: Fabio Araújo

---

## 🆘 Suporte

Para dúvidas:
- 📧 Email do instrutor: fabio@example.com
- 💬 Discord da turma: [Link da comunidade]
- 📖 Wiki do projeto: [Link da documentação]

---

**Última atualização**: 14 de novembro de 2025

Happy Testing! 🧪✅
