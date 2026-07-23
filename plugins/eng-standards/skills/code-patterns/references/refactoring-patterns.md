# Patterns de Refatoração — Antes / Depois

---

## 1. Hook gigante → Hooks por responsabilidade

### ❌ Antes

```ts
function useUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch('/users').then(r => r.json()).then(setUsers).finally(() => setIsLoading(false));
    fetch('/permissions').then(r => r.json()).then(setPermissions);
  }, []);

  const filtered = users.filter(u => !filters.name || u.name.includes(filters.name));
  const canEdit = permissions.some(p => p.name === 'user:edit');

  return { users: filtered, filters, setFilters, canEdit, isLoading };
}
```

### ✅ Depois

```ts
/** Busca a lista de usuários da API. */
function useUserList() {
  return useQuery({ queryKey: ['users'], queryFn: fetchUsers });
}

/** Gerencia os filtros ativos e aplica sobre uma lista de usuários. */
function useUserFilters(users: User[]) {
  const [filters, setFilters] = useState<UserFilters>({});
  const filtered = useMemo(() => applyUserFilters(users, filters), [users, filters]);
  return { filters, setFilters, filtered };
}

/** Resolve as permissões do usuário logado sobre o módulo de usuários. */
function useUserPermissions() {
  const { data: permissions = [] } = useQuery({ queryKey: ['permissions'], queryFn: fetchPermissions });
  return { canEdit: hasPermission(permissions, 'user:edit') };
}
```

---

## 2. Componente monolítico → Composição

### ❌ Antes

```tsx
function UserPage() {
  const { users, isLoading } = useUserList();

  return (
    <div>
      <div className="header">
        <h1>Usuários</h1>
        <button onClick={() => {}}>Novo</button>
      </div>
      {isLoading ? (
        <div className="spinner" />
      ) : (
        <table>
          <thead><tr><th>Nome</th><th>Email</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

### ✅ Depois

```tsx
// features/users/ui/user-page.tsx
function UserPage() {
  const { data: users = [], isLoading } = useUserList();

  return (
    <PageLayout title="Usuários" action={<CreateUserButton />}>
      <UserTable users={users} isLoading={isLoading} />
    </PageLayout>
  );
}

// features/users/components/user-table.tsx
function UserTable({ users, isLoading }: UserTableProps) {
  if (isLoading) return <TableSkeleton />;
  if (users.length === 0) return <EmptyState message="Nenhum usuário encontrado" />;

  return (
    <Table>
      <TableHeader columns={USER_TABLE_COLUMNS} />
      <TableBody>
        {users.map(user => <UserRow key={user.id} user={user} />)}
      </TableBody>
    </Table>
  );
}
```

---

## 3. Nesting profundo → Guard clauses

### ❌ Antes

```ts
function processOrder(order: Order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.status === 'pending') {
        if (order.customer.isActive) {
          return chargeOrder(order);
        } else {
          throw new Error('Cliente inativo');
        }
      } else {
        throw new Error('Pedido não está pendente');
      }
    } else {
      throw new Error('Pedido sem itens');
    }
  }
  throw new Error('Pedido inválido');
}
```

### ✅ Depois

```ts
function processOrder(order: Order) {
  if (!order) throw new InvalidOrderError();
  if (order.items.length === 0) throw new EmptyOrderError();
  if (order.status !== 'pending') throw new InvalidOrderStatusError(order.status);
  if (!order.customer.isActive) throw new InactiveCustomerError();

  return chargeOrder(order);
}
```

---

## 4. Condicional com muitos ramos → Map de estratégias

### ❌ Antes

```ts
function getShippingCost(method: string, weight: number): number {
  if (method === 'standard') return weight * 2;
  if (method === 'express') return weight * 5;
  if (method === 'overnight') return weight * 12;
  if (method === 'pickup') return 0;
  throw new Error('Método inválido');
}
```

### ✅ Depois

```ts
const SHIPPING_RATES: Record<ShippingMethod, (weight: number) => number> = {
  standard: weight => weight * 2,
  express: weight => weight * 5,
  overnight: weight => weight * 12,
  pickup: () => 0,
};

/**
 * Calcula o custo de frete conforme o método escolhido.
 *
 * @throws {InvalidShippingMethodError} Quando o método não é suportado
 */
function getShippingCost(method: ShippingMethod, weight: number): number {
  const rate = SHIPPING_RATES[method];
  if (!rate) throw new InvalidShippingMethodError(method);
  return rate(weight);
}
```

---

## 5. Controller com regra de negócio → Camadas

### ❌ Antes

```ts
// usuarios.controller.ts
export async function createUser(req: Request, res: Response) {
  const { nome, email, senha } = req.body;

  if (!email.includes('@')) return res.status(400).json({ error: 'Email inválido' });

  const existing = await prisma.usuario.findUnique({ where: { email } });
  if (existing) return res.status(422).json({ error: 'Email já existe' });

  const hash = await bcrypt.hash(senha, 10);
  const user = await prisma.usuario.create({ data: { nome, email, senhaHash: hash } });

  res.status(201).json(user);
}
```

### ✅ Depois

```ts
// usuarios.controller.ts — só entrada e saída HTTP
export async function createUser(req: Request, res: Response) {
  const payload = createUserSchema.parse(req.body);
  const user = await usuariosService.create(payload);
  return sendSuccess(res, user, 201);
}

// usuarios.service.ts — regra de negócio
export async function create(payload: CreateUserPayload): Promise<PublicUser> {
  const existing = await usuariosRepository.findByEmail(payload.email);
  if (existing) throw new EmailAlreadyExistsError(payload.email);

  const senhaHash = await hashPassword(payload.senha);
  const user = await usuariosRepository.create({ ...payload, senhaHash });

  return toPublicUser(user);
}

// usuarios.repository.ts — só acesso a dados
export function findByEmail(email: string) {
  return prisma.usuario.findUnique({ where: { email } });
}

export function create(data: CreateUserData) {
  return prisma.usuario.create({ data });
}
```

---

## 6. Magic numbers → Constantes nomeadas

### ❌ Antes

```ts
if (user.loginAttempts > 5) lockAccount(user);
setTimeout(retry, 3000);
if (file.size > 5242880) throw new Error('Arquivo grande demais');
```

### ✅ Depois

```ts
// constants/auth.constants.ts
export const MAX_LOGIN_ATTEMPTS = 5;
export const RETRY_DELAY_MS = 3_000;
export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

// uso
if (user.loginAttempts > MAX_LOGIN_ATTEMPTS) lockAccount(user);
setTimeout(retry, RETRY_DELAY_MS);
if (file.size > MAX_UPLOAD_SIZE_BYTES) throw new FileTooLargeError();
```

---

## 7. `utils.ts` genérico → Helpers por domínio

### ❌ Antes

```
shared/
└── utils.ts          # 30 funções: datas, moeda, string, validação, array...
```

### ✅ Depois

```
shared/helpers/
├── date.helper.ts        # formatDate, addWorkdays, isWeekend
├── currency.helper.ts    # formatCurrency, parseCurrency
├── string.helper.ts      # slugify, truncate, capitalize
└── index.ts              # barrel export
```

---

## 8. Prop drilling → Store ou Context

### ❌ Antes

```tsx
<Dashboard user={user} />
  <Sidebar user={user} />
    <UserMenu user={user} />
      <UserAvatar user={user} />
```

### ✅ Depois

```ts
// store/global/auth.store.ts
export const useAuthStore = create<AuthState>(set => ({
  user: null,
  setUser: user => set({ user }),
}));

// UserAvatar.tsx — consome direto
function UserAvatar() {
  const user = useAuthStore(state => state.user);
  return <Avatar src={user?.avatarUrl} alt={user?.name} />;
}
```
