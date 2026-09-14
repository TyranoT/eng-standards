# Nomenclatura

> Biblioteca compartilhada `eng-standards`. Referenciável por qualquer skill:
> `${CLAUDE_PLUGIN_ROOT}/references/patterns/nomenclatura.md`

**Quando ler:** ao criar qualquer variável, função, classe, arquivo ou pasta — e ao revisar nomes existentes.

---

## 1. Tabela de referência

| Elemento | Regra | Exemplo |
|---|---|---|
| Variáveis | Intenção clara, sem abreviações | `userList`, não `ul` ou `arr` |
| Funções | Verbo + substantivo | `fetchUserById`, `formatCurrency` |
| Booleanos | Prefixo `is`, `has`, `can`, `should` | `isLoading`, `hasPermission` |
| Constantes | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Componentes React/Angular | PascalCase | `UserProfileCard` |
| Hooks (React) | Prefixo `use` | `useUserPermissions` |
| Classes | PascalCase + substantivo | `PaymentProcessor` |
| Arquivos | kebab-case | `user-profile-card.tsx` |
| Pastas | kebab-case | `user-management/` |

---

## 2. Verbos padrão para funções

| Verbo | Usa quando | Exemplo |
|---|---|---|
| `get` | Retorna algo já disponível em memória, síncrono | `getFullName(user)` |
| `fetch` | Busca remota (HTTP, RPC) | `fetchUserById(id)` |
| `find` | Busca em coleção, pode não achar | `findUserByEmail(list, email)` |
| `create` | Cria um novo recurso | `createOrder(payload)` |
| `build` | Monta um objeto sem persistir | `buildQueryParams(filters)` |
| `format` | Converte para exibição | `formatCurrency(value)` |
| `parse` | Converte de texto para estrutura | `parseCurrency(text)` |
| `to` | Transforma entre representações | `toPublicUser(user)` |
| `validate` | Retorna resultado de validação | `validateCpf(value)` |
| `assert` | Lança erro se inválido | `assertIsAdmin(user)` |
| `handle` | Trata evento de UI ou fila | `handleSubmit(event)` |
| `on` | Prop de callback recebida | `onSelectUser` |

---

## 3. Sufixos de arquivo por papel

| Sufixo | Papel | Exemplo |
|---|---|---|
| `.helper.ts` | Funções puras de um domínio | `date.helper.ts` |
| `.service.ts` | Regra de negócio | `usuarios.service.ts` |
| `.repository.ts` | Acesso a dados | `usuarios.repository.ts` |
| `.controller.ts` | Entrada/saída HTTP | `usuarios.controller.ts` |
| `.store.ts` | Estado global | `auth.store.ts` |
| `.schema.ts` | Validação (Zod, Yup, class-validator) | `user.schema.ts` |
| `.type.ts` | Tipos e interfaces | `user.type.ts` |
| `.constants.ts` | Constantes nomeadas | `auth.constants.ts` |

---

## 4. Proibições

- Abreviações que só o autor entende — `usr`, `tmp2`, `dtIni`, `flg`
- Nomes genéricos em escopo amplo — `data`, `item`, `value`, `handler`, `utils`
- Sufixo numérico — `user2`, `processOrderNew`, `formatDateV2`
- Nome que mente sobre o custo — `getUser()` que dispara chamada HTTP
- Nome com "e" ligando dois verbos — `validateAndSave()` são duas funções

---

## 5. Regra de ouro

**Se o nome precisa de comentário, o nome está errado.** Renomeie antes de comentar —
ver `regras-absolutas.md`, seção 3.

---

## Relacionados

- `regras-absolutas.md` — proibição de comentário inline
- `anti-patterns.md` — `utils.ts` genérico e magic numbers
