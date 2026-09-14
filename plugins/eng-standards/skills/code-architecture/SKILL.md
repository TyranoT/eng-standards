---
name: code-architecture
description: >
  Raciocínio e artefatos de arquitetura de software, com diagramas em Draw.io. Skill filha de code-standards. Use ao
  decidir, documentar ou revisar arquitetura: gerar opções, escrever cenários de atributos de qualidade (performance,
  disponibilidade, segurança), análise de trade-off, ADR, arquitetura em camadas, fronteiras de componentes e de
  integração, decomposição em serviços, monólito vs. monólito modular, visão de runtime, visão de implantação,
  hotspots de escalabilidade, estratégia de disponibilidade e registro de riscos. Ensina a estruturar diagramas
  .drawio (C4 contexto/containers/componentes, implantação AWS, sequência) em XML versionável e validado. Gatilhos:
  "qual arquitetura usar", "monólito ou microsserviços", "compara essas opções", "escreve um ADR", "registra essa
  decisão", "diagrama de arquitetura", "diagrama C4", "desenha no draw.io", "visão de implantação", "fluxo de
  runtime", "onde isso vai escalar", "quais os riscos dessa arquitetura".
---

# Code Architecture — Decisões, Visões e Diagramas Draw.io

> Arquitetura é **decisão com motivo explícito**, não estilo da moda.
> Esta skill transforma preferência vaga em raciocínio rastreável: drivers → opções → trade-off → decisão → visões → riscos.
> Todo diagrama sai em Draw.io, versionado como XML e validado antes da entrega.

---

## Princípio

Antes de desenhar caixa, responda: **qual decisão este artefato ajuda a tomar, e para quem?**

```
Drivers (qualidade + restrições)  →  Opções  →  Trade-off  →  Decisão (ADR)  →  Visões  →  Riscos
```

- Sem driver declarado, não há como dizer que uma opção é melhor — só diferente.
- Sem trade-off explícito, a decisão parece óbvia e ninguém sabe o que foi sacrificado.
- Sem ADR, a próxima pessoa reabre a discussão do zero.
- Diagrama sem propósito é decoração. Todo diagrama responde uma pergunta escrita no próprio título.

---

## Modos — o que esta skill produz

Cada modo é um artefato com template em `references/architecture-artifacts.md`. Carregue só o que o pedido exige.

| # | Modo | Pergunta que responde | Diagrama Draw.io | Próximo passo típico |
|---|---|---|---|---|
| 1 | **Gerar opções** | Quais caminhos viáveis existem para este problema? | — | 2 ou 3 |
| 2 | **Cenários de atributos de qualidade** | O que "rápido", "disponível", "seguro" significa, de forma mensurável? | — | 3 |
| 3 | **Análise de trade-off** | Qual opção vence nos drivers e o que perdemos ao escolhê-la? | — | 14 |
| 4 | **Arquitetura em camadas** | Quais camadas existem e quem pode depender de quem? | Camadas (C4 Componente) | `code-structure` |
| 5 | **Fronteiras de componentes** | Onde termina a responsabilidade de cada módulo e quem é dono do dado? | C4 Componente | 6 |
| 6 | **Fronteiras de integração** | Como o sistema conversa com o mundo — protocolo, contrato, falha? | C4 Contexto / Containers | 9 |
| 7 | **Decomposição em serviços** | Faz sentido separar em serviços? Onde cortar? | C4 Containers | 14 |
| 8 | **Monólito vs. monólito modular** | O time e a operação comportam separar o deploy? | C4 Containers | 14 |
| 9 | **Visão de runtime** | O que acontece, em que ordem, quando o fluxo X roda — e onde falha? | Sequência | 12 |
| 10 | **Visão de implantação** | Onde cada container roda, em que rede, com que redundância? | Implantação (AWS) | 11 e 12 |
| 11 | **Hotspots de escalabilidade** | Qual peça quebra primeiro quando a carga crescer 10×? | Anotação na implantação | 13 |
| 12 | **Estratégia de disponibilidade** | Qual SLO, quais pontos únicos de falha, qual RPO/RTO? | Anotação na implantação | 13 |
| 13 | **Avaliação de riscos** | O que pode dar errado nesta arquitetura e o que fazemos a respeito? | — | 14 |
| 14 | **ADR** | Qual foi a decisão, por quê, e o que ela custa? | — | `code-docs` |

### Fluxo completo (projeto novo ou decisão estrutural grande)

```
1 Opções → 2 Cenários de qualidade → 3 Trade-off → (4 | 7 | 8) Estilo → 5 Componentes → 6 Integrações
        → 9 Runtime → 10 Implantação → 11 Escalabilidade → 12 Disponibilidade → 13 Riscos → 14 ADR
```

Para pedido pontual, entre direto no modo e termine recomendando o próximo — não rode o fluxo inteiro por cerimônia.

| Pedido | Modos |
|---|---|
| "monólito ou microsserviços?" | 2 → 8 (ou 7) → 3 → 14 |
| "desenha a arquitetura desse projeto" | 6 → 4/5 → diagramas C4 Contexto + Containers |
| "como isso vai pra produção?" | 10 → 12 → diagrama de implantação |
| "o que acontece quando o pedido é pago?" | 9 → diagrama de sequência |
| "registra essa decisão" | 14 |
| "essa arquitetura aguenta?" | 11 → 12 → 13 |

---

## Procedimento operacional (vale para todo modo)

1. **Delimite a decisão.** Escreva em uma frase o que este artefato decide ou descreve. Se não couber, são dois artefatos.
2. **Separe o que se sabe do que se supõe.** Quatro listas: fatos (lidos no código/infra), restrições (prazo, time,
   orçamento, compliance), suposições (a confirmar) e atributos de qualidade desejados.
3. **Leia o sistema real antes de propor.** `package.json`/`pom.xml`, `docker-compose.yml`, IaC (`terraform/`, `cdk/`),
   `.github/workflows/`, `.env.example`, pastas `modules/`/`features/`. Arquitetura descrita de memória é ficção.
4. **Produza estrutura concreta** amarrada a este sistema — nomes reais de módulos, rotas, filas, tabelas, serviços AWS.
5. **Torne o trade-off e a incerteza explícitos.** Cada recomendação diz o que ganha, o que perde e o que a invalidaria.
6. **Recomende o próximo artefato** — qual modo ou skill irmã deve vir depois e por quê.

### Evidência vs. inferência vs. recomendação

Todo artefato marca a origem de cada afirmação:

| Marca | Significa | Exemplo |
|---|---|---|
| **[fato]** | Verificado no código, config ou infra | "API e worker compartilham o mesmo banco (`prisma/schema.prisma`)" |
| **[suposição]** | Plausível, ainda não confirmado | "Pico de 500 pedidos/min na Black Friday" |
| **[recomendação]** | Opinião técnica fundamentada | "Separar o worker em processo próprio antes do pico" |

---

## Diagramas — Draw.io como padrão

Visões de arquitetura são desenhadas em **Draw.io**: editável por qualquer pessoa (app.diagrams.net, desktop ou
extensão do VS Code), versionável como texto e exportável para SVG que renderiza no GitHub.

> Mermaid continua valendo para diagramas **dentro** dos documentos da `/eng-standards:code-docs` (ER, atividade,
> caso de uso). Visão de arquitetura — C4, implantação, sequência entre containers — é Draw.io.

### Qual diagrama para qual pergunta

| Diagrama | Pergunta | Mostra | Não mostra | Template |
|---|---|---|---|---|
| **C4 · Contexto** (nível 1) | Quem usa o sistema e com o que ele fala? | Pessoas, o sistema como caixa única, sistemas externos | Tecnologia, containers | `assets/c4-contexto.drawio` |
| **C4 · Containers** (nível 2) | Quais peças executáveis compõem o sistema? | Apps, APIs, workers, bancos, storage + protocolo de cada relação | Classes, pastas | `assets/c4-containers.drawio` |
| **C4 · Componentes** (nível 3) | Como um container se divide por dentro? | Módulos/camadas de **um** container | Outros containers por dentro | derive do de containers |
| **Implantação** | Onde e como cada container roda? | Nuvem, região, VPC, subnets, nós, serviços gerenciados | Regra de negócio | `assets/implantacao-aws.drawio` |
| **Sequência (runtime)** | O que acontece, em que ordem, no fluxo X? | Participantes, mensagens síncronas/assíncronas, retornos, falhas | Estrutura estática | `assets/sequencia-runtime.drawio` |

Nível 4 do C4 (código) não se desenha — o código é a fonte de verdade.

### Onde os diagramas moram no projeto

```
docs/arquitetura/
├── README.md                     # Índice: visões, ADRs e o que cada um responde
├── adr/
│   └── 0001-<decisao-em-kebab>.md
├── diagramas/
│   ├── c4-contexto.drawio        # Fonte — XML descomprimido, diff legível
│   ├── c4-contexto.svg           # Exportado com o diagrama embutido — renderiza no GitHub
│   ├── c4-containers.drawio
│   ├── c4-containers.svg
│   ├── implantacao-producao.drawio
│   ├── implantacao-producao.svg
│   └── sequencia-<fluxo>.drawio
└── <artefato>.md                 # Opções, trade-off, riscos, visões...
```

### Procedimento para gerar um diagrama

1. **Escreva a pergunta** que o diagrama responde — ela vira o título da página.
2. **Inventarie elementos e relações a partir do sistema real** (passo 3 do procedimento operacional). Tabela antes
   de desenhar: elemento · tipo C4 · tecnologia · relaciona com · protocolo.
3. **Copie o template** de `assets/` mais próximo para `docs/arquitetura/diagramas/<nome>.drawio`.
4. **Planeje o layout em grade** antes de escrever XML: colunas por papel (quem usa → o sistema → dependências),
   espaçamento mínimo de 80 px na horizontal e 60 px na vertical, múltiplos de 10.
5. **Escreva o XML** seguindo `references/drawio-diagrams.md` — ids semânticos, estilos da paleta, containers com
   filhos em coordenadas relativas, uma aresta por relação com rótulo `verbo + [protocolo]`, legenda.
6. **Valide**:
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/skills/code-architecture/scripts/validate-drawio.mjs" docs/arquitetura/diagramas/*.drawio
   ```
   Erro (✖) bloqueia a entrega. Aviso (⚠) de sobreposição ou transbordo precisa ser corrigido ou justificado.
7. **Exporte o SVG** se o Draw.io desktop estiver instalado (comando em `references/drawio-diagrams.md`). Se não
   estiver, entregue o `.drawio` e diga ao usuário como abrir e exportar — não invente o SVG à mão.
8. **Incorpore** no Markdown com link para a fonte:
   ```markdown
   ![C4 · Containers — Sistema de Pedidos](diagramas/c4-containers.svg)
   Fonte editável: [`c4-containers.drawio`](diagramas/c4-containers.drawio)
   ```

Anatomia do XML, estilos, containers, arestas, paleta C4, AWS, sequência, exportação e erros comuns:
`references/drawio-diagrams.md`

---

## Quality gates — antes de entregar qualquer artefato

- [ ] A decisão ou pergunta do artefato está escrita em uma frase no topo
- [ ] Recomendações amarradas aos drivers **deste** sistema, não a "boas práticas" genéricas
- [ ] Fatos, suposições e recomendações estão marcados e separados
- [ ] Consequências operacionais (deploy, monitoramento, custo, on-call) aparecem quando relevantes
- [ ] Tamanho do time, ownership e maturidade operacional foram considerados
- [ ] Todo diagrama tem título-pergunta, legenda, rótulo em toda aresta e passou no validador sem erro
- [ ] Nomes nos diagramas batem com os nomes reais no código e na infra
- [ ] Achados concretos o suficiente para mudar implementação ou governança
- [ ] O próximo artefato ou skill recomendado está indicado

---

## Formato mínimo de saída

```markdown
## Resumo
<a decisão ou visão em 2–3 linhas>

## Proposta ou achados
<estrutura concreta: tabela, diagrama, lista priorizada>

## Evidência vs. suposições
- [fato] ...
- [suposição] ... → como confirmar

## Riscos e trade-offs
| O que ganhamos | O que perdemos | O que invalidaria esta escolha |

## Próximo passo recomendado
<modo desta skill ou skill irmã, e por quê>
```

---

## Modos de falha — o que nunca fazer

| ❌ | ✅ |
|---|---|
| Recomendar microsserviços "porque escala" | Mostrar qual driver exige deploy/escala independente e se o time comporta a operação |
| "A solução é robusta e escalável" | "Aguenta 10× a carga atual até o RDS; o limite seguinte é a conexão por instância (ver hotspot H2)" |
| Esconder incerteza atrás de linguagem definitiva | Marcar como [suposição] e dizer como confirmar |
| Ignorar tamanho do time e custo operacional | Colocar "time de 3 devs, sem SRE" como restrição explícita no trade-off |
| Diagrama sem pergunta, sem legenda, setas sem rótulo | Título-pergunta, legenda e `verbo + [protocolo]` em toda aresta |
| Desenhar a arquitetura desejada como se fosse a atual | Separar "atual" e "alvo" em páginas ou arquivos distintos |
| Um diagrama com 40 caixas "para mostrar tudo" | Descer um nível C4 ou quebrar em mais diagramas |

---

## Regras absolutas desta skill

- [ ] **Nunca** recomende estilo arquitetural sem citar o driver que o justifica
- [ ] **Nunca** apresente uma única opção como "a" arquitetura — no mínimo duas, mesmo que uma seja "manter como está"
- [ ] **Nunca** descreva a arquitetura atual sem ler o código e a infra do projeto
- [ ] **Nunca** entregue `.drawio` comprimido, sem legenda ou reprovado no validador
- [ ] **Nunca** gere o SVG exportado à mão — ele sai do Draw.io ou não sai
- [ ] **Nunca** altere um ADR aceito — crie um novo que o substitua e marque o antigo como `Substituído por ADR-NNNN`
- [ ] **Nunca** decida sozinho uma mudança estrutural (novo serviço, nova infra, troca de banco) — apresente o
  trade-off e pergunte com **AskUserQuestion**

---

## Quando esta skill vira outra coisa

| Situação | O que fazer |
|---|---|
| Decisão tomada, agora é criar pastas e módulos | `/eng-standards:code-structure` |
| O ADR precisa virar o Documento de Arquitetura de Código | `/eng-standards:code-docs` — incorpore os SVGs em vez de redesenhar |
| A visão revelou código violando camadas | `/eng-standards:code-review` sobre os módulos afetados |
| A mudança proposta cria serviço ou lib que talvez já exista | `/eng-standards:code-attention` antes de seguir |

---

## Skills irmãs

- `/eng-standards:code-structure` — materializa a decisão em pastas, stacks e serviços AWS
- `/eng-standards:code-docs` — Documento de Arquitetura de Código, Especificação e Contrato de API
- `/eng-standards:code-patterns` — princípios (SOLID, camadas) que as fronteiras aplicam dentro do código
- `/eng-standards:code-review` — verifica se o código respeita a arquitetura decidida
- `/eng-standards:code-standards` — skill mãe, roteamento entre as filhas

---

## Referências desta skill

- `references/architecture-artifacts.md` — Templates dos 14 modos (opções, cenários, trade-off, camadas, fronteiras,
  decomposição, runtime, implantação, escalabilidade, disponibilidade, riscos, ADR) + fluxo de exemplo
- `references/drawio-diagrams.md` — Como estruturar arquivos `.drawio`: anatomia do XML, estilos, containers,
  arestas, paleta C4, grupos AWS, sequência UML, validação, exportação e erros comuns
- `assets/*.drawio` — Templates prontos: C4 Contexto, C4 Containers, Implantação AWS e Sequência de runtime
- `scripts/validate-drawio.mjs` — Validador estrutural e de layout dos arquivos `.drawio`

> Procedimento, modos e templates adaptados de [45ck/software-architecture-skills](https://github.com/45ck/software-architecture-skills)
> (licença MIT), traduzidos e integrados à árvore `eng-standards`.
