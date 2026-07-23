# Exemplos de Documentação por Linguagem

---

## TypeScript / JavaScript — TSDoc / JSDoc

### Função

```ts
/**
 * Calcula o valor total do pedido com desconto e frete aplicados.
 *
 * @param items - Itens do carrinho, mínimo 1
 * @param discountCode - Código promocional; ignorado se inválido
 * @returns Valor final em centavos
 * @throws {EmptyCartError} Quando `items` está vazio
 *
 * @example
 * calculateOrderTotal(items, 'BLACK50') // 4990
 */
export function calculateOrderTotal(
  items: CartItem[],
  discountCode?: string
): number
```

### Hook React

```ts
/**
 * Gerencia a listagem paginada de usuários com filtros aplicados.
 *
 * @param filters - Filtros ativos; alterações refazem a query
 * @returns Lista, estado de carregamento e controles de paginação
 */
export function useUserList(filters: UserFilters): UseUserListReturn
```

### Classe

```ts
/**
 * Processa pagamentos via gateway externo com retry automático.
 *
 * @remarks
 * Cada instância mantém sua própria contagem de tentativas.
 */
export class PaymentProcessor {
  /**
   * @param gateway - Provedor de pagamento configurado
   * @param maxRetries - Tentativas antes de falhar; padrão 3
   */
  constructor(
    private readonly gateway: PaymentGateway,
    private readonly maxRetries: number = 3
  ) {}
}
```

### Tipo / Interface

```ts
/** Usuário com dados normalizados prontos para exibição. */
export interface FormattedUser {
  id: string;
  /** Nome completo em caixa alta. */
  name: string;
  /** ISO 8601. */
  createdAt: string;
}
```

---

## Python — Docstrings (Google Style)

### Função

```python
def calculate_order_total(items: list[CartItem], discount_code: str | None = None) -> int:
    """Calcula o valor total do pedido com desconto e frete aplicados.

    Args:
        items: Itens do carrinho, mínimo 1.
        discount_code: Código promocional; ignorado se inválido.

    Returns:
        Valor final em centavos.

    Raises:
        EmptyCartError: Quando `items` está vazio.

    Example:
        >>> calculate_order_total(items, 'BLACK50')
        4990
    """
```

### Classe

```python
class PaymentProcessor:
    """Processa pagamentos via gateway externo com retry automático.

    Cada instância mantém sua própria contagem de tentativas.

    Attributes:
        gateway: Provedor de pagamento configurado.
        max_retries: Tentativas antes de falhar.
    """

    def __init__(self, gateway: PaymentGateway, max_retries: int = 3) -> None:
        """Inicializa o processador.

        Args:
            gateway: Provedor de pagamento configurado.
            max_retries: Tentativas antes de falhar.
        """
```

### Rota FastAPI

```python
@router.get("/users/{user_id}", response_model=UserSchema)
async def get_user(user_id: UUID) -> UserSchema:
    """Retorna os dados de um usuário.

    Args:
        user_id: UUID v4 do usuário.

    Returns:
        Dados públicos do usuário.

    Raises:
        HTTPException: 404 se o usuário não existir.
    """
```

---

## Java / Spring — Javadoc

```java
/**
 * Processa pagamentos via gateway externo com retry automático.
 *
 * <p>Cada instância mantém sua própria contagem de tentativas.
 */
public class PaymentProcessor {

    /**
     * Calcula o valor total do pedido com desconto e frete aplicados.
     *
     * @param items itens do carrinho, mínimo 1
     * @param discountCode código promocional; ignorado se inválido
     * @return valor final em centavos
     * @throws EmptyCartException quando {@code items} está vazio
     */
    public int calculateOrderTotal(List<CartItem> items, String discountCode) {
        // ...
    }
}
```

### Controller Spring

```java
/**
 * Endpoints de gerenciamento de usuários.
 */
@RestController
@RequestMapping("/users")
public class UserController {

    /**
     * Retorna os dados de um usuário.
     *
     * @param id UUID v4 do usuário
     * @return dados públicos do usuário
     * @throws UserNotFoundException quando o usuário não existe
     */
    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable UUID id) {
        // ...
    }
}
```

---

## Dart / Flutter — DartDoc

### Função

```dart
/// Calcula o valor total do pedido com desconto e frete aplicados.
///
/// [items] deve conter no mínimo 1 item.
/// [discountCode] é ignorado se inválido.
///
/// Retorna o valor final em centavos.
///
/// Lança [EmptyCartException] quando [items] está vazio.
int calculateOrderTotal(List<CartItem> items, {String? discountCode}) {
  // ...
}
```

### Widget

```dart
/// Card de exibição resumida de um usuário.
///
/// Usado nas listagens de [UserListPage] e [TeamPage].
class UserCard extends StatelessWidget {
  /// Usuário exibido no card.
  final User user;

  /// Chamado ao tocar no card. Se `null`, o card fica inerte.
  final VoidCallback? onTap;

  const UserCard({super.key, required this.user, this.onTap});
}
```

### Classe de domínio

```dart
/// Tarefa de um cronograma Gantt com dependências.
class GanttTask {
  /// Identificador único no cronograma.
  final String id;

  /// Verifica se a tarefa está atrasada em relação à data atual.
  bool isOverdue() => DateTime.now().isAfter(endDate);
}
```

---

## README — Estrutura mínima

```markdown
# Nome do Projeto

Uma frase descrevendo o que o sistema faz.

## Stack

- Next.js 15 / TypeScript
- Express.js / Prisma / PostgreSQL

## Requisitos

- Node.js 20+
- Docker

## Rodando localmente

\`\`\`bash
npm install
cp .env.example .env
docker compose up -d
npm run dev
\`\`\`

## Variáveis de ambiente

| Variável | Descrição | Obrigatória |
|---|---|---|
| `DATABASE_URL` | String de conexão do Postgres | Sim |
| `JWT_SECRET` | Segredo de assinatura dos tokens | Sim |

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Ambiente de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run test` | Suíte de testes |

## Documentação

- [Especificação Completa](./docs/especificacao.md)
- [Contrato de API](./docs/contrato-api.md)
- [Arquitetura](./docs/arquitetura.md)
```
