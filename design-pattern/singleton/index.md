---
url: /czxBlog/design-pattern/singleton/index.md
---
\==Singleton(单例模式)== 是前端领域中最被熟知的模式之一。

## 什么是单例模式？

\==单例模式== 限制了 **类** 的实例化次数只能一次。

从经典意义上来说，单例模式，在该实例不存在时，可以通过一个方法创建一个类来实现创建类的新示例；
如果实例已经存在，它会简单返回该对象的引用。

* **单例** 不同于静态类（或对象），因为可以推迟它的初始化。
* **单例** 可以实现为全局共享的实例，因此它特别适合管理应用中的全局状态。

## 实现单例模式

在 JavaScript 中，实现单例模式的方法有很多, 比如，
实现一个 `Counter` 单例，拥有如下方法：

* `getInstance()`：返回当前实例。
* `getCount()`：返回当前计数器的值。
* `increment()`：增加计数器的值。
* `decrement()`：减少计数器的值。

::: code-tabs#singleton

@tab namespace

```ts
const Counter = (function () {
  let instance // 保存实例

  function init() {
    // 私有变量
    let count = 0
    // 返回公共方法
    return {
      getCount() {
        return count
      },
      increment() {
        count++
      },
      decrement() {
        count--
      },
    }
  }

  return {
    getInstance() {
      // 仅在第一次调用时创建实例
      if (!instance) {
        instance = init()
      }
      return instance
    }
  }
})()

const counter = Counter.getInstance()
```

@tab class

```ts
class Counter {
  private static instance

  private count = 0

  static getInstance() {
    if (!Counter.instance) {
      Counter.instance = new Counter()
    }
    return Counter.instance
  }

  getCount() {
    return this.count
  }

  increment() {
    this.count++
  }

  decrement() {
    this.count--
  }
}

const counter = Counter.getInstance()
```

:::

在上述的实现中，我们通过调用 `Counter.getInstance()` 方法来获取 `Counter` 的实例，
而不是直接创建一个 `Counter` 的实例，这样确保了 `Counter` 只会被实例化一次。

同时，我们也看到， `Counter` 被延迟到了 `getInstance()` 方法被调用时才进行实例化。

**为什么这样做？**

一方面，通过延迟实例化，可以使得**直到我们需要使用实例前，不会产生额外的资源和内存开销**。

另一方面，我们可以有机会在 `getInstance()` 方法中，添加一些额外的逻辑。试想一个场景，我们需要
根据一些外部环境信息，来决定 如何实例化 `Counter`，以适配不同环境的需求。

::: code-tabs#singleton

@tab namespace

```ts
const Counter = (function () {
  let instance // 保存实例

  function baseInit() {
    // do something
    return {}
  }

  function fooInit() {
    return {
      ...baseInit(),
      // do something
    }
  }

  function barInit() {
    return {
      ...baseInit(),
      // do something
    }
  }

  return {
    getInstance() {
      if (!instance) {
        // some conditions
        if (isEnvFoo()) {
          instance = fooInit()
        }
        else {
          instance = barInit()
        }
      }
      return instance
    }
  }
})()

const counter = Counter.getInstance()
```

@tab class

```ts
class Counter {
  private static instance
  static getInstance() {
    if (!Counter.instance) {
      // some conditions
      if (isEnvFoo()) {
        Counter.instance = new FooCounter()
      }
      else {
        Counter.instance = new BarCounter()
      }
    }
    return Counter.instance
  }
  // do something
}

class FooCounter extends Counter {
  // do something
}

class BarCounter extends Counter {
  // do something
}

const counter = Counter.getInstance()
```

:::

在这里，`getInstance()` 变得有些像 **Factory(工厂)**，当访问它时，我们不需要更新代码中的每个访问节点。

## 权衡利弊

\==Singleton(单例)== 很有使用价值。但是，当我们发现在项目中需要它时，则表示我们可能需要重新评估我们的设计。
因为 **Singleton(单例)** 被认为是一个`anti-pattern` （反模式）。

**单例** 的存在往往表明系统中的模块要么是系统紧密耦合的，要么是其逻辑过于分散在代码库的多个部分。
由于一系列的问题：从隐藏的依赖到创建多个实例的难度、底层依赖的难度等等，**单例** 的测试会更加困难。

### 使用常规对象

事实上，在 `ESM` 的 模块化系统中，可以直接使用常规对象，然后通过 `export` 将它暴露出去。

```ts
let count = 0

const counter = {
  getCount() {
    return count
  },
  increment() {
    count++
  },
  decrement() {
    count--
  },
}

export { counter }
```

由于 对象是按引用传递的，因此从 `ESM` 的其他模块中导入的是 `counter` 对象的同一个引用，
任意地改变 `counter` 对象的值，都会对其他模块产生影响。

### 测试

测试依赖单例模式的代码可能会变得棘手。
由于我们无法每次都创建新实例，所有测试都依赖于对前一个测试全局实例的修改。
在这种情况下，测试顺序至关重要，一个小小的改动就可能导致整个测试套件失败。
测试完成后，我们需要重置整个实例以清除测试所做的修改。

### 全局访问

**Singleton(单例)** 通常意味着我们可以在整个应用中访问它，因此可能需要将它放到全局变量中。

但通常来说，全局变量通常被认为是一个糟糕的做法，因为它会导致全局命名空间的污染，可能会导致很多意外的行为。

::: info
在 `ES2015` 中，创建全局变量并不常见，新的 `let` 和 `const` 声明块级作用域，这些变量只会在块级作用域中可见，
从而避免意外的全局变量污染。而模块化开发，使得创建的变量在模块级作用域，通过 `export` 导入，其它模块通过 `import` 访问。
:::

然而，单例模式的常见用途是在整个应用程序中维护某种全局状态。让代码库的多个部分依赖同一个可变对象，可能会导致不可预期的行为。

通常，代码库中的某些部分会修改全局状态中的值，而其他部分则负责使用这些数据。此处的执行顺序至关重要：我们不希望在没有数据可供使用（尚未存在）时，意外地先消费数据！随着应用程序规模扩大，当数十个组件相互依赖时，理解使用全局状态时的数据流会变得极其复杂。
