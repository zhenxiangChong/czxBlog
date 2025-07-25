---
url: /czxBlog/algorithm/data-structure/stack/index.md
---
## 概述

\==栈== 是一种遵循 **后进先出（LIFO） 原则** 的线性数据结构，类似于现实中的一摞盘子或书籍。

::: center
![stack](/images/algorithm/stack.svg)
:::

::: tip 提示
想象一下，我们把盘子从上到下依次摆放在桌子上，当我们要用到盘子时，就从最上面取走一个盘子，
放回盘子时，则是把盘子放在最上面。
:::

## 核心特性

* **后进先出（LIFO）**：最后添加的元素最先被移除
* **单端操作**：所有操作（插入/删除/访问）仅在栈顶（Top）进行

## 时间复杂度

* **压栈（Push）**: O(1)
* **弹栈（Pop）**: O(1)
* **查看栈顶（Peek）**: O(1)

## 栈的实现

### 使用数组模拟栈

```ts
class ArrayStack<T> {
  private items: T[]

  constructor() {
    this.items = []
  }

  // 压栈
  push(element: T): void {
    this.items.push(element)
  }

  // 弹栈
  pop(): T | undefined {
    return this.items.pop()
  }

  // 查看栈顶元素
  peek(): T | undefined {
    return this.items[this.items.length - 1]
  }

  // 判断空栈
  isEmpty(): boolean {
    return this.items.length === 0
  }

  // 获取栈大小
  size(): number {
    return this.items.length
  }

  // 清空栈
  clear(): void {
    this.items = []
  }

  // 打印栈内容
  print(): string {
    return this.items.toString()
  }
}
```

### 使用链表模拟栈

```ts
class LinkedNode<T> {
  constructor(
    public value: T,
    public next: LinkedNode<T> | null = null
  ) {}
}

class LinkedListStack<T> {
  private top: LinkedNode<T> | null = null
  private count: number = 0

  push(element: T): void {
    const newNode = new LinkedNode(element)
    newNode.next = this.top
    this.top = newNode
    this.count++
  }

  pop(): T | undefined {
    if (!this.top)
      return undefined
    const value = this.top.value
    this.top = this.top.next
    this.count--
    return value
  }

  peek(): T | undefined {
    return this.top?.value
  }

  isEmpty(): boolean {
    return this.count === 0
  }

  size(): number {
    return this.count
  }

  clear(): void {
    this.top = null
    this.count = 0
  }
}
```

## 应用场景

* **函数调用栈**（程序执行上下文管理）
* **括号匹配校验**（编译器语法检查）
* **撤销操作（Undo）**（编辑器历史记录）
* **深度优先搜索（DFS）**（图遍历算法）
* **表达式求值**（中缀转后缀表达式）
* **浏览器历史记录**（前进/后退功能）

::: important
掌握 **栈** 的关键在于理解其 **LIFO 特性** 和 **受限的操作方式**，
这种特性使其在需要"撤销"或"回溯"的场景中具有天然优势。
:::

## 相关题目

[**LeetCode** - 栈](https://leetcode.cn/problem-list/stack/){.read-more}

### 基础操作

* **20. 有效的括号**（[LeetCode](https://leetcode.cn/problems/valid-parentheses/)）
* **225. 用队列实现栈**（[LeetCode](https://leetcode.cn/problems/implement-stack-using-queues/)）
* **155. 最小栈**（[LeetCode](https://leetcode.cn/problems/min-stack/)）

### 表达式求值

* **150. 逆波兰表达式求值**（[LeetCode](https://leetcode.cn/problems/evaluate-reverse-polish-notation/)）
* **227. 基本计算器 II**（[LeetCode](https://leetcode.cn/problems/basic-calculator-ii/)）

### 单调栈

* **496. 下一个更大元素 I**（[LeetCode](https://leetcode.cn/problems/next-greater-element-i/)）
* **503. 下一个更大元素 II**（[LeetCode](https://leetcode.cn/problems/next-greater-element-ii/)）
* **739. 每日温度**（[LeetCode](https://leetcode.cn/problems/daily-temperatures/)）
* **42. 接雨水**（[LeetCode](https://leetcode.cn/problems/trapping-rain-water/)）

### 深度优先搜索（DFS）

* **94. 二叉树的中序遍历**（[LeetCode](https://leetcode.cn/problems/binary-tree-inorder-traversal/)）
* **144. 二叉树的前序遍历**（[LeetCode](https://leetcode.cn/problems/binary-tree-preorder-traversal/)）
* **341. 扁平化嵌套列表迭代器**（[LeetCode](https://leetcode.cn/problems/flatten-nested-list-iterator/)）

### 特殊栈应用

* **316. 去除重复字母**（[LeetCode](https://leetcode.cn/problems/remove-duplicate-letters/)）
* **394. 字符串解码**（[LeetCode](https://leetcode.cn/problems/decode-string/)）
* **456. 132 模式**（[LeetCode](https://leetcode.cn/problems/132-pattern/)）
