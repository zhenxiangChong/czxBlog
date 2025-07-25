---
url: /czxBlog/design-pattern/facade/index.md
---
:::tip 当系统复杂度达到需要频繁查阅文档才能调用时，就是考虑引入外观模式的最佳时机。它如同一位优秀的翻译官，在复杂的技术细节与简洁的业务逻辑之间架起沟通的桥梁。
:::

## 什么是外观模式？

\==Facade(外观)模式== 是一种结构型设计模式，核心思想是 **为复杂的子系统提供一个简化的统一接口**。
如同建筑外墙隐藏内部结构，它通过创建一个高层接口，将底层模块的复杂性屏蔽，使客户端调用更简单直观。

## 实现外观模式

```ts
// 复杂子系统
class CPU {
  start() { console.log('启动CPU') }
}
class Memory {
  load() { console.log('加载内存') }
}

// 外观接口
class ComputerFacade {
  constructor() {
    this.cpu = new CPU()
    this.memory = new Memory()
  }

  start() {
    this.cpu.start()
    this.memory.load()
    console.log('计算机启动完成')
  }
}

// 客户端调用
const computer = new ComputerFacade()
computer.start() // 隐藏底层细节
```

**实际应用示例：浏览器事件处理**：

```ts
// 封装不同浏览器的事件处理差异
const eventFacade = {
  addListener(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false)
    }
    else if (element.attachEvent) {
      element.attachEvent(`on${type}`, handler)
    }
    else {
      element[`on${type}`] = handler
    }
  },

  removeListener(element, type, handler) {
    // 类似实现移除逻辑...
  }
}

// 统一调用方式
eventFacade.addListener(document.getElementById('btn'), 'click', handleClick)
```

## 优点

* **简化接口**：将复杂调用简化为清晰的方法
* **解耦系统**：客户端与子系统松耦合，易于维护
* **渐进式重构**：逐步替换旧代码的利器
* **安全隔离**：隐藏敏感操作，提升安全性

## 潜在局限

* **过度封装风险**：可能创建"上帝对象"
* **灵活性限制**：需要平衡简化与扩展性

## 最佳实践

* 明确外观层的职责边界
* 避免直接暴露子系统内部
* 保持外观接口的稳定性
