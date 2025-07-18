---
url: /czxBlog/algorithm/bubble-sort/index.md
---
## 概述

\==冒泡排序（Bubble sort）== 一种基础的比较排序算法。

### 核心思想

**重复遍历数组，依次比较相邻元素，将较大值向后交换**，如同气泡上浮的过程。

## 算法步骤

1. **外层循环**：控制遍历轮数（n-1 轮）
2. **内层循环**：比较相邻元素，将较大值后移
3. **优化点**：每轮结束后，末尾元素已有序，可减少比较范围
4. **提前终止**：当某轮无交换时，说明数组已有序，提前结束

## 时间复杂度

* 在序列完全有序时，冒泡排序只需遍历一遍数组，不用执行任何交换操作，时间复杂度为 $O(n)$。
* 在最坏情况下，冒泡排序要执行 $\frac{(n-1)n}{2}$ 次交换操作，时间复杂度为 $O(n^2)$。
* 冒泡排序的平均时间复杂度为 $O(n^2)$。

## 空间复杂度

$O(1)$（原地排序）

## 稳定性

**稳定**（相同元素顺序不变）

## 伪代码

$$
\begin{array}{ll}
1 & \textbf{Input. } \text{An array } A \text{ consisting of }n\text{ elements.} \\
2 & \textbf{Output. } A\text{ will be sorted in nondecreasing order stably.} \\
3 & \textbf{Method. }  \\
4 & flag\gets True\\
5 & \textbf{while }flag\\
6 & \qquad flag\gets False\\
7 & \qquad\textbf{for }i\gets1\textbf{ to }n-1\\
8 & \qquad\qquad\textbf{if }A\[i]>A\[i + 1]\\
9 & \qquad\qquad\qquad flag\gets True\\
10 & \qquad\qquad\qquad \text{Swap } A\[i]\text{ and }A\[i + 1]
\end{array}
$$

## 实现

```ts
function bubbleSort(arr: number[]): number[] {
  const n = arr.length
  // 复制数组以避免修改原数组（可选）
  const sortedArr = [...arr]

  // 外层循环：控制遍历轮数（n-1轮）
  for (let i = 0; i < n - 1; i++) {
    let swapped = false // 优化标记

    // 内层循环：比较相邻元素（每轮减少i个已排序元素）
    for (let j = 0; j < n - 1 - i; j++) {
      // 如果前一个元素大于后一个元素
      if (sortedArr[j] > sortedArr[j + 1]) {
        // 交换元素（ES6解构赋值）
        [sortedArr[j], sortedArr[j + 1]] = [sortedArr[j + 1], sortedArr[j]]
        swapped = true // 标记发生交换
      }
    }

    // 如果本轮无交换，说明数组已有序，提前终止
    if (!swapped)
      break
  }

  return sortedArr
}

// 测试示例
const unsortedArray = [64, 34, 25, 12, 22, 11, 90]
const sortedArray = bubbleSort(unsortedArray)
console.log('排序前:', unsortedArray) // [64, 34, 25, 12, 22, 11, 90]
console.log('排序后:', sortedArray) // [11, 12, 22, 25, 34, 64, 90]
```

### 执行过程示例 （`[5, 3, 8, 4]`）

* 第一轮：

  * 比较 $5 > 3$ → 交换 → `[3, 5, 8, 4]`
  * 比较 $5 < 8$ → 不交换
  * 比较 $8 > 4$ → 交换 → `[3, 5, 4, 8]`

* 第二轮：

  * 比较 $3 < 5$ → 不交换
  * 比较 $5 > 4$ → 交换 → `[3, 4, 5, 8]`
  * 检查发现无交换 → 提前终止

## 优化

* **优化内层循环范围**

  ```ts
  for (let j = 0; j < n - 1 - i; j++) {
    // ...
  }
  ```

  每轮结束后，末尾 i 个元素已有序，无需再比较。

* **提前终止**

  ```ts
  if (!swapped)
    break
  ```

  当数组在中间轮次已有序时，避免无效遍历。
