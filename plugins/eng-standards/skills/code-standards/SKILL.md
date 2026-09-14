---
name: code-standards
description: >
  Skill MÃE de padrões de engenharia de software. SEMPRE consulte ao escrever, revisar, refatorar, documentar ou
  estruturar qualquer código ou projeto, em qualquer linguagem ou framework — React, Next.js, Angular, Flutter,
  Node.js, NestJS, Express, FastAPI, Python, Java, Spring. Coordena seis skills filhas: code-attention (varredura
  antes de criar e checkpoint antes de entregar), code-docs (documentação e documentos de projeto), code-structure
  (estrutura de pastas, stacks e serviços), code-patterns (patterns, princípios e anti-patterns em código),
  code-review (procedimento de revisão de PR, branch ou diff) e code-architecture (decisões, ADR, visões e diagramas
  de arquitetura em Draw.io). Use sempre que o usuário pedir para criar, refatorar, revisar, documentar, organizar ou
  decidir a arquitetura de código e projetos — mesmo que não mencione "padrões", "arquitetura" ou "documentação".
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
├── 3. code-patterns ..... Aplicação de Patterns (índice)
│   └── references/patterns/ ... Biblioteca compartilhada de conceitos
│       ├── 3.1 principios-solid.md .. SOLID, KISS, DRY, Clean Code, MVC/MVVM
│       ├── 3.2 nomenclatura.md ...... Variáveis, funções, arquivos, verbos padrão
│       ├── 3.3 poo.md ............... Classe vs. função pura
│       ├── 3.4 regras-absolutas.md .. O que nunca pode ser violado
│       ├── 3.5 anti-patterns.md ..... Catálogo ❌ → ✅
│       └── 3.6 refatoracao.md ....... Gatilhos + exemplos antes/depois
│
├── 4. code-review ....... Revisão de código (consome a biblioteca acima)
│   ├── 4.1 Escopo e caça a erros (correção, segurança, regressão)
│   ├── 4.2 Organização e enxugamento
│   └── 4.3 Severidade e formato do relatório
│
└── 5. code-architecture . Arquitetura (decisão antes da estrutura)
    ├── 5.1 Opções, cenários de atributos de qualidade e trade-off
    ├── 5.2 Fronteiras: camadas, componentes, integrações, serviços
    ├── 5.3 Visões: runtime e implantação
    ├── 5.4 Escalabilidade, disponibilidade, riscos e ADR
    └── 5.5 Diagramas Draw.io (C4, implantação AWS, sequência) + validador
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
| "refatora isso", "melhora essa função", "esse componente tá grande" | `/eng-standards:code-patterns` |
| "revisa esse PR", "revisa essa branch", "olha esse diff", "tem bug aqui?" | `/eng-standards:code-review` |
| "qual arquitetura usar", "monólito ou microsserviços", "compara essas opções" | `/eng-standards:code-architecture` |
| "escreve um ADR", "diagrama de arquitetura", "desenha no draw.io", "visão de implantação" | `/eng-standards:code-architecture` |
| "escreve o código de X" (qualquer feature nova) | `/eng-standards:code-attention` → `/eng-standards:code-structure` → `/eng-standards:code-patterns` |
| "cria o projeto do zero" | nesta ordem: attention → architecture → structure → patterns → docs |
| "revisa o que você acabou de fazer" | `/eng-standards:code-review` sobre o próprio diff |

> Na dúvida, carregue as quatro primeiras. A `code-review` só entra quando o pedido é revisar algo já escrito.
> A `code-architecture` entra quando há decisão estrutural a tomar (novo serviço, integração, mudança de
> implantação) ou visão/diagrama de arquitetura a produzir.

---

## Ordem de execução (feature ou projeto novo)

1. **`/eng-standards:code-attention`** — Gate de Entrada: o que já existe no projeto cobre isso?
2. **`/eng-standards:code-architecture`** — só se houver decisão estrutural: opções, trade-off, ADR e diagramas
3. **`/eng-standards:code-structure`** — define pastas, stack e serviços antes de qualquer linha de código
4. **`/eng-standards:code-patterns`** — escreve o código já dentro dos princípios
5. **`/eng-standards:code-docs`** — documenta o que foi entregue
6. **`/eng-standards:code-attention`** — Gate de Saída: documentação referenciada e teste E2E

Nunca inverta: documentar código mal estruturado é retrabalho, estruturar antes de decidir a arquitetura é
apostar, e criar o que já existe é dívida nova.

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

> Para entrega grande ou com risco de regressão, conduza este passo com `/eng-standards:code-review` aplicada ao
> próprio diff — é o mesmo procedimento, com severidade e formato de relatório já definidos.

---

## Estratégia de desenvolvimento

Toda estrutura é construída com potencial de crescimento e escala. Mesmo que o sistema não receba atualizações e
seja descontinuado, ele mantém a centelha de evolução e integração — sempre visando desenvolvimento futuro
organizado, simples e prático de executar.

---

## Referências desta skill

- `references/orchestration.md` — Como as filhas se combinam por tipo de tarefa, com exemplos
- `${CLAUDE_PLUGIN_ROOT}/references/patterns/README.md` — Índice da biblioteca compartilhada de patterns
