---
url: /czxBlog/type-challenges/medium/zip/index.md
---
## 题目

Github: [Zip](https://github.com/type-challenges/type-challenges/blob/main/questions/04471-medium-zip/)

在此挑战中，您需要实现一个类型 `Zip<T, U>`，其中 `T` 和 `U` 必须是元组。

```ts
type exp = Zip<[1, 2], [true, false]> // expected to be [[1, true], [2, false]]
```

## 解题思路

这个挑战要求我们创建一个分组元素的数组，数组的第一个元素包含数组 `T` 和 `U` 的第一个元素，
数组的第二个元素包含数组 `T` 和 `U`的第二个元素，以此类推。

首先添加类型参数 `L` 用于保存分组元素的数组，初始值为空数组。

当 `L` 为空数组时，此时 数组长度 `L['length']` 为 `0`，我们恰好可以从数组 `T` 和 `U` 中通过索引下标获取第一个元素，
并将其添加到 `L` 中，此时 `L` 的类型结果为 `[T[0], U[0]]`，然后继续递归调用 `Zip` 。

当 `L` 的长度为 数组 `T` 或 `U` 的最小长度时，则表示递归结束。

## 答案

```ts
type Zip<T extends any[], U extends any[], L extends any[] = []> =
  L['length'] extends T['length'] | U['length']
    ? L
    : Zip<T, U, [...L, [T[L['length']], U[L['length']]]]>
```

## 验证

```ts twoslash
import type { Equal, Expect, NotEqual } from '~/tc-utils'

type Zip<T extends any[], U extends any[], L extends any[] = []> =
  L['length'] extends T['length'] | U['length']
    ? L
    : Zip<T, U, [...L, [T[L['length']], U[L['length']]]]>

// ---cut---
type cases = [
  Expect<Equal<Zip<[], []>, []>>,
  Expect<Equal<Zip<[1, 2], [true, false]>, [[1, true], [2, false]]>>,
  Expect<Equal<Zip<[1, 2, 3], ['1', '2']>, [[1, '1'], [2, '2']]>>,
  Expect<Equal<Zip<[], [1, 2, 3]>, []>>,
  Expect<Equal<Zip<[[1, 2]], [3]>, [[[1, 2], 3]]>>,
]
```

## 参考

* [泛型 Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
* [泛型约束 Generics constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [递归条件类型 Recursive Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types)
* [模板字面量类型 Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
* [索引访问类型 Indexed Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
