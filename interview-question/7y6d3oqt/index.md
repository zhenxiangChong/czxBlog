---
url: /czxBlog/interview-question/7y6d3oqt/index.md
---
::: tip 提问

1. 什么是事件循环？
2. 什么是宏任务和微任务？
3. 事件循环的执行步骤？

:::

参阅 [Event Loop 浏览器端的事件循环](/article/browser-event-loop)

## 什么是 Event-Loop ？

Event-Loop 是一个执行模型，在 [html5规范](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops) 中进行了浏览器端的 Event-Loop 的明确定义。

## 宏任务与微任务

javascript 有两种异步任务，分别是`宏任务`和`微任务`

### 宏任务

宏任务，`macro task`，也叫 `tasks`，一些异步任务的回调会依次进入 `macro task queue`，等待后续被调用。

这些异步任务包括：

* setTimeout
* setInterval
* setImmediate (Node独有)
* requestAnimationFrame (浏览器独有)
* I/O
* UI rendering

### 微任务

微任务， `micro task`, 也叫 `jobs`，另一些异步任务的回调会依次进入`micro task queue`，等待后续被调用。

这些异步任务包括：

* process.nextTick(Node独有)
* Promise
* Object.observe
* MutationObserver

## 事件循环 Event Loop

1. 执行全局 `script` 代码，这些代码有一些是同步语句，有一些是异步语句（如： setTimeout）；
2. 全局`script`同步代码执行完毕后，调用栈Stack会清空；
3. 从微任务`micro task queue` 中取出位于队首的任务，放入调用栈Stack中执行，执行完后`micro task queue`长度减一；
4. 继续取出微任务`micro task queue`位于队首的任务，放入调用栈Stack中执行，
   以此类推，直到把`micro task queue`中的所有任务都执行完毕。**注意，如果在执行micro task的过程中，产生了`micro task`那么会加入到队列的末尾，也会在这个周期被调用执行**；
5. `micro task`中的所有无人都执行完毕，此时 `micro task queue` 为空队列，调用栈Stack也为空；
6. 取出宏队列 `macro task queue` 中位于队首的任务，放入Stack中执行；
7. 执行完毕后，调用栈Stack为空；
8. 重复第3-7个步骤；
9. 以此继续循环重复；

::: important 重点

1. 宏任务`marco task` 一次只从队列中取出一个任务执行，执行后就去执行微任务队列中的任务；
2. 微任务队列中所有的任务都会依次取出来执行，直到`micro task queue`为空，
   且当前微任务执行过程中产生新的`micro task`，也会加入到当前`micro task queue`;
3. `UI Rendering`由浏览器自定判断决定执行节点。但是只要执行`UI Rendering`，它的节点是在执行完所有
   `micro task`之后，下一个`macro task`之前，紧跟着执行`UI Rendering`

:::
