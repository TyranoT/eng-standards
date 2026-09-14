# Templates — Artefatos de Arquitetura

Um template por modo da skill. Todo artefato começa com o cabeçalho padrão da `code-docs` e termina com
**Próximo passo recomendado**. Marque cada afirmação como **[fato]**, **[suposição]** ou **[recomendação]**.

```markdown
# 0. Informações

Este artefato decide/descreve [objetivo em uma frase].

| Feito por | [Nome] |
| --- | --- |
| Cargo | [Cargo] |
| Data de Criação | DD/MM/AAAA |
| Status | Rascunho · Em revisão · Aceito |
```

Salve em `docs/arquitetura/<modo>-<assunto>.md` — ex.: `trade-off-mensageria.md`, `riscos-2026-q3.md`.

---

## 1. Opções de arquitetura

```markdown
# 1. Problema
<o que precisa ser resolvido, em 2–3 linhas>

# 2. Drivers
| Driver | Tipo | Peso |
|---|---|---|
| Time de 3 devs full-stack, sem SRE | Restrição | Alto |
| P95 < 500 ms no checkout | Qualidade (performance) | Alto |
| Integrar com 2 ERPs até o fim do ano | Qualidade (integrabilidade) | Médio |

# 3. Opções
| # | Opção | Como funciona | Atende bem | Atende mal | Custo operacional |
|---|---|---|---|---|---|
| A | Manter como está | ... | ... | ... | Nenhum novo |
| B | Monólito modular | ... | ... | ... | Baixo |
| C | Serviço separado para integrações | ... | ... | ... | Médio: 2º deploy, 2º pipeline |

# 4. Opção recomendada
[recomendação] <opção> porque <driver 1> e <driver 2>.

# 5. O que invalidaria esta recomendação
- Se o time dobrar e surgir um squad dedicado a integrações → reavaliar C
```

> Sempre inclua "manter como está" como opção A — ela é a base de comparação.

---

## 2. Cenários de atributos de qualidade

Transforma "o sistema tem que ser rápido" em algo testável. Um cenário = seis partes.

```markdown
| ID | Atributo | Fonte / estímulo | Ambiente | Artefato | Resposta | Medida | Prioridade |
|---|---|---|---|---|---|---|---|
| QA01 | Performance | Cliente finaliza pedido | Pico (500 req/min) | API de pedidos | Pedido confirmado | P95 < 500 ms | (A, M) |
| QA02 | Disponibilidade | Instância EC2 cai | Produção, horário comercial | API + worker | Tráfego vai para a outra instância | Indisponível < 2 min | (A, A) |
| QA03 | Segurança | Token JWT expirado | Qualquer | Rotas autenticadas | Requisição recusada | 100% com 401, zero dado vazado | (A, B) |
| QA04 | Modificabilidade | Novo meio de pagamento | Desenvolvimento | Módulo de pagamentos | Implementado sem tocar em pedidos | ≤ 3 dias, 1 módulo alterado | (M, M) |
```

**Prioridade = (importância para o negócio, dificuldade técnica)** em A/M/B. Cenários (A, A) são os que definem a
arquitetura — comece o trade-off por eles.

Atributos mais comuns: performance, escalabilidade, disponibilidade, segurança, modificabilidade, testabilidade,
integrabilidade, observabilidade, custo.

---

## 3. Matriz de trade-off

```markdown
# 1. Critérios (dos cenários de qualidade e restrições)
| Critério | Peso (1–5) | Origem |
|---|---|---|
| Performance no checkout | 5 | QA01 |
| Custo operacional para time de 3 | 4 | Restrição |
| Facilidade de integrar ERPs | 3 | QA04 |

# 2. Notas (1 = ruim · 5 = ótimo)
| Critério | Peso | A — manter | B — modular | C — serviço |
|---|---|---|---|---|
| Performance | 5 | 3 | 4 | 4 |
| Custo operacional | 4 | 5 | 4 | 2 |
| Integrar ERPs | 3 | 2 | 4 | 5 |
| **Total ponderado** | | **44** | **48** | **43** |

# 3. Sensibilidade
- Se o peso de "integrar ERPs" subir para 5, C empata com B → a decisão depende dessa prioridade. Confirmar com o negócio.

# 4. O que perdemos ao escolher B
- Deploy continua único: bug no módulo de integração derruba o checkout
- Escala independente das integrações fica para depois
```

> Nota sem justificativa é chute. Ao lado de cada nota ≤ 2 ou ≥ 5, escreva o porquê em uma linha.

---

## 4. Arquitetura em camadas

```markdown
| Camada | Responsabilidade | Pode depender de | Nunca depende de |
|---|---|---|---|
| Routes | Registro de rotas e middlewares | Controller | Service, Repository |
| Controller | Entrada HTTP, validação de payload | Service | Repository, ORM |
| Service | Regra de negócio | Repository, outros services via interface | `req`/`res`, framework HTTP |
| Repository | Acesso a dados | ORM/DB | Service |

**Regra de dependência:** sempre para baixo, uma camada por vez.

**Exceções permitidas:** <lista curta, cada uma com motivo — ou "nenhuma">

**Como verificar automaticamente:**
| Stack | Ferramenta |
|---|---|
| Node/TS | `dependency-cruiser` ou `eslint-plugin-boundaries` |
| Java/Spring | ArchUnit |
| Python | `import-linter` |
```

A estrutura de pastas que materializa as camadas é da `/eng-standards:code-structure` — este artefato só decide as regras.

---

## 5. Fronteiras de componentes

```markdown
| Componente | Responsabilidade (1 frase) | Dados que possui | Interface pública | Depende de | Dono |
|---|---|---|---|---|---|
| pedidos | Ciclo de vida do pedido | `pedidos`, `itens_pedido` | `features/pedidos/index.ts`, `POST /pedidos` | pagamentos (interface) | Time A |
| pagamentos | Cobrança e conciliação | `cobrancas` | `PagamentosService.cobrar()` | Gateway externo | Time A |

## Acoplamentos suspeitos
| De → Para | Sintoma | Severidade | Ação |
|---|---|---|---|
| relatorios → pedidos | Lê a tabela `pedidos` direto, fora do repository | Alta | Expor consulta no contrato de pedidos |

## Regras
- Cada tabela tem **um** componente dono; os outros leem pela interface pública
- Import entre componentes só pelo barrel (`index.ts`) ou contrato público
```

---

## 6. Fronteiras de integração

```markdown
| Integração | Direção | Protocolo | Sync/Async | Contrato | Falha e retry | Idempotência | Dono |
|---|---|---|---|---|---|---|---|
| Gateway de pagamento | Sai | HTTPS/JSON | Sync | OpenAPI do provedor v3 | Timeout 5 s, 3 tentativas com backoff | Chave = id do pedido | Time A |
| Webhook do gateway | Entra | HTTPS/JSON | Async | Evento `payment.updated` | Provedor reenvia por 24 h | Deduplica por `event_id` | Time A |
| SMTP | Sai | SMTP/TLS | Async (worker) | — | Fila de reenvio | Não necessária | Time A |

## Camada anticorrupção
Onde o modelo externo é traduzido para o modelo interno — nenhum tipo do provedor vaza para o domínio.
<arquivo ou módulo responsável pela tradução>

## Dependências críticas
Quais integrações, se caírem, param o fluxo principal — alimenta a estratégia de disponibilidade (modo 12).
```

---

## 7. Decomposição em serviços · 8. Monólito vs. monólito modular

Os dois modos usam o mesmo template — a diferença é o ponto de partida (um monólito existente, ou a proposta de separar).

```markdown
# 1. Candidatos a fronteira
| Candidato | Coesão interna | Dados próprios | Taxa de mudança | Carga diferente do resto |
|---|---|---|---|---|
| Integrações | Alta | Sim (`cobrancas`) | Alta | Não |
| Relatórios | Média | Não — lê de pedidos | Baixa | Sim (consultas pesadas) |

# 2. Critérios de separação
| Critério | Pergunta | Resposta |
|---|---|---|
| Deploy independente | Precisamos publicar X sem publicar Y? | |
| Escala diferenciada | X tem carga ou perfil de recurso diferente? | |
| Fronteira de dados | X tem dados que só ele escreve? | |
| Autonomia de time | Existe time dedicado para X? | |
| Maturidade operacional | Temos CI/CD, observabilidade distribuída e on-call para N serviços? | |

# 3. Decisão
| Opção | Quando é certa |
|---|---|
| Monólito | Time pequeno, domínio ainda mudando, um deploy basta |
| Monólito modular | Fronteiras claras no código, mas um deploy ainda basta — **padrão recomendado** |
| Serviços separados | ≥ 2 critérios acima com "sim" forte **e** maturidade operacional presente |

# 4. Sinais para reavaliar
- Deploy de um módulo bloqueando outro mais de 1× por mês
- Um módulo exigindo escala 5× maior que o resto
```

> Monólito modular primeiro. Extrair serviço de um módulo com fronteira limpa é barato; juntar serviços mal cortados é caro.

---

## 9. Visão de runtime

```markdown
# 1. Fluxo
<nome do fluxo> — gatilho: <quem/o que dispara>

# 2. Elementos em execução
| Elemento | Container | Papel no fluxo |
|---|---|---|

# 3. Interações síncronas
| # | De → Para | Mensagem | Timeout |
|---|---|---|---|

# 4. Interações assíncronas
| # | Produtor → Consumidor | Evento / job | Garantia (at-least-once, etc.) |
|---|---|---|---|

# 5. Pontos de falha
| Onde | O que acontece | Efeito para o usuário |
|---|---|---|

# 6. Recuperação
| Falha | Estratégia (retry, compensação, reprocessamento) | Idempotente? |
|---|---|---|

# 7. Diagrama
![Sequência — <fluxo>](diagramas/sequencia-<fluxo>.svg)
```

Diagrama: copie `assets/sequencia-runtime.drawio`.

---

## 10. Visão de implantação

```markdown
# 1. Ambientes
| Ambiente | Onde | Diferença para produção |
|---|---|---|
| Produção | AWS sa-east-1 | — |
| Homologação | AWS sa-east-1, conta separada | Instância menor, RDS single-AZ |

# 2. Mapeamento container → nó
| Container | Nó | Réplicas | Escala por |
|---|---|---|---|
| Web App | Vercel | Gerenciado | Automático |
| API | EC2 t3.medium (Docker Compose) | 2 | Manual / ASG |
| Worker | Mesmo EC2 da API | 1 | — |
| Banco | RDS PostgreSQL 16 | Multi-AZ | Vertical |

# 3. Rede e segurança
- Subnet pública: somente EC2 atrás de Elastic IP / ALB; SG libera 443
- Subnet privada: RDS, SG libera 5432 apenas para o SG da API
- Segredos em <SSM Parameter Store / Secrets Manager>, nunca no `.env` versionado

# 4. Pipeline
<GitHub Actions: build → testes → imagem → deploy>

# 5. Riscos de implantação
<ex.: API e worker no mesmo nó competem por CPU no pico>

# 6. Diagrama
![Implantação — produção](diagramas/implantacao-producao.svg)
```

Diagrama: copie `assets/implantacao-aws.drawio`.

---

## 11. Hotspots de escalabilidade

```markdown
| ID | Componente | Carga atual → projetada | Recurso limitante | Sintoma quando estoura | Limite estimado | Mitigação | Custo |
|---|---|---|---|---|---|---|---|
| H1 | API — listagem de pedidos | 50 → 500 req/min | Consulta sem índice em `pedidos.status` | P95 > 2 s | ~200 req/min [suposição] | Índice composto + paginação por cursor | Baixo |
| H2 | RDS | 40 → 400 conexões | `max_connections` da instância | Erro de conexão | ~170 conexões | Pool no app / RDS Proxy | Médio |

## Como medir
<métrica, dashboard ou teste de carga que confirma cada limite estimado>
```

> Hotspot é hipótese até ser medido. Marque o limite como [suposição] e diga como confirmar.

---

## 12. Estratégia de disponibilidade

```markdown
# 1. Objetivo
| Item | Valor |
|---|---|
| SLO | 99,5% mensal (~3,6 h de indisponibilidade/mês) |
| RPO (perda de dados aceitável) | 5 min |
| RTO (tempo para voltar) | 30 min |

# 2. Pontos únicos de falha
| Componente | Hoje | Mitigação | Prioridade |
|---|---|---|---|
| EC2 da API | 1 instância | 2ª instância + ALB | Alta |

# 3. Dependências críticas
<integrações do modo 6 que param o fluxo principal e o que fazer quando caem>

# 4. Degradação graciosa
| Se cair | O sistema continua | Desativa |
|---|---|---|
| Gateway de pagamento | Recebe pedidos como PENDENTE | Confirmação instantânea |

# 5. Backup e restauração
<frequência, retenção, onde fica e quando foi o último teste de restore>

# 6. Observabilidade
<health check, alertas, logs centralizados, quem é acionado>
```

---

## 13. Registro de riscos

```markdown
| ID | Risco | Causa | Impacto | Probabilidade | Severidade | Mitigação | Gatilho de revisão | Dono |
|---|---|---|---|---|---|---|---|---|
| R1 | Checkout indisponível no pico | EC2 único para API | Alto | Média | 🔴 | 2ª instância + ALB | Antes da Black Friday | Italo |
| R2 | Vazamento de dados de pagamento | Log com payload completo | Alto | Baixa | 🟡 | Mascarar campos no logger | Todo PR em pagamentos | Time A |
```

Severidade = impacto × probabilidade: 🔴 alta · 🟡 média · 🔵 baixa. Risco sem dono e sem gatilho de revisão é só
preocupação — não é gestão de risco.

---

## 14. ADR — Architecture Decision Record

Um arquivo por decisão: `docs/arquitetura/adr/NNNN-<decisao-em-kebab>.md`, numeração sequencial que nunca se reutiliza.

```markdown
# ADR-0003 — Monólito modular com worker em processo separado

| Status | Proposto · Aceito · Rejeitado · Substituído por ADR-NNNN |
| --- | --- |
| Data | DD/MM/AAAA |
| Decisores | [nomes] |

## Contexto
<situação e forças em jogo, sem opinião — o que é verdade hoje>

## Drivers
- QA01 — P95 < 500 ms no checkout
- Restrição: time de 3 devs, sem SRE

## Opções consideradas
1. Manter o monólito atual
2. Monólito modular com worker separado ← escolhida
3. Serviço de integrações independente

## Decisão
<o que foi decidido, em voz ativa: "Vamos separar ...">

## Consequências
**Positivas**
- ...

**Negativas (o que aceitamos perder)**
- ...

## Ações de acompanhamento
- [ ] Criar `modules/integracoes/` com contrato público — responsável, prazo

## Revisar quando
<condição objetiva que reabre a decisão>
```

Regras:

- ADR aceito é **imutável**. Mudou a decisão → novo ADR, e o antigo recebe `Substituído por ADR-NNNN`.
- Contexto descreve fatos; opinião vai em Decisão.
- Uma decisão por ADR. Se o título tem "e", provavelmente são dois.

---

## Fluxo de exemplo — do pedido ao ADR

**Pedido:** "Precisamos de uma plataforma de pedidos com web e mobile, painel administrativo, auditoria e
integrações futuras com ERPs. Time pequeno, expansão para novas filiais prevista."

| Passo | Modo | Entrega |
|---|---|---|
| 1 | Opções | Tabela com 3 opções (monólito, monólito modular, serviços) e drivers |
| 2 | Cenários de qualidade | QA01–QA06 priorizados, com os (A, A) destacados |
| 3 | Trade-off | Matriz ponderada + sensibilidade → monólito modular |
| 4 | Monólito vs. modular | Critérios de separação respondidos; sinais de reavaliação |
| 5 | Camadas + componentes | Regras de dependência e donos de dados; C4 Componentes da API |
| 6 | Integrações | ERPs, gateway, SMTP com contrato, falha e idempotência; C4 Contexto + Containers |
| 7 | Runtime | Sequência "criar e cobrar pedido" com pontos de falha |
| 8 | Implantação | Vercel + EC2 + RDS + S3; diagrama de implantação |
| 9 | Escalabilidade + disponibilidade | H1–H3, SLO 99,5%, pontos únicos de falha |
| 10 | Riscos | R1–R5 com dono e gatilho |
| 11 | ADR | ADR-0001 registrando o monólito modular |

Depois: `/eng-standards:code-structure` cria `modules/` conforme as fronteiras, e `/eng-standards:code-docs` gera o
Documento de Arquitetura de Código incorporando os SVGs.
