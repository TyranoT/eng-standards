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
| 1 | `/eng-standards:code-structure` | Definir árvore de pastas (`features/` no front, `modules/` no back), escolher stack da lista padrão, listar serviços necessários |
| 2 | `/eng-standards:code-docs` | Gerar Especificação Completa + Contrato de API **antes** de codar |
| 3 | `/eng-standards:code-patterns` | Implementar respeitando SOLID/KISS/DRY, nomenclatura e regras absolutas |
| 4 | `/eng-standards:code-docs` | Documentar funções exportadas + README |

> Exceção à ordem padrão: em projeto novo, o Contrato de API vem antes do código — ele guia frontend e backend simultaneamente.

---

## Cenário 2 — Nova feature em projeto existente

**Pedido típico:** "Adiciona a feature de relatórios"

| Ordem | Skill | O que fazer |
|---|---|---|
| 1 | `/eng-standards:code-structure` | Criar `features/relatorios/` com `api/`, `hooks/`, `helpers/`, `constants/`, `components/`, `ui/`, `schema.ts`, `type.ts`, `index.ts` |
| 2 | `/eng-standards:code-patterns` | Um hook por responsabilidade, UI separada da lógica |
| 3 | `/eng-standards:code-docs` | JSDoc nas funções exportadas + atualizar Contrato de API se houver rota nova |

---

## Cenário 3 — Refatoração

**Pedido típico:** "Esse componente tá enorme, arruma"

| Ordem | Skill | O que fazer |
|---|---|---|
| 1 | `/eng-standards:code-patterns` | Identificar gatilhos de refatoração, aplicar SRP, extrair duplicação |
| 2 | `/eng-standards:code-structure` | Realocar arquivos extraídos para a pasta correta da feature |
| 3 | `/eng-standards:code-docs` | Documentar as novas funções/componentes criados |

---

## Cenário 4 — Review de código

**Pedido típico:** "Revisa esse PR"

Carregue `/eng-standards:code-patterns` como principal. Use `/eng-standards:code-structure` para validar se os arquivos estão no lugar certo e
`/eng-standards:code-docs` para verificar cobertura de documentação nas funções exportadas.

Formato do review:
1. **Bloqueadores** — violações de regras absolutas
2. **Melhorias** — anti-patterns e oportunidades de refatoração
3. **Sugestões** — nomenclatura, organização, documentação

---

## Cenário 5 — Só documentação

**Pedido típico:** "Escreve o documento de arquitetura desse projeto"

Carregue apenas `/eng-standards:code-docs`. Use `/eng-standards:code-structure` como fonte de verdade sobre a organização real do projeto para
que o documento descreva a estrutura correta.

---

## Regra de conflito

Se duas filhas derem orientações conflitantes:

1. **Regras absolutas** de `/eng-standards:code-patterns` vencem sempre
2. Estrutura de pastas de `/eng-standards:code-structure` vence sobre preferências pontuais
3. Formato de documentação de `/eng-standards:code-docs` cede a padrões oficiais da linguagem quando houver divergência
