---
url: /czxBlog/interview-question/5z48vy52/index.md
---
::: tip 提问

1. 选择排序
2. 实现

:::

## 选择排序

选择排序，首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。

## 实现

```js
function selectSort(arr) {
  if (!Array.isArray(arr) || arr.length <= 1)
    return arr
  const len = arr.length
  for (let i = 0; i < len - 1; i++) {
    let minIndex = i
    for (let j = i + 1; j < len; j++) {
      if (arr[minIndex] > arr[j]) {
        minIndex = j
      }
    }
    ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
  }
  return arr
}
```
