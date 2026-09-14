# Princípios Fundamentais — SOLID, KISS, DRY, Clean Code, MVC/MVVM

> Biblioteca compartilhada `eng-standards`. Referenciável por qualquer skill:
> `${CLAUDE_PLUGIN_ROOT}/references/patterns/principios-solid.md`

**Quando ler:** antes de escrever, revisar ou refatorar qualquer código, em qualquer linguagem ou framework.

---

## 1. Os cinco pilares

| Princípio | Descrição |
|---|---|
| **SOLID** | Cada função ou classe tem sua responsabilidade e sempre pode ser integrada em outra, sem estar atrelada. Dependa de abstrações, não de implementações. |
| **KISS** | Tudo deve ser idiotamente simples. Não adianta complicar — a lógica deve ser simples de entender. |
| **DRY** | Repetição de código deve ser evitada; duplicação leva a código confuso e difícil de manter. |
| **Clean Code** | Variáveis autoexplicativas e funções enxutas que também são autoexplicativas. |
| **MVC / MVVM** | Separação clara entre dados, lógica e apresentação. Cada camada sabe apenas o que precisa. |

---

## 2. Os cinco princípios SOLID

| Sigla | Nome | Aplicação prática |
|---|---|---|
| **S**RP | Single Responsibility Principle | Uma função faz uma coisa. Se faz duas, são duas funções. |
| **O**CP | Open/Closed Principle | Aberto para extensão, fechado para modificação. Adicione comportamento sem alterar o núcleo. |
| **L**SP | Liskov Substitution Principle | Uma subclasse deve poder substituir a classe base sem quebrar o consumidor. |
| **I**SP | Interface Segregation Principle | Interfaces pequenas e específicas. Ninguém implementa método que não usa. |
| **D**IP | Dependency Inversion Principle | Dependa de abstrações. Injete dependências, não instancie dentro da classe. |

---

## 3. Como os princípios se traduzem em decisão

| Situação | Princípio que decide | Decisão |
|---|---|---|
| Função cresceu e faz duas coisas | SRP | Separe em duas funções nomeadas pelo que cada uma faz |
| Novo caso de negócio exige `if` novo no núcleo | OCP | Extraia para um map de estratégias ou polimorfismo |
| Classe filha precisa lançar erro em método herdado | LSP | A hierarquia está errada — use composição |
| Interface com métodos que metade das implementações ignora | ISP | Quebre em interfaces menores |
| Service instanciando o client do banco diretamente | DIP | Receba a dependência por injeção/parâmetro |
| Mesma regra copiada em dois arquivos | DRY | Extraia para helper ou service compartilhado |
| Abstração criada "para o futuro" sem uso real | KISS | Remova — abstraia quando o segundo caso aparecer |

---

## 4. Estratégia de crescimento

Toda estrutura é construída com potencial de crescimento e escala. Mesmo que o sistema não receba atualizações e
seja descontinuado, ele mantém a centelha de evolução e integração — sempre visando desenvolvimento futuro
organizado, simples e prático de executar.

Isso **não** autoriza complexidade antecipada: KISS vence sobre extensibilidade especulativa. Construa simples,
mas com fronteiras limpas o suficiente para crescer sem reescrita.

---

## Relacionados

- `regras-absolutas.md` — o que nunca pode ser violado
- `anti-patterns.md` — catálogo do que evitar
- `refatoracao.md` — sinais e exemplos antes/depois
