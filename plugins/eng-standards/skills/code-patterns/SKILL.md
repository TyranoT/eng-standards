---
name: code-patterns
description: >
  Princípios, patterns e anti-patterns em código. Skill filha de code-standards. Use ao escrever, revisar ou
  refatorar qualquer código em qualquer linguagem — React, Next.js, Angular, Flutter, Node.js, NestJS, Express,
  FastAPI, Python, Java, Spring. Cobre SOLID, KISS, DRY, Clean Code, MVC/MVVM, nomenclatura, uso de POO, regras
  absolutas (sem IIFE em JSX, sem funções multi-propósito, sem comentário inline), anti-patterns e gatilhos de
  refatoração. Gatilhos: "refatora isso", "revisa esse código", "melhora essa função", "escreve o código de X",
  "esse componente tá grande", "como nomear isso", "aplica SOLID".
---

# Code Patterns — Princípios e Patterns em Código

> Estas regras valem para **qualquer** linguagem ou framework. Leia antes de gerar ou refatorar código.

---

## 1. Princípios Fundamentais

| Princípio | Descrição |
|---|---|
| **SOLID** | Cada função ou classe tem sua responsabilidade e sempre pode ser integrada em outra, sem estar atrelada. Dependa de abstrações, não de implementações. |
| **KISS** | Tudo deve ser idiotamente simples. Não adianta complicar — a lógica deve ser simples de entender. |
| **DRY** | Repetição de código deve ser evitada; duplicação leva a código confuso e difícil de manter. |
| **Clean Code** | Variáveis autoexplicativas e funções enxutas que também são autoexplicativas. |
| **MVC / MVVM** | Separação clara entre dados, lógica e apresentação. Cada camada sabe apenas o que precisa. |

### Os cinco princípios SOLID

| Sigla | Nome | Aplicação prática |
|---|---|---|
| **S**RP | Single Responsibility Principle | Uma função faz uma coisa. Se faz duas, são duas funções. |
| **O**CP | Open/Closed Principle | Aberto para extensão, fechado para modificação. Adicione comportamento sem alterar o núcleo. |
| **L**SP | Liskov Substitution Principle | Uma subclasse deve poder substituir a classe base sem quebrar o consumidor. |
| **I**SP | Interface Segregation Principle | Interfaces pequenas e específicas. Ninguém implementa método que não usa. |
| **D**IP | Dependency Inversion Principle | Dependa de abstrações. Injete dependências, não instancie dentro da classe. |

---

## 2. Regras Absolutas (nunca viole)

### ❌ Sem IIFEs em JSX/TSX

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

### ❌ Sem funções complexas e multi-propósito

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

### ❌ Sem comentários inline explicando "o que fez"

O código deve ser autoexplicativo pela nomenclatura. Documentação vai no contrato da função —
ver skill `/eng-standards:code-docs`.

---

## 3. Nomenclatura

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

## 4. POO — Quando e Como Usar

Use POO quando a lógica for complexa, stateful ou representar uma entidade com comportamentos encapsulados.

**Gatilhos:**
- Lógica complexa com múltiplos estados (Gantt, editor, motor de regras)
- Entidades com comportamento próprio (`Order`, `PaymentProcessor`)
- Lógica que precisa ser extensível sem modificar o núcleo (OCP)

```ts
// ✅ Lógica de Gantt com POO
class GanttTask {
  constructor(
    private readonly id: string,
    private startDate: Date,
    private endDate: Date,
    private dependencies: string[] = []
  ) {}

  /** Verifica se a tarefa está atrasada em relação à data atual. */
  isOverdue(): boolean {
    return new Date() > this.endDate;
  }

  /** Calcula a duração em dias úteis. */
  getDurationInWorkdays(): number {
    return calculateWorkdays(this.startDate, this.endDate);
  }
}
```

**Funções simples e puras** continuam sendo a escolha padrão fora desses casos.

---

## 5. Anti-Patterns — Nunca Faça

| ❌ Anti-pattern | ✅ Alternativa |
|---|---|
| IIFE em JSX/TSX | Função nomeada ou componente |
| Função que faz A, B e C | Três funções: `doA()`, `doB()`, `doC()` |
| Comentário explicando o que o código faz | Renomeie a função/variável para ser clara |
| `utils.ts` com 30 funções não relacionadas | Separe por domínio: `date.helper.ts`, `currency.helper.ts` |
| Hook gigante `usePageLogic()` | Um hook por responsabilidade |
| Componente com lógica de API + UI + estado | Hook (lógica) + componente (UI) |
| Nesting profundo (4+ níveis) | Guard clauses e early returns |
| Magic numbers | Constante nomeada em `constants/` |
| Arquivo de 500+ linhas | Quebre em módulos menores |
| Controller com regra de negócio | Mova para o service |
| Service acessando o ORM direto | Passe pelo repository |
| `any` em TypeScript | Tipo específico, `unknown` + narrowing, ou generic |

---

## 6. Refatoração — Quando e Como

| Sinal | Ação |
|---|---|
| Lógica duplicada em 2+ lugares | Extraia para helper/hook |
| Componente com 100+ linhas | Quebre em sub-componentes |
| Função com 3+ responsabilidades | Separe em funções únicas |
| JSX com lógica condicional complexa | Extraia para componente ou função |
| Classe com muitos métodos não relacionados | Aplique SRP, separe em classes |
| Arquivo com 200+ linhas | Avalie separação por responsabilidade |
| Mesma prop passada por 3+ níveis | Context ou store global |
| Condicional com 4+ ramos | Map de estratégias ou polimorfismo |

**Refatoração é parte do trabalho, não opcional.** Ao encontrar código duplicado ou funções grandes,
refatore sem precisar ser pedido.

Exemplos antes/depois: `references/refactoring-patterns.md`

---

## Checklist antes de entregar código

- [ ] Nenhuma IIFE em JSX/TSX
- [ ] Cada função tem propósito único e nome claro
- [ ] Sem comentários inline explicando "o que fez"
- [ ] Código duplicado foi extraído
- [ ] Nomes de variáveis, funções e arquivos são autoexplicativos
- [ ] POO aplicado onde a lógica é complexa/stateful
- [ ] Nenhum `any` sem justificativa
- [ ] Guard clauses no lugar de nesting profundo
- [ ] Magic numbers viraram constantes nomeadas
- [ ] SOLID, KISS, DRY e Clean Code respeitados

---

## Referências

- `references/refactoring-patterns.md` — Exemplos antes/depois de refatorações comuns
