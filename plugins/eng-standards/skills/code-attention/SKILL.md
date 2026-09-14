---
name: code-attention
description: >
  Skill de atenção e verificação prévia durante o desenvolvimento. Skill filha de code-standards. Use ANTES de criar
  qualquer componente, hook, helper, serviço, rota ou instalar biblioteca, e ANTES de fechar qualquer entrega. Varre o
  projeto atrás de design system já instalado (Shadcn, MUI, Chakra, Ant), componentes com o mesmo propósito,
  duplicatas, documentação que referencia o alvo e suíte E2E (Playwright, Cypress). Quando encontra duplicatas ou
  candidatos equivalentes, PERGUNTA ao usuário qual usar em vez de decidir sozinho; ao fechar a entrega, pergunta se
  deve atualizar a documentação referenciada e se deve criar teste E2E. Gatilhos: "cria um componente", "adiciona um
  botão/modal/tabela", "instala a lib X", "já existe algo pra isso?", "isso não vai duplicar?", "finaliza a entrega",
  "pode commitar", "revisa antes de entregar".
---

# Code Attention — Verificação Antes de Criar e Antes de Entregar

> Esta skill não escreve código. Ela **impede** que código errado seja escrito e que entrega saia pela metade.
> Atua em dois momentos: **Gate de Entrada** (antes de criar) e **Gate de Saída** (antes de entregar).

---

## Princípio

Todo código novo é passivo. Antes de adicionar qualquer coisa ao projeto, a pergunta não é
*"como eu escrevo isso?"* — é **"isso já existe aqui?"**.

```
Reutilizar  >  Estender  >  Instalar do design system já adotado  >  Criar do zero
```

Criar do zero é a última opção, não a primeira.

---

## Gate de Entrada — antes de criar qualquer coisa

Dispare quando o pedido envolver criar componente, hook, helper, serviço, rota, tipo, constante
ou instalar dependência. Execute as 4 varreduras **antes** de escrever a primeira linha.

### 1. Varredura de dependências

Leia o manifesto do projeto e identifique o que já está disponível.

| Stack | Arquivo |
|---|---|
| Node / Next / React / Angular | `package.json` + `components.json` (Shadcn) |
| Python | `pyproject.toml`, `requirements.txt` |
| Flutter | `pubspec.yaml` |
| Java | `pom.xml`, `build.gradle` |

Marque em qual categoria o pedido cai e verifique se já há biblioteca cobrindo:

| Pedido | Verifique antes se já existe |
|---|---|
| Componente de UI | Shadcn (`components.json`), MUI, Chakra, Ant, Radix, Headless UI |
| Formulário | React Hook Form, Formik |
| Validação | Zod, Yup, Pydantic, class-validator |
| Data / hora | date-fns, dayjs, moment, Luxon |
| Requisição HTTP | `shared/http/`, TanStack Query, axios, wrapper próprio de fetch |
| Estado | Zustand, Redux, Context já existente |
| Ícone | Lucide, Heroicons, React Icons, Font Awesome |
| Gráfico | Recharts, Chart.js, D3, ApexCharts |
| Tabela | TanStack Table, DataGrid, componente próprio da `shared/` |

> **Regra absoluta:** nunca instale uma lib nova se já existe outra instalada cobrindo a mesma
> necessidade. Se achar que a instalada é inferior, **exponha o trade-off e pergunte** — não troque sozinho.

### 2. Varredura de componentes/funções com o mesmo propósito

Procure nesta ordem:

1. `shared/components/` e `shared/ui/` — componentes globais
2. `components/ui/` — pasta padrão do Shadcn
3. `features/*/components/` — pode haver um local pronto para ser promovido a global
4. `shared/hooks/` e `features/*/hooks/` — para hooks
5. `shared/helpers/` e `features/*/helpers/` — para funções auxiliares

**Busque por sinônimo, nunca só pelo nome pedido.** É aqui que a varredura falha: o componente
existe, mas com outro nome, e o resultado vazio vira justificativa para duplicar.

| Pedido | Também procure por |
|---|---|
| Modal | Dialog, Drawer, Sheet, Overlay, Popup, Lightbox |
| Tabela | Table, DataGrid, Grid, List, Listagem, DataTable |
| Select | Dropdown, Combobox, Autocomplete, Picker, Seletor |
| Aviso | Toast, Snackbar, Alert, Notification, Notificacao, Banner, Flash |
| Card | Panel, Tile, Box, Widget, Painel |
| Loader | Spinner, Loading, Skeleton, Shimmer, Carregando |
| Abas | Tabs, TabBar, Segmented, Navegacao |
| Upload | Dropzone, FilePicker, FileInput, Anexo |
| Data | DatePicker, Calendar, Calendario, DateRange |
| Confirmação | Confirm, ConfirmDialog, AlertDialog, Prompt |
| Badge | Tag, Chip, Pill, Label, Etiqueta |

Cubra as três frentes: nome de arquivo, declaração exportada (`export (function|const)`) e
barrel export das features (`**/index.ts`). Em projeto fora do padrão de pastas do
`/eng-standards:code-structure`, a busca por sinônimo continua valendo — só a ordem das pastas muda.

### 3. Varredura de documentação que referencia o alvo

Liste os arquivos que citam o componente/módulo/rota que será alterado:
`README.md`, `docs/`, `**/docs/*.md`, Contrato de API, Especificação, Documento de Arquitetura.

O resultado alimenta a pergunta do Gate de Saída. Não atualize nada ainda.

### 4. Varredura de suíte de testes

| Procure por | Significa |
|---|---|
| `playwright.config.ts` / `.js`, pasta `e2e/`, `tests/e2e/` | Projeto tem **E2E com Playwright** |
| `cypress.config.ts`, pasta `cypress/` | Projeto tem **E2E com Cypress** |
| `vitest.config.*`, `jest.config.*`, `*.test.ts`, `*.spec.ts` | Projeto tem **testes unitários** |
| Nenhum dos acima | Projeto **sem suíte** — não crie uma do nada; pergunte se é para iniciar |

O resultado alimenta a pergunta do Gate de Saída.

---

## Decisão — o que fazer com o resultado da varredura

| Resultado da varredura | Ação |
|---|---|
| Existe **1** componente com o mesmo propósito | Reutilize. Informe o caminho e siga. Não pergunte. |
| Existe **1 parecido**, cobre ~80% do caso | Estenda via prop/variant. Informe a mudança e siga. |
| Existem **2 ou mais** com o mesmo propósito | **PARE e pergunte** — ver seção abaixo |
| Design system instalado tem o componente, mas ele não foi adicionado | Adicione pelo CLI oficial (ex.: `npx shadcn@latest add dialog`). Não reescreva à mão. |
| Nada existe e nenhuma lib cobre | Crie do zero seguindo `/eng-standards:code-structure` e `/eng-standards:code-patterns` |
| Nada existe, mas uma lib **nova** cobriria | **PARE e pergunte** — instalar dependência é decisão do usuário |

---

## Duplicatas — sempre perguntar, nunca escolher sozinho

Ao encontrar dois ou mais candidatos com o mesmo propósito, apresente a comparação antes da pergunta:

```
Encontrei 2 componentes com o mesmo propósito para "modal de confirmação":

| # | Caminho                                         | Usos | Última alteração | Base           |
|---|-------------------------------------------------|------|------------------|----------------|
| 1 | shared/components/confirm-dialog.tsx            | 14   | 2 semanas        | Shadcn (Radix) |
| 2 | features/admin/components/modal-confirmacao.tsx | 3    | 7 meses          | HTML + CSS puro|
```

Levante os dois dados objetivos da tabela antes de perguntar:

```bash
rg -c --glob '!node_modules' '\bConfirmDialog\b'          # quantos usos tem cada candidato
git log -1 --format='%ad — %s' --date=relative -- <arquivo>   # há quanto tempo foi tocado
```

Em seguida pergunte com **AskUserQuestion**, oferecendo as opções reais:

- Usar o nº 1 (mais usado, já no design system)
- Usar o nº 2
- Unificar os dois em um só e migrar os usos
- Criar um terceiro (só com justificativa)

**Critério para escolher qual recomendar**, nesta ordem de precedência:

1. Está no design system adotado pelo projeto
2. Mora em `shared/` (já é global) em vez de dentro de uma feature
3. Tem mais usos no projeto
4. Foi alterado mais recentemente
5. Tem tipagem e testes

> Recomende uma opção, mas **não execute** antes da resposta. Consolidar duplicata mexe em
> arquivos fora do pedido original — isso precisa de aval explícito.

O mesmo vale para dependência: quando **nada** existe mas uma lib nova cobriria, mostre o que já
está instalado, proponha a lib da stack padrão e pergunte. Quando já existe equivalente instalada e
você julga outra superior, a pergunta muda de forma — *"troco nesta entrega, mantenho por
consistência, ou abro a migração como tarefa separada?"*.

---

## Gate de Saída — antes de fechar a entrega

Com o código pronto e antes de dizer "concluído", pergunte o que sobrou.
Agrupe tudo em **uma única** chamada de `AskUserQuestion` — não pergunte em série.

### Pergunta 1 — Documentação referenciada

Só faça se a varredura nº 3 encontrou arquivos. Cite os arquivos pelo nome:

> "Esta entrega altera o contrato de `POST /usuarios`. Encontrei referências em `docs/api-contract.md`
> e `README.md`. Atualizo a documentação agora?"

Opções: **Atualizar tudo** · **Atualizar só o Contrato de API** · **Não atualizar agora**

### Pergunta 2 — Teste E2E

Só faça se a varredura nº 4 encontrou Playwright ou Cypress:

> "O projeto usa Playwright (`e2e/`). Crio o teste E2E cobrindo o fluxo novo?"

Opções: **Criar E2E do fluxo feliz** · **Fluxo feliz + casos de erro** · **Não criar agora**

Se o projeto **não** tem suíte E2E, não invente uma. Apenas registre na entrega:
*"Projeto sem suíte E2E — nenhum teste de ponta a ponta foi criado."*

### Pergunta 3 — Consolidação pendente

Só faça se o Gate de Entrada encontrou duplicata e o usuário optou por seguir com uma delas
sem unificar. Ofereça abrir a limpeza como tarefa separada.

Opções: **Deixar como está** · **Consolidar agora** (aumenta o diff) · **Anotar como débito técnico**

### O que NÃO perguntar

Perguntar demais custa tanto quanto perguntar de menos. **Decida sozinho** quando:

| Situação | Ação direta, sem pergunta |
|---|---|
| Existe **um** componente com o mesmo propósito | Reutilize e informe o caminho |
| O componente do design system só precisa ser adicionado | Rode o CLI oficial e informe |
| O arquivo novo tem um lugar óbvio na estrutura | Siga a `/eng-standards:code-structure` |
| Refatoração exigida pelo contrato mínimo | Faça — não é opcional nem precisa ser pedida |
| Mudança puramente interna, sem impacto em docs | Entregue sem perguntar sobre documentação |
| O usuário já respondeu "não criar E2E" nesta sessão | Não repita a pergunta na entrega seguinte |

---

## Regras absolutas

- [ ] **Nunca** crie componente, hook ou helper sem antes rodar a varredura de mesmo propósito
- [ ] **Nunca** instale dependência nova sem checar se já existe equivalente instalada
- [ ] **Nunca** escolha sozinho entre duplicatas — a escolha é do usuário
- [ ] **Nunca** reescreva à mão um componente que o design system instalado entrega via CLI
- [ ] **Nunca** feche entrega que mexeu em contrato, rota ou componente público sem perguntar sobre documentação
- [ ] **Nunca** crie suíte de testes do zero por conta própria — pergunte antes
- [ ] **Nunca** refatore ou apague a duplicata perdedora sem autorização explícita

---

## Formato do relatório de varredura

Antes de codar, entregue em no máximo 6 linhas:

```
Varredura — "modal de confirmação"
- Design system: Shadcn instalado (components.json), `dialog` já adicionado
- Mesmo propósito: 2 candidatos encontrados → precisa de decisão
- Docs referenciando: docs/componentes.md
- E2E: Playwright em e2e/ (12 specs)
→ Bloqueado: preciso da sua escolha entre os 2 candidatos
```

Se a varredura não encontrar nada, diga em uma linha e siga direto para a implementação —
não transforme o gate em cerimônia.

---

## Quando NÃO aplicar esta skill

- Correção de bug em arquivo existente, sem criar nada novo
- Ajuste de texto, estilo ou constante
- Tarefa fora de código (documento institucional, planilha, proposta)

Nesses casos o Gate de Entrada é desnecessário. O Gate de Saída ainda vale se o ajuste
mudar comportamento documentado.
