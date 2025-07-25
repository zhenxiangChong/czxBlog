---
url: /czxBlog/design-pattern/strategy/index.md
---
::: tip
策略模式在 JavaScript 中通过函数和对象的灵活性，简洁地实现了算法的动态替换。
它特别适用于需要消除条件分支、支持扩展的场景，但需权衡策略管理的复杂度。
合理使用该模式，可显著提升代码的可维护性和可读性。
:::

## 什么是策略模式？

\==Strategy(策略)模式== 是一种行为设计模式。

它允许定义一系列算法，并将每个算法封装成独立的对象，使得它们可以相互替换。
该模式的核心思想是将算法的使用与实现分离，让客户端动态选择算法，避免代码中冗长的条件判断，提高灵活性和可维护性。

## 实现策略模式

在 JavaScript 中，策略模式通常通过对象或函数实现。以下是两种典型实现方式：

### 对象字面量封装策略

将不同策略封装为对象的方法，通过键名动态调用。

```ts
const strategies = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
}

function calculate(type, a, b) {
  return strategies[type](a, b)
}

console.log(calculate('add', 5, 3)) // 8
```

### 类结合策略对象

通过上下文类管理策略，支持动态切换策略。

```ts
class PaymentContext {
  constructor(strategy) {
    this.strategy = strategy
  }

  executePayment(amount) {
    return this.strategy(amount)
  }
}

// 定义策略函数
const creditCardStrategy = amount => `支付 ${amount} 元（信用卡）`
const wechatPayStrategy = amount => `支付 ${amount} 元（微信支付）`

// 使用示例
const context = new PaymentContext(creditCardStrategy)
console.log(context.executePayment(100)) // 支付 100 元（信用卡）

context.strategy = wechatPayStrategy
console.log(context.executePayment(200)) // 支付 200 元（微信支付）
```

## 优点

* **避免条件分支**：消除大量 `if-else` 或 `switch-case` 语句。
* **开闭原则**：新增策略无需修改现有代码，只需扩展新策略。
* **高内聚低耦合**：每个策略独立封装，职责明确，易于复用和测试。
* **动态切换**：运行时灵活替换算法逻辑。

## 缺点

* **策略数量爆炸**：策略过多会增加对象或类的数量。
* **客户端需知策略细节**：使用者需要理解不同策略的差异。
* **性能开销**：简单场景可能因对象化策略引入额外开销。

## 适用场景

* **算法需动态切换**：如支付方式、数据验证规则、排序算法等。
* **替代复杂条件判断**：多个分支逻辑相似但实现不同。
* **隐藏算法细节**：隔离复杂逻辑，对外提供统一接口。
* **组合行为**：多个策略可组合使用（如复合表单验证）。
