# Orquestração — Combinando as Skills Filhas

Guia de como as três filhas se combinam por tipo de tarefa real.

---

## Passo final universal — Revisão de encerramento

Todo cenário abaixo termina com a **Revisão de encerramento** descrita na skill mãe (`SKILL.md`): reler o próprio
diff, confirmar o Contrato mínimo e mapear se a mudança interferiu em outras partes do código (quem consome o que foi
alterado, imports/exports, tipos, contratos de API, efeitos colaterais). Nenhuma atividade é considerada concluída
sem esse passo — ele é implícito na última linha de cada tabela.

---

## Cenário 1 — Projeto novo do zero

**Pedido típico:** "Cria um sistema de gestão de usuários com Next.js e Express"

| Ordem | Skill | O que fazer |
|---|---|---|
| 1 | `/eng-standards:code-attention` | Confirmar com o usuário as dependências a instalar e se haverá suíte E2E desde o início — em projeto novo não há o que reaproveitar, mas há o que decidir |
| 2 | `/eng-standards:code-structure` | Definir árvore de pastas (`features/` no front, `modules/` no back), escolher stack da lista padrão, listar serviços necessários |
| 3 | `/eng-standards:code-docs` | Gerar Especificação Completa + Contrato de API **antes** de codar |
| 4 | `/eng-standards:code-patterns` | Implementar respeitando SOLID/KISS/DRY, nomenclatura e regras absolutas |
| 5 | `/eng-standards:code-docs` | Documentar funções exportadas + README |

> Exceção à ordem padrão: em projeto novo, o Contrato de API vem antes do código — ele guia frontend e backend simultaneamente.

---

## Cenário 2 — Nova feature em projeto existente

**Pedido típico:** "Adiciona a feature de relatórios"

| Ordem | Skill | O que fazer |
|---|---|---|
| 1 | `/eng-standards:code-attention` | **Gate de Entrada** — checar design system instalado, componentes com o mesmo propósito, docs que citam o alvo e suíte E2E. Perguntar se houver duplicata |
| 2 | `/eng-standards:code-structure` | Criar `features/relatorios/` com `api/`, `hooks/`, `helpers/`, `constants/`, `components/`, `ui/`, `schema.ts`, `type.ts`, `index.ts` |
| 3 | `/eng-standards:code-patterns` | Um hook por responsabilidade, UI separada da lógica |
| 4 | `/eng-standards:code-docs` | JSDoc nas funções exportadas + atualizar Contrato de API se houver rota nova |
| 5 | `/eng-standards:code-attention` | **Gate de Saída** — perguntar sobre documentação referenciada e teste E2E |

---

## Cenário 3 — Refatoração

**Pedido típico:** "Esse componente tá enorme, arruma"

| Ordem | Skill | O que fazer |
|---|---|---|
| 1 | `/eng-standards:code-attention` | Antes de extrair, checar se o pedaço extraído já existe em `shared/` — extrair para um arquivo novo o que já era global é criar duplicata |
| 2 | `/eng-standards:code-patterns` | Identificar gatilhos de refatoração, aplicar SRP, extrair duplicação |
| 3 | `/eng-standards:code-structure` | Realocar arquivos extraídos para a pasta correta da feature |
| 4 | `/eng-standards:code-docs` | Documentar as novas funções/componentes criados |
| 5 | `/eng-standards:code-attention` | Gate de Saída — a refatoração mudou algo documentado? há E2E cobrindo o comportamento mantido? |

---

## Cenário 4 — Review de código

**Pedido típico:** "Revisa esse PR"

Carregue `/eng-standards:code-review` — ela é a dona do procedimento (escopo, caça a erros, severidade e formato
do relatório) e puxa as demais conforme o diff exigir:

| Passo do review | Skill consultada |
|---|---|
| Caça a erros, severidade, relatório | `/eng-standards:code-review` (conduz) |
| Conceito ferido em cada achado | `${CLAUDE_PLUGIN_ROOT}/references/patterns/` via `/eng-standards:code-patterns` |
| Arquivo no lugar certo, camadas respeitadas | `/eng-standards:code-structure` |
| Duplicata introduzida pelo PR, pendência de doc e E2E | `/eng-standards:code-attention` |
| Cobertura de documentação nas funções exportadas | `/eng-standards:code-docs` |

Saída em 4 níveis de severidade: 🔴 Bloqueador · 🟡 Melhoria · 🔵 Sugestão · ⚪ Nota.

---

## Cenário 5 — Só documentação

**Pedido típico:** "Escreve o documento de arquitetura desse projeto"

Carregue apenas `/eng-standards:code-docs`. Use `/eng-standards:code-structure` como fonte de verdade sobre a organização real do projeto para
que o documento descreva a estrutura correta.

---

## Regra de conflito

Se duas filhas derem orientações conflitantes:

1. **Regras absolutas** de `/eng-standards:code-patterns` vencem sempre
2. **Bloqueio de `/eng-standards:code-attention` vence sobre pressa** — se há duplicata ou dependência a decidir, nada é escrito antes da resposta do usuário
3. Estrutura de pastas de `/eng-standards:code-structure` vence sobre preferências pontuais
4. Formato de documentação de `/eng-standards:code-docs` cede a padrões oficiais da linguagem quando houver divergência

---

## Cenário 6 — Só verificação

**Pedido típico:** "Já existe um componente de tabela nesse projeto?" / "Pode commitar?"

Carregue apenas `/eng-standards:code-attention`. Entregue o relatório de varredura em até 6 linhas
e, se houver decisão pendente, faça a pergunta. Não escreva código nem documentação nesse caso.
