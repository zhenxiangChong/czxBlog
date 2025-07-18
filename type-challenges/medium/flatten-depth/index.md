---
url: /czxBlog/type-challenges/medium/flatten-depth/index.md
---
## 题目

递归地将数组扁平化，最多进行 `depth` 次。

```ts
type a = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2> // [1, 2, 3, 4, [5]]. 展开 2 次
type b = FlattenDepth<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, [[5]]]. 深度默认为 1
```

如果提供了深度，则保证其为正整数。

## 解题思路

我们已经在 [Flatten](./459.flatten.md) 这个挑战中知道应该如何将一个数组完全扁平化。

```ts
type Flatten<T extends unknown[]> = T extends [infer F, ...infer R]
  ? F extends unknown[]
    ? [...Flatten<F>, ...Flatten<R>]
    : [F, ...Flatten<R>]
  : T
```

同样的思路可以应用到这个挑战多，只是多了一个限制条件，即最多进行 `depth` 次。

在 类型参数中添加一个 `Depth` 类型参数，表示最大次数。由于在 Typescript 中并不支持运算操作，
但我们可以通过给 元组添加成员，再获取元组的长度 来实现累加，添加一个 `R` 类型参数保存元组：

```ts
type FlattenDepth<
  T extends unknown[],
  Depth extends number = 1,
  R extends unknown[] = []
> = T extends [infer F, ...infer O]
  ? F extends unknown[]
    ? [...FlattenDepth<F, Depth, R>, ...FlattenDepth<O, Depth, R>]
  //     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //     实际只在这里进行一次展开
    : [F, ...FlattenDepth<O, Depth, R>]
  : T
```

我们只需要在实际展开的位置，在类型参数 `R` 中添加成员，通过 `R['length']` 获取最新长度，
判断是否达到 `Depth` 的最大限制。

## 答案

```ts
type FlattenDepth<
  T extends unknown[],
  Depth extends number = 1,
  R extends unknown[] = []
> = R['length'] extends Depth
  ? T
  : T extends [infer F, ...infer O]
    ? F extends unknown[]
      ? [...FlattenDepth<F, Depth, [unknown, ...R]>, ...FlattenDepth<O, Depth, R>]
      : [F, ...FlattenDepth<O, Depth, R>]
    : T
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type FlattenDepth<
  T extends unknown[],
  Depth extends number = 1,
  R extends unknown[] = []
> = R['length'] extends Depth
  ? T
  : T extends [infer F, ...infer O]
    ? F extends unknown[]
      ? [...FlattenDepth<F, Depth, [unknown, ...R]>, ...FlattenDepth<O, Depth, R>]
      : [F, ...FlattenDepth<O, Depth, R>]
    : T

// ---cut---
type cases = [
  Expect<Equal<FlattenDepth<[]>, []>>,
  Expect<Equal<FlattenDepth<[1, 2, 3, 4]>, [1, 2, 3, 4]>>,
  Expect<Equal<FlattenDepth<[1, [2]]>, [1, 2]>>,
  Expect<Equal<FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2>, [1, 2, 3, 4, [5]]>>,
  Expect<Equal<FlattenDepth<[1, 2, [3, 4], [[[5]]]]>, [1, 2, 3, 4, [[5]]]>>,
  Expect<Equal<FlattenDepth<[1, [2, [3, [4, [5]]]]], 3>, [1, 2, 3, 4, [5]]>>,
  Expect<Equal<FlattenDepth<[1, [2, [3, [4, [5]]]]], 19260817>, [1, 2, 3, 4, 5]>>,
]
```

## 参考

* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [条件类型中的类型推断 Type Inference in Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
* [递归条件类型 Recursive Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types)
* [可变元组类型 Variadic Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)
