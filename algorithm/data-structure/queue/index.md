---
url: /czxBlog/algorithm/data-structure/queue/index.md
---
## 概述

\==队列（Queue）== 是一种 先进先出（FIFO: First-In-First-Out） 的线性数据结构，类似于现实生活中的排队场景。

在队列中，元素从一端（队尾）添加，从另一端（队首）移除。

:::center
![stack](/images/algorithm/queue.svg)
:::

::: tip 提示
当我们在排队买票时，排在队首的人先买票，然后离开队伍。
新来的人需要排到队伍尾部，等待前面的人买完票再轮到他。
:::

## 核心特性

* **操作受限**：只允许在两端操作
* **先进先出**：最早入队的元素最先出队
* **动态大小**：长度随操作变化（非固定容量）

## 时间复杂度

| 操作        | 描述                   | TypeScript 实现示例         |
|-------------|------------------------|----------------------------|
| `enqueue()` | 元素入队（添加到队尾） | `queue.push(item)`         |
| `dequeue()` | 元素出队（移除队首元素）| `queue.shift()`            |
| `peek()`    | 查看队首元素（不移除） | `queue[0]`                 |
| `isEmpty()` | 检查队列是否为空       | `queue.length === 0`       |
| `size()`    | 获取队列长度           | `queue.length`             |

## 队列的实现

### 数组实现

**注意**：`shift()` 操作需要移动所有元素（时间复杂度 O(n)）

```ts
class ArrayQueue<T> {
  private items: T[] = []

  enqueue(item: T): void {
    this.items.push(item)
  }

  dequeue(): T | undefined {
    return this.items.shift()
  }

  peek(): T | undefined {
    return this.items[0]
  }

  get size(): number {
    return this.items.length
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }

  clear(): void {
    this.items = []
  }
}
```

### 链表实现

所有操作时间复杂度均为 O(1)

```ts
class QueueNode<T> {
  constructor(
    public value: T,
    public next: QueueNode<T> | null = null
  ) {}
}

class LinkedListQueue<T> {
  private front: QueueNode<T> | null = null
  private rear: QueueNode<T> | null = null
  private _size = 0

  enqueue(item: T): void {
    const newNode = new QueueNode(item)
    if (this.isEmpty()) {
      this.front = newNode
    }
    else {
      this.rear!.next = newNode
    }
    this.rear = newNode
    this._size++
  }

  dequeue(): T | undefined {
    if (this.isEmpty())
      return undefined

    const removed = this.front!
    this.front = this.front!.next
    this._size--

    if (this.isEmpty())
      this.rear = null
    return removed.value
  }

  peek(): T | undefined {
    return this.front?.value
  }

  get size(): number {
    return this._size
  }

  isEmpty(): boolean {
    return this._size === 0
  }

  clear(): void {
    this.front = null
    this.rear = null
    this._size = 0
  }
}
```

### 循环队列实现

解决数组实现的性能问题，使用环形缓冲区，适用于 **固定容量优化** 的场景

```ts
class CircularQueue<T> {
  private items: (T | undefined)[]
  private front = 0
  private rear = -1
  private count = 0

  constructor(private capacity: number) {
    this.items = Array.from({ length: capacity })
  }

  enqueue(item: T): boolean {
    if (this.isFull())
      return false

    this.rear = (this.rear + 1) % this.capacity
    this.items[this.rear] = item
    this.count++
    return true
  }

  dequeue(): T | undefined {
    if (this.isEmpty())
      return undefined

    const item = this.items[this.front]
    this.front = (this.front + 1) % this.capacity
    this.count--
    return item
  }

  peek(): T | undefined {
    return this.isEmpty() ? undefined : this.items[this.front]
  }

  isFull(): boolean {
    return this.count === this.capacity
  }

  isEmpty(): boolean {
    return this.count === 0
  }

  get size(): number {
    return this.count
  }
}
```

## 应用场景

* **任务调度**：CPU 进程调度、打印机任务队列
* **广度优先搜索**：树/图的层级遍历
* **消息传递**：消息队列（RabbitMQ/Kafka）
* **缓冲区管理**：网络数据包处理
* **撤销操作栈**：编辑器中的撤销历史记录

## 复杂度对比

| 操作        | 数组实现 | 链表实现 | 循环队列 |
|-------------|----------|----------|----------|
| **enqueue** | O(1)\*   | O(1)     | O(1)     |
| **dequeue** | O(n)     | O(1)     | O(1)     |
| **peek**    | O(1)     | O(1)     | O(1)     |
| **空间**    | O(n)     | O(n)     | O(n)     |

::: warning 注：数组的 push() 平均 O(1)，但动态扩容时可能 O(n)
:::

## 相关问题

[**LeetCode** - 队列](https://leetcode.cn/problem-list/queue/){.read-more}

### 基础操作

* **232. 用栈实现队列**（[LeetCode](https://leetcode.cn/problems/implement-queue-using-stacks/)）
* **622. 设计循环队列**（[LeetCode](https://leetcode.cn/problems/design-circular-queue/)）

### 广度优先搜索 (BFS)

* **102. 二叉树的层序遍历**（[LeetCode](https://leetcode.cn/problems/binary-tree-level-order-traversal/)）
* **752. 打开转盘锁**（[LeetCode](https://leetcode.cn/problems/open-the-lock/)）
* **994. 腐烂的橘子**（[LeetCode](https://leetcode.cn/problems/rotting-oranges/)）

### 单调队列

* **239. 滑动窗口最大值**（[LeetCode](https://leetcode.cn/problems/sliding-window-maximum/)）
* **862. 和至少为 K 的最短子数组**（[LeetCode](https://leetcode.cn/problems/shortest-subarray-with-sum-at-least-k/)）
