---
url: /czxBlog/type-challenges/medium/last-of-array/index.md
---
## 题目

Github: [Last of array](https://github.com/type-challenges/type-challenges/blob/main/questions/00015-medium-last/)

实现一个通用`Last<T>`，它接受一个数组T并返回其最后一个元素的类型。

```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type tail1 = Last<arr1> // expected to be 'c'
type tail2 = Last<arr2> // expected to be 1
```

## 解题思路

我们可以直接使用 **条件类型** 将数组的最后一个元素推导出来。

## 答案

```ts
type Last<T extends any[]> = T extends [...any[], infer R] ? R : never
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type Last<T extends any[]> = T extends [...any[], infer R] ? R : never

// ---cut---
type cases = [
  Expect<Equal<Last<[]>, never>>,
  Expect<Equal<Last<[2]>, 2>>,
  Expect<Equal<Last<[3, 2, 1]>, 1>>,
  Expect<Equal<Last<[() => 123, { a: string }]>, { a: string }>>,
]
```

## 参考

* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [条件类型内推断 Inferring Within Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
* [可变参数元组类型 Variadic Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)
