# POO — Quando e Como Usar

> Biblioteca compartilhada `eng-standards`. Referenciável por qualquer skill:
> `${CLAUDE_PLUGIN_ROOT}/references/patterns/poo.md`

**Quando ler:** ao decidir entre função pura e classe, ou ao modelar uma entidade com comportamento próprio.

---

## 1. Regra de decisão

**Funções simples e puras são o padrão.** Use POO quando a lógica for complexa, stateful ou representar
uma entidade com comportamentos encapsulados.

| Gatilho para POO | Exemplo real |
|---|---|
| Lógica complexa com múltiplos estados | Gantt, editor de texto, motor de regras |
| Entidade com comportamento próprio | `Order`, `PaymentProcessor`, `Invoice` |
| Precisa ser extensível sem modificar o núcleo (OCP) | Integrações de gateway de pagamento |
| Invariante que precisa ser garantida na construção | `DateRange` que valida início < fim |

| Gatilho para função pura | Exemplo |
|---|---|
| Transformação sem estado | `formatCurrency`, `toPublicUser` |
| Validação isolada | `validateCpf` |
| Cálculo determinístico | `calculateWorkdays` |

---

## 2. Exemplo — lógica de Gantt com POO

```ts
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

---

## 3. Regras ao usar classes

- **Campos privados por padrão.** Exponha só o que o consumidor precisa (ISP).
- **Construtor valida invariantes.** Objeto inválido não deve existir.
- **Dependências entram pelo construtor**, nunca são instanciadas dentro da classe (DIP).
- **Sem classe "de serviço" só para agrupar funções soltas** — isso é um módulo, não uma classe.
- **Sem herança profunda.** Mais de um nível, prefira composição.
- **Métodos seguem as mesmas regras de função**: um propósito, nome verbo + substantivo.

---

## 4. Anti-uso comum

```ts
// ❌ Classe que é só um namespace com métodos estáticos
class DateUtils {
  static format(d: Date) { /* ... */ }
  static addDays(d: Date, n: number) { /* ... */ }
}

// ✅ Módulo de helpers por domínio
// shared/helpers/date.helper.ts
export function formatDate(date: Date): string { /* ... */ }
export function addDays(date: Date, days: number): Date { /* ... */ }
```

---

## Relacionados

- `principios-solid.md` — SRP, OCP, LSP, ISP, DIP aplicados
- `nomenclatura.md` — nomes de classes e métodos
- `anti-patterns.md` — `utils.ts` genérico
