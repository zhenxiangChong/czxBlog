---
url: /czxBlog/design-pattern/decorator/index.md
---
## 什么是装饰者模式？

\==Decorator(装饰者)模式== 是一种结构型设计模式。

它允许动态地为对象添加额外的职责，而无需修改其原有代码。
它通过将对象包装在装饰者类中，以透明的方式扩展功能，避免了静态继承带来的类爆炸问题，
符合开闭原则（对扩展开放，对修改关闭）。

## 实现装饰者模式

在 JavaScript 中，装饰者模式可以通过以下方式实现：

### 函数装饰（高阶函数）

通过高阶函数包装原函数，添加新功能：

```ts
function logDecorator(func) {
  return function (...args) {
    console.log('Function called:', func.name)
    const result = func.apply(this, args)
    console.log('Result:', result)
    return result
  }
}

// 使用
const add = (a, b) => a + b
const decoratedAdd = logDecorator(add)
decoratedAdd(2, 3) // 输出日志并计算结果
```

### 对象方法装饰

替换对象的方法以实现增强功能：

```ts
function decorateMethod(obj, methodName, decorator) {
  const originalMethod = obj[methodName]
  obj[methodName] = function (...args) {
    console.log('Method execution started')
    const result = originalMethod.apply(this, args)
    console.log('Method execution ended')
    return result
  }
}

// 使用
const calculator = { add: (a, b) => a + b }
decorateMethod(calculator, 'add', original => original)
calculator.add(1, 2) // 输出执行日志
```

### 类装饰（基于组合）

通过装饰类包裹原对象，扩展其方法：

```ts
class Coffee {
  cost() { return 5 }
}

class MilkDecorator {
  constructor(coffee) {
    this.coffee = coffee
  }

  cost() { return this.coffee.cost() + 2 }
}

class SugarDecorator {
  constructor(coffee) {
    this.coffee = coffee
  }

  cost() { return this.coffee.cost() + 1 }
}

// 使用
let coffee = new Coffee()
coffee = new MilkDecorator(coffee)
coffee = new SugarDecorator(coffee)
console.log(coffee.cost()) // 输出：8
```

### ES7/TypeScript 装饰器语法

利用 `@decorator` 语法糖简化实现（需 Babel 或 TypeScript 支持）：

```ts
function log(target, key, descriptor) {
  const originalMethod = descriptor.value
  descriptor.value = function (...args) {
    console.log(`Calling ${key} with args:`, args)
    return originalMethod.apply(this, args)
  }
  return descriptor
}

class Example {
  @log
  add(a, b) { return a + b }
}
```

## 优点

* **动态扩展**：运行时添加或移除功能，灵活性强。
* **单一职责**：每个装饰类只关注一个功能，代码更清晰。
* **替代继承**：避免多层继承导致的类膨胀问题。
* **开闭原则**：无需修改原有代码即可扩展功能。

## 缺点

* **复杂度增加**：多层装饰可能导致代码结构复杂，调试困难。
* **性能开销**：装饰链较长时，可能影响执行效率。
* **依赖管理**：装饰者需要与原对象保持接口一致，否则可能破坏调用逻辑。

## 适用场景

* **动态功能扩展**：如为对象添加日志、缓存、权限检查等。
* **不可修改的第三方库**：在不修改源码的情况下增强功能。
* **组合替代继承**：需要多维度扩展对象功能时。
* **中间件机制**：如 Express 的中间件、Redux 的 enhancer。
