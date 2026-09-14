# Biblioteca de Patterns — `eng-standards`

Conceitos de patterns separados em arquivos autônomos, para serem citados como referência por
**qualquer skill**, dentro ou fora deste plugin.

Cada arquivo é independente: tem escopo próprio, exemplos próprios e links para os relacionados.
Nenhum depende de ser lido em ordem.

---

## Índice — qual arquivo ler para quê

| Arquivo | Conteúdo | Leia quando |
|---|---|---|
| `principios-solid.md` | SOLID (os 5), KISS, DRY, Clean Code, MVC/MVVM + tabela de decisão | Precisa justificar ou decidir uma separação de responsabilidade |
| `regras-absolutas.md` | Sem IIFE em JSX, sem função multi-propósito, sem comentário inline, sem `any` | Vai gerar código novo ou aprovar/bloquear um review |
| `nomenclatura.md` | Tabela por elemento, verbos padrão, sufixos de arquivo, proibições | Vai nomear variável, função, classe, arquivo ou pasta |
| `poo.md` | Quando usar classe vs. função pura, regras ao usar classes | Está modelando entidade com estado ou comportamento |
| `anti-patterns.md` | Catálogo ❌ → ✅ com o princípio ferido em cada linha | Está revisando código ou fechando uma entrega |
| `refatoracao.md` | Gatilhos (quando refatorar) + 8 exemplos antes/depois | Encontrou código que precisa melhorar |

---

## Como referenciar a partir de outra skill

No corpo do `SKILL.md` da sua skill, aponte pelo caminho da raiz do plugin:

```markdown
Antes de escrever código, leia:
- `${CLAUDE_PLUGIN_ROOT}/references/patterns/regras-absolutas.md`
- `${CLAUDE_PLUGIN_ROOT}/references/patterns/nomenclatura.md`
```

Para uma skill **fora** deste plugin, use o caminho instalado do plugin:

```
~/.claude/plugins/eng-standards/references/patterns/<arquivo>.md
```

> Carregue apenas os arquivos que a tarefa exige. Carregar os seis de uma vez desperdiça contexto —
> o índice acima existe justamente para escolher.

---

## Combinações usuais

| Tarefa | Arquivos a carregar |
|---|---|
| Escrever código novo | `regras-absolutas.md` + `nomenclatura.md` |
| Revisar PR | `anti-patterns.md` + `regras-absolutas.md` |
| Refatorar | `refatoracao.md` + `principios-solid.md` |
| Modelar domínio / entidade | `poo.md` + `principios-solid.md` |
| Discussão de arquitetura | `principios-solid.md` |

---

## Regra de manutenção

Estes arquivos são a **fonte única** dos conceitos de patterns. O `SKILL.md` de
`/eng-standards:code-patterns` é apenas índice e checklist — não duplique conteúdo lá.
Ao alterar um conceito, altere aqui.
