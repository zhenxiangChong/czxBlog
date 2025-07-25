---
url: /czxBlog/interview-question/5l8aw7ss/index.md
---
::: tip 提问

1. 快速排序
2. 实现

:::

## 快速排序

通过一趟排序将待排记录分隔成独立的两部分，其中一部分记录的关键字均比另一部分的关键字小，则可分别对这两部分记录继续进行排序，以达到整个序列有序。

### 描述

* 从数列中挑出一个元素，称为 “基准”（pivot）；
* 重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区退出之后，该基准就处于数列的中间位置。这个称为分区（partition）操作；
* 递归地（recursive）把小于基准值元素的子数列和大于基准值元素的子数列排序。

## 实现

```js
function quickSort(arr, left, right) {
  if (!Array.isArray(arr) || arr.length <= 1 || left > right)
    return arr
  const len = arr.length
  left = typeof left === 'number' ? left : 0
  right = typeof right === 'number' ? right : len - 1
  const index = partition(arr, left, right)
  quickSort(arr, left, index - 1)
  quickSort(arr, index + 1, right)
  return arr
}

function partition(arr, left, right) {
  const pivot = arr[left]
  while (left < right) {
    while (arr[right] >= pivot && left < right) {
      right--
    }
    arr[left] = arr[right]
    while (arr[left] < pivot && left < right) {
      left++
    }
    arr[right] = arr[left]
  }
  arr[left] = pivot
  return left
}
```
