---
url: /czxBlog/article/6itrx1jz/index.md
---
**异步传染性** 是指，当一个函数使用了 `async / await`，其调用者也需要使用 `async / await` 处理异步操作，
这导致了与之相关的整个调用链，都变成了异步的。这种情况可能导致代码变得复杂，不易于维护。

## 概述

在之前的某一个面试中， 恰好遇到了这么一个问题：

> \[!note]
> 我个人是很反感这种类型的面试的，它只会变成面试中的八股文，让人去背答案，
> 但却在大多数的开发场景中，都不会这么去做，甚至于，这道题目本身的答案，可能
> 还会列在开发规范的禁止规则中，以至于无法通过 code-review。
>
> 这道题目虽然可以利用 JavaScript 本身的特性解决，但大多数时候，谁会去这么写代码呢？
> 我是不支持这样去滥用语言特性的，也许你在做一个基础建设时，搭建某些库或框架，不得不去
> 这么做，那么我是支持的，但是，大多数的业务开发，这么写就是在给其他人埋坑。

消除下面代码中的异步传染性， 通过同步调用 打印 正确的结果。

```ts
async function getData() {
  return fetch('/api/data').then(res => res.json())
}

async function foo() {
  // other work
  return await getData()
}

async function bar() {
  // other work
  return await foo()
}

async function main() {
  // other work
  const data = await bar()

  console.log(data)
}

main()
```

期望的结果是：

```ts
function main() {
  // other work
  const data = bar()

  console.log(data) // 打印正确的结果
}
```

这道题目乍一看， `data` 的源头是从 `getData()` 中，调用 服务接口获取的，需要等待 服务器响应后才能
获取数据，那又怎么做到 同步执行获取结果呢？

## 解决方案

在代码中，可以看到，最初的异步是从 `getData()` 函数中的 `fetch()` 发起的，想要解决这个问题，就需要
从这里开始下手。

试想一下，`fetch()` 获取数据结果必然是需要等待时间的，除非它立即抛出了错误:

```ts
async function getData() {
  const res = fetch('/api/data').then(res => res.json())
  throw new Error('error')
  return res // 演示用，实际情况代码不会这么写，因为这里永远不执行
}
```

此时，如果我们不手动捕获该错误，则会导致程序中断。但是可以看到，抛出错误是 立即执行的，符合 同步执行的要求。

那么我们可以沿着这个思路，继续尝试。

我们可以通过 `try {} catch {}` 手动捕获这个错误，然后继续执行其他的代码。但是，应该捕获什么样的错误，才是
我们想要的呢？ 如果仅仅是抛出一个 普通的 请求错误，或者是 执行时错误，这对于 我们的问题 没有任何的用处，
因为它们不能告诉我们 数据准备好了。

那么，谁能告诉我们 数据准备好了？ 还是 只有 `fetch()` 返回给我们的 `Promise` 才能告诉我们数据准备好了。
既然如此，那么我们就直接将 这个 `Promise` 作为 错误抛出，然后再重新捕获它不就好了吗？

```ts
async function getData() {
  const res = fetch('/api/data').then(res => res.json())
  throw res
  return res // 演示用，实际情况代码不会这么写，因为这里永远不执行
}

function main() {
  // other work
  try {
    const data = getData()
    console.log(data)
  }
  catch (err) {
    if (err instanceof Promise) {
      // do something
    }
  }
}
```

接着，我们可以在 `catch` 块中， 检查 `Promise` 是不是有返回结果。这样我们就可以知道 数据是否准备好了。

但是，知道数据准备好了，然后呢？`main()` 方法已经执行完毕了， `console.log(data)` 并没有被执行到。
由此产生了下面的问题：

* 如何让 `console.log(data)` 执行?
* 数据准备好又该从哪里去拿？

重新执行必然需要重新调用 `main()` 函数，但是 重新调用 `main()` 函数，又必然重新抛出错误。
因此，还需要 让 `getData()` 知道什么时候该抛出错误，什么时候不需要抛出错误。

我们可以 增加一个 缓存机制， 当 `Promise` 状态从 `pending` 变更后，将结果 缓存起来。
然后在 `getData()` 中，判断 是否有 缓存，有缓存就直接返回 缓存结果。
当然还有最重要的一步， 将 `Promise` 状态从 `pending` 变更后，需要重新调用一次 `main()` 函数。

```ts
// 缓存数据
let cache = null

function getData() {
  // 发现有缓存立即返回 缓存数据
  if (cache) {
    if (cache.status === 'fulfilled') {
      return cache.data
    }
    else {
      throw new Error(cache.reason)
    }
  }
  const res = fetch('/api/data').then(res => res.json())
  throw res
}

function main() {
  // other work
  try {
    const data = getData()
    console.log(data)
  }
  catch (err) {
    // 捕获 `getData`抛出的错误， 判断 err 是不是 `Promise`
    if (err instanceof Promise) {
      // 对结果进行缓存
      err
        .then(
          (data) => {
            cache = {
              status: 'fulfilled',
              data,
            }
          },
          (reason) => {
            cache = {
              status: 'rejected',
              reason,
            }
          },
        )
        // 重新调用 `main()`
        .finally(() => main())
    }
  }
}
```

::: note
这不能作为最终答案，因为它对 `getData()` 和 `main()` 做了太多的改动。
实际上的答案应该将这部分改写的逻辑封装到一个单独的函数中。

这里就不给出实现代码的示例了，不妨自己尝试一下？
:::

将 `fetch` 部分 替换为一个 假数据接口来进行测试：

```ts
function sleep(num, func) {
  return new Promise((resolve) => {
    setTimeout(() => {
      func?.()
      resolve()
    }, num || 0)
  })
}

async function mockData() {
  await sleep(100)
  return { a: 1 }
}

// 缓存数据
let cache = null

function getData() {
  // 发现有缓存立即返回 缓存数据
  if (cache) {
    if (cache.status === 'fulfilled') {
      return cache.data
    }
    else {
      throw new Error(cache.reason)
    }
  }
  const res = mockData()
  throw res
}

function main() {
  // other work
  try {
    const data = getData()
    console.log(data)
  }
  catch (err) {
    // 判断 错误是不是 `Promise`
    if (err instanceof Promise) {
      // 对结果进行缓存
      err
        .then(
          (data) => {
            cache = {
              status: 'fulfilled',
              data,
            }
          },
          (reason) => {
            cache = {
              status: 'rejected',
              reason,
            }
          },
        )
        // 重新调用 `main()`
        .finally(main)
    }
  }
}

main()
```

> \[!tip]
> 你可以直接复制这段代码到 浏览器的控制台中直接运行，看看结果。

::: code-tabs
@tab Console

```txt
{ a: 1 }
```

:::

## 总结

从代码角度分析，实现的同步执行获取结果的过程中，利用的是 抛出错误会阻断后续代码的执行，
然后捕获错误，在 `catch` 中 等待 异步结果并缓存，最后再重新调用 `main()` 函数，直接返回 缓存结果。

实现了 看似同步执行的结果。实际上， `main()` 函数执行了两次，这就产生了副作用。

如果 `main()` 函数内容 在 `getData()` 调用之前的代码中， 包含了会影响外部作用域的代码，
那么两次执行 `main()` 就可能产生意想不到的影响。

于是，这就又要求了 在 `main()` 的整个调用链上的函数，应该都是 纯函数，不应该有副作用。
