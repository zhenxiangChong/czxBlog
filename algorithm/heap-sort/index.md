---
url: /czxBlog/algorithm/heap-sort/index.md
---
## 概述

\==堆排序（Heap Sort）== 是一种基于 **二叉堆** 数据结构的高效排序算法。

## 核心思想

* **构建最大堆（Max-Heap）**：将无序数组转换为满足堆性质的结构（父节点 ≥ 子节点）。
* **反复提取最大值**：将堆顶（最大值）与末尾元素交换，缩小堆范围，重新调整堆。
* **重复调整**：直到堆大小为1，数组即有序。

## 时间复杂度

堆排序的最优时间复杂度、平均时间复杂度、最坏时间复杂度均为 $O(n\log n)$。

## 空间复杂度

由于可以在输入数组上建立堆，所以这是一个原地算法。

## 稳定性

同选择排序一样，由于其中交换位置的操作，所以是不稳定的排序算法。

## 实现

```ts
function heapSort(arr: number[]): number[] {
  const n = arr.length

  // 构建最大堆（从最后一个非叶子节点开始）
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i)
  }

  // 逐个提取最大值并调整堆
  for (let i = n - 1; i > 0; i--) {
    // 交换堆顶（最大值）与当前末尾元素
    [arr[0], arr[i]] = [arr[i], arr[0]]
    // 调整剩余元素为最大堆
    heapify(arr, i, 0)
  }
  return arr
}

// 堆调整函数（确保以i为根的子树满足最大堆性质）
function heapify(arr: number[], heapSize: number, i: number): void {
  let largest = i // 初始化最大元素为根节点
  const left = 2 * i + 1 // 左子节点索引
  const right = 2 * i + 2 // 右子节点索引

  // 若左子节点大于根，更新最大值索引
  if (left < heapSize && arr[left] > arr[largest]) {
    largest = left
  }

  // 若右子节点大于当前最大值，更新最大值索引
  if (right < heapSize && arr[right] > arr[largest]) {
    largest = right
  }

  // 如果最大值不是根节点，则交换并递归调整
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]]
    heapify(arr, heapSize, largest) // 递归调整受影响子树
  }
}

// 测试示例
const array = [12, 11, 13, 5, 6, 7]
console.log('排序前:', array)
console.log('排序后:', heapSort(array))
```

### 执行示例（`[12, 11, 13, 5, 6, 7]`）

* `构建堆`：

  ```txt
  [13, 11, 12, 5, 6, 7]  // 初始堆
  ```

* **首轮交换**：13（堆顶）与 7（末尾）交换 → `[7, 11, 12, 5, 6, 13]`

  调整堆：`[12, 11, 7, 5, 6]` → 新堆顶 12

* **次轮交换**：12 与 6 交换 → `[6, 11, 7, 5, 12, 13]`

  调整堆：`[11, 6, 7, 5]` → 新堆顶 11

* **持续交换与调整**：直到堆大小为 1，得到有序数组。
