---
url: /czxBlog/type-challenges/medium/pop/index.md
---
## 题目

Github: [Pop](https://github.com/type-challenges/type-challenges/blob/main/questions/00016-medium-pop/)

实现一个通用`Pop<T>`，它接受一个数组 `T`，并返回一个由数组T的前 `N-1` 项以相同的顺序组成的数组。

```ts
type arr1 = ['a', 'b', 'c', 'd']
type arr2 = [3, 2, 1]

type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
type re2 = Pop<arr2> // expected to be [3, 2]
```

## 解题思路

我们需要将数组分成两部份：从头部到最后一个元素之前的所有内容和最后一个元素本身。
然后去掉最后一个元素并返回头部部分。

## 答案

```ts
type Pop<T extends any[]> = T extends [...infer R, unknown] ? R : T
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type Pop<T extends any[]> = T extends [...infer R, unknown] ? R : T

// ---cut---
type cases = [
  Expect<Equal<Pop<[3, 2, 1]>, [3, 2]>>,
  Expect<Equal<Pop<['a', 'b', 'c', 'd']>, ['a', 'b', 'c']>>,
  Expect<Equal<Pop<[]>, []>>,
]
```

## 参考

* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [条件类型内推断 Inferring Within Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
* [可变元组类型 Variadic Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)
