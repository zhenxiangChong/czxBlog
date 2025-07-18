---
url: /czxBlog/interview-question/at4kz32a/index.md
---
::: tip 提问

1. 插入排序
2. 实现

:::

## 插入排序

一种简单直观的排序算法。它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。

### 过程

1. 从第一个元素开始，该元素可以认为已经被排序；
2. 取出下一个元素，在已经排序的元素序列中从后向前扫描；
3. 如果该元素（已排序）大于新元素，将该元素移到下一位置；
4. 重复步骤3，直到找到已排序的元素小于或者等于新元素的位置；
5. 将新元素插入到该位置后；
6. 重复步骤2~5。

## 实现

```js
function insertSort(arr) {
  if (!Array.isArray(arr) || arr.length <= 1)
    return arr
  const len = arr.length
  for (let i = 1; i < len; i++) {
    let tmp = arr[i]
    let j = i
    while (j - 1 >= 0 && arr[j - 1] > tmp) {
      arr[j] = arr[j - 1]
      j--
    }
    arr[j] = tmp
  }
  return arr
}
```
