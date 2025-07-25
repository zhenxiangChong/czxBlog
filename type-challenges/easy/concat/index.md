---
url: /czxBlog/type-challenges/easy/concat/index.md
---
## 题目

Github: [Concat](https://github.com/type-challenges/type-challenges/blob/main/questions/00533-easy-concat/)

在类型系统里实现 JavaScript 内置的 `Array.concat` 方法，这个类型接受两个参数，
返回的新数组类型应该按照输入参数从左到右的顺序合并为一个新的数组。

```ts
type Result = Concat<[1], [2]> // expected to be [1, 2]
```

## 解题思路

泛型参数 `T` `U` 约束为可变元组类型，通过 数组展开，合并到新的数组中。

## 答案

```ts
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U]
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U]
// ---cut---
type Result = Concat<[1], [2]>

type test = Expect<Equal<Result, [1, 2]>>
```

## 参考

> * [可变元组 Variadic Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)
