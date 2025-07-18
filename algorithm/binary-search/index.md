---
url: /czxBlog/algorithm/binary-search/index.md
---
## 概述

\==二分查找（Binary Search）==，也称 **折半搜索（half-interval search）**、**对数搜索（logarithmic search）** 。
是一种高效的搜索算法，适用于已排序的数据集（如数组）。
它通过不断将搜索范围减半来定位目标值，时间复杂度为 $O(log n)$ ，远优于线性查找的 $O(n)$ 。

## 核心思想

* **分而治之**：每次比较目标值与数组中间元素。
* **缩小范围**：根据比较结果，将搜索范围缩小一半。
* **终止条件**：找到目标值或范围为空（未找到）。

## 过程

以在一个升序数组中查找一个数为例。

1. 它每次考察数组当前部分的中间元素，如果中间元素刚好是要找的，就结束搜索过程；
2. 如果中间元素小于所查找的值，那么左侧的只会更小，不会有所查找的元素，只需到右侧查找；
3. 如果中间元素大于所查找的值同理，只需到左侧查找。

## 实现

* **循环条件**：`left <= right`

  确保当 `left === right` 时（只剩一个元素）仍会检查。

* **中间索引计算**：

  * `mid = Math.floor((left + right) / 2)` 防止小数索引

    建议写作 `mid = (left + right) >> 1` 。

  * 大数安全写法：`mid = left + Math.floor((right - left) / 2)`（避免溢出）

    建议写作 `mid = left + ((right - left) >> 1)`。

* **边界更新**：

  * 目标在右侧：`left = mid + 1`（跳过已检查的 mid）。
  * 目标在左侧：`right = mid - 1`（同上）。

* **终止条件**：

  * 找到：`arr[mid] === target`。
  * 未找到：`left > right`（范围无效）。

### 迭代实现

```ts
function binarySearch(arr: number[], target: number): number {
  let left = 0
  let right = arr.length - 1

  while (left <= right) {
    const mid = left + ((right - left) >> 1) // 中间索引
    if (arr[mid] === target) {
      return mid // 找到目标
    }
    else if (arr[mid] < target) {
      left = mid + 1 // 目标在右半部分
    }
    else {
      right = mid - 1 // 目标在左半部分
    }
  }
  return -1 // 未找到
}
```

### 递归实现

```ts
function binarySearchRecursive(
  arr: number[],
  target: number,
  left: number = 0,
  right: number = arr.length - 1
): number {
  if (left > right)
    return -1 // 终止条件

  const mid = left + ((right - left) >> 1)
  if (arr[mid] === target) {
    return mid
  }
  else if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right) // 搜索右半
  }
  else {
    return binarySearchRecursive(arr, target, left, mid - 1) // 搜索左半
  }
}
```

## 最大值最小化

注意，这里的有序是广义的有序，如果一个数组中的左侧或者右侧都满足某一种条件，
而另一侧都不满足这种条件，也可以看作是一种有序（如果把满足条件看做 1，不满足看做 0，
至少对于这个条件的这一维度是有序的）。换言之，二分搜索法可以用来查找满足某种条件的最大（最小）的值。

要求满足某种条件的最大值的最小可能情况（最大值最小化），首先的想法是从小到大枚举这个作为答案的「最大值」，
然后去判断是否合法。若答案单调，就可以使用二分搜索法来更快地找到答案。
因此，要想使用二分搜索法来解这种「最大值最小化」的题目，需要满足以下三个条件：

* 答案在一个固定区间内；
* 可能查找一个符合条件的值不是很容易，但是要求能比较容易地判断某个值是否是符合条件的；
* 可行解对于区间满足一定的单调性。换言之，如果 x 是符合条件的，那么有 x + 1 或者 x - 1 也符合条件。（这样下来就满足了上面提到的单调性）

当然，最小值最大化是同理的。

## 适用场景

* 有序数据（数组、列表等）。
* 需要高效搜索（如数据库索引、大型数据集）。
* 变体问题：找边界、插入位置）。

## 相关问题

[**LeetCode** - 二分查找](https://leetcode.cn/problem-list/binary-search/){.read-more}

### 基础分治应用

* **169. 多数元素**（[LeetCode](https://leetcode.cn/problems/majority-element/)）
* **50. Pow(x, n)**（[LeetCode](https://leetcode.cn/problems/powx-n/)）

### 最大子数组问题

* **53. 最大子序和**（[LeetCode](https://leetcode.cn/problems/maximum-subarray/)）

### 进阶问题

* **4. 寻找两个有序数组的中位数**（[LeetCode](https://leetcode.cn/problems/median-of-two-sorted-arrays/)）
* **23. 合并 K 个升序链表**（[LeetCode](https://leetcode.cn/problems/merge-k-sorted-lists/)）

### 经典变体（分治思想延伸）

* **215. 数组中的第K个最大元素**（[LeetCode](https://leetcode.cn/problems/kth-largest-element-in-an-array/)）
* **240. 搜索二维矩阵 II**（[LeetCode](https://leetcode.cn/problems/search-a-2d-matrix-ii/)）
