---
name: code-docs
description: >
  Padrões de documentação — de código e de projeto. Skill filha de code-standards. Use ao escrever ou revisar JSDoc,
  TSDoc, Docstrings Python, Javadoc, DartDoc, README, ou ao produzir documentos de projeto: Especificação Completa
  (requisitos funcionais, não funcionais, modelo de dados), Documento de Arquitetura de Código, Documento de Fluxo
  (UML — diagrama de atividade e caso de uso), Plano de Ação por fases e Contrato de API. Gatilhos: "documenta isso",
  "escreve o JSDoc", "cria o README", "documento de especificação", "contrato de API", "plano de ação", "diagrama de
  fluxo", "docstring", "documenta a arquitetura".
---

# Code Docs — Documentação de Código e de Projeto

> Documentação boa é **curta e direta**. Se precisou de 3 linhas para explicar o que a função faz,
> o problema é o nome da função — não a doc.

---

## Parte 1 — Documentação de Código

### Regra fundamental

Nunca comente linha a linha o que o código faz. Use o padrão de documentação da linguagem no **contrato** da
função — o corpo deve ser autoexplicativo pela nomenclatura.

```ts
// ❌ ERRADO
// busca o usuário pelo id
const user = await fetchUser(id);
// formata o nome
user.name = user.name.toUpperCase();

// ✅ CERTO — doc no contrato, código autoexplicativo
/**
 * Busca e retorna um usuário formatado pelo seu identificador único.
 *
 * @param userId - UUID v4 do usuário
 * @returns Usuário com dados normalizados prontos para exibição
 * @throws {UserNotFoundError} Quando o usuário não existe na base
 */
async function getFormattedUser(userId: string): Promise<FormattedUser> {
  const user = await fetchUser(userId);
  return formatUser(user);
}
```

### Regras de clareza e brevidade

| Regra | Descrição |
|---|---|
| **Uma frase na descrição** | Deve caber em uma linha. Se não couber, a função faz coisas demais. |
| **Só documente o que não é óbvio** | `@param id` não precisa de "o id do usuário". Documente restrições, formato, comportamento especial. |
| **`@param` sem redundância** | O tipo já está na assinatura. Foque no *porquê* ou no *formato*. |
| **`@returns` objetivo** | Diga o que retorna em caso de sucesso — não repita o tipo. |
| **`@throws` apenas quando relevante** | Só erros que o chamador precisa tratar. |
| **`@example` para casos não óbvios** | Use quando o uso correto não for evidente pela assinatura. |

```ts
// ❌ VERBOSO — repete o óbvio
/**
 * Esta função busca um usuário pelo seu identificador único de usuário.
 * Ela recebe como parâmetro o id que é o identificador do usuário.
 *
 * @param id - O id do usuário (string com o identificador do usuário)
 * @returns Retorna uma Promise com o objeto do tipo User contendo os dados
 */
async function fetchUser(id: string): Promise<User>

// ✅ CLARO E BREVE
/**
 * Busca um usuário pelo seu ID.
 *
 * @param id - UUID v4 do usuário
 * @returns Dados do usuário ou `null` se não encontrado
 * @throws {UnauthorizedError} Quando a sessão expirou
 */
async function fetchUser(id: string): Promise<User | null>
```

```ts
// ❌ EXEMPLO DESNECESSÁRIO — trivial demais
/**
 * Soma dois números.
 * @example
 * add(1, 2) // 3
 */
function add(a: number, b: number): number

// ✅ EXEMPLO ÚTIL — comportamento não óbvio
/**
 * Formata um valor em centavos para exibição em moeda local.
 *
 * @param cents - Valor em centavos (inteiro)
 * @returns String no formato "R$ 0,00"
 *
 * @example
 * formatCurrency(0)     // "R$ 0,00"
 * formatCurrency(1990)  // "R$ 19,90"
 * formatCurrency(-500)  // "R$ -5,00"
 */
function formatCurrency(cents: number): string
```

### Padrão por linguagem

| Linguagem | Padrão | Tags principais |
|---|---|---|
| JavaScript / TypeScript | JSDoc / TSDoc | `@param`, `@returns`, `@throws`, `@example` |
| Python | Docstrings (Google style) | `Args:`, `Returns:`, `Raises:`, `Example:` |
| Java / Spring | Javadoc | `@param`, `@return`, `@throws` |
| Dart / Flutter | DartDoc | `/// Descrição`, `[param]` |
| Markdown / README | Markdown | Cabeçalhos, exemplos de uso |

> Para linguagens sem padrão oficial, use o estilo mais próximo da comunidade.

Exemplos completos por linguagem: `references/documentation-examples.md`

---

## Parte 2 — Documentos de Projeto

Cinco documentos essenciais. Todo projeto de porte médio ou maior deve tê-los.

| # | Documento | Finalidade |
|---|---|---|
| 1 | **Especificação Completa** | Requisitos funcionais, não funcionais e modelo de dados, incluindo diagrama de relações |
| 2 | **Arquitetura de Código** | Explica e demonstra como funciona a arquitetura do projeto, com casos gerais e específicos |
| 3 | **Documento de Fluxo** | Diagrama de Atividade e Diagrama de Caso de Uso padronizados em UML |
| 4 | **Plano de Ação** | Guia de execução separado por fases, da Fase 0 (configurações) até a entrega do MVP |
| 5 | **Contrato de API** | Descreve o que entra e o que sai de cada rota — guia frontend e integrações futuras |

### Prioridade de criação

1. **Especificação Completa** — antes de qualquer decisão técnica
2. **Contrato de API** — antes de codar frontend ou backend; ele desbloqueia os dois em paralelo
3. **Arquitetura de Código** — junto com a Fase 0
4. **Plano de Ação** — junto com a Fase 0
5. **Documento de Fluxo** — conforme os casos de uso se consolidam

### Cabeçalho padrão de todo documento

```markdown
# 0. Informações

Este documento tem como finalidade [objetivo em uma frase].

| Feito por | [Nome] |
| --- | --- |
| Cargo | [Cargo] |
| Data de Criação | DD/MM/AAAA |
```

Templates prontos dos cinco documentos: `references/project-documents.md`

> Diagramas de arquitetura (C4, implantação, sequência entre containers) e ADRs vêm da
> `/eng-standards:code-architecture`, em Draw.io. O Documento de Arquitetura de Código incorpora os SVGs exportados
> em vez de redesenhar. Mermaid continua valendo para ER, atividade e caso de uso dentro dos documentos.

---

## Checklist de documentação

- [ ] Toda função exportada/pública tem doc no padrão da linguagem
- [ ] Descrição principal cabe em uma linha
- [ ] Nenhum `@param` repete o tipo da assinatura
- [ ] `@throws` só lista erros tratáveis pelo chamador
- [ ] `@example` só onde o uso não é evidente
- [ ] Zero comentário inline explicando "o que fez"
- [ ] README existe e mostra como rodar o projeto
- [ ] Contrato de API atualizado se houve mudança em rota

---

## Referências

- `references/documentation-examples.md` — JSDoc, TSDoc, Docstring, Javadoc e DartDoc completos
- `references/project-documents.md` — Templates dos cinco documentos essenciais
