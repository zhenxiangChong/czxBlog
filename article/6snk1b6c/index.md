---
url: /czxBlog/article/6snk1b6c/index.md
---
关于 执行上下文，请点击查看[这篇文章](/article/d12xkizf/)。

## 执行上下文栈

`JavaScript` 引擎 创建了 执行上下文栈 来存储并管理 代码执行时创建的所有 执行上下文。

执行上下文栈（Execution context stack，ECS） 是一个种拥有 LIFO(后进先出) 的栈。

我们使用一个数组 模拟 执行上下文栈:

```js
const ECSStack = []
```

当 `JavaScript` 执行时，首先遇到的是 全局代码，初始化时，会首先向 执行上下文栈中压入 全局执行上下文
（global execution context)。它只有在整个程序结束时，才会被清空，所以在程序结束前， `ECSStack` 底部
都会有一个 `globalExecutionContext`

```js
const ECSStack = [globalExecutionContext]
```

当 `JavaScript` 开始执行以下代码时：

```js
function foo() {
  console.log('foo')
}
function bar() {
  foo()
}
function run() {
  bar()
}

run()
```

在这段代码中，`JavaScript` 进行以下处理：

```ts
// 伪代码：

// run()， 创建 函数执行上下文，并压入 执行上下文栈
ECSStack.push(functionExecutionContext<run>)

// run() 中发现需要执行 bar(), 继续创建 函数执行上下文，并压入执行上下文栈
ECSStack.push(functionExecutionContext<bar>)

// bar() 中发现需要执行 foo(), 继续创建 函数执行上下文，并压入执行上下文栈
ECSStack.push(functionExecutionContext<foo>)

/**
 * 此时， ECSStack 的结构，如下：
 * [
 *    globalExecutionContext,
 *    functionExecutionContext<run>,
 *    functionExecutionContext<bar>,
 *    functionExecutionContext<foo>
 * ]
 */

// 当 foo() 执行完毕，从执行上下文栈中移除 functionExecutionContext<foo>
ECSStack.pop()

// 当 bar() 执行完毕，从执行上下文栈中移除 functionExecutionContext<bar>
ECSStack.pop()

// 当 run() 执行完毕，从执行上下文栈中移除 functionExecutionContext<run>
ECSStack.pop()

// 在程序未结束时， ECSStack 底部永远有一个 globalExecutionContext
```

再看下一个例子：

```js
let scope = 'global scope'
function checkScope() {
  let scope = 'local scope'
  function f() {
    return scope
  }
  return f()
}
checkScope()
```

```js
let scope = 'global scope'
function checkScope() {
  let scope = 'local scope'
  function f() {
    return scope
  }
  return f
}
checkScope()()
```

这两段代码，虽然在执行结果是一样的，都是输出 `local scope`， 但是在 执行上下文栈 中的变化不同。

第一段代码， 在 执行上下文栈，模拟处理如下：

```ts
// 执行checkScope()
ECSStack.push(functionExecutionContext<checkScope>)
// 在checkScope执行阶段中执行 f()
ECSStack.push(functionExecutionContext<f>)

ECSStack.pop()
ECSStack.pop()
```

第二段代码， 在执行上下文栈，模拟处理如下：

```ts
// 执行checkScope()
ECSStack.push(functionExecutionContext<checkScope>)
ECSStack.pop()
// 在checkScope 完成后，再执行 f()
ECSStack.push(functionExecutionContext<f>)
ECSStack.pop()
```

可以看出， 函数执行的时机不同，虽然最终结果一致，但是在 执行上下文栈 中的过程是不同的。

## 总结

1. 执行上下文栈，是用于存储和管理所有执行上下文。
2. 在程序没有结束前，执行栈中永远有一个全局执行上下文。
3. 函数执行时，会创建一个新的函数执行上下文，并按顺序压入到执行栈中。
4. 函数执行完成后，对应的函数执行上下文会从执行栈中移除。
