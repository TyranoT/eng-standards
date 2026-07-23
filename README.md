# Italo-Standards — Marketplace de Plugins Claude Code

Marketplace pessoal com padrões de engenharia de software.

## Plugins disponíveis

| Plugin | Descrição | Skills |
|---|---|---|
| `eng-standards` | Padrões de engenharia em árvore EAP | 4 |

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
├── /eng-standards:code-docs       Documentação de código + documentos de projeto
├── /eng-standards:code-structure  Pastas, stacks e serviços
└── /eng-standards:code-patterns   SOLID, KISS, DRY, nomenclatura, POO, anti-patterns
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
| **Patterns** | SOLID, KISS, DRY, Clean Code, MVC/MVVM, nomenclatura, POO, regras absolutas, anti-patterns, gatilhos de refatoração |

## Estrutura do repositório

```
.
├── .claude-plugin/
│   └── marketplace.json          # Catálogo de plugins
├── plugins/
│   └── eng-standards/
│       ├── .claude-plugin/
│       │   └── plugin.json       # Manifesto do plugin
│       └── skills/
│           ├── code-standards/   # Skill mãe
│           ├── code-docs/
│           ├── code-structure/
│           └── code-patterns/
└── README.md
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
