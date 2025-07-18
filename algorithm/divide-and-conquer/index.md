---
url: /czxBlog/algorithm/divide-and-conquer/index.md
---
## 概述

\==分治算法（Divide and Conquer）== , 字面上的解释是「分而治之」。
把一个复杂的问题分成两个或更多的相同或相似的子问题，直到最后子问题可以简单的直接求解，原问题的解即子问题的解的合并。

**核心流程包含三步**：

* **分解（Divide）**：将原问题拆分为独立子问题
* **解决（Conquer）**：递归求解子问题
* **合并（Combine）**：将子问题的解合并为原问题的解

## 算法特征

* 该问题的规模缩小到一定的程度就可以容易地解决。
* 该问题可以分解为若干个规模较小的相同问题，即该问题具有最优子结构性质，利用该问题分解出的子问题的解可以合并为该问题的解。
* 该问题所分解出的各个子问题是相互独立的，即子问题之间不包含公共的子问题。

::: warning
如果各子问题是不独立的，则分治法要重复地解公共的子问题，也就做了许多不必要的工作。
此时虽然也可用分治法，但一般用 ==动态规划== 较好。
:::

## 过程

以归并排序为例。

假设实现归并排序的函数名为 `mergeSort`。明确该函数的职责，即 **对传入的一个数组排序**。
这个问题显然可以分解。给一个数组排序等于给该数组的左右两半分别排序，然后合并成一个数组。

```ts
function mergeSort(一个数组) {
  if (可以很容易处理)
    return
  mergeSort(左半个数组)
  mergeSort(右半个数组)
  merge(左半个数组, 右半个数组)
}
```

传给它半个数组，那么处理完后这半个数组就已经被排好了。
注意到，`mergeSort` 与二叉树的后序遍历模板极其相似。
因为分治算法的套路是 **分解 -> 解决（触底）-> 合并（回溯）**，先左右分解，再处理合并，回溯就是在退栈，即相当于后序遍历。

`merge` 函数的实现方式与两个有序链表的合并一致。

## 分治示例

### 归并排序（经典分治）

* **时间复杂度**：$O(n log n)$
* **空间复杂度**：$O(n)$

```ts
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1)
    return arr // 终止条件

  // 分解阶段
  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))

  // 合并阶段
  return merge(left, right)
}

function merge(left: number[], right: number[]): number[] {
  let result: number[] = []
  let i = 0
  let j = 0

  // 合并两个有序数组
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++])
    }
    else {
      result.push(right[j++])
    }
  }

  // 处理剩余元素
  return result.concat(left.slice(i)).concat(right.slice(j))
}

// 测试
const arr = [38, 27, 43, 3, 9, 82, 10]
console.log(mergeSort(arr)) // [3, 9, 10, 27, 38, 43, 82]
```

## 分治算法优化技巧

* **避免重复计算**：使用记忆化存储中间结果
* **尾递归优化**：减少递归栈深度
* **迭代替代递归**：降低空间复杂度
* **并行计算**：子问题独立时可并行处理

## 适用场景

* 问题可分解为独立子问题（归并排序、快速排序）
* 子问题结构相似（二叉树遍历）
* 合并操作复杂度低于暴力求解（矩阵乘法）
* 问题具有递归特性（汉诺塔、斐波那契数列）

## 相关问题

[**LeetCode** - 分治](https://leetcode.cn/tag/divide-and-conquer/){.read-more}

### 基础分治应用

* **169. 多数元素**（[LeetCode](https://leetcode.cn/problems/majority-element/)）
* **50. Pow(x, n)**（[LeetCode](https://leetcode.cn/problems/powx-n/)）

### 子问题合并技巧

* **53. 最大子序和**（[LeetCode](https://leetcode.cn/problems/maximum-subarray/)）
* **493. 翻转对**（[LeetCode](https://leetcode.cn/problems/reverse-pairs/)）

### 分治优化：三路划分

* **215. 数组中的第K个最大元素**（[LeetCode](https://leetcode.cn/problems/kth-largest-element-in-an-array/)）
* **75. 颜色分类**（[LeetCode](https://leetcode.cn/problems/sort-colors/)）

### 进阶问题

* **4. 寻找两个有序数组的中位数**（[LeetCode](https://leetcode.cn/problems/median-of-two-sorted-arrays/)）
