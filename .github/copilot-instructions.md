# Copilot Instructions - Golden Movie Studio (GMS)

## Project Overview

GMS é uma **plataforma de treinamento QA** com arquitetura full-stack em 3 componentes independentes:

- **Backend**: Node.js + Express + SQLite (porta 3000)
- **Frontend**: HTML/CSS/JS com integração OMDB API (porta 8080)
- **Tests**: Cypress E2E com detecção automática Docker/localhost

Cada componente é containerizado independentemente e pode ser executado via npm scripts ou Docker Compose.

---

## Critical Architecture Patterns

### API-First Design with Dynamic URL Detection

Frontend (`script.js`) detecta automaticamente o ambiente:
```javascript
const isDocker = window.location.hostname === 'frontend';
const API_BASE_URL = isDocker ? 'http://backend:3000' : 'http://localhost:3000';
```

**Why**: Mesmo código roda em desenvolvimento local (localhost) e em produção (Docker com service names).

### Validation at Source: Joi Schemas in Backend

Backend enforça validação única com **Joi** em `/cadastro`:
- Nomes/sobrenomes: apenas letras + acentos + espaços (regex Unicode)
- Email: validação padrão + UNIQUE constraint no SQLite
- Senha: mín 8 chars, 1 maiúscula, 1 número, 1 especial (!@#$&*)
- Telefone: opcional, apenas dígitos

**Critical**: Frontend não valida campos - confia 100% no backend. Erros de validação retornam HTTP 400 com `err.details[0].message`.

### Database Design (SQLite)

Single table `cadastros` criada auto-magicamente no `server.js`:
```
id (PRIMARY KEY, AUTOINCREMENT)
nome, sobrenome, email (UNIQUE), telefone, senha
```

Não há migrations - schema é inline no startup. Email UNIQUE previne duplicatas.

---

## Development Workflow

### Starting Services

**Option 1: Manual (Recommended for Development)**
```bash
# Terminal 1 - Backend
cd golden-movie-studio-backend && npm install && npm start
# Esperado: "Servidor rodando em http://localhost:3000"

# Terminal 2 - Frontend (outro terminal)
cd golden-movie-studio-frontend && npm install && npm start
# Esperado: Servidor HTTP na porta 8080

# Terminal 3 - Tests (opcional)
cd tests && npm install && npx cypress open
```

**Option 2: Docker (One Command)**
```bash
# Na raiz do projeto
docker compose up --build
# Inicia backend → frontend → cypress em sequência
```

### Testing Commands

```bash
# E2E tests headless (CI mode)
cd tests && npx cypress run

# E2E tests interactive (dashboard)
cd tests && npx cypress open

# API testing via cURL
curl -X POST http://localhost:3000/cadastro \
  -H "Content-Type: application/json" \
  -d '{"nome":"Test","sobrenome":"User","email":"test@ex.com","telefone":"1234567890","senha":"Pass@123"}'
```

### GitHub Actions

Backend CI pipeline (`workflows/backend-ci.yml`):
- Triggered: push/PR com mudanças em `golden-movie-studio-backend/**`
- Steps: checkout → node 18 setup → npm install → docker build
- Status: Valida compilação sem rodar testes (apenas build)

---

## Code Patterns & Conventions

### Backend Error Handling

```javascript
// POST /cadastro pattern
try {
  const value = await schemaCadastro.validateAsync(req.body);
  // ... database operations
  res.status(200).json({ message: '...' });
} catch (err) {
  return res.status(400).json({ message: err.details[0].message });
}
```

**Convention**: Always return JSON objects with `message` field. HTTP status codes strictly:
- 200: Success
- 400: Validation error (Joi details[0].message)
- 404: Resource not found
- 500: Server error

### Frontend Form Integration

```javascript
function registerUser(event) {
  event.preventDefault();
  const formData = {
    nome, sobrenome, email, telefone, senha
  };
  fetch(API_URL, { method: 'POST', body: JSON.stringify(formData) })
    .then(r => r.json())
    .then(data => { responseDiv.textContent = data.message; })
    .catch(err => { responseDiv.textContent = 'Falha: ...'; });
}
```

**Convention**: POST → read response JSON → display `message` in `#signup-response` div. No validation on frontend.

### Cypress E2E Tests

```javascript
it('Deve fazer cadastro com sucesso', () => {
  let email = `usuario${Date.now()}@example.com`; // Dynamic to avoid duplicates
  cy.visit('/');
  cy.get('#signup-firstname').type('Fabio');
  // ... fill form fields
  cy.get('#signup-button').click();
  cy.get('#signup-response').should('contain', 'Cadastro realizado com sucesso!');
});
```

**Convention**: Tests generate unique emails with timestamps. Base URL is `http://localhost:8080` (from cypress.config.js).

---

## Key File Reference

| File | Purpose |
|------|---------|
| `golden-movie-studio-backend/server.js` | Express app, Joi validation schemas, SQLite operations, Swagger docs |
| `golden-movie-studio-frontend/script.js` | API integration, OMDB search, form submission, Docker detection |
| `tests/cypress/e2e/cadastro.cy.js` | User registration E2E test suite |
| `.github/workflows/backend-ci.yml` | CI pipeline for backend changes |

---

## Important Notes for AI Agents

1. **Validation Trust Boundary**: Never add frontend validation to replace backend checks. Backend is the single source of truth.
2. **Docker Service Names**: Use `backend` (not localhost) for cross-container communication in Docker environment.
3. **Email Uniqueness**: Always test with dynamic emails (timestamps) to avoid constraint violations in tests.
4. **Swagger Documentation**: Kept updated inline with JSDoc comments in `server.js`. Update both code AND Swagger when API changes.
5. **No Migration System**: Database schema is generated on app startup. Breaking schema changes require manual steps.
