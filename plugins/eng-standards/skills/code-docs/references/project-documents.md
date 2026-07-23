# Templates — Documentos Essenciais de Projeto

Cinco documentos. Todo projeto de porte médio ou maior deve tê-los.

---

## 1. Especificação Completa

Requisitos funcionais, não funcionais e modelo de dados com diagrama de relações.

```markdown
# 0. Informações

Este documento especifica os requisitos e o modelo de dados do sistema [Nome].

| Feito por | [Nome] |
| --- | --- |
| Cargo | [Cargo] |
| Data de Criação | DD/MM/AAAA |

# 1. Visão Geral

Descrição do problema que o sistema resolve e para quem.

# 2. Requisitos Funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF01 | O sistema deve permitir cadastro de usuários | Alta |
| RF02 | O sistema deve autenticar via e-mail e senha | Alta |

# 3. Requisitos Não Funcionais

| ID | Requisito | Categoria |
|---|---|---|
| RNF01 | Tempo de resposta abaixo de 500ms no P95 | Performance |
| RNF02 | Senhas armazenadas com hash bcrypt | Segurança |
| RNF03 | Interface responsiva de 320px a 1920px | Usabilidade |

# 4. Modelo de Dados

## 4.1 Entidades

### usuarios
| Campo | Tipo | Restrição |
|---|---|---|
| id | UUID | PK |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| senha_hash | VARCHAR(255) | NOT NULL |
| criado_em | TIMESTAMP | DEFAULT now() |

## 4.2 Diagrama de Relações

\`\`\`mermaid
erDiagram
    USUARIOS ||--o{ PEDIDOS : realiza
    PEDIDOS ||--|{ ITENS_PEDIDO : contem
\`\`\`

# 5. Regras de Negócio

| ID | Regra |
|---|---|
| RN01 | Um usuário não pode ter dois pedidos abertos simultaneamente |
```

---

## 2. Arquitetura de Código

Explica e demonstra como funciona a arquitetura do projeto, com casos gerais e específicos.

```markdown
# 0. Informações

Este documento descreve a arquitetura de código do sistema [Nome].

| Feito por | [Nome] |
| --- | --- |
| Cargo | [Cargo] |
| Data de Criação | DD/MM/AAAA |

# 1. Visão Geral da Arquitetura

Descrição do estilo arquitetural adotado e o porquê.

\`\`\`mermaid
flowchart LR
    Client[Next.js] --> API[Express API]
    API --> DB[(PostgreSQL)]
    API --> Queue[RabbitMQ]
    Queue --> Worker[Worker]
\`\`\`

# 2. Camadas

| Camada | Responsabilidade | Pode acessar |
|---|---|---|
| Routes | Registro de rotas e middlewares | Controller |
| Controller | Entrada HTTP, validação de payload | Service |
| Service | Regra de negócio | Repository |
| Repository | Acesso a dados | ORM/DB |

**Regra de dependência:** camadas só chamam a camada imediatamente abaixo. Controller nunca acessa Repository.

# 3. Caso Geral — Fluxo de uma requisição

1. Requisição chega em `usuarios.routes.ts`
2. Middleware de autenticação valida o JWT
3. `usuarios.controller.ts` valida o payload com Zod
4. `usuarios.service.ts` aplica a regra de negócio
5. `usuarios.repository.ts` persiste via Prisma
6. Controller devolve a resposta padronizada

# 4. Casos Específicos

## 4.1 Processamento assíncrono
Descreva quando e por que uma operação vai para a fila.

## 4.2 Tratamento de erros
Descreva a hierarquia de erros e como são convertidos em respostas HTTP.

# 5. Decisões Arquiteturais

| Decisão | Alternativas consideradas | Motivo da escolha |
|---|---|---|
| Prisma como ORM | TypeORM, Knex | Tipagem gerada e migrations declarativas |
```

---

## 3. Documento de Fluxo (UML)

Diagrama de Atividade e Diagrama de Caso de Uso padronizados em UML.

```markdown
# 0. Informações

Este documento mapeia os fluxos de uso do sistema [Nome] em notação UML.

| Feito por | [Nome] |
| --- | --- |
| Cargo | [Cargo] |
| Data de Criação | DD/MM/AAAA |

# 1. Atores

| Ator | Descrição |
|---|---|
| Usuário Comum | Acessa e opera as funcionalidades básicas |
| Administrador | Gerencia usuários e configurações |

# 2. Diagrama de Caso de Uso

\`\`\`mermaid
flowchart TB
    Usuario((Usuário))
    Admin((Admin))

    Usuario --> UC1[Fazer login]
    Usuario --> UC2[Consultar pedidos]
    Admin --> UC3[Gerenciar usuários]
    Admin --> UC1
\`\`\`

# 3. Casos de Uso Detalhados

## UC01 — Fazer login

| Campo | Descrição |
|---|---|
| Ator | Usuário Comum, Administrador |
| Pré-condição | Usuário cadastrado e ativo |
| Fluxo principal | 1. Informa e-mail e senha<br>2. Sistema valida<br>3. Sistema emite JWT |
| Fluxo alternativo | 2a. Credenciais inválidas → mensagem de erro |
| Pós-condição | Sessão ativa com token válido |

# 4. Diagrama de Atividade

\`\`\`mermaid
flowchart TD
    Start([Início]) --> Input[Informa credenciais]
    Input --> Valid{Credenciais válidas?}
    Valid -->|Não| Error[Exibe erro] --> Input
    Valid -->|Sim| Token[Gera JWT]
    Token --> Redirect[Redireciona ao dashboard]
    Redirect --> End([Fim])
\`\`\`
```

---

## 4. Plano de Ação

Guia de execução por fases, da Fase 0 até a entrega do MVP.

```markdown
# 0. Informações

Este documento guia a execução do projeto [Nome] em fases.

| Feito por | [Nome] |
| --- | --- |
| Cargo | [Cargo] |
| Data de Criação | DD/MM/AAAA |

# Fase 0 — Configurações

| # | Tarefa | Status |
|---|---|---|
| 0.1 | Criar repositório e definir branches | ☐ |
| 0.2 | Configurar estrutura de pastas padrão | ☐ |
| 0.3 | Instalar stack base e configurar linter | ☐ |
| 0.4 | Provisionar infraestrutura (Terraform) | ☐ |
| 0.5 | Configurar CI/CD (GitHub Actions) | ☐ |
| 0.6 | Criar Especificação e Contrato de API | ☐ |

# Fase 1 — Fundação

| # | Tarefa | Status |
|---|---|---|
| 1.1 | Modelagem do banco e migrations | ☐ |
| 1.2 | Autenticação e autorização | ☐ |
| 1.3 | Layout base e navegação | ☐ |

# Fase 2 — Core

| # | Tarefa | Status |
|---|---|---|
| 2.1 | [Módulo principal do domínio] | ☐ |

# Fase 3 — Complementos

| # | Tarefa | Status |
|---|---|---|
| 3.1 | Relatórios e exportações | ☐ |
| 3.2 | Notificações | ☐ |

# Fase Final — Entrega do MVP

| # | Tarefa | Status |
|---|---|---|
| F.1 | Testes de integração | ☐ |
| F.2 | Deploy em produção | ☐ |
| F.3 | Documentação final e handover | ☐ |
```

---

## 5. Contrato de API

Descreve o que entra e o que sai de cada rota. Guia frontend e integrações futuras.

```markdown
# 0. Informações

Este documento define o contrato das rotas da API do sistema [Nome].

| Feito por | [Nome] |
| --- | --- |
| Cargo | [Cargo] |
| Data de Criação | DD/MM/AAAA |

# 1. Convenções

- **Base URL:** `https://api.exemplo.com/v1`
- **Autenticação:** `Authorization: Bearer <jwt>`
- **Formato:** JSON em requisição e resposta

## 1.1 Envelope de resposta

Sucesso:
\`\`\`json
{ "success": true, "data": { } }
\`\`\`

Erro:
\`\`\`json
{ "success": false, "error": { "code": "USER_NOT_FOUND", "message": "Usuário não encontrado" } }
\`\`\`

## 1.2 Códigos de status

| Código | Uso |
|---|---|
| 200 | Sucesso |
| 201 | Recurso criado |
| 400 | Payload inválido |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Recurso não encontrado |
| 422 | Regra de negócio violada |
| 500 | Erro interno |

# 2. Módulo: Usuários

## POST /usuarios

Cria um novo usuário.

**Autenticação:** Não requerida

**Request Body**
| Campo | Tipo | Obrigatório | Regra |
|---|---|---|---|
| nome | string | Sim | 3 a 120 caracteres |
| email | string | Sim | Formato de e-mail, único |
| senha | string | Sim | Mínimo 8 caracteres |

\`\`\`json
{ "nome": "Maria Silva", "email": "maria@exemplo.com", "senha": "senha12345" }
\`\`\`

**Response 201**
\`\`\`json
{
  "success": true,
  "data": { "id": "uuid", "nome": "Maria Silva", "email": "maria@exemplo.com" }
}
\`\`\`

**Erros**
| Status | Code | Quando |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Payload fora do schema |
| 422 | `EMAIL_ALREADY_EXISTS` | E-mail já cadastrado |

## GET /usuarios/:id

Retorna os dados de um usuário.

**Autenticação:** Requerida

**Path Params**
| Param | Tipo | Regra |
|---|---|---|
| id | string | UUID v4 |

**Response 200**
\`\`\`json
{ "success": true, "data": { "id": "uuid", "nome": "Maria Silva" } }
\`\`\`

**Erros**
| Status | Code | Quando |
|---|---|---|
| 404 | `USER_NOT_FOUND` | Usuário inexistente |
```
