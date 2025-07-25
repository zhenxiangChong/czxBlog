---
url: /czxBlog/type-challenges/easy/includes/index.md
---
## 题目

Github: [Includes](https://github.com/type-challenges/type-challenges/blob/main/questions/00898-easy-includes/)

在类型系统里实现 JavaScript 的 Array.includes 方法，这个类型接受两个参数，返回的类型要么是 true 要么是 false。

```ts
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
```

::: note
这个挑战归类于 “简单” , 是欠妥的，它的难点在于，如果判断两个类型是 **全等** 的，但它的难度远比这个挑战本身要大得多。
:::

## 解题思路

本题解题的关键难点在于， 如何判断类型`U` 全等于 数组类型 `T` 中的某个成员。比如 `1` 虽然是 `number` 类型，但是
类型 `1`是继承 `number` 类型，而不是全等关系，因此 `1` 不能被认为是 `[number]` 数组的成员。

在 `TS` 类型系统中，实现 **全等判断**，需要通过 `extends` 关键词，以及 函数的返回值类型，才能正确的判断两个类型是否完全一致。

假设需要对比泛型参数 `<X, Y>` 是否全等，需要通过构造函数类型 `<T>() => T extends X ? 1 : 2`， 以及函数类型
`<T>() => T extends Y ? 1 : 2`，再通过 `extends` 关键词做条件类型，判断两个函数类型是否具有继承关系，即可间接推断
出类型 `X` 是否全等于类型`Y`。

```ts
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false
```

有了 `Equal<X, Y>` 类型工具，继续进一步的通过类型递归的方式，遍历数组类型`T`中的每一个成员，是否全等于类型`U`，
即可实现 `includes`。

通过构造 `T extends [infer F, ...infer O]` 条件类型推断，在条件为真时，使用 `infer F`取出数组的第一个元素
与 类型`U` 进行 `Equal`。如果对比为 `false` ，则继续将 `infer O` 获取的数组`T`剩余成员，继续传入 `Includes` 类型中递归对比。

## 答案

```ts
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false

type Includes<T extends readonly any[], U> = T extends [infer F, ...infer O]
  ? Equal<F, U> extends true
    ? true
    : Includes<O, U>
  : false
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'
type Includes<T extends readonly any[], U> = T extends [infer F, ...infer O]
  ? Equal<F, U> extends true
    ? true
    : Includes<O, U>
  : false

// ---cut---
type cases = [
  Expect<Equal<Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Kars'>, true>>,
  Expect<Equal<Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'>, false>>,
  Expect<Equal<Includes<[1, 2, 3, 5, 6, 7], 7>, true>>,
  Expect<Equal<Includes<[1, 2, 3, 5, 6, 7], 4>, false>>,

  Expect<Equal<Includes<[{}], { a: 'A' }>, false>>,
  Expect<Equal<Includes<[boolean, 2, 3, 5, 6, 7], false>, false>>,
  Expect<Equal<Includes<[true, 2, 3, 5, 6, 7], boolean>, false>>,
  Expect<Equal<Includes<[false, 2, 3, 5, 6, 7], false>, true>>,
  Expect<Equal<Includes<[{ a: 'A' }], { readonly a: 'A' }>, false>>,
  Expect<Equal<Includes<[{ readonly a: 'A' }], { a: 'A' }>, false>>,
  Expect<Equal<Includes<[1], 1 | 2>, false>>,
  Expect<Equal<Includes<[1 | 2], 1>, false>>,
  Expect<Equal<Includes<[null], undefined>, false>>,
  Expect<Equal<Includes<[undefined], null>, false>>,
]
```

## 参考

> * [泛型 Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
> * [泛型约束 Generics Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
> * [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
> * [条件类型分支 Distributive Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)
> * [条件类型中的类型推断 Type Inference in Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
