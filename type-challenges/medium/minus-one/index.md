---
url: /czxBlog/type-challenges/medium/minus-one/index.md
---
## 题目

Github: [MinusOne](https://github.com/type-challenges/type-challenges/blob/main/questions/02257-medium-minusone/)

给定一个正整数作为类型的参数，要求返回的类型是该数字减 1。

```ts
type Zero = MinusOne<1> // 0
type FiftyFour = MinusOne<55> // 54
```

## 解题思路

这个挑战咋一看似乎很简单，但是别忘了，Typescript 类型系统是不支持 算术运算 的，即无法直接进行
加减乘除运算，这让我们即便是实现 **减去一** 都变得不那么简单了。

一开始，我想到的是利用 可变元祖类型 的长度，通过 将特定长度的元组删去一个成员，然后通过 `T['length']` 获取
新的长度 实现 减一。

```ts
type MinusOne<T extends number, R extends unknown[] = []> = R['length'] extends T
  ? R extends [infer _, ...infer O] ? O['length'] : never
  : MinusOne<T, [unknown, ...R]>
```

这个实现看起来完成了这个挑战，但是却存在潜在的问题。

**发现了吗，`T` 的值越大，递归的深度越深！**

我们找一个比较大一点的数试试：

```ts twoslash
// @errors: 2589
type MinusOne<T extends number, R extends unknown[] = []> = R['length'] extends T
  ? R extends [infer _, ...infer O] ? O['length'] : never
  : MinusOne<T, [unknown, ...R]>
// ---cut---
type n = MinusOne<1100>
```

很显然，这已经超过 Typescript 的递归深度限制了，而且由于 递归深度太深，需要消耗的时间也非常夸张，
这显然是不可接受的。

> 以下解答来自于 [#13507](https://github.com/type-challenges/type-challenges/issues/13507) 。

我们回归到 减法运算本身，对数字减去 `1`，以个位数的运算如下：

* `9 - 1 = 8`
* `8 - 1 = 7`
* `7 - 1 = 6`
* ...
* `1 - 1 = 0`

当个位数为 `0` ，减去 `1`时 ，则 个位数 变为 `9`，同时 十位数 也需要减去 `1`。

在十位数上为 `0` 减去 `1` 时，十位数变更为 `9`，同时 百位数也需要减去 `1`。

千位数、万位数、 ... 以此类推。

这告诉我们，可以单独处理每位数的运算，在当前位数为 `0`时，则继续对下一位数进行处理。

太棒了，我们不再需要创建一个冗长的元组，再用元组的长度去求值！现在，迭代深度只跟数字的位数相关！

为了便于处理，我们需要先将 数字转为 字符串，然后通过 模板字面量类型中的类型推理，取出数字中的每一位数。

由于 `T extends ${infer F}${infer R}` 是从左往右依次提取单个字符 `F`, 我们可以先将 数字字符串进行翻转，
在完成处理后再翻转回来。

```ts
type ReverseString<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${ReverseString<Rest>}${First}`
  : ''

type MinusOne<T extends number> = ReverseString<`${T}`>
```

接下来，我们对单个位数进行 减 `1` 处理。由于现在我们只需要考虑 10 个 数字的 减 `1` 操作，因为我们
可以取巧，直接用元组保存运算结果，以 元组索引作为原始值，以索引对应的值作为 减 `1` 后的结果：

```ts
type Result<Index extends number> = [9, 0, 1, 2, 3, 4, 5, 6, 7, 8][Index]
```

比如索引为 `7` 时，取得的值为 `6`。

现在，我们从 数字字符串中取出每一位数，进行处理：

```ts
type InternalMinusOne<
  S extends string
> = S extends `${infer Digit extends number}${infer Rest}`
  ? never
  : never
```

你可能注意到，`infer Digit extends number`，这是为了约束在 模板字面量类型中的类型推理时， `Digit` 约束为
`number` 类型，因为 **元组的索引类型应该为 `number`** ，否则无法访问元组中的成员。

对于取出的 `Digit` ，当其值为 `0` 时，我们需要继续处理剩余位数，而非 `0` 时，则可以直接从 `Result<T>`
中取出结果，与剩余的 `Rest` 拼接得到结果：

```ts
type InternalMinusOne<
  S extends string
> = S extends `${infer Digit extends number}${infer Rest}`
  ? Digit extends 0
    ? `9${InternalMinusOne<Rest>}`
    : `${[9, 0, 1, 2, 3, 4, 5, 6, 7, 8][Digit]}${Rest}`
  : never

type MinusOne<T extends number> = InternalMinusOne<ReverseString<`${T}`>>
```

处理完成后，得到的结果别忘了需要重新翻转回来：

```ts
type MinusOne<T extends number> = ReverseString<InternalMinusOne<ReverseString<`${T}`>>>
```

同时还需要注意，在数字的高位数，可能是以 `0` 开头，还需要删除起始的 `0`：

```ts
type RemoveLeadingZeros<S extends string> = S extends '0'
  ? S
  : S extends `${'0'}${infer R}`
    ? RemoveLeadingZeros<R>
    : S

type MinusOne<T extends number> = RemoveLeadingZeros<
  ReverseString<InternalMinusOne<ReverseString<`${T}`>>>
>
```

此时，我们已经得到了 减 `1` 结果的 数字字符串，还需要将其转为 `number` 类型：

```ts
type ParseInt<T extends string> = T extends `${infer Digit extends number}`
  ? Digit
  : never

type MinusOne<T extends number> = ParseInt<RemoveLeadingZeros<
  ReverseString<InternalMinusOne<ReverseString<`${T}`>>>
>>
```

理论上此方法可以处理非常大的数，但由于 `number` 类型的限制，它允许的边界最大值为 2^53^ 。
即 `9007199254740991` 。

## 答案

```ts
type ParseInt<T extends string> = T extends `${infer Digit extends number}`
  ? Digit
  : never

type ReverseString<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${ReverseString<Rest>}${First}`
  : ''

type RemoveLeadingZeros<S extends string> = S extends '0'
  ? S
  : S extends `${'0'}${infer R}`
    ? RemoveLeadingZeros<R>
    : S

type InternalMinusOne<
  S extends string
> = S extends `${infer Digit extends number}${infer Rest}`
  ? Digit extends 0
    ? `9${InternalMinusOne<Rest>}`
    : `${[9, 0, 1, 2, 3, 4, 5, 6, 7, 8][Digit]}${Rest}`
  : never

type MinusOne<T extends number> = ParseInt<RemoveLeadingZeros<
  ReverseString<InternalMinusOne<ReverseString<`${T}`>>>
>>
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type ParseInt<T extends string> = T extends `${infer Digit extends number}`
  ? Digit
  : never

type ReverseString<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${ReverseString<Rest>}${First}`
  : ''

type RemoveLeadingZeros<S extends string> = S extends '0'
  ? S
  : S extends `${'0'}${infer R}`
    ? RemoveLeadingZeros<R>
    : S

type InternalMinusOne<
  S extends string
> = S extends `${infer Digit extends number}${infer Rest}`
  ? Digit extends 0
    ? `9${InternalMinusOne<Rest>}`
    : `${[9, 0, 1, 2, 3, 4, 5, 6, 7, 8][Digit]}${Rest}`
  : never

type MinusOne<T extends number> = ParseInt<RemoveLeadingZeros<
  ReverseString<InternalMinusOne<ReverseString<`${T}`>>>
>>

// ---cut---
type cases = [
  Expect<Equal<MinusOne<1>, 0>>,
  Expect<Equal<MinusOne<55>, 54>>,
  Expect<Equal<MinusOne<3>, 2>>,
  Expect<Equal<MinusOne<100>, 99>>,
  Expect<Equal<MinusOne<1101>, 1100>>,
  Expect<Equal<MinusOne<9_007_199_254_740_992>, 9_007_199_254_740_991>>,
]
```

## 参考

* [模板字面量类型 Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [条件类型中的类型推断 Type Inference in Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
* [递归条件类型 Recursive Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types)
* [改进模板字符串类型中推断类型的推理能力 improved inference for infer types in template string types](https://devblogs.microsoft.com/typescript/announcing-typescript-4-8-beta/#improved-inference-for-infer-types-in-template-string-types)
