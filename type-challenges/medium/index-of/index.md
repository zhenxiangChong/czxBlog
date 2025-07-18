---
url: /czxBlog/type-challenges/medium/index-of/index.md
---
## 题目

Github: [IndexOf](https://github.com/type-challenges/type-challenges/blob/main/questions/05153-medium-indexof/)

实现数组的索引查找类型版本，`indexOf<T, U>` 接收一个数组 `T` 和任意类型 `U`，
并返回数组 `T` 中第一个 `U` 类型的元素的索引。

```ts
type Res = IndexOf<[1, 2, 3], 2> // expected to be 1
type Res1 = IndexOf<[2, 6, 3, 8, 4, 1, 7, 3, 9], 3> // expected to be 2
type Res2 = IndexOf<[0, 0, 0], 2> // expected to be -1
```

## 解题思路

本挑战的难点在于 如何判断一个类型是否严格等于另一个类型。

对于此难点，请参考 [类型系统的真假美猴王：破解 IsEqual\<X, Y> 之谜](../../../1.前端/12.TypeScript/isEqual.md)

通过 条件类型 `infer`，从数组 `T` 中，通过递归的方式取出一个个元素，判断是否严格等于类型 `U`，
如果是，则直接返回 `R['length']` 的长度，否则继续递归取下一个元素，并为 `R` 添加一个元素。

由于开始递归时，类型`R` 为空数组，因此此时的 `R['length']` 恰好 为 `0`。

## 答案

```ts
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false

type IndexOf<T extends unknown[], U, R extends unknown[] = []> =
  T extends [infer F, ...infer O]
    ? Equal<U, F> extends true
      ? R['length']
      : IndexOf<O, U, [unknown, ...R]>
    : -1
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type IndexOf<T extends unknown[], U, R extends unknown[] = []> =
  T extends [infer F, ...infer O]
    ? Equal<U, F> extends true
      ? R['length']
      : IndexOf<O, U, [unknown, ...R]>
    : -1

// ---cut---
type cases = [
  Expect<Equal<IndexOf<[1, 2, 3], 2>, 1>>,
  Expect<Equal<IndexOf<[2, 6, 3, 8, 4, 1, 7, 3, 9], 3>, 2>>,
  Expect<Equal<IndexOf<[0, 0, 0], 2>, -1>>,
  Expect<Equal<IndexOf<[string, 1, number, 'a'], number>, 2>>,
  Expect<Equal<IndexOf<[string, 1, number, 'a', any], any>, 4>>,
  Expect<Equal<IndexOf<[string, 'a'], 'a'>, 1>>,
  Expect<Equal<IndexOf<[any, 1], 1>, 1>>,
]
```

## 参考

* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [条件类型中的类型推断 Type Inference in Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
* [可变元组类型 Variadic Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)
* [索引访问类型 Indexed Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
