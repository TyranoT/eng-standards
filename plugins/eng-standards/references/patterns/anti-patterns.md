# Anti-Patterns — Nunca Faça

> Biblioteca compartilhada `eng-standards`. Referenciável por qualquer skill:
> `${CLAUDE_PLUGIN_ROOT}/references/patterns/anti-patterns.md`

**Quando ler:** em todo review de código e antes de entregar qualquer implementação.

---

## 1. Catálogo

| ❌ Anti-pattern | ✅ Alternativa | Princípio ferido |
|---|---|---|
| IIFE em JSX/TSX | Função nomeada ou componente | Clean Code |
| Função que faz A, B e C | Três funções: `doA()`, `doB()`, `doC()` | SRP |
| Comentário explicando o que o código faz | Renomeie a função/variável para ser clara | Clean Code |
| `utils.ts` com 30 funções não relacionadas | Separe por domínio: `date.helper.ts`, `currency.helper.ts` | SRP |
| Hook gigante `usePageLogic()` | Um hook por responsabilidade | SRP |
| Componente com lógica de API + UI + estado | Hook (lógica) + componente (UI) | MVC/MVVM |
| Nesting profundo (4+ níveis) | Guard clauses e early returns | KISS |
| Magic numbers | Constante nomeada em `constants/` | Clean Code |
| Arquivo de 500+ linhas | Quebre em módulos menores | SRP |
| Controller com regra de negócio | Mova para o service | MVC |
| Service acessando o ORM direto | Passe pelo repository | DIP |
| `any` em TypeScript | Tipo específico, `unknown` + narrowing, ou generic | Clean Code |
| Prop passada por 3+ níveis (prop drilling) | Context ou store global | KISS |
| Condicional com 4+ ramos | Map de estratégias ou polimorfismo | OCP |
| Abstração criada "para o futuro" sem uso real | Escreva o caso concreto; abstraia no segundo | KISS |
| Regra de negócio duplicada em front e back | Fonte única no backend; front só valida UX | DRY |
| `catch` vazio ou que engole o erro | Trate, propague ou logue com contexto | — |
| Classe só com métodos estáticos | Módulo de funções exportadas | — |

---

## 2. Os três mais caros (custam retrabalho, não só estética)

### Controller com regra de negócio
Impede reuso da regra por outra entrada (fila, CLI, job) e torna o teste dependente de HTTP.
Correção em `refatoracao.md`, seção 5.

### Hook/componente multi-propósito
Cada nova feature na página aumenta o mesmo arquivo até ninguém mais mexer nele com segurança.
Correção em `refatoracao.md`, seções 1 e 2.

### Regra duplicada entre camadas
Duas fontes de verdade divergem na primeira alteração e o bug aparece só em produção.

---

## 3. Como reportar em review

1. **Bloqueadores** — violações de `regras-absolutas.md`
2. **Melhorias** — anti-patterns desta lista e gatilhos de refatoração
3. **Sugestões** — nomenclatura, organização, documentação

O procedimento completo de review — escopo, caça a erros, severidade e formato do relatório — está em
`/eng-standards:code-review`. Esta seção é só o resumo da classificação.

---

## Relacionados

- `regras-absolutas.md` — subconjunto que bloqueia a entrega
- `refatoracao.md` — como corrigir cada item, com antes/depois
- `principios-solid.md` — o princípio ferido em cada linha da tabela
