---
name: code-review
description: >
  Revisão de código. Skill filha de code-standards. Use ao revisar PR, branch, diff, arquivo ou trecho solto em
  qualquer linguagem — React, Next.js, Angular, Flutter, Node.js, NestJS, Express, FastAPI, Python, Java, Spring.
  Reporta erros e bugs reais (null/undefined, async mal tratado, race condition, vazamento, falha de segurança),
  avalia a organização do código contra a estrutura de features/modules, aponta onde enxugar e despoluir, e verifica
  aderência aos patterns (SOLID, KISS, DRY, regras absolutas, anti-patterns). Classifica cada achado por severidade e
  separa o que bloqueia do que é opinião. Gatilhos: "revisa esse PR", "revisa esse código", "revisa essa branch",
  "olha esse diff", "tem algum bug aqui?", "isso tá bom?", "o que dá pra melhorar aqui?", "faz um code review".
---

# Code Review — Revisão de Código

> Esta skill é o **procedimento** da revisão: o que ler, em que ordem, como classificar e como reportar.
> Os **conceitos** (SOLID, anti-patterns, nomenclatura) vivem em `${CLAUDE_PLUGIN_ROOT}/references/patterns/`.
> Não restate conceito aqui — cite o arquivo.

---

## Princípio

Review não é opinião sobre estilo. É a resposta a quatro perguntas, nesta ordem de importância:

```
1. Isso quebra?        → erro/bug        → BLOQUEIA
2. Isso está no lugar? → organização     → BLOQUEIA se fere a estrutura
3. Isso está poluído?  → enxugamento     → MELHORIA
4. Isso segue o padrão? → patterns       → BLOQUEIA se fere regra absoluta
```

Um review que só aponta nomenclatura e ignora um `await` faltando falhou.

---

## Passo 1 — Delimitar o escopo

Antes de ler qualquer linha, saiba **o que** está sendo revisado.

| Pedido | Escopo |
|---|---|
| "revisa esse PR" | `git diff <base>...HEAD` — só o que mudou |
| "revisa essa branch" | `git diff main...HEAD` |
| "revisa esse arquivo" | O arquivo inteiro |
| "revisa isso" (código colado) | O trecho, assumindo o resto desconhecido |
| "revisa o projeto" | **Pergunte** qual módulo/feature — revisar tudo produz ruído, não sinal |

```bash
git diff --stat main...HEAD          # dimensão da mudança antes de mergulhar
git diff main...HEAD -- <caminho>    # arquivo por arquivo
```

Regras de escopo:

- Revise **o que mudou**, não o repositório inteiro. Código pré-existente só entra se a mudança o quebrou.
- Se o diff tem 40+ arquivos, revise por módulo e diga que fez isso — review superficial de diff grande é pior que nenhum.
- Leia o código **em volta** do diff quando necessário para julgar. Uma linha pode estar certa isolada e errada no contexto.

---

## Passo 2 — Caçar erros (prioridade máxima)

Esta é a única parte do review que não admite falso negativo. Varra explicitamente:

### Correção

| Classe | O que procurar |
|---|---|
| Null / undefined | Acesso a propriedade sem checagem, `!` non-null assertion, optional chaining ausente onde a origem pode faltar |
| Async | `await` esquecido, promise não tratada, `Promise.all` com erro engolido, `async` em `forEach` |
| Erro | `catch` vazio ou que só loga, erro engolido, `throw` de string em vez de `Error`, falta de tratamento no boundary |
| Condicional | Comparação `==` vs `===`, falsy acidental (`0`, `""`, `false` caindo no else), negação invertida |
| Limite | Índice fora do array, divisão por zero, string vazia, lista vazia, primeiro/último elemento |
| Tipo | `any` mascarando incompatibilidade, cast forçado, retorno que não bate com a assinatura |
| Estado | Mutação direta de estado/props, dependência faltando em `useEffect`/`useMemo`, closure capturando valor velho |
| Recurso | Listener/subscription/timer sem cleanup, conexão não fechada, `useEffect` sem retorno de limpeza |
| Concorrência | Race condition, request sem cancelamento, escrita concorrente no mesmo registro |

### Segurança

| Classe | O que procurar |
|---|---|
| Entrada | Payload não validado antes de chegar no service, query construída por concatenação |
| Segredo | Chave, token ou senha hardcoded; `.env` commitado; segredo em log |
| Exposição | Dado sensível em resposta de API, stack trace vazando para o cliente, log com PII |
| Autorização | Rota sem middleware de auth, checagem de permissão só no frontend |

> Se encontrar algo desta tabela, é **Bloqueador** — independentemente de quão limpo o resto esteja.

### Regressão

Todo review verifica quem **consome** o que mudou: assinatura alterada, retorno diferente, campo
removido do contrato, arquivo movido ou renomeado. É o mesmo mapeamento da *Revisão de encerramento*
da skill mãe — aqui aplicado ao código de outra pessoa.

---

## Passo 3 — Avaliar a organização

Compare o que está no diff com a estrutura definida em `/eng-standards:code-structure`.

| Verificação | Falha quando |
|---|---|
| Arquivo no lugar certo | Helper de feature em `shared/`, ou componente global dentro de uma feature |
| Camada respeitada (backend) | Controller acessando repository direto, service conhecendo `req`/`res`, regra de negócio no controller |
| Camada respeitada (frontend) | Lógica de negócio dentro do JSX, chamada HTTP direto no componente, `ui/` com regra |
| Barrel export | Feature nova sem `index.ts`, ou import furando o barrel (`features/x/hooks/use-y` em vez de `features/x`) |
| Um hook por finalidade | Hook devolvendo 5+ valores não relacionados |
| Dependência entre features | Uma feature importando o interior de outra em vez do contrato público |
| Arquivo genérico | `utils.ts`, `helpers.ts` ou `constants.ts` virando depósito |

> Violação de camada é **Bloqueador**. Arquivo no lugar errado é **Melhoria**, salvo quando cria
> dependência circular ou acoplamento entre features — aí bloqueia.

---

## Passo 4 — Sugerir enxugamento

Aqui o objetivo é **remover**, não adicionar. Escolha os trechos com maior retorno e ignore o resto —
sugerir 30 micro-ajustes é ruído.

Critério de escolha: priorize o que é **mais lido** e o que **mais cresce**.

| Sinal no diff | Sugestão |
|---|---|
| Código duplicado entre 2+ arquivos do PR | Extrair para helper/hook — cite os dois caminhos |
| Nesting de 4+ níveis | Guard clauses e early return |
| Condicional com 4+ ramos | Map de estratégias |
| Componente 100+ linhas / arquivo 200+ linhas | Quebrar por responsabilidade |
| Variável intermediária usada uma vez só | Inline, se o nome não agrega significado |
| Wrapper que só repassa argumentos | Remover a camada |
| `else` depois de `return` | Remover o `else` |
| Try/catch envolvendo bloco grande | Estreitar ao que realmente pode falhar |
| Comentário explicando "o que faz" | Renomear até dispensar o comentário |
| Código morto, `console.log`, TODO antigo, trecho comentado | Remover |
| Abstração com um único uso | Deixar inline até aparecer o segundo caso |

Gatilhos completos e 8 exemplos antes/depois:
`${CLAUDE_PLUGIN_ROOT}/references/patterns/refatoracao.md`

**Regra de proporção:** sugestão de refatoração não pode ser maior que a mudança revisada. Se o PR
altera 20 linhas e a sugestão reescreve o módulo, isso não é review — é outra tarefa. Aponte e
proponha separar.

---

## Passo 5 — Verificar patterns

Carregue apenas o que o diff exige:

| Situação no diff | Carregue |
|---|---|
| Sempre (base do review) | `${CLAUDE_PLUGIN_ROOT}/references/patterns/anti-patterns.md` |
| Sempre (o que bloqueia) | `${CLAUDE_PLUGIN_ROOT}/references/patterns/regras-absolutas.md` |
| Nomes novos de variável/função/arquivo | `${CLAUDE_PLUGIN_ROOT}/references/patterns/nomenclatura.md` |
| Separação de responsabilidade em discussão | `${CLAUDE_PLUGIN_ROOT}/references/patterns/principios-solid.md` |
| Classe ou entidade nova | `${CLAUDE_PLUGIN_ROOT}/references/patterns/poo.md` |
| Sugestão de refatoração | `${CLAUDE_PLUGIN_ROOT}/references/patterns/refatoracao.md` |

As 4 regras absolutas — sem IIFE em JSX, sem função multi-propósito, sem comentário inline
explicando "o que fez", sem `any` injustificado — são **sempre Bloqueador**.

---

## Passo 6 — Checar o que ficou para trás

Reaproveite o Gate de Saída da `/eng-standards:code-attention`:

- [ ] O PR criou algo que **já existia** no projeto? (duplicata é Bloqueador)
- [ ] O PR instalou dependência que já tinha equivalente instalada?
- [ ] Mudou contrato/rota/componente público sem atualizar a documentação que o referencia?
- [ ] Tem suíte E2E no projeto e o fluxo novo ficou sem cobertura?
- [ ] Funções exportadas novas ficaram sem documentação no padrão da linguagem?

---

## Severidade — como classificar cada achado

| Nível | Critério | Efeito |
|---|---|---|
| 🔴 **Bloqueador** | Quebra em execução, falha de segurança, viola regra absoluta, fere camada, duplica o que já existe | Não aprova até corrigir |
| 🟡 **Melhoria** | Anti-pattern, gatilho de refatoração, arquivo no lugar errado, complexidade desnecessária | Corrigir preferencialmente neste PR |
| 🔵 **Sugestão** | Nomenclatura, organização interna, documentação, preferência justificada | Fica a critério do autor |
| ⚪ **Nota** | Contexto, elogio a uma solução boa, aviso sobre algo fora do escopo do PR | Informativo |

Regra de honestidade: **não infle severidade para parecer rigoroso, nem esvazie para agradar.**
Se a única coisa errada é um nome, o review tem um item 🔵 — e está certo assim.

---

## Formato do relatório

```markdown
## Review — <escopo>  ·  <N> arquivos, +<X>/-<Y>

**Veredito:** Aprovado · Aprovado com ressalvas · Requer correção

### 🔴 Bloqueadores (2)

1. **`src/modules/pedidos/pedidos.service.ts:47`** — `await` ausente em `repository.salvar()`
   A função retorna antes da escrita concluir; o response diz sucesso mesmo se o banco falhar.
   ```ts
   - repository.salvar(pedido)
   + await repository.salvar(pedido)
   ```

2. **`src/modules/pedidos/pedidos.controller.ts:22`** — regra de negócio no controller
   O cálculo de desconto está na camada de entrada. Mover para o service.
   Fere a cadeia `routes → controller → service → repository`.

### 🟡 Melhorias (1)

3. **`features/pedidos/hooks/use-pedidos.ts:12`** — hook devolve 6 valores não relacionados
   Separar em `usePedidosList` e `usePedidosFiltros`.

### 🔵 Sugestões (1)

4. **`features/pedidos/helpers/calc.ts:3`** — `calc` não diz o que calcula
   Sugestão: `calcularTotalComDesconto`.

### ⚪ Notas

- O tratamento de erro em `shared/http/client.ts` ficou bem resolvido.
- `POST /pedidos` mudou de contrato e `docs/api-contract.md` não foi atualizado.

### Verificado e sem apontamento
Tipagem, cobertura de teste unitário, imports, nomenclatura de arquivos.
```

Regras do relatório:

- **Sempre** `arquivo:linha`. Achado sem localização é inútil.
- **Sempre** o porquê, não só o quê. "Está errado" não é review; "retorna antes da escrita concluir" é.
- Mostre o patch quando a correção couber em poucas linhas. Descreva quando for estrutural.
- Numere os achados de forma contínua — facilita o autor responder "resolvi o 2 e o 4".
- A seção **"Verificado e sem apontamento"** não é enfeite: ela diz ao autor o que você *olhou*, separando "está bom" de "não olhei".
- Se não houver nenhum achado, diga isso em duas linhas e liste o que foi verificado. Não invente item para justificar o review.

---

## Regras absolutas desta skill

- [ ] **Nunca** aprove sem ter lido o diff inteiro do escopo definido
- [ ] **Nunca** reporte achado sem `arquivo:linha`
- [ ] **Nunca** classifique preferência pessoal como Bloqueador
- [ ] **Nunca** sugira refatoração maior que a mudança revisada sem marcá-la como tarefa separada
- [ ] **Nunca** afirme que algo quebra sem conseguir descrever o cenário concreto de falha
- [ ] **Nunca** altere o código durante o review — review descreve, não corrige, salvo pedido explícito
- [ ] **Nunca** invente achado para encher o relatório

---

## Tom

O alvo é o código, nunca quem escreveu. Sem ironia, sem "obviamente", sem lição de moral.
Escreva o que muda e por quê — o autor decide.

| ❌ | ✅ |
|---|---|
| "Esse código está uma bagunça" | "`pedidos.service.ts` acumula 3 responsabilidades; separar em service + validator" |
| "Óbvio que isso quebra" | "Quebra quando `itens` vem vazio: `itens[0]` retorna `undefined` na linha 47" |
| "Ninguém mais usa var" | "`var` tem escopo de função; aqui `const` evita o vazamento no loop" |
| "Melhora isso aí" | "Nesting de 5 níveis; guard clause na linha 12 reduz para 2" |

---

## Quando o review vira outra coisa

| Situação | O que fazer |
|---|---|
| Usuário pede para **corrigir** o que foi apontado | Carregue `/eng-standards:code-patterns` e aplique — o review acabou |
| O diff revela problema de arquitetura, não de código | Sinalize e proponha `/eng-standards:code-structure` como tarefa separada |
| O PR está sem documentação e o usuário quer resolver | Carregue `/eng-standards:code-docs` |
| Pedido é "isso já existe no projeto?" | É `/eng-standards:code-attention`, não review |

---

## Skills irmãs

- `/eng-standards:code-patterns` — os conceitos que este review aplica (índice da biblioteca de patterns)
- `/eng-standards:code-structure` — a estrutura contra a qual o Passo 3 compara
- `/eng-standards:code-attention` — varredura de duplicata e Gate de Saída usados no Passo 6
- `/eng-standards:code-docs` — padrão de documentação verificado no Passo 6
- `/eng-standards:code-standards` — skill mãe, roteamento entre as filhas
