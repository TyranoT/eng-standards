# Regras Absolutas — Nunca Viole

> Biblioteca compartilhada `eng-standards`. Referenciável por qualquer skill:
> `${CLAUDE_PLUGIN_ROOT}/references/patterns/regras-absolutas.md`

**Quando ler:** sempre que for gerar código novo ou aprovar um review. Estas regras vencem qualquer outra
orientação em caso de conflito.

---

## 1. Sem IIFEs em JSX/TSX

```tsx
// ❌ ERRADO
return (
  <div>
    {(() => {
      if (isLoading) return <Spinner />;
      return <Content />;
    })()}
  </div>
);

// ✅ CERTO — função nomeada
function renderContent() {
  if (isLoading) return <Spinner />;
  return <Content />;
}
return <div>{renderContent()}</div>;

// ✅ MELHOR — componente dedicado
return <div><ContentOrSpinner isLoading={isLoading} /></div>;
```

**Por quê:** a IIFE esconde uma responsabilidade dentro do markup, não é testável isoladamente e não é reaproveitável.

---

## 2. Sem funções complexas e multi-propósito

```ts
// ❌ ERRADO — busca, transforma e salva num lugar só
async function handleUserData(id: string) {
  const res = await fetch(`/users/${id}`);
  const data = res.json();
  const formatted = { ...data, name: data.name.toUpperCase() };
  localStorage.setItem('user', JSON.stringify(formatted));
  return formatted;
}

// ✅ CERTO — responsabilidades separadas
async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/users/${id}`);
  return res.json();
}

function formatUser(user: User): FormattedUser {
  return { ...user, name: user.name.toUpperCase() };
}

function persistUser(user: FormattedUser): void {
  localStorage.setItem('user', JSON.stringify(user));
}
```

**Teste rápido:** se o nome da função precisa de um "e" (`buscaEFormata`), são duas funções.

---

## 3. Sem comentários inline explicando "o que fez"

O código deve ser autoexplicativo pela nomenclatura. Documentação vai no contrato da função —
ver skill `/eng-standards:code-docs`.

```ts
// ❌ ERRADO
// incrementa o contador em 1
count = count + 1;

// soma os itens do carrinho
const t = items.reduce((a, i) => a + i.price, 0);

// ✅ CERTO — o nome já explica
count += 1;
const cartTotal = sumItemPrices(items);
```

**Exceção legítima:** comentário que explica **por que** algo foi feito de forma não óbvia
(workaround de bug de terceiro, decisão de negócio, restrição de performance). Isso não é
"o que fez" — é contexto que o código não consegue carregar.

```ts
// A API retorna a data em UTC sem sufixo Z; sem isso o parse assume timezone local.
const createdAt = new Date(`${payload.createdAt}Z`);
```

---

## 4. Sem `any` sem justificativa (TypeScript)

Use o tipo específico, `unknown` + narrowing, ou generic. `any` só com comentário explicando a
restrição externa que o obriga.

---

## Ordem de precedência em conflito

1. Regras deste arquivo vencem sempre
2. Estrutura de pastas de `/eng-standards:code-structure` vence preferências pontuais
3. Formato de documentação de `/eng-standards:code-docs` cede a padrões oficiais da linguagem

---

## Relacionados

- `principios-solid.md` — o porquê por trás das regras
- `anti-patterns.md` — catálogo mais amplo do que evitar
- `nomenclatura.md` — como nomear para dispensar comentário
