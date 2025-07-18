---
url: /czxBlog/type-challenges/medium/shift/index.md
---
## 题目

Github: [Shift](https://github.com/type-challenges/type-challenges/blob/main/questions/03062-medium-shift/README.md)

实现 `Array.shift` 的类型版本

```ts
type Result = Shift<[3, 2, 1]> // [2, 1]
```

## 解题思路

略。

## 答案

```ts
type Shift<T extends unknown[]> = T extends [infer _, ...infer O] ? O : T
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type Shift<T extends unknown[]> = T extends [infer _, ...infer O] ? O : T

// ---cut---
type cases = [
  // @ts-expect-error
  Shift<unknown>,
  Expect<Equal<Shift<[]>, []>>,
  Expect<Equal<Shift<[1]>, []>>,
  Expect<Equal<Shift<[3, 2, 1]>, [2, 1]>>,
  Expect<Equal<Shift<['a', 'b', 'c', 'd']>, ['b', 'c', 'd']>>,
]
```

## 参考

* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [条件类型分支 Distributive Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)
* [元组类型 Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-3.html#tuple-types)
