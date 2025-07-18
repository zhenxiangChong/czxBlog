---
url: /czxBlog/article/kflidi22/index.md
---
响应式编程从提出至今，大约有几十年的历史了，它时而兴起，时而沉寂。而在前端，它在这几年来，有开始迸发出了新的活力。
特别是在当下流行的如 `vue` 、 `react`、`svelte` 和 `solid` 之类的前端框架中，响应式编程的发展迅速。

然而，它并不是那么容易理解。

* 在不同的响应式编程实现方式中，某些术语或者概念可能会有所不同，对于不同的人来说，也有不同的理解。
* 其次，它看起来像是一个魔法，虽然事实并非如此，人们在理解响应式编程是什么之前，常常会被 **“怎么做到的”** 分散注意力，从而导致理解难度的增加。这使得很难通过一些实际的例子，完全理解响应式编程。

本文不完全解释响应式编程，但是希望能够帮助你理解响应式编程。并帮助理解 `vue` 的响应式系统。

## 响应性

响应式编程，一个重要的特点是 **响应性**。

那么如何理解响应性？一种很口语化的表达是，两个物体之间存在某种关联，当其中一个发生变化时，另一个也会随之发生变化。

一个常见的例子，如我们常用的 Excel 表格：

|     | A   | B   | C   |
| --- | --- | --- | --- |
| 0   | 2   |     |     |
| 1   | 3   |     |     |
| 2   | 5   |     |     |

`A2` 单元格的值 是根据 `A0` 和 `A1` 两个单元格的值，进行求和后的结果，
通常我们会在 `A2` 的单元格上写 `=SUM(A0:A1)` 的公式。
当 `A0` 和 `A1` 两个单元格的值发生变化时，`A2` 单元格的值也会随之发生变化。

这种`A2` 与 `A0``A1`的关系，我们可以称之为 **响应性**。公式 `=SUM(A0:A1)` 则声明并建立了这种关系。

所以，**响应性** 是一种可以使我们声明式地处理变化的编程范式。

## JavaScript 中实现响应性

我们把 这个 Excel 表格 编写为 `javascript` 的逻辑：

```ts
let A0 = 2
let A1 = 3
let A2 = A0 + A1

console.log(A2) // 5

A0 = 5
console.log(A2) // 仍然是 5
```

即使`A0`的值发生了变化，但`A2`的值仍然是 5。可见在 `javascript` 中，默认并不具有 响应性 的。
那么，要如何在 javascript 中建立响应性呢？

通常在 `javascript` 的代码中，我们使用一个函数来包装计算`A2`的逻辑，
并在其他值发生改变时，调用这个函数来更新`A2`的值。

```ts
let A0 = 2
let A1 = 3
let A2

function update() {
  A2 = A0 + A1
}
console.log(A2) // 5

A0 = 5
update()
console.log(A2) // 8
```

但是，每次修改 `A0` 或 `A1` 时，都需要主动调用 `update()` 来更新`A2`的值，这显然没有 `响应性`。
需要找到一种，修改 `A0` 或 `A1` 时，自动调用 `update()` 来更新`A2`的值的方法。

通常，我们很容易就会联想到通过 `订阅者模式`，来实现这种功能。
`A2` 订阅 `A0`和`A1` 两个变量，当它们发生变化时，自动调用 `update()` 来更新`A2`的值。

```ts
// 仅表示伪代码，方便理解
A2.subscribe(A0, A1, update)
```

然而，在 `javascript` 中，要实现对 变量的变更的监听，并不那么容易。
`javascript` 并没有提供一种方式，帮助我们实现对基本数据类型的变更监听。

### 轮询检查

我们还是可以通过 **轮询检查** 来实现对变量的变更的监听。每隔一段时间，扫描`A0`和`A1`两个变量的值，如果发生了变化，就调用 `update()` 来更新`A2`的值。

```ts
let A0 = 2
let A1 = 3
let A2
let OA0 = A0
let OA1 = A1

setInterval(() => {
  if (OA0 !== A0 || OA1 !== A1) {
    A2 = A0 + A1
    console.log('A2:', A2)
  }
}, 10)

A0 = 5
// A2: 8
```

**缺陷**：

```mermaid
graph TD
    A[轮询机制] --> B[高频CPU消耗]
    A --> C[状态同步延迟]
    A --> D[无效检查浪费]
```

### 输入检查

然而定期检查 会带来不必要的开销，在稍微复杂的场景中，会导致严重的性能问题，
因此最好能够在 `A0 = 5` 时，再检查是否发生变更，自动更新`A2`的值。

```ts
let A0 = 2
let A1 = 3
let A2
function updateValue(update) {
  let OA1 = A1
  let OA0 = A0

  update()

  if (OA0 !== A0 || OA1 !== A1) {
    A2 = A0 + A1
    console.log('A2:', A2)
  }
}
updateValue(() => {
  A0 = 5
})
// A2: 8
```

这种方式的好处是，只有在 重新输入 `A0` 或 `A1` 时，才会检查变更。
但这种代码，把 检查的代码、响应变更的代码都放在一起，会导致代码的复杂度增加。
我们期望的是，将它们分开，从而降低代码的复杂度。

```ts
let A0 = 2
let A1 = 3
let A2

const { onUpdate, updateValue } = createReactive(A0, A1) // 创建响应式

// 监听变更
onUpdate(() => {
  A2 = A0 + A1
})

// 更新变量
updateValue(() => {
  A0 = 5
})
```

### 状态机

在上面的代码中，我们很容易产生一个困惑，
`A0` 和 `A1` 作为外部变量，`createReactive` 函数内部如何知道它们是否有变化呢？

答案是，确实不知道。`A0` 和 `A1` 仅是 基本数据类型，即使传入`createReactive`，
函数内部也不知道它们何时发生变化。

因此，我们需要引入 `状态机`的概念，来解决这个问题。将 `A0` 和 `A1` 、`A2` 作为状态变量，而不是基本数据类型，
托管给 状态机。

```ts
const { subscribe, setState } = createReactive({
  A0: 2,
  A1: 3,
  A2: 5,
}) // 创建响应式

// 侦听变更
subscribe((state) => {
  state.A2 = state.A0 + state.A1
})

setState((state) => {
  return { A0: 5 }
})
```

我们可以很轻松的实现 一个简单的 `createReactive`：

```ts
function createReactive(initialState) {
  let state = initialState
  const listeners = new Set()

  // 添加订阅者
  const subscribe = (callback) => {
    listeners.add(callback)
  }

  const checkUpdate = (newState, oldState) => {
    // 实际情况需要对比 state 每个 key 的值，
    return newState !== oldState
  }

  const setState = (callback) => {
    const oldState = state
    const newState = { ...state, ...callback(state) }
    if (checkUpdate(newState, oldState)) {
      listeners.forEach(callback => callback(newState))
      state = newState
    }
  }
  return { state, subscribe, setState }
}
```

当然，实际情况远比这复杂的多，但至少是可以理解的，已经初具雏形。

在 `createReactive` 的帮助下，通过 `setState()` 更新 `A0` 和 `A1` 两个状态的值时，在函数内部
检查状态变更，然后在内部调用 侦听器，实现对 `A2` 状态的响应更新。

### 响应视图更新

到这里，你或许已经想到，这好像与 `React` 类似，然后想到，那么如何使视图更新呢?

其实 视图 也是一个 订阅者，在 `React` 组件中，我们通过 `render()` 方法来定义视图：

```tsx
class Counter extends React.Component {
  state = { count: 0 }
  render() {
    return (
      <div>
        <h1>{this.state.count}</h1>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>+</button>
      </div>
    )
  }
}
```

同样的，通过 `subscribe()` 方法来添加订阅者。

```ts
subscribe((state) => {
  render()
})
```

当调用 `setState()` 更新状态时， `render()` 也会被重新调用，从而更新视图。

## Vue2 的响应式系统

在有了以上的 基础了解后，你已经对 响应式编程 有了一个 基本的认识，和 对如何实现响应式编程 有了一定的了解。

接下来，我们来看看 `vue` 的响应式系统。

在 `vue2` 中，我们 仅 需要写 `this.count += 1` 就能触发视图更新。并没有看到 如 `setState()` 这样的方法帮助我们
检查状态变更和调用侦听者。 这看起来像是一个 “魔法” 。

事实上，`vue2` 通过 `Object.defineProperty`, 把 `count` 属性改成了 `getter/setter` ,
`getter/setter` 对用户而言，是不可见的。 当我们对 `this.count += 1` 时，实际上调用的是 `setter` 方法。

```ts
Object.defineProperty(this, 'count', {
  set(val) {
    this.count = val
  },
  get() {
    return this.count
  }
})
```

这样就有机会在 `setter` 方法中，进行状态变更检查，并调用侦听器。

```ts
Object.defineProperty(this, 'count', {
  set(val) {
    const oldValue = this.count
    this.count = val
    listeners.forEach(callback => callback(val, oldValue))
  },
  get() {
    return this.count
  }
})
```
