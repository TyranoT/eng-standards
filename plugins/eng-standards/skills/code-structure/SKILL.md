---
name: code-structure
description: >
  Estrutura de projeto, stacks e serviços. Skill filha de code-standards. Use ao criar projetos do zero, adicionar
  features, decidir onde um arquivo deve morar, escolher bibliotecas ou definir infraestrutura. Cobre estrutura
  frontend (features + shared + store para Next.js/React/Angular), backend (modules com controller/service/repository
  para Node.js/Express/NestJS/FastAPI/Spring), mobile (Flutter data/domain/presentation), stacks padrão e serviços
  AWS. Gatilhos: "monta o projeto", "estrutura de pastas", "onde coloco esse arquivo", "qual stack usar", "que lib
  para X", "qual serviço AWS", "cria a feature de...", "organiza esse projeto".
---

# Code Structure — Estruturação de Projeto

> Organize por **feature/domínio**, nunca por tipo de arquivo global.
> Estrutura vem antes do código. Definir pastas depois é retrabalho.

---

## 1. Estrutura Frontend (Next.js / React / Angular)

Baseada em **features + shared + store**.

```
├── app/
│   ├── (pages)/
│   ├── global.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── not-found.tsx
│   ├── global-error.tsx
│   └── loading.tsx
│
├── features/
│   └── signin/
│       ├── api/          # Queries e mutations
│       ├── hooks/        # Lógica refatorada em hooks
│       ├── helpers/      # Funções auxiliares da feature
│       ├── constants/    # Valores constantes
│       ├── components/   # Frações de UI compostas ou reaproveitadas
│       ├── ui/           # Telas da feature
|       ├── tests/         # Testes unitários e E2E
│       ├── schema.ts     # Schema Zod para validação
│       ├── type.ts       # Tipagens e z.infer
│       └── index.ts      # Barrel export da feature
│
├── shared/
│   ├── http/             # Requisições padronizadas com Fetch
│   ├── components/       # Componentes UI globais (Shadcn)
│   ├── libs/             # Configuração de dependências
│   ├── config/           # Configurações gerais
│   ├── helpers/          # Funções helper globais
│   ├── hooks/            # Hooks globais
│   └── index.ts          # Barrel export do shared
│
├── store/
│   ├── global/           # Estado global (Zustand)
│   └── context/          # Context API
│
├── README.md
├── next.config.ts
├── package.json
├── tsconfig.json
└── proxy.ts
```

### Regras

| Regra | Detalhe |
|---|---|
| **Um hook por finalidade** | Nunca um `useUser.ts` que faz tudo. `useUserList`, `useUserFilters`, `useUserPermissions`. |
| **`ui/` sem lógica** | Telas e componentes puramente visuais. Lógica vem via props ou hooks. |
| **`components/` vs `ui/`** | `components/` = frações compostas com alguma orquestração. `ui/` = telas e apresentação pura. |
| **Lógica de negócio** | Vive em `hooks/` ou `api/`. Nunca dentro do JSX. |
| **Tabelas e listas grandes** | Viram componentes próprios sempre. |
| **`index.ts` obrigatório** | Toda feature exporta seu contrato público por barrel export. |
| **Nada de `utils.ts` genérico** | Separe por domínio dentro de `helpers/`. |

---

## 2. Estrutura Backend (Node.js / Express / NestJS)

Baseada em **controller + service + repository + config**.

```
├── src/
│   ├── modules/
│   │   └── usuarios/
│   │       ├── schemas/                  # Validação Zod
│   │       ├── tests/                    # Testes do módulo
│   │       ├── docs/                     # Contrato de API do módulo
│   │       ├── usuarios.controller.ts    # Entrada HTTP, sem regra de negócio
│   │       ├── usuarios.repository.ts    # Acesso a dados
│   │       ├── usuarios.routes.ts        # Registro de rotas
│   │       └── usuarios.service.ts       # Regra de negócio
│   │
│   ├── shared/
│   │   ├── database/                     # Conexão e client do ORM
│   │   ├── errors/                       # Hierarquia de erros da aplicação
│   │   ├── http/                         # Respostas padronizadas, clients externos
│   │   ├── middlewares/                  # Auth, log, tratamento de erro
│   │   └── routes.ts                     # Agregador de rotas dos módulos
│   │
│   ├── index.ts
│   └── server.ts
```

### Regra de dependência

```
routes → controller → service → repository → banco
```

Cada camada chama **apenas** a imediatamente abaixo. Controller nunca acessa repository direto.

| Camada | Responsabilidade | Não pode |
|---|---|---|
| `routes` | Registrar endpoint e middlewares | Conter lógica |
| `controller` | Receber request, validar payload, devolver response | Conter regra de negócio |
| `service` | Regra de negócio, orquestração | Conhecer `req`/`res` |
| `repository` | Acesso a dados | Conter regra de negócio |

### Python / FastAPI

```
app/
└── modules/
    └── users/
        ├── router.py        # Rotas
        ├── service.py       # Lógica
        ├── repository.py    # Banco de dados
        ├── schemas.py       # Pydantic models
        └── models.py        # ORM models
```

### Java / Spring

```
src/main/java/com/empresa/app/
└── modules/
    └── users/
        ├── controller/
        ├── service/
        ├── repository/
        ├── dto/
        └── entity/
```

---

## 3. Estrutura Mobile (Flutter)

```
lib/
└── features/
    └── user_profile/
        ├── data/
        │   ├── repositories/
        │   └── datasources/
        ├── domain/
        │   ├── entities/
        │   └── usecases/
        └── presentation/
            ├── pages/
            ├── widgets/
            └── controllers/      # ou bloc/, cubit/
```

---

## 4. Stacks Padrão

Escolha primeiro daqui. Só saia da lista com motivo claro.

### Frontend

| Categoria | Escolha |
|---|---|
| Linguagem | TypeScript (JavaScript apenas quando inevitável) |
| Framework | Next.js |
| Estilização | TailwindCSS |
| Componentes UI | Shadcn |
| Formulários | React Hook Form |
| Validação | Zod |
| Estado global | Zustand |
| Estado HTTP | TanStack Query (+ DevTools) |
| Ícones | Lucide React |
| Loading | Ldrs |
| Cookies | Nookies |
| Gráficos | Recharts |
| Datas | date-fns |
| Animações | Anime.js |
| JWT | jsonwebtoken |
| PDF | Puppeteer |
| Excel | XLSX.js |

### Backend

| Categoria | Escolha |
|---|---|
| Linguagem / Runtime | TypeScript sobre Node.js |
| Framework | Express.js |
| ORM | Prisma |
| Validação | Zod |
| Criptografia | bcryptjs |
| Fila | RabbitMQ (amqplib) |
| Containers | Docker |
| Infraestrutura | Terraform |
| LLM | LangChain |
| Cloud SDK | AWS SDK |
| Templates | Handlebars |
| JWT | jsonwebtoken |
| Agendamento | node-cron |
| E-mail | Nodemailer |

---

## 5. Serviços

### AWS

| Serviço | Uso |
|---|---|
| **EC2** | Hospedagem escalável de aplicações, acesso e configuração via Linux |
| **S3** | Armazenamento de documentos, organizável livremente |
| **Bedrock** | Modelos de IA de diferentes empresas centralizados em uma fatura |
| **RDS** | Banco relacional gerenciado com endereço próprio; alternativa: rodar em container Docker no EC2 |
| **Lambda** | Funções por evento, mais barato que EC2, porém pouco escalável |

### Terceiros

| Serviço | Uso |
|---|---|
| **Tavily** | Pesquisa na web com IA |
| **Vercel** | Hospedagem e deploy de baixo custo |
| **GitHub** | Repositório e versionamento |
| **GitHub Actions** | Automação CI/CD |

---

## Checklist de estruturação

- [ ] Projeto organizado por feature/módulo, não por tipo de arquivo
- [ ] Cada feature tem `index.ts` com barrel export
- [ ] Backend respeita a cadeia routes → controller → service → repository
- [ ] Nenhum `utils.ts` genérico com funções não relacionadas
- [ ] Stack escolhida a partir da lista padrão
- [ ] Arquivos e pastas em kebab-case
- [ ] Estrutura suporta crescimento sem reorganização

---

## Referências

- `references/project-setup.md` — Passo a passo de Fase 0 para frontend e backend
