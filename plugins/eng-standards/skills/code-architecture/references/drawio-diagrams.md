# Draw.io — Como Estruturar Diagramas de Arquitetura

Guia para escrever arquivos `.drawio` à mão (ou por agente) que abrem limpos no Draw.io, geram diff legível no Git
e passam no validador. Templates prontos em `../assets/`.

---

## 1. Formatos e qual usar

| Formato | O que é | Uso no projeto |
|---|---|---|
| `.drawio` | XML puro (descomprimido) | **Fonte** — é o que se edita e versiona |
| `.svg` exportado com `--embed-diagram` | Imagem que carrega o XML dentro | **Exibição** — renderiza no GitHub e ainda reabre no Draw.io |
| `.png` exportado com `--embed-diagram` | Mesma ideia em bitmap | Só quando o destino não aceita SVG (slides, Confluence antigo) |

Regras:

- Sempre salve **descomprimido**. Arquivo comprimido vira um blob base64 dentro de `<diagram>` — impossível revisar em PR.
  No Draw.io: *Arquivo › Propriedades › desmarcar "Comprimido"*.
- **Um arquivo por visão.** Várias páginas no mesmo arquivo só quando formam uma sequência do mesmo sistema
  (ex.: "atual" e "alvo"). Exportar e referenciar fica sem ambiguidade.
- Versione a fonte **e** o SVG. O SVG é gerado — nunca edite à mão.

Onde abrir: [app.diagrams.net](https://app.diagrams.net), Draw.io Desktop ou a extensão **Draw.io Integration**
do VS Code (`hediet.vscode-drawio`), que edita o `.drawio` direto no repositório.

---

## 2. Anatomia do arquivo

```xml
<mxfile host="eng-standards">
  <diagram id="c4-contexto" name="C4 · Contexto">
    <mxGraphModel grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1"
                  page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <mxCell id="sys-pedidos" value="Sistema de Pedidos" style="rounded=1;whiteSpace=wrap;html=1;"
                vertex="1" parent="1">
          <mxGeometry x="480" y="270" width="260" height="160" as="geometry"/>
        </mxCell>

        <mxCell id="ext-gateway" value="Gateway de Pagamento" style="rounded=1;whiteSpace=wrap;html=1;"
                vertex="1" parent="1">
          <mxGeometry x="880" y="285" width="240" height="130" as="geometry"/>
        </mxCell>

        <mxCell id="rel-pedidos-gateway" value="Cobra pedidos [HTTPS]" style="edgeStyle=orthogonalEdgeStyle;html=1;"
                edge="1" parent="1" source="sys-pedidos" target="ext-gateway">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

| Elemento | Papel | Regra |
|---|---|---|
| `<mxfile>` | Raiz do arquivo | Um por arquivo |
| `<diagram>` | Uma página (aba) | `id` estável, `name` = título curto da visão |
| `<mxGraphModel>` | Configuração da página | `grid="1" gridSize="10"`; `pageWidth/pageHeight` em px (A4 paisagem 1169×827, A3 1654×1169) |
| `<root>` | Lista plana de células | Ordem importa: **pai antes do filho**, e quem vem depois é desenhado por cima |
| `mxCell id="0"` | Raiz invisível | Obrigatória, sem `parent` |
| `mxCell id="1" parent="0"` | Camada padrão | Obrigatória; todo elemento de nível superior tem `parent="1"` |
| `vertex="1"` | Caixa, forma, texto | Precisa de `<mxGeometry x y width height as="geometry"/>` |
| `edge="1"` | Linha/seta | `source`/`target` com ids existentes e `<mxGeometry relative="1" as="geometry"/>` |

---

## 3. IDs semânticos

O Draw.io aceita qualquer string como id. Use prefixo + kebab-case — o diff do PR fica legível e as arestas se
explicam sozinhas.

| Prefixo | Elemento | Exemplo |
|---|---|---|
| `p-` | Pessoa | `p-cliente` |
| `sys-` | Sistema de software (o nosso) | `sys-pedidos` |
| `ext-` | Sistema externo | `ext-gateway` |
| `bnd-` | Fronteira (boundary) | `bnd-pedidos` |
| `ctn-` | Container C4 | `ctn-api`, `ctn-banco` |
| `cmp-` | Componente C4 | `cmp-pedidos-service` |
| `grp-` | Grupo de infraestrutura | `grp-vpc`, `grp-subnet-privada` |
| `nd-` | Nó de implantação | `nd-ec2` |
| `res-` | Recurso gerenciado (ícone) | `res-rds`, `res-s3` |
| `ll-` / `act-` / `msg-` | Lifeline, ativação, mensagem (sequência) | `ll-api`, `msg-02` |
| `rel-<origem>-<destino>` | Relação | `rel-api-banco` |
| `titulo`, `legenda`, `nota-` | Elementos de apoio | `nota-falha-gateway` |

Nunca repita id dentro da mesma página.

---

## 4. Estilo (`style`)

String `chave=valor;` separada por ponto e vírgula. As chaves que importam:

| Chave | Valores | Efeito |
|---|---|---|
| `html` | `1` | Rótulo aceita HTML (`<b>`, `<br>`, `<font>`). **Sempre use** |
| `whiteSpace` | `wrap` | Quebra texto dentro da caixa. **Sempre use** em vértice |
| `rounded` / `arcSize` | `1` / `10` | Cantos arredondados e raio (%) |
| `fillColor` / `strokeColor` / `fontColor` | `#RRGGBB` ou `none` | Cores |
| `fontSize` | `11` | Tamanho em px |
| `fontStyle` | bitmask: `1` negrito, `2` itálico, `4` sublinhado | `3` = negrito + itálico |
| `align` / `verticalAlign` | `left·center·right` / `top·middle·bottom` | Posição do rótulo |
| `spacingLeft` / `spacingTop` / `spacingBottom` | px | Respiro do rótulo |
| `verticalLabelPosition` | `bottom` | Rótulo abaixo da forma (ícones) |
| `dashed` / `dashPattern` | `1` / `8 4` | Linha tracejada |
| `shape` | `cylinder3`, `note`, `umlLifeline`, `mxgraph.c4.person2`, `mxgraph.aws4.*` | Forma especial |
| `container` | `1` | Aceita filhos (fronteira, grupo, nó) |
| `collapsible` / `recursiveResize` | `0` | Container não colapsa e não redimensiona filhos |
| `aspect` | `fixed` | Mantém proporção (ícones) |

---

## 5. Rótulos (`value`)

O `value` é um atributo XML, então HTML dentro dele **precisa de escape**:

| Caractere | Escreva |
|---|---|
| `<` | `&lt;` |
| `>` | `&gt;` |
| `&` | `&amp;` |
| `"` | `&quot;` |
| quebra de linha | `&lt;br&gt;` (com `html=1`) |

Padrão de rótulo C4 — nome, tipo/tecnologia, descrição:

```xml
value="&lt;b&gt;API de Pedidos&lt;/b&gt;&lt;br&gt;&lt;font style=&quot;font-size:9px&quot;&gt;[Container: Node.js · Express]&lt;/font&gt;&lt;br&gt;&lt;br&gt;Regras de negócio e contrato REST"
```

Renderiza como:

```
API de Pedidos                    ← negrito
[Container: Node.js · Express]    ← pequeno
                                   
Regras de negócio e contrato REST
```

Rótulo de aresta: **verbo + [protocolo]** — `Lê e grava&lt;br&gt;[SQL/TLS]`. Seta sem rótulo é proibida.

---

## 6. Arestas

```xml
<mxCell id="rel-api-banco" value="Lê e grava&lt;br&gt;[SQL/TLS]"
        style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=blockThin;endFill=1;dashed=1;exitX=0.5;exitY=1;entryX=0.5;entryY=0;"
        edge="1" parent="1" source="ctn-api" target="ctn-banco">
  <mxGeometry relative="1" as="geometry">
    <Array as="points">
      <mxPoint x="660" y="560"/>
    </Array>
  </mxGeometry>
</mxCell>
```

| Recurso | Como |
|---|---|
| Roteamento | `edgeStyle=orthogonalEdgeStyle` (ângulos retos) — padrão para arquitetura |
| Ponta da seta | `endArrow=blockThin;endFill=1` (C4), `endArrow=block` (síncrono), `endArrow=open;endFill=0` (assíncrono/retorno) |
| Porta de saída/entrada | `exitX/exitY` e `entryX/entryY` de `0` a `1` na borda da forma (`0.5;1` = meio de baixo) |
| Desvio | `<Array as="points">` com `mxPoint` em coordenadas **absolutas** da página |
| Aresta solta (sequência) | Sem `source`/`target`; use `<mxPoint as="sourcePoint"/>` e `<mxPoint as="targetPoint"/>` |
| Fundo do rótulo | `labelBackgroundColor=#FFFFFF` — o texto não fica riscado pela linha |

Regras:

- `parent="1"` em toda aresta, mesmo ligando elementos dentro de containers diferentes.
- Duas arestas saindo do mesmo lado da mesma forma: use `exitX` diferentes (`0.25` e `0.75`) para não sobreporem.
- Evite cruzamentos. Se não der, reordene colunas antes de adicionar desvios.

---

## 7. Containers e fronteiras

Fronteira de sistema (C4), grupo de rede e nó de implantação são vértices com `container=1`. Os filhos apontam
`parent` para o container e usam **coordenadas relativas ao canto superior esquerdo do pai**.

```xml
<mxCell id="bnd-pedidos" value="&lt;b&gt;Sistema de Pedidos&lt;/b&gt;&lt;br&gt;[Sistema de Software]"
        style="rounded=1;arcSize=2;dashed=1;dashPattern=8 4;fillColor=none;strokeColor=#666666;align=left;verticalAlign=bottom;spacingLeft=10;spacingBottom=6;html=1;whiteSpace=wrap;container=1;collapsible=0;recursiveResize=0;"
        vertex="1" parent="1">
  <mxGeometry x="160" y="300" width="1000" height="600" as="geometry"/>
</mxCell>

<!-- filho: x=40 relativo ao pai → x absoluto = 160 + 40 = 200 -->
<mxCell id="ctn-webapp" value="..." style="..." vertex="1" parent="bnd-pedidos">
  <mxGeometry x="40" y="60" width="240" height="130" as="geometry"/>
</mxCell>
```

Regras:

- O container vem **antes** dos filhos no `<root>`.
- Filho cabe no pai: `x + width ≤ largura do pai` e `y + height ≤ altura do pai`. O validador avisa quando transborda.
- Rótulo da fronteira C4 fica embaixo à esquerda (`verticalAlign=bottom;align=left`); grupos AWS, em cima.
- Aninhamento máximo recomendado: 5 níveis (nuvem › região › VPC › subnet › nó).

---

## 8. Páginas e camadas

- **Página** (`<diagram>`): uma visão. Nome curto e distinto — `C4 · Containers`, `Implantação · Produção`.
- **Camada** (`mxCell` com `parent="0"`): sobreposição que liga/desliga na mesma página. Use para anotações de
  hotspot e disponibilidade sobre o diagrama de implantação:

```xml
<mxCell id="1" parent="0"/>                              <!-- camada base -->
<mxCell id="camada-hotspots" value="Hotspots" parent="0"/> <!-- camada extra -->
<mxCell id="nota-h1" value="H1 · consulta sem índice" style="shape=note;..." vertex="1" parent="camada-hotspots">
```

---

## 9. Layout em grade

Planeje as coordenadas em tabela **antes** de escrever XML:

| Coluna | x | Conteúdo |
|---|---|---|
| 1 | 80 | Pessoas / quem inicia |
| 2 | 480 | O sistema (ou containers de entrada) |
| 3 | 880 | Dependências e sistemas externos |

| Medida | Valor |
|---|---|
| Grade | múltiplos de 10 |
| Pessoa C4 | 200 × 180 |
| Sistema / container | 240 × 130 (sistema principal 260 × 160) |
| Banco (cilindro) | 240 × 150 |
| Ícone AWS | 78 × 78 |
| Espaço horizontal entre elementos | ≥ 80 px (100+ quando a aresta tem rótulo) |
| Espaço vertical | ≥ 60 px |
| Margem da página | ≥ 40 px |

Fluxo de leitura: **esquerda → direita** (quem usa → sistema → dependências) ou **cima → baixo** (usuário → apps →
dados). Não misture os dois na mesma página. Mais de 20 elementos: desça um nível C4 ou divida.

---

## 10. Paleta e convenção visual

Paleta C4 — use sempre as mesmas cores, para que qualquer diagrama do projeto seja lido do mesmo jeito:

| Elemento | `fillColor` | `strokeColor` | `fontColor` | Forma |
|---|---|---|---|---|
| Pessoa | `#08427B` | `#073B6F` | `#FFFFFF` | `shape=mxgraph.c4.person2` |
| Sistema (nosso) | `#1168BD` | `#0B4884` | `#FFFFFF` | retângulo arredondado |
| Container | `#438DD5` | `#3C7FC0` | `#FFFFFF` | retângulo arredondado |
| Banco / storage | `#438DD5` | `#3C7FC0` | `#FFFFFF` | `shape=cylinder3;size=15;boundedLbl=1;backgroundOutline=1` |
| Componente | `#85BBF0` | `#78A8D8` | `#000000` | retângulo arredondado |
| Sistema externo | `#8C8496` | `#736782` | `#FFFFFF` | retângulo arredondado |
| Fronteira | `none` | `#666666` | `#333333` | tracejado, `container=1` |
| Relação | — | `#707070` | `#404040` | tracejada, `endArrow=blockThin` |
| Nota / alerta | `#FFF2CC` | `#D6B656` | `#000000` | `shape=note;size=14` |

Estilos prontos para copiar:

```text
PESSOA     shape=mxgraph.c4.person2;html=1;whiteSpace=wrap;fontSize=11;fillColor=#08427B;strokeColor=#073B6F;fontColor=#FFFFFF;align=center;resizable=0;
SISTEMA    rounded=1;arcSize=10;whiteSpace=wrap;html=1;fontSize=11;fillColor=#1168BD;strokeColor=#0B4884;fontColor=#FFFFFF;
CONTAINER  rounded=1;arcSize=10;whiteSpace=wrap;html=1;fontSize=11;fillColor=#438DD5;strokeColor=#3C7FC0;fontColor=#FFFFFF;
BANCO      shape=cylinder3;size=15;boundedLbl=1;backgroundOutline=1;whiteSpace=wrap;html=1;fontSize=11;fillColor=#438DD5;strokeColor=#3C7FC0;fontColor=#FFFFFF;
EXTERNO    rounded=1;arcSize=10;whiteSpace=wrap;html=1;fontSize=11;fillColor=#8C8496;strokeColor=#736782;fontColor=#FFFFFF;
RELACAO    edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=blockThin;endFill=1;endSize=10;dashed=1;dashPattern=6 4;strokeColor=#707070;fontColor=#404040;fontSize=10;labelBackgroundColor=#FFFFFF;
```

Se `mxgraph.c4.person2` não renderizar na versão do Draw.io, troque por `shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top`.

**Legenda obrigatória** em toda página — uma caixa com o `value` começando por "Legenda", listando as cores e os
tipos de seta usados. O validador avisa quando falta.

**Título-pergunta** no topo: `text;html=1;fontSize=18;fontStyle=1;align=left;verticalAlign=top;` com a pergunta
que o diagrama responde ("Quem usa o Sistema de Pedidos e com o que ele se integra?").

---

## 11. Formas por tipo de diagrama

### C4 Contexto e Containers

Pessoas, sistemas, containers, bancos, fronteira e relações — paleta da seção 10.
Templates: `assets/c4-contexto.drawio` e `assets/c4-containers.drawio`.

C4 Componentes: copie o de containers, troque a fronteira para o container detalhado (`[Container: Node.js]`) e use
a cor de componente (`#85BBF0`, texto preto). Uma caixa por módulo/camada real do código.

### Implantação AWS

Grupos oficiais do Draw.io (biblioteca *AWS 2019+*), todos com
`container=1;collapsible=0;recursiveResize=0;shape=mxgraph.aws4.group;html=1;whiteSpace=wrap;verticalAlign=top;align=left;spacingLeft=30;fontSize=12;`:

| Grupo | Complemento do estilo |
|---|---|
| AWS Cloud | `grIcon=mxgraph.aws4.group_aws_cloud_alt;strokeColor=#232F3E;fillColor=none;fontColor=#232F3E;` |
| Região | `grIcon=mxgraph.aws4.group_region;strokeColor=#00A4A6;fillColor=none;fontColor=#147EBA;dashed=1;` |
| VPC | `grIcon=mxgraph.aws4.group_vpc2;strokeColor=#8C4FFF;fillColor=none;fontColor=#8C4FFF;` |
| Subnet pública | `grIcon=mxgraph.aws4.group_security_group;grStroke=0;strokeColor=#7AA116;fillColor=#F2F6E8;fontColor=#248814;` |
| Subnet privada | `grIcon=mxgraph.aws4.group_security_group;grStroke=0;strokeColor=#00A4A6;fillColor=#E6F6F7;fontColor=#147EBA;` |
| Instância EC2 (conteúdo) | `grIcon=mxgraph.aws4.group_ec2_instance_contents;strokeColor=#D86613;fillColor=none;fontColor=#D86613;` |

Recursos como ícone (78 × 78, rótulo abaixo):
`shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.<serviço>;fillColor=<cor da categoria>;strokeColor=#FFFFFF;fontColor=#232F3E;verticalLabelPosition=bottom;verticalAlign=top;align=center;aspect=fixed;html=1;outlineConnect=0;`

| Serviço | `resIcon` | Cor da categoria |
|---|---|---|
| EC2 | `mxgraph.aws4.ec2` | `#ED7100` (compute) |
| Lambda | `mxgraph.aws4.lambda` | `#ED7100` |
| RDS | `mxgraph.aws4.rds` | `#C925D1` (database) |
| S3 | `mxgraph.aws4.s3` | `#7AA116` (storage) |
| Bedrock | `mxgraph.aws4.bedrock` | `#01A88D` (IA) |

Se um ícone aparecer em branco, a versão do Draw.io não tem aquele `resIcon` — abra *Mais formas › AWS* no editor,
arraste o ícone e copie o estilo gerado. Serviço fora da AWS (Vercel, provedor SMTP) usa grupo genérico tracejado.
Template: `assets/implantacao-aws.drawio`.

### Sequência (runtime)

| Peça | Estilo | Observação |
|---|---|---|
| Participante (lifeline) | `shape=umlLifeline;perimeter=lifelinePerimeter;container=1;collapsible=0;recursiveResize=0;dropTarget=0;outlineConnect=0;portConstraint=eastwest;size=50;html=1;whiteSpace=wrap;` | `size` = altura do cabeçalho; lifelines lado a lado a cada 220 px |
| Ativação | `html=1;points=[];perimeter=orthogonalPerimeter;outlineConnect=0;targetShapes=umlLifeline;portConstraint=eastwest;` | Filho da lifeline: `x = largura/2 − 5`, `width=10` |
| Mensagem síncrona | `html=1;verticalAlign=bottom;endArrow=block;endFill=1;` | Aresta solta com `sourcePoint`/`targetPoint` |
| Mensagem assíncrona | `html=1;verticalAlign=bottom;endArrow=open;endFill=0;` | |
| Retorno | `html=1;verticalAlign=bottom;endArrow=open;endFill=0;dashed=1;` | |
| Nota de falha | `shape=note;size=14;whiteSpace=wrap;html=1;fillColor=#FFF2CC;strokeColor=#D6B656;align=left;spacingLeft=8;` | Ao lado do trecho que falha |

Mensagens descem de 40 em 40 px, na ordem em que acontecem. As pontas ficam na borda da barra de ativação
(centro da lifeline ± 5). Template: `assets/sequencia-runtime.drawio`.

---

## 12. Validar e exportar

### Validar

```bash
node "${CLAUDE_PLUGIN_ROOT}/skills/code-architecture/scripts/validate-drawio.mjs" docs/arquitetura/diagramas/*.drawio
```

| Verifica | Nível |
|---|---|
| XML bem formado, `<` cru ou `&` sem escape em atributo | ✖ erro |
| Página comprimida | ✖ erro |
| Células `0` e `1`, ids duplicados, `parent`/`source`/`target` inexistentes | ✖ erro |
| Vértice sem tamanho, aresta sem ponta | ✖ erro |
| Filho transbordando o container, vértices irmãos sobrepostos | ⚠ aviso |
| HTML no rótulo sem `html=1`, página sem legenda, mais de 30 vértices | ⚠ aviso |

### Exportar (Draw.io Desktop)

```bash
# macOS / Linux
drawio --export --format svg --embed-diagram --border 20 \
  --output docs/arquitetura/diagramas/c4-containers.svg docs/arquitetura/diagramas/c4-containers.drawio

# Windows
"C:\Program Files\draw.io\draw.io.exe" --export --format svg --embed-diagram --border 20 ^
  --output docs\arquitetura\diagramas\c4-containers.svg docs\arquitetura\diagramas\c4-containers.drawio
```

| Flag | Efeito |
|---|---|
| `--format svg\|png\|pdf` | Formato de saída |
| `--embed-diagram` | Embute o XML — o arquivo exportado reabre editável |
| `--page-index N` | Página a exportar (padrão: a primeira) |
| `--border 20` | Margem em px |
| `--transparent` | Fundo transparente (PNG) |

Sem Draw.io Desktop instalado: entregue o `.drawio`, informe que o SVG não foi gerado e passe o caminho de
exportação manual — *Arquivo › Exportar como › SVG*, marcando "Incluir cópia do diagrama".

---

## 13. Checklist do diagrama

- [ ] Título-pergunta no topo da página
- [ ] Um nível de abstração por página (não misture container com classe)
- [ ] Todo elemento tem nome, tipo/tecnologia e — nos C4 — uma frase de responsabilidade
- [ ] Toda aresta tem rótulo `verbo + [protocolo]` e direção correta (quem inicia a chamada)
- [ ] Cores da paleta, legenda presente
- [ ] Nada sobreposto, nada transbordando container, cruzamentos minimizados
- [ ] Nomes batem com o código e a infra reais
- [ ] Arquivo descomprimido, validador sem erro, SVG exportado (ou ausência justificada)

---

## 14. Erros comuns

| Sintoma ao abrir | Causa | Correção |
|---|---|---|
| "Não foi possível abrir o arquivo" | `&` ou `<` sem escape em `value` | `&amp;` / `&lt;` |
| Rótulo mostra `<b>` literal | Falta `html=1` no `style` | Adicione `html=1;` |
| Elemento some ou aparece no canto | `parent` apontando para container errado, ou coordenada absoluta num filho | Coordenadas de filho são relativas ao pai |
| Seta presa no canto (0,0) | `source`/`target` com id inexistente | Confira os ids |
| Container "engole" elementos ao mover | Elemento que não é filho está dentro da área do container | Mova para fora ou torne-o filho |
| Texto vaza da caixa | Falta `whiteSpace=wrap` ou caixa pequena | Adicione `whiteSpace=wrap;` e aumente a altura |
| Ícone AWS em branco | `resIcon` não existe na versão instalada | Arraste da biblioteca AWS e copie o estilo |
| PR com diff ilegível | Arquivo salvo comprimido | Desmarque "Comprimido" nas propriedades |
