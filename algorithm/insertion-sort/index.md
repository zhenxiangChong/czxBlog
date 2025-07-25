---
url: /czxBlog/algorithm/insertion-sort/index.md
---
## 概述

\==插入排序（Insertion sort）== 是一种简单直观的排序算法。

### 核心思想

将数组分为 **已排序区间** 和 **未排序区间** ，每次从未排序区间取出一个元素，
在已排序区间中找到合适的位置插入（类似整理扑克牌）。

## 时间复杂度

插入排序的最优时间复杂度为 $O(n)$，在数列几乎有序时效率很高。

插入排序的最坏时间复杂度和平均时间复杂度都为 $O(n^2)$。

## 空间复杂度

原地排序, $O(1)$ ，不需要额外空间。

## 稳定性

插入排序是一种稳定的排序算法

## 伪代码

$$
\begin{array}{ll}
1 & \textbf{Input. } \text{An array } A \text{ consisting of }n\text{ elements.} \\
2 & \textbf{Output. } A\text{ will be sorted in nondecreasing order stably.} \\
3 & \textbf{Method. }  \\
4 & \textbf{for } i\gets 2\textbf{ to }n\\
5 & \qquad key\gets A\[i]\\
6 & \qquad j\gets i-1\\
7 & \qquad\textbf{while }j>0\textbf{ and }A\[j]>key\\
8 & \qquad\qquad A\[j + 1]\gets A\[j]\\
9 & \qquad\qquad j\gets j - 1\\
10 & \qquad A\[j + 1]\gets key
\end{array}
$$

## 实现

```ts
function insertionSort(arr: number[]): number[] {
  // 遍历未排序区间（从第二个元素开始）
  for (let i = 1; i < arr.length; i++) {
    const current = arr[i] // 当前待插入元素
    let j = i - 1 // 从已排序区末尾开始比较

    // 在已排序区间中寻找插入位置
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j] // 元素后移
      j--
    }

    arr[j + 1] = current // 插入到正确位置
  }
  return arr
}

// 测试示例
const testArr = [5, 2, 4, 6, 1, 3]
console.log(insertionSort([...testArr])) // 输出: [1, 2, 3, 4, 5, 6]
```

### 执行过程示例 (`[5, 2, 4, 6, 1, 3]`)

* 初始状态

  ```txt
  已排序区 [5] | 未排序区 [2, 4, 6, 1, 3]
  ```

* 第一轮（插入 $2$ ）：

  * 比较 $5 > 2$ → $5$ 后移
  * 插入 $2$ 到首位 → `[2, 5] | [4, 6, 1, 3]`

* 第二轮（插入 $4$ ）：

  * $5 > 4$ → $5$ 后移
  * $2 < 4$ → 插入到 $5$ 前 → `[2, 4, 5] | [6, 1, 3]`

* 第三轮（插入 $6$ ）：

  * $5 < 6$ → 直接插入末尾 → `[2, 4, 5, 6] | [1, 3]`

* 第四轮（插入 $1$ ）：

  * 依次与 $6/5/4/2$ 比较 → 全部后移
  * 插入到首位 → `[1, 2, 4, 5, 6] | [3]`

* 第五轮（插入 $3$ ）：

  * $6/5/4 > 3$ → 后移，$2 < 3$ → 插入 $4$ 前
  * 最终结果：`[1, 2, 3, 4, 5, 6]`

## 优化

二分查找优化

```ts
// 二分查找优化（查找插入位置）
function insertionSortOptimized(arr: number[]) {
  for (let i = 1; i < arr.length; i++) {
    const current = arr[i]
    const pos = binarySearch(arr, 0, i - 1, current)

    // 整体后移元素
    for (let j = i - 1; j >= pos; j--) {
      arr[j + 1] = arr[j]
    }
    arr[pos] = current
  }
  return arr
}
```

二分插入排序：将比较操作优化至 $O(log n)$，但移动操作仍为 $O(n²)$
