---
url: /czxBlog/algorithm/data-structure/linked-list/index.md
---
## 概述

链表是一种用于存储数据的数据结构，通过如链条一般的指针来连接元素。
它的特点是插入与删除数据十分方便，但寻找与读取数据的表现欠佳。

## 核心特性

* **节点（Node）**：

  * 存储数据（value）
  * 指向下一个节点的指针（next）
  * 双向链表额外包含指向前一个节点的指针（prev）

* **头指针（Head）**：

  * 指向链表的第一个节点
  * 链表入口点

* **尾节点（Tail）**：

  * 最后一个节点，其 next 指向 null

## 单向链表

单向链表中包含数据域和指针域，其中数据域用于存放数据，指针域用来连接当前结点和下一节点。

:::center
![linked list](/images/algorithm/linked-list.svg)
:::

### 插入数据

单向链表插入数据的流程大致如下：

::: steps

1. 初始化待插入的数据 node

   ![insert node](/images/algorithm/linked-list-insert-1.svg)

2. 将 node 的 next 指针指向 p 的下一个结点

   ![insert node](/images/algorithm/linked-list-insert-2.svg)

3. 将 p 的 next 指针指向 node

   ![insert node](/images/algorithm/linked-list-insert-3.svg)

:::

对于 **单向循环链表** ，由于链表首尾相连，在插入数据时需要判断原链表是否为空：为空则自身循环，不为空则正常插入数据。

大致流程如下：

1. 初始化待插入的数据 node；
2. 判断给定链表 p 是否为空；
3. 若为空，则将 node 的 next 指针和 p 都指向自己；
4. 否则，将 node 的 next 指针指向 p 的下一个结点；
5. 将 p 的 next 指针指向 node。

::: steps

* ![insert node](/images/algorithm/linked-list-insert-cyclic-1.svg)
* ![insert node](/images/algorithm/linked-list-insert-cyclic-2.svg)
* ![insert node](/images/algorithm/linked-list-insert-cyclic-3.svg)

:::

### 删除数据

设待删除结点为 p，从链表中删除它时，将 p 的下一个结点 p->next 的值覆盖给 p 即可，与此同时更新 p 的下下个结点。

流程大致如下：

1. 将 p 下一个结点的值赋给 p，以抹掉 p->value；
2. 新建一个临时结点 t 存放 p->next 的地址；
3. 将 p 的 next 指针指向 p 的下下个结点，以抹掉 p->next；
4. 删除 t。此时虽然原结点 p 的地址还在使用，删除的是原结点 p->next 的地址，但 p 的数据被 p->next 覆盖，p 名存实亡。

**参考**：

::: steps

* ![delete node](/images/algorithm/linked-list-delete-1.svg)
* ![delete node](/images/algorithm/linked-list-delete-2.svg)
* ![delete node](/images/algorithm/linked-list-delete-3.svg)

:::

### 单向链表实现

1. 定义节点类

```ts
class ListNode<T> {
  value: T
  next: ListNode<T> | null

  constructor(value: T) {
    this.value = value
    this.next = null
  }
}
```

2. 定义链表类

```ts :collapsed-lines
class SinglyLinkedList<T> {
  private head: ListNode<T> | null
  private size: number

  constructor() {
    this.head = null
    this.size = 0
  }

  // 插入到尾部 (O(n))
  append(value: T): void {
    const newNode = new ListNode(value)
    if (!this.head) {
      this.head = newNode
    }
    else {
      let current = this.head
      while (current.next) {
        current = current.next
      }
      current.next = newNode
    }
    this.size++
  }

  // 插入到头部 (O(1))
  prepend(value: T): void {
    const newNode = new ListNode(value)
    newNode.next = this.head
    this.head = newNode
    this.size++
  }

  // 删除节点 (O(n))
  delete(value: T): void {
    if (!this.head)
      return

    if (this.head.value === value) {
      this.head = this.head.next
      this.size--
      return
    }

    let current = this.head
    while (current.next) {
      if (current.next.value === value) {
        current.next = current.next.next
        this.size--
        return
      }
      current = current.next
    }
  }

  // 查找节点 (O(n))
  find(value: T): ListNode<T> | null {
    let current = this.head
    while (current) {
      if (current.value === value)
        return current
      current = current.next
    }
    return null
  }

  // 获取长度 (O(1))
  getLength(): number {
    return this.size
  }

  // 转换为数组 (O(n))
  toArray(): T[] {
    const result: T[] = []
    let current = this.head
    while (current) {
      result.push(current.value)
      current = current.next
    }
    return result
  }
}
```

## 双向链表

双向链表中同样有数据域和指针域。不同之处在于，指针域有左右（或上一个、下一个）之分，用来连接上一个结点、当前结点、下一个结点。

:::center
![double linked list](/images/algorithm/double-linked-list.svg)
:::

### 插入数据

在向双向（循环）链表插入数据时，除了要判断给定链表是否为空外，还要同时修改左、右两个指针。

大致流程如下：

1. 初始化待插入的数据 node；
2. 判断给定链表 p 是否为空；
3. 若为空，则将 node 的 left 和 right 指针，以及 p 都指向自己；
4. 否则，将 node 的 left 指针指向 p;
5. 将 node 的 right 指针指向 p 的右结点；
6. 将 p 右结点的 left 指针指向 node；
7. 将 p 的 right 指针指向 node。

### 删除数据

流程大致如下：

1. 将 p 左结点的右指针指向 p 的右节点；
2. 将 p 右结点的左指针指向 p 的左节点；
3. 新建一个临时结点 t 存放 p 的地址；
4. 将 p 的右节点地址赋给 p，以避免 p 变成悬垂指针；
5. 删除 t。

### 双向链表实现

1. 定义节点类

```ts
class DoublyListNode<T> {
  value: T
  next: DoublyListNode<T> | null
  prev: DoublyListNode<T> | null

  constructor(value: T) {
    this.value = value
    this.next = null
    this.prev = null
  }
}
```

2. 定义双向链表类

```ts :collapsed-lines
class DoublyLinkedList<T> {
  private head: DoublyListNode<T> | null
  private tail: DoublyListNode<T> | null
  private size: number

  constructor() {
    this.head = null
    this.tail = null
    this.size = 0
  }

  // 尾部插入 (O(1))
  append(value: T): void {
    const newNode = new DoublyListNode(value)
    if (!this.tail) {
      this.head = newNode
      this.tail = newNode
    }
    else {
      this.tail.next = newNode
      newNode.prev = this.tail
      this.tail = newNode
    }
    this.size++
  }

  // 头部插入 (O(1))
  prepend(value: T): void {
    const newNode = new DoublyListNode(value)
    if (!this.head) {
      this.head = newNode
      this.tail = newNode
    }
    else {
      newNode.next = this.head
      this.head.prev = newNode
      this.head = newNode
    }
    this.size++
  }

  // 删除节点 (O(n))
  delete(value: T): void {
    if (!this.head)
      return

    let current: DoublyListNode<T> | null = this.head
    while (current) {
      if (current.value === value) {
        if (current === this.head) {
          this.head = current.next
          if (this.head)
            this.head.prev = null
        }
        else if (current === this.tail) {
          this.tail = current.prev
          if (this.tail)
            this.tail.next = null
        }
        else {
          current.prev!.next = current.next
          current.next!.prev = current.prev
        }
        this.size--
        return
      }
      current = current.next
    }
  }
}
```

## 时间复杂度

| 操作     | 单向链表 | 双向链表 |
| -------- | -------- | -------- |
| 插入头部 | $O(1)$   | $O(1)$   |
| 插入尾部 | $O(n)$   | $O(1)$   |
| 删除头部 | $O(1)$   | $O(1)$   |
| 删除尾部 | $O(n)$   | $O(1)$   |
| 随机访问 | $O(n)$   | $O(n)$   |
| 查找元素 | $O(n)$   | $O(n)$   |

## 与数组的区别

链表和数组都可用于存储数据。与链表不同，数组将所有元素按次序依次存储。不同的存储结构令它们有了不同的优势：

* 链表因其链状的结构，能方便地删除、插入数据，操作次数是 $O(1)$ 。
  但也因为这样，寻找、读取数据的效率不如数组高，在随机访问数据中的操作次数是 $O(n)$ 。

* 数组可以方便地寻找并读取数据，在随机访问中操作次数是 $O(1)$ 。但删除、插入的操作次数是 $O(n)$ 次。

| 特性          | 链表               | 数组              |
| ------------- | ------------------ | ----------------- |
| 内存分配      | 动态分配（非连续） | 静态/连续内存     |
| 插入/删除效率 | $O(1)$ 在已知位置  | $O(n)$ 需移动元素 |
| 随机访问      | $O(n)$ 需要遍历    | $O(1)$ 通过索引   |
| 内存开销      | 额外存储指针       | 无额外开销        |
| 缓存友好度    | 差（内存不连续）   | 好（局部性原理）  |

## 应用场景

* **实现栈/队列**：

  ```ts
  // 基于链表的队列
  class Queue<T> {
    private list = new SinglyLinkedList<T>()

    enqueue(value: T) { this.list.append(value) }
    dequeue(): T | undefined { /* ... */ }
  }
  ```

* **LRU缓存淘汰算法**：

  使用双向链表 + HashMap 实现 O(1) 的插入/删除

* **大文件处理**：

  避免数组连续内存限制，分段处理数据

* **撤销操作历史记录**：

  双向链表实现前进/后退功能

## 链表使用技巧

* **虚拟头节点**：

  ```ts
  // 简化边界处理
  const dummyHead = new ListNode(0)
  dummyHead.next = head
  // ...操作后返回 dummyHead.next
  ```

* **快慢指针**：

  ```ts
  // 检测环/找中点
  let slow = head
  let fast = head
  while (fast && fast.next) {
    slow = slow.next!
    fast = fast.next.next!
  }
  ```

* **反转链表**：

  ```ts
  function reverseList<T>(head: ListNode<T> | null): ListNode<T> | null {
    let prev = null
    let current = head
    while (current) {
      const next = current.next
      current.next = prev
      prev = current
      current = next
    }
    return prev
  }
  ```

## 相关问题

[**LeetCode** - 链表](https://leetcode.cn/problem-list/linked-list/){.read-more}

### 基础操作

* **206. 反转链表**（[LeetCode](https://leetcode.cn/problems/reverse-linked-list/)）
* **21. 合并两个有序链表**（[LeetCode](https://leetcode.cn/problems/merge-two-sorted-lists/)）
* **83. 删除排序链表中的重复元素**（[LeetCode](https://leetcode.cn/problems/remove-duplicates-from-sorted-list/)）
* **203. 移除链表元素**（[LeetCode](https://leetcode.cn/problems/remove-linked-list-elements/)）

### 双指针技巧

* **141. 环形链表**（[LeetCode](https://leetcode.cn/problems/linked-list-cycle/)）
* **19. 删除链表的倒数第 N 个结点**（[LeetCode](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)）
* **876. 链表的中间结点**（[LeetCode](https://leetcode.cn/problems/middle-of-the-linked-list/)）

### 递归与归并

* **24. 两两交换链表中的节点**（[LeetCode](https://leetcode.cn/problems/swap-nodes-in-pairs/)）
* **23. 合并 K 个升序链表**（[LeetCode](https://leetcode.cn/problems/merge-k-sorted-lists/)）
* **148. 排序链表**（[LeetCode](https://leetcode.cn/problems/sort-list/)）

### 其它

* **138. 复制带随机指针的链表**（[LeetCode](https://leetcode.cn/problems/copy-list-with-random-pointer/)）
* **234. 回文链表**（[LeetCode](https://leetcode.cn/problems/palindrome-linked-list/)）
* **143. 重排链表**（[LeetCode](https://leetcode.cn/problems/reorder-list/)）
