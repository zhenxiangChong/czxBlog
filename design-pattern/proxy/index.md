---
url: /czxBlog/design-pattern/proxy/index.md
---
## 什么是代理模式？

\==Proxy(代理)模式== 是一种结构型设计模式。

通过创建一个代理对象来控制对另一个对象的访问。
在 JavaScript 中，ES6 的 `Proxy` 对象是代理模式的典型实现，允许你拦截并自定义对象的基本操作（如属性读取、赋值、函数调用等）。

## 实现代理模式

JavaScript 通过 `Proxy` 构造函数实现代理模式，其核心是定义一个 handler 对象，在 handler 对象中，
我们可以根据交互类型定义特定行为。
尽管可以向 Proxy 处理程序添加许多方法，但最常见的两种方法是 `get` 和 `set`

```ts
const target = { name: 'Alice' }

const handler = {
  get(target, prop) {
    console.log(`读取属性 ${prop}`)
    return target[prop] || '属性不存在'
  },
  set(target, prop, value) {
    if (prop === 'age' && value < 0) {
      throw new Error('年龄不能为负数')
    }
    target[prop] = value
    return true // 表示设置成功
  }
}

const proxy = new Proxy(target, handler)

console.log(proxy.name) // 输出: 读取属性 name → Alice
proxy.age = 25 // 正常设置
proxy.age = -5 // 抛出错误: 年龄不能为负数
```

JavaScript提供了一个名为 `Reflect` 的内置对象，它让我们在使用代理时能更方便地操作目标对象。

此前，我们尝试通过在代理中直接使用方括号取值或赋值来修改和访问目标对象的属性。
现在，我们使用 `Reflect` 对象来实现。`Reflect` 对象上的方法与 `handler` 对象上的方法具有相同的名称。

```ts
const handler = {
  get(target, prop) {
    console.log(`读取属性 ${prop}`)
    return Reflect.get(target, prop) || '属性不存在'
  },
  set(target, prop, value) {
    if (prop === 'age' && value < 0) {
      throw new Error('年龄不能为负数')
    }
    Reflect.set(target, prop, value)
    return true // 表示设置成功
  }
}
```

## 优点

* **控制访问**：限制或增强对目标对象的操作（如权限验证、数据校验）。
* **职责分离**：代理对象与目标对象各司其职，符合单一职责原则。
* **延迟初始化（虚拟代理）**：仅在需要时创建开销大的对象。
* **缓存优化**：减少重复计算或网络请求。
* **透明性**：客户端无需感知代理存在，目标对象接口不变。

## 缺点

* **性能开销**：代理的拦截操作会增加调用栈深度，高频操作中可能影响性能。
* **复杂度**：复杂代理逻辑可能使代码难以维护。
* **调试困难**：错误堆栈可能指向代理而非原始对象。
