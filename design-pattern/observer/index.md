---
url: /czxBlog/design-pattern/observer/index.md
---
## 什么是观察者模式？

::: important 《设计模式：可复用面向对象软件的基础》
一个或多个观察者对目标的状态感兴趣，它们通过将自己依附在目标对象上以便注册所感兴趣的内容。
目标状态发生改变并且观察者可能对这些状态感兴趣，就会发送一个通知消息，调用每个观察者的更新方法。
当观察者不在对目标状态感兴趣时，它们可以简单地将自己从中分离。
:::

在 ==观察者模式== 中，一个对象被称为 **被观察者（Subject）** ，它维持着一系列的依赖于它（观察者）的对象，
将有关状态的任何变更自动通知给他们（观察者）。

当一个目标需要告诉观察者发生了什么事情，它会向观察者广播一个通知（可以包括与通知主题相关的特定数据）。

当我们不在希望某个特定的观察者获得其注册目标发出的改变通知时，该目标可以将它从观察者列表中删除。

## 使用 观察者模式

一个 Observer 对象通常包含三个重要组成部分：

* **observers**： 观察者数组，每当特定目标状态发生改变时，观察者会接受到通知。
* **subscribe() / unsubscribe()**： 将 `observer` 添加到 `observers` 列表，或者从 `observers` 列表中移除
* **notify()**： 用于通知所有观察者，目标状态已经发生改变的方法

在 `ES6` 中，我们可以使用 `class` 来实现：

```ts
class Observable {
  constructor() {
    this.observers = []
  }

  subscribe(observer) {
    if (!this.observers.includes(observer))
      this.observers.push(observer)
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(item => item !== observer)
  }

  notify(context) {
    this.observers.forEach(observer => observer(context))
  }
}
```

我们来通过构建一个简单的程序，以便更直观的了解观察者模式的作用。

该程序仅包含 一个按钮、一个复选框，以及点击次数记录，和 一个日志。

```html
<div id="app">
  <button id="btn" type="button">点击我！</button>
  <label for="checkbox">
    <input type="checkbox" id="checkbox" />
    <span>切换选择状态！</span>
  </label>
  <p>点击次数：<span id="count">0</span></p>
  <div id="logger">
    <h3>日志</h3>
  </div>
</div>
```

期望实现的两个功能：

1. 当用户点击按钮或者复选框时，均在日志中打印相应的信息。
2. 仅点用户点击按钮时，点击次数记录 **+1**。

我们需要将 按钮的点击事件 和 复选框的变化事件 变为可观测的对象，因此，我们需要通过事件监听的
方式，当用户进行交互时使用 `notify()` 通知观察者。

```ts
// 创建可观察对象
const observable = new Observable()

btnEl.addEventListener('click', () => {
  // 点击按钮发送通知
  observable.notify({ type: 'click', message: '点击按钮' })
})

checkboxEl.addEventListener('change', (ev) => {
  // 点击复选框发送通知
  observable.notify({ type: 'checkbox', message: `点击复选框: ${ev.target.checked}` })
})
```

日志接收通知，并打印相关信息：

```ts
const logger = new Logger()
observable.subscribe(({ type, message }) => {
  logger.log(`${type} ${message}`)
})
```

点击次数记录:

```ts
observable.subscribe(({ type }) => {
  if (type === 'click')
    countEl.textContent = Number(countEl.textContent) + 1
})
```

**完整示例：**

:::: demo normal

::: code-tabs

@tab HTML

```html
<div id="app">
  <button id="btn" type="button">点击我！</button>
  <label for="checkbox">
    <input type="checkbox" id="checkbox" />
    <span>切换选择状态！</span>
  </label>
  <p>点击次数：<span id="count">0</span></p>
  <div id="logger">
    <h3>日志</h3>
  </div>
</div>
```

@tab Typescript

```ts
const btnEl = document.getElementById('btn')
const checkboxEl = document.getElementById('checkbox')
const loggerEl = document.getElementById('logger')
const countEl = document.getElementById('count')

class Logger {
  render(type, message) {
    const line = document.createElement('p')
    line.textContent = `${getCurrentDate()} [${type}] ${message}`
    loggerEl.appendChild(line)
  }

  log(message) {
    this.render('log', message)
  }
}

class Observable {
  constructor() {
    this.observers = []
  }

  subscribe(observer) {
    if (!this.observers.includes(observer))
      this.observers.push(observer)
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(item => item !== observer)
  }

  notify(context) {
    this.observers.forEach(observer => observer(context))
  }
}

const logger = new Logger()
// 创建可观察对象
const observable = new Observable()

// 日志 观察者
observable.subscribe(({ type, message }) => {
  logger.log(`${type} ${message}`)
})

// 点击次数 观察者
observable.subscribe(({ type }) => {
  if (type === 'click')
    countEl.textContent = Number(countEl.textContent) + 1
})

btnEl.addEventListener('click', () => {
  // 点击按钮发送通知
  observable.notify({ type: 'click', message: '点击按钮' })
})

checkboxEl.addEventListener('change', (ev) => {
  // 点击复选框发送通知
  observable.notify({ type: 'checkbox', message: `点击复选框: ${ev.target.checked}` })
})

function getCurrentDate() {
  return new Intl.DateTimeFormat(
    'zh-CN',
    { hour: 'numeric', minute: 'numeric', second: 'numeric', fractionalSecondDigits: 3 },
  ).format(new Date())
}
```

::::

## 优点

使用观察者模式是实现关注点分离和单一职责原则的绝佳方式。
观察者对象与可观察对象之间不存在紧耦合，可以随时进行（解）耦。
可观察对象负责监控事件，而观察者只需处理接收到的数据。

## 缺点

* 观察者并不在乎订阅者的顺序，这可能很难保证应用程序的特定部分是按照我们期望的方式运行。
* 订阅者之间无视彼此的存在，我们很难追踪他们的依赖关系。

## 相关模式

* **发布/订阅模式**

  通常在 JavaScript 里，观察者模式通常会使用 ==Publish/Subscribe== 模式这一变体实现。

* **中介者模式**

  \==中介者模式== 本质上是观察者模式的变体，但中介者模式通过限制对象严格通过中介者进行通信来实现这一目的。
