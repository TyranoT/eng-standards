# Italo-Standards — Marketplace de Plugins Claude Code

Marketplace pessoal com padrões de engenharia de software.

## Plugins disponíveis

| Plugin | Descrição | Skills |
|---|---|---|
| `eng-standards` | Padrões de engenharia em árvore EAP | 6 |

## Instalação

```bash
# 1. Adicionar o marketplace
/plugin marketplace add SEU_USUARIO/SEU_REPOSITORIO

# 2. Instalar o plugin
/plugin install eng-standards@italo-standards
```

Para atualizar depois de novos commits:

```bash
/plugin marketplace update italo-standards
```

## Plugin: eng-standards

Árvore de skills coordenadas por uma skill mãe:

```
/eng-standards:code-standards      MÃE — roteamento e contrato mínimo
├── /eng-standards:code-attention  Varredura antes de criar + checkpoint antes de entregar
├── /eng-standards:code-docs       Documentação de código + documentos de projeto
├── /eng-standards:code-structure  Pastas, stacks e serviços
├── /eng-standards:code-patterns   SOLID, KISS, DRY, nomenclatura, POO, anti-patterns
└── /eng-standards:code-review     Revisão de PR/branch/diff: erros, organização, patterns
```

### Como usar

As skills carregam automaticamente quando o contexto bate com a `description` do frontmatter —
não é preciso invocar manualmente. Para forçar o carregamento:

```
/eng-standards:code-standards
```

A skill mãe decide quais filhas carregar conforme o pedido.

### Cobertura

| Área | Conteúdo |
|---|---|
| **Documentação** | JSDoc/TSDoc, Docstrings Python, Javadoc, DartDoc, README + templates dos 5 documentos essenciais (Especificação, Arquitetura, Fluxo UML, Plano de Ação, Contrato de API) |
| **Estruturação** | Frontend (features + shared + store), Backend (modules com controller/service/repository), Flutter, FastAPI, Spring, stacks padrão, serviços AWS |
| **Patterns** | SOLID, KISS, DRY, Clean Code, MVC/MVVM, nomenclatura, POO, regras absolutas, anti-patterns, gatilhos de refatoração — em biblioteca compartilhada, um arquivo por conceito |
| **Verificação** | Varredura de design system instalado (Shadcn, MUI, Chakra), busca por componente de mesmo propósito, decisão de duplicata via pergunta ao usuário, detecção de documentação referenciada e de suíte E2E (Playwright, Cypress) |
| **Review** | Caça a erros (null/async/limite/estado/recurso/concorrência) e falhas de segurança, aderência a camadas e estrutura, sugestões de enxugamento, 4 níveis de severidade e relatório com `arquivo:linha` |

## Estrutura do repositório

```
.
├── .claude-plugin/
│   └── marketplace.json          # Catálogo de plugins
├── plugins/
│   └── eng-standards/
│       ├── .claude-plugin/
│       │   └── plugin.json       # Manifesto do plugin
│       ├── references/
│       │   └── patterns/         # Biblioteca compartilhada de conceitos
│       │       ├── README.md             # Índice: qual arquivo ler pra quê
│       │       ├── principios-solid.md
│       │       ├── regras-absolutas.md
│       │       ├── nomenclatura.md
│       │       ├── poo.md
│       │       ├── anti-patterns.md
│       │       └── refatoracao.md
│       └── skills/
│           ├── code-standards/   # Skill mãe
│           ├── code-attention/   # Gate de entrada e de saída
│           ├── code-docs/
│           ├── code-structure/
│           ├── code-patterns/    # Índice → aponta para references/patterns/
│           └── code-review/      # Procedimento de revisão
└── README.md
```

### Biblioteca de patterns compartilhada

Os conceitos de patterns ficam em arquivos autônomos, fora das skills, para poderem ser citados como
referência por **qualquer skill** — inclusive skills de outros plugins ou projetos.

| Arquivo | Leia quando |
|---|---|
| `principios-solid.md` | Precisa justificar ou decidir uma separação de responsabilidade |
| `regras-absolutas.md` | Vai gerar código novo ou aprovar/bloquear um review |
| `nomenclatura.md` | Vai nomear variável, função, classe, arquivo ou pasta |
| `poo.md` | Está modelando entidade com estado ou comportamento |
| `anti-patterns.md` | Está revisando código ou fechando uma entrega |
| `refatoracao.md` | Encontrou código que precisa melhorar |

Para citar de dentro deste plugin:

```markdown
Leia `${CLAUDE_PLUGIN_ROOT}/references/patterns/nomenclatura.md`
```

De uma skill fora do plugin, use o caminho instalado:

```
~/.claude/plugins/eng-standards/references/patterns/<arquivo>.md
```

## Publicando

O marketplace é um repositório Git público. Não há pacote npm nem hospedagem própria.

```bash
git init
git add .
git commit -m "feat: marketplace com plugin eng-standards"
git remote add origin git@github.com:SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

> Use fonte Git (GitHub, GitLab ou URL `.git`) ao adicionar o marketplace. Os caminhos relativos
> em `marketplace.json` não resolvem quando o arquivo é distribuído por URL direta.

## Versionamento

Ao alterar uma skill, suba a versão em **dois** lugares:

- `plugins/eng-standards/.claude-plugin/plugin.json` → `version`
- `.claude-plugin/marketplace.json` → `plugins[].version`
