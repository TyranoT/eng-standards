---
name: code-standards
description: >
  Skill MÃE de padrões de engenharia de software. SEMPRE consulte ao escrever, revisar, refatorar, documentar ou
  estruturar qualquer código ou projeto, em qualquer linguagem ou framework — React, Next.js, Angular, Flutter,
  Node.js, NestJS, Express, FastAPI, Python, Java, Spring. Coordena três skills filhas: code-docs (documentação e
  documentos de projeto), code-structure (estrutura de pastas, stacks e serviços) e code-patterns (patterns,
  princípios e anti-patterns em código). Use sempre que o usuário pedir para criar, refatorar, revisar, documentar
  ou organizar código e projetos — mesmo que não mencione "padrões", "arquitetura" ou "documentação".
---

# Code Standards — Skill Mãe

> Ponto de entrada único dos padrões de engenharia de software.
> Esta skill **não contém as regras** — ela roteia para a skill filha correta e garante que nenhuma camada seja esquecida.

---

## Árvore de Skills (EAP)

```
/eng-standards:code-standards (MÃE — orquestração)
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
└── 3. code-patterns ..... Aplicação de Patterns
    ├── 3.1 Princípios (SOLID, KISS, DRY, Clean Code, MVC/MVVM)
    ├── 3.2 Nomenclatura
    ├── 3.3 POO — quando e como
    ├── 3.4 Regras absolutas e anti-patterns
    └── 3.5 Refatoração
```

---

## Roteamento — qual filha carregar

| Pedido do usuário | Carregue |
|---|---|
| "documenta essa função", "escreve o JSDoc", "cria o README" | `/eng-standards:code-docs` |
| "cria o documento de especificação", "contrato de API", "plano de ação" | `/eng-standards:code-docs` |
| "monta o projeto", "onde coloco esse arquivo", "estrutura de pastas" | `/eng-standards:code-structure` |
| "qual stack usar", "que lib para X", "qual serviço AWS" | `/eng-standards:code-structure` |
| "refatora isso", "revisa esse código", "melhora essa função" | `/eng-standards:code-patterns` |
| "escreve o código de X" (qualquer feature nova) | `/eng-standards:code-patterns` + `/eng-standards:code-structure` |
| "cria o projeto do zero" | **as três**, nesta ordem: structure → patterns → docs |

> Na dúvida, carregue as três. É barato e evita entregar código fora do padrão.

---

## Ordem de execução (projeto novo)

1. **`/eng-standards:code-structure`** — define pastas, stack e serviços antes de qualquer linha de código
2. **`/eng-standards:code-patterns`** — escreve o código já dentro dos princípios
3. **`/eng-standards:code-docs`** — documenta o que foi entregue

Nunca inverta: documentar código mal estruturado é retrabalho.

---

## Contrato mínimo (vale para toda entrega, sem exceção)

Independentemente da filha carregada, todo código entregue respeita:

- [ ] Uma responsabilidade por função, arquivo e módulo
- [ ] Nomes autoexplicativos — sem abreviações, sem magic numbers
- [ ] Zero comentário inline explicando "o que o código faz"
- [ ] Funções exportadas documentadas no padrão da linguagem
- [ ] Código duplicado extraído
- [ ] Arquivo no lugar certo da estrutura de features/modules
- [ ] SOLID, KISS, DRY e Clean Code respeitados
- [ ] Revisão de encerramento executada (ver seção abaixo)

Se qualquer item falhar, corrija **antes** de entregar — refatoração não é opcional nem precisa ser pedida.

---

## Revisão de encerramento (obrigatória)

Ao **encerrar qualquer atividade ou processo** — feature, refatoração, correção, documentação ou ajuste pontual —
faça uma revisão final **antes** de considerar a tarefa concluída. Isso vale para toda entrega, mesmo as pequenas,
e não precisa ser pedido pelo usuário.

A revisão responde duas perguntas:

**1. O que foi feito está correto e dentro do padrão?**
- [ ] Reler o próprio diff do início ao fim, arquivo por arquivo
- [ ] Confirmar que o Contrato mínimo foi cumprido em tudo que foi tocado
- [ ] Garantir que não sobrou código morto, `console.log`, TODO esquecido ou trecho comentado

**2. Isso interferiu em alguma outra parte do código?**
- [ ] Mapear tudo que **consome** o que foi alterado (funções, componentes, rotas, tipos, contratos de API)
- [ ] Verificar se assinaturas, tipos, retornos ou comportamentos mudaram e quebram quem depende deles
- [ ] Conferir imports/exports, nomes renomeados e arquivos movidos em **todos** os pontos que os referenciam
- [ ] Validar efeitos colaterais: estado compartilhado, side effects, migrações, variáveis de ambiente, configs
- [ ] Rodar (ou pedir para rodar) build, lint e testes afetados quando existirem

Se a revisão encontrar qualquer impacto colateral, **corrija ou sinalize explicitamente antes de encerrar** — nunca
entregue assumindo que "provavelmente não afetou nada". Ao final, relate em uma linha o que mudou e o que foi
verificado como não afetado.

---

## Estratégia de desenvolvimento

Toda estrutura é construída com potencial de crescimento e escala. Mesmo que o sistema não receba atualizações e
seja descontinuado, ele mantém a centelha de evolução e integração — sempre visando desenvolvimento futuro
organizado, simples e prático de executar.

---

## Referências desta skill

- `references/orchestration.md` — Como as filhas se combinam por tipo de tarefa, com exemplos
