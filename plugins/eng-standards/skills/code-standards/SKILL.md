---
name: code-standards
description: >
  Skill MÃE de padrões de engenharia de software. SEMPRE consulte ao escrever, revisar, refatorar, documentar ou
  estruturar qualquer código ou projeto, em qualquer linguagem ou framework — React, Next.js, Angular, Flutter,
  Node.js, NestJS, Express, FastAPI, Python, Java, Spring. Coordena quatro skills filhas: code-attention (varredura
  antes de criar e checkpoint antes de entregar), code-docs (documentação e documentos de projeto), code-structure
  (estrutura de pastas, stacks e serviços) e code-patterns (patterns, princípios e anti-patterns em código). Use
  sempre que o usuário pedir para criar, refatorar, revisar, documentar ou organizar código e projetos — mesmo que
  não mencione "padrões", "arquitetura" ou "documentação".
---

# Code Standards — Skill Mãe

> Ponto de entrada único dos padrões de engenharia de software.
> Esta skill **não contém as regras** — ela roteia para a skill filha correta e garante que nenhuma camada seja esquecida.

---

## Árvore de Skills (EAP)

```
/eng-standards:code-standards (MÃE — orquestração)
│
├── 0. code-attention .... Verificação (transversal — roda antes e depois das outras)
│   ├── 0.1 Gate de Entrada — varredura de deps, design system e mesmo propósito
│   ├── 0.2 Decisão de duplicata — sempre pergunta ao usuário
│   └── 0.3 Gate de Saída — docs referenciadas e testes E2E
│
├── 1. code-docs ......... Documentação
│   ├── 1.1 Documentação de código (JSDoc, Docstring, Javadoc, DartDoc)
│   ├── 1.2 Documentos de projeto (Specs, Arquitetura, Fluxo, Plano de Ação, Contrato de API)
│   └── 1.3 Regras de clareza e brevidade
│
├── 2. code-structure .... Estruturação
│   ├── 2.1 Estrutura Frontend (features + shared + store)
│   ├── 2.2 Estrutura Backend (modules: controller/service/repository)
│   ├── 2.3 Estrutura Mobile (Flutter — data/domain/presentation)
│   ├── 2.4 Stacks padrão (frontend, backend, infra)
│   └── 2.5 Serviços de nuvem e terceiros
│
└── 3. code-patterns ..... Aplicação de Patterns (índice)
    └── references/patterns/ ... Biblioteca compartilhada de conceitos
        ├── 3.1 principios-solid.md .. SOLID, KISS, DRY, Clean Code, MVC/MVVM
        ├── 3.2 nomenclatura.md ...... Variáveis, funções, arquivos, verbos padrão
        ├── 3.3 poo.md ............... Classe vs. função pura
        ├── 3.4 regras-absolutas.md .. O que nunca pode ser violado
        ├── 3.5 anti-patterns.md ..... Catálogo ❌ → ✅
        └── 3.6 refatoracao.md ....... Gatilhos + exemplos antes/depois
```

> A biblioteca `${CLAUDE_PLUGIN_ROOT}/references/patterns/` é a **fonte única** dos conceitos de patterns e pode ser
> citada diretamente por qualquer skill, dentro ou fora deste plugin — ver `references/patterns/README.md`.

---

## Roteamento — qual filha carregar

| Pedido do usuário | Carregue |
|---|---|
| "cria um componente/hook/serviço", "adiciona um modal", "instala a lib X" | `/eng-standards:code-attention` **primeiro** |
| "já existe algo pra isso?", "isso não vai duplicar?", "pode commitar" | `/eng-standards:code-attention` |
| "documenta essa função", "escreve o JSDoc", "cria o README" | `/eng-standards:code-docs` |
| "cria o documento de especificação", "contrato de API", "plano de ação" | `/eng-standards:code-docs` |
| "monta o projeto", "onde coloco esse arquivo", "estrutura de pastas" | `/eng-standards:code-structure` |
| "qual stack usar", "que lib para X", "qual serviço AWS" | `/eng-standards:code-structure` |
| "refatora isso", "revisa esse código", "melhora essa função" | `/eng-standards:code-patterns` |
| "escreve o código de X" (qualquer feature nova) | `/eng-standards:code-attention` → `/eng-standards:code-structure` → `/eng-standards:code-patterns` |
| "cria o projeto do zero" | **as quatro**, nesta ordem: attention → structure → patterns → docs |

> Na dúvida, carregue as quatro. É barato e evita entregar código fora do padrão.

---

## Ordem de execução (feature ou projeto novo)

1. **`/eng-standards:code-attention`** — Gate de Entrada: o que já existe no projeto cobre isso?
2. **`/eng-standards:code-structure`** — define pastas, stack e serviços antes de qualquer linha de código
3. **`/eng-standards:code-patterns`** — escreve o código já dentro dos princípios
4. **`/eng-standards:code-docs`** — documenta o que foi entregue
5. **`/eng-standards:code-attention`** — Gate de Saída: documentação referenciada e teste E2E

Nunca inverta: documentar código mal estruturado é retrabalho, e criar o que já existe é dívida nova.

---

## Contrato mínimo (vale para toda entrega, sem exceção)

Independentemente da filha carregada, todo código entregue respeita:

- [ ] Nada foi criado sem antes checar se já existia no projeto
- [ ] Nenhuma duplicata foi resolvida sem a escolha do usuário
- [ ] Uma responsabilidade por função, arquivo e módulo
- [ ] Nomes autoexplicativos — sem abreviações, sem magic numbers
- [ ] Zero comentário inline explicando "o que o código faz"
- [ ] Funções exportadas documentadas no padrão da linguagem
- [ ] Código duplicado extraído
- [ ] Arquivo no lugar certo da estrutura de features/modules
- [ ] SOLID, KISS, DRY e Clean Code respeitados

Se qualquer item falhar, corrija **antes** de entregar — refatoração não é opcional nem precisa ser pedida.

---

## Estratégia de desenvolvimento

Toda estrutura é construída com potencial de crescimento e escala. Mesmo que o sistema não receba atualizações e
seja descontinuado, ele mantém a centelha de evolução e integração — sempre visando desenvolvimento futuro
organizado, simples e prático de executar.

---

## Referências desta skill

- `references/orchestration.md` — Como as filhas se combinam por tipo de tarefa, com exemplos
- `${CLAUDE_PLUGIN_ROOT}/references/patterns/README.md` — Índice da biblioteca compartilhada de patterns
