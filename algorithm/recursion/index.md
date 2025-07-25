---
url: /czxBlog/algorithm/recursion/index.md
---
## 概述

\==递归== ，在数学和计算机科学中是指在函数的定义中使用函数自身的方法，
在计算机科学中还额外指一种 **通过重复将问题分解为同类的子问题而解决问题的方法**。

递归的基本思想是某个函数直接或者间接地调用自身，这样原问题的求解就转换为了许多性质相同但是规模更小的子问题。
求解时只需要关注如何把原问题划分成符合条件的子问题，而不需要过分关注这个子问题是如何被解决的。

## 如何理解递归？

请看下面的例子：

* 点击：递归

* 在 google 中 搜索 **递归** 时，会得到如下结果：

  ![递归](/images/algorithm/recursion-1.png)

* 给一堆数字排序？分成两半，先排左半边再排右半边，最后进行合并。而怎么排左边和右边，重新阅读这句话。

## 递归的要素

* **基线条件（Base Case）**

  递归终止的条件，防止无限递归（栈溢出）。

* **递归条件（Recursive Case）**

  将问题分解为更小的子问题，并调用自身。

* **递归方向（Progress）**

  每次递归必须向基线条件靠近。

## 递归示例

### 阶乘计算

```ts
function factorial(n: number): number {
  // 基线条件：0! = 1, 1! = 1
  if (n <= 1) return 1; 
  
  // 递归条件：n! = n * (n-1)!
  return n * factorial(n - 1); 
}

console.log(factorial(5)); // 120
```

### 斐波那契数列

```ts
function fibonacci(n: number): number {
  // 基线条件
  if (n === 0) return 0;
  if (n === 1) return 1;
  
  // 递归条件：F(n) = F(n-1) + F(n-2)
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(6)); // 8
```

## 递归的优化策略

### 记忆化（Memoization）

缓存计算结果，避免重复递归（适合有重叠子问题的情况）。

```ts
const memo = new Map<number, number>();

function fibonacciMemo(n: number): number {
  if (n <= 1) return n;
  
  // 检查缓存
  if (memo.has(n)) return memo.get(n)!;
  
  // 计算并缓存结果
  const result = fibonacciMemo(n - 1) + fibonacciMemo(n - 2);
  memo.set(n, result);
  return result;
}
```

### 尾递归优化（Tail Recursion）

将递归操作置于函数末尾，编译器可优化为迭代（TypeScript 需手动转换）。

```ts
// 阶乘的尾递归实现
function factorialTail(n: number, acc: number = 1): number {
  return n <= 1 ? acc : factorialTail(n - 1, n * acc);
}
```

## 递归的典型应用场景

* **分治算法**

  如归并排序、快速排序。

* **树/图遍历**

  如深度优先搜索（DFS）。

* **回溯算法**

  如八皇后问题、迷宫求解。

* **动态规划**

  通常基于递归定义状态转移方程。

## 递归的优缺点

| 优点                       | 缺点                     |
| -------------------------- | ------------------------ |
| 代码简洁直观，贴近数学定义 | 栈溢出风险（深度过大）   |
| 简化复杂问题的实现         | 重复计算（需记忆化优化） |
| 天然适合处理嵌套结构       | 函数调用开销比循环大     |

## 写递归的要点

* **明确基线条件**：确保递归最终会终止。
* **信任递归**：假设子问题已解决，聚焦当前逻辑。
* **缩小问题规模**：每次递归必须更接近基线条件。
* **避免重复计算**：对重叠子问题使用记忆化。

:::important 明白一个函数的作用并相信它能完成这个任务，千万不要跳进这个函数里面企图探究更多细节，否则就会陷入无穷的细节无法自拔。
:::

## 递归与分治的区别

递归是一种编程技巧，一种解决问题的思维方式；分治算法很大程度上是基于递归的，解决更具体问题的算法思想。

## 相关问题

[**LeetCode - 递归**](https://leetcode.cn/tag/recursion/){.read-more}

### 基础递归问题

* **509. 斐波那契数**（[LeetCode](https://leetcode.cn/problems/fibonacci-number/)）
* **70. 爬楼梯**（[LeetCode](https://leetcode.cn/problems/climbing-stairs/)）
* **50. Pow(x, n)**（[LeetCode](https://leetcode.cn/problems/powx-n/)）

### 链表与树结构递归

* **206. 反转链表**（[LeetCode](https://leetcode.cn/problems/reverse-linked-list/)）
* **112. 路径总和**（[LeetCode](https://leetcode.cn/problems/path-sum/)）
* **236. 二叉树的最近公共祖先**（[LeetCode](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)）
* **230. 二叉搜索树中第K小的元素**（[LeetCode](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/)）

### 分治与回溯问题

* **169. 多数元素**（[LeetCode](https://leetcode.cn/problems/majority-element/)）
* **22. 括号生成**（[LeetCode](https://leetcode.cn/problems/generate-parentheses/)）
* **46. 全排列**（[LeetCode](https://leetcode.cn/problems/permutations/)）
