---
name: code-patterns
description: >
  Princípios, patterns e anti-patterns em código. Skill filha de code-standards. Use ao escrever ou
  refatorar qualquer código em qualquer linguagem — React, Next.js, Angular, Flutter, Node.js, NestJS, Express,
  FastAPI, Python, Java, Spring. Cobre SOLID, KISS, DRY, Clean Code, MVC/MVVM, nomenclatura, uso de POO, regras
  absolutas (sem IIFE em JSX, sem funções multi-propósito, sem comentário inline), anti-patterns e gatilhos de
  refatoração. Gatilhos: "refatora isso", "melhora essa função", "escreve o código de X", "esse componente tá
  grande", "como nomear isso", "aplica SOLID". Para revisar PR, branch ou diff, a skill é code-review — esta aqui
  fornece os conceitos que aquele review aplica.
---

# Code Patterns — Índice dos Princípios e Patterns

> Estas regras valem para **qualquer** linguagem ou framework.
> O conteúdo completo vive na biblioteca compartilhada `${CLAUDE_PLUGIN_ROOT}/references/patterns/`.
> Esta skill carrega o mínimo inegociável e roteia para o conceito certo.

---

## 1. Regras absolutas — valem sempre, sem carregar nada

1. **Sem IIFE em JSX/TSX** — use função nomeada ou componente dedicado
2. **Sem função multi-propósito** — se o nome precisa de um "e", são duas funções
3. **Sem comentário inline explicando "o que fez"** — renomeie até dispensar o comentário
4. **Sem `any` sem justificativa** — tipo específico, `unknown` + narrowing, ou generic

Detalhes, exemplos e a única exceção legítima ao item 3:
`${CLAUDE_PLUGIN_ROOT}/references/patterns/regras-absolutas.md`

---

## 2. Roteamento — qual conceito carregar

| Pedido / situação | Carregue de `references/patterns/` |
|---|---|
| "aplica SOLID", discussão de arquitetura, justificar separação | `principios-solid.md` |
| Gerar código novo | `regras-absolutas.md` |
| "como nomear isso", criar variável/função/arquivo/pasta | `nomenclatura.md` |
| Modelar entidade, decidir classe vs. função | `poo.md` |
| Fechar entrega, checar o próprio código | `anti-patterns.md` |
| "refatora isso", "esse componente tá grande" | `refatoracao.md` |

Índice completo, combinações usuais e como citar de outras skills:
`${CLAUDE_PLUGIN_ROOT}/references/patterns/README.md`

> Carregue só o que a tarefa exige. Na dúvida entre dois, carregue os dois — não os seis.

---

## 3. Combinações por tipo de tarefa

| Tarefa | Arquivos |
|---|---|
| Escrever código novo | `regras-absolutas.md` + `nomenclatura.md` |
| Revisar PR (via `/eng-standards:code-review`) | `anti-patterns.md` + `regras-absolutas.md` |
| Refatorar | `refatoracao.md` + `principios-solid.md` |
| Modelar domínio | `poo.md` + `principios-solid.md` |

---

## 4. Checklist antes de entregar código

- [ ] Nenhuma IIFE em JSX/TSX
- [ ] Cada função tem propósito único e nome claro
- [ ] Sem comentários inline explicando "o que fez"
- [ ] Código duplicado foi extraído
- [ ] Nomes de variáveis, funções e arquivos são autoexplicativos
- [ ] POO aplicado onde a lógica é complexa/stateful
- [ ] Nenhum `any` sem justificativa
- [ ] Guard clauses no lugar de nesting profundo
- [ ] Magic numbers viraram constantes nomeadas
- [ ] SOLID, KISS, DRY e Clean Code respeitados

Se qualquer item falhar, corrija **antes** de entregar — refatoração não é opcional nem precisa ser pedida.

---

## Skills irmãs

- `/eng-standards:code-review` — procedimento de revisão de PR/branch/diff, que aplica estes conceitos
- `/eng-standards:code-structure` — onde o arquivo deve morar, stack e serviços
- `/eng-standards:code-docs` — documentação de código e documentos de projeto
- `/eng-standards:code-standards` — skill mãe, roteamento entre as filhas
