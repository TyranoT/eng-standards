# Setup de Projeto — Fase 0

Passo a passo de configuração antes da primeira linha de código de feature.

---

## Frontend — Next.js

### 1. Criação

```bash
npx create-next-app@latest nome-do-projeto --typescript --tailwind --app --eslint
cd nome-do-projeto
```

### 2. Dependências base

```bash
# Estado e dados
npm install zustand @tanstack/react-query @tanstack/react-query-devtools

# Formulários e validação
npm install react-hook-form zod @hookform/resolvers

# UI e utilidades
npm install lucide-react ldrs nookies date-fns animejs

# Componentes
npx shadcn@latest init
```

### 3. Esqueleto de pastas

```bash
mkdir -p src/features src/shared/{http,components,libs,config,helpers,hooks} src/store/{global,context}
touch src/shared/index.ts src/store/global/index.ts
```

### 4. Arquivos obrigatórios do `app/`

| Arquivo | Função |
|---|---|
| `layout.tsx` | Layout raiz com providers |
| `page.tsx` | Home |
| `loading.tsx` | Fallback de suspense |
| `not-found.tsx` | 404 |
| `global-error.tsx` | Erro não tratado |
| `global.css` | Tailwind e variáveis de tema |

### 5. Cliente HTTP padronizado

`src/shared/http/` centraliza as requisições. Nenhuma feature chama `fetch` direto — sempre pelo client compartilhado,
que já injeta headers, base URL e tratamento de erro.

### 6. Providers no layout raiz

TanStack Query Provider, tema e qualquer Context global entram em `layout.tsx`, envolvendo `children`.

---

## Backend — Express + TypeScript

### 1. Criação

```bash
mkdir nome-do-projeto && cd nome-do-projeto
npm init -y
npm install express cors dotenv
npm install -D typescript @types/node @types/express @types/cors tsx
npx tsc --init
```

### 2. Dependências base

```bash
npm install zod bcryptjs jsonwebtoken @prisma/client
npm install -D prisma @types/bcryptjs @types/jsonwebtoken
npx prisma init
```

### 3. Esqueleto de pastas

```bash
mkdir -p src/modules src/shared/{database,errors,http,middlewares}
touch src/index.ts src/server.ts src/shared/routes.ts
```

### 4. Módulo novo — scaffold

Para cada domínio, crie a estrutura completa:

```bash
MODULE=usuarios
mkdir -p src/modules/$MODULE/{schemas,tests,docs}
touch src/modules/$MODULE/$MODULE.{controller,service,repository,routes}.ts
```

### 5. Shared obrigatório

| Pasta | Conteúdo mínimo |
|---|---|
| `database/` | Client Prisma singleton |
| `errors/` | `AppError` base + erros de domínio herdando dela |
| `http/` | Helper de resposta padronizada (`success`/`error`) |
| `middlewares/` | `authMiddleware`, `errorHandler`, `requestLogger` |
| `routes.ts` | Agrega e registra as rotas de cada módulo |

---

## Infraestrutura

### Docker Compose local

Serviços mínimos para desenvolvimento: banco de dados e fila.

```yaml
services:
  postgres:
    image: postgres:16
    ports: ["5432:5432"]
    environment:
      POSTGRES_PASSWORD: dev
    volumes: ["pgdata:/var/lib/postgresql/data"]

  rabbitmq:
    image: rabbitmq:3-management
    ports: ["5672:5672", "15672:15672"]

volumes:
  pgdata:
```

### Terraform

Infraestrutura de produção é declarada em código, nunca configurada manualmente no console. Estrutura mínima:

```
infra/
├── main.tf
├── variables.tf
├── outputs.tf
└── modules/
    ├── ec2/
    ├── rds/
    └── s3/
```

### GitHub Actions

Pipeline mínima em `.github/workflows/`:

| Workflow | Gatilho | Passos |
|---|---|---|
| `ci.yml` | PR para `main` | install → lint → typecheck → test → build |
| `deploy.yml` | push em `main` | build → deploy |

---

## Checklist Fase 0

- [ ] Repositório criado e branches definidas
- [ ] Estrutura de pastas padrão criada
- [ ] Stack base instalada
- [ ] Linter e typecheck configurados
- [ ] Docker Compose local funcionando
- [ ] Variáveis de ambiente documentadas em `.env.example`
- [ ] Terraform provisionando o ambiente
- [ ] CI/CD rodando
- [ ] Especificação Completa e Contrato de API escritos
- [ ] README com instruções de execução
