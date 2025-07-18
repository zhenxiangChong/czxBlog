---
url: /czxBlog/type-challenges/medium/greater-than/index.md
---
## 题目

Github: [GreaterThan](https://github.com/type-challenges/type-challenges/blob/main/questions/04425-medium-greater-than/)

在此挑战中，您需要实现一个类型 `GreaterThan<T, U>`，类似于 `T > U`。

无需考虑负数。

```ts
GreaterThan<2, 1> // should be true
GreaterThan<1, 1> // should be false
GreaterThan<10, 100> // should be false
GreaterThan<111, 11> // should be true
```

## 解题思路

比较大小在 JavaScript 中是非常容易的事情，但是放到 typescript 的类型系统中，就不那么容易了。
typescript 的类型系统并不支持这些数学运算。

对于这个挑战，一开始很容易想到利用 数组 的特性来解决，通过构建两个长度为 `T` 和 `U` 的数组，判断
`ArrU` 是否是 `ArrT` 的子集，如果是的话，那么 `T` 就比 `U` 大，反之则不是。对于构建特定长度的数组，
可以使用递归的方式来实现。

```ts
type LenToArr<T extends number, R extends any[] = []> = R['length'] extends T
  ? R
  : LenToArr<T, [...R, 0]>

type GreaterThan<T extends number, U extends number> =
  LenToArr<U> extends [...LenToArr<T>, ...infer _] ? false : true
```

我们使用这个实现来进行验证：

```ts twoslash
// @errors: 2589
import type { Equal, Expect, NotEqual } from '~/tc-utils'

type LenToArr<T extends number, R extends any[] = []> = R['length'] extends T
  ? R
  : LenToArr<T, [...R, 0]>

type GreaterThan<T extends number, U extends number> =
  LenToArr<U> extends [...LenToArr<T>, ...infer _] ? false : true

// ---cut---
type cases = [
  Expect<Equal<GreaterThan<1, 0>, true>>,
  Expect<Equal<GreaterThan<5, 4>, true>>,
  Expect<Equal<GreaterThan<4, 5>, false>>,
  Expect<Equal<GreaterThan<0, 0>, false>>,
  Expect<Equal<GreaterThan<10, 9>, true>>,
  Expect<Equal<GreaterThan<20, 20>, false>>,
  Expect<Equal<GreaterThan<10, 100>, false>>,
  Expect<Equal<GreaterThan<111, 11>, true>>,
  Expect<Equal<GreaterThan<13, 12>, true>>,
  Expect<Equal<GreaterThan<1234567891011, 1234567891010>, true>>,
]
```

可以看到，在数字比较小时，通过 递归实现的类型是可以通过的，但是在大数字时，会出现错误，
这是因为 typescript 的类型系统对递归有深度限制。

因此，通过递归实现并不是最优解。

我们不妨将数字转为字符串，通过比对字符串来实现，这可以避免递归深度的问题。

我们可以延续 [minus one](./2257.minusOne.md) 挑战中的思路，将数字转为字符串，然后分别对相对应
的位数进行比较，最终得到结果。

**对于两个不同的十以内的数，通过检查这两个数分别位于 `0123456789` 的位置判断大小：**

```ts
type GreaterThan<T extends number, U extends number> =
  '0123456789' extends `${string}${T}${string}${U}${string}`
    ? false
    : true
```

当 `T` 位于 `U` 的左侧时，则说明 `T` 小于 `U`, 反之则 `T` 大于 `U`。

**检查两个数字字符串的长度，根据长度判断大小：**

```ts
type DigitCountArr<T extends string> = T extends `${string}${infer R}`
  ? [0, ...DigitCountArr<R>]
  : []

type DigitCountCompare<
  T extends number,
  U extends number
> = '0123456789' extends `${string}${T}${string}${U}${string}`
  ? '<'
  : '0123456789' extends `${string}${U}${string}${T}${string}`
    ? '>'
    : '='
```

**当两个数字字符串的长度相同时，分别对每位位数进行比较：**

```ts
type GreaterThanSameDigitCount<
  T extends number | string,
  U extends number | string
> = `${T}` extends `${infer TF}${infer TR}`
  ? `${U}` extends `${infer UF}${infer UR}`
    ? TF extends UF
      ? GreaterThanSameDigitCount<TR, UR>
      : '0123456789' extends `${string}${TF}${string}${UF}${string}`
        ? false
        : true
    : true
  : false
```

## 答案

```ts
type DigitCountArr<T extends string> = T extends `${string}${infer R}`
  ? [0, ...DigitCountArr<R>]
  : []

type DigitCountCompare<
  T extends number,
  U extends number
> = '0123456789' extends `${string}${T}${string}${U}${string}`
  ? '<'
  : '0123456789' extends `${string}${U}${string}${T}${string}`
    ? '>'
    : '='

type GreaterThanSameDigitCount<
  T extends number | string,
  U extends number | string
> = `${T}` extends `${infer TF}${infer TR}`
  ? `${U}` extends `${infer UF}${infer UR}`
    ? TF extends UF
      ? GreaterThanSameDigitCount<TR, UR>
      : '0123456789' extends `${string}${TF}${string}${UF}${string}`
        ? false
        : true
    : true
  : false

type GreaterThan<
  T extends number | string,
  U extends number | string,
  C = DigitCountCompare<DigitCountArr<`${T}`>['length'], DigitCountArr<`${U}`>['length']>
> = C extends '='
  ? GreaterThanSameDigitCount<T, U>
  : C extends '>'
    ? true
    : false
```

## 验证

```ts twoslash
import type { Equal, Expect, NotEqual } from '~/tc-utils'

type DigitCountArr<T extends string> = T extends `${string}${infer R}` ? [0, ...DigitCountArr<R>] : []
type DigitCountCompare<T extends number, U extends number> = '0123456789' extends `${string}${T}${string}${U}${string}`
  ? '<'
  : '0123456789' extends `${string}${U}${string}${T}${string}`
    ? '>'
    : '='
type GreaterThanSameDigitCount<T extends number | string, U extends number | string> =
  `${T}` extends `${infer TF}${infer TR}`
    ? `${U}` extends `${infer UF}${infer UR}`
      ? TF extends UF
        ? GreaterThanSameDigitCount<TR, UR>
        : '0123456789' extends `${string}${TF}${string}${UF}${string}`
          ? false
          : true
      : true
    : false

type GreaterThan<
  T extends number | string,
  U extends number | string,
  C = DigitCountCompare<DigitCountArr<`${T}`>['length'], DigitCountArr<`${U}`>['length']>
> = C extends '='
  ? GreaterThanSameDigitCount<T, U>
  : C extends '>'
    ? true
    : false

// ---cut---
type cases = [
  Expect<Equal<GreaterThan<1, 0>, true>>,
  Expect<Equal<GreaterThan<5, 4>, true>>,
  Expect<Equal<GreaterThan<4, 5>, false>>,
  Expect<Equal<GreaterThan<0, 0>, false>>,
  Expect<Equal<GreaterThan<10, 9>, true>>,
  Expect<Equal<GreaterThan<20, 20>, false>>,
  Expect<Equal<GreaterThan<10, 100>, false>>,
  Expect<Equal<GreaterThan<111, 11>, true>>,
  Expect<Equal<GreaterThan<13, 12>, true>>,
  Expect<Equal<GreaterThan<1234567891011, 1234567891010>, true>>,
]
```

## 参考

* [泛型 Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
* [泛型约束 Generics constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [递归条件类型 Recursive Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types)
* [可变元组类型 Variadic Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)
* [模板字面量类型 Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
* [条件类型中的类型推断 Type Inference in Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
