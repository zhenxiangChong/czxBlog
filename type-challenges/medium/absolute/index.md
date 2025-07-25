---
url: /czxBlog/type-challenges/medium/absolute/index.md
---
## 题目

Github: [Absolute](https://github.com/type-challenges/type-challenges/blob/main/questions/00529-medium-absolute/)

实现一个接收 `string`, `number` 或 `bigInt` 类型参数的 `Absolute` 类型,返回一个 正数字符串。

```ts
type Test = -100
type Result = Absolute<Test> // expected to be "100"
```

## 解题思路

将一个负数转为正数的方法，很容易想到就是直接把负号 `-` 去掉，因此，可以使用模板字面量来实现。

首先将 `T` 转为字符串，然后判断是否该字符串是否以 `-` 字符开始。
如果是，就去掉 `-` 字符，否则返回原字符串。

## 答案

```ts
type Absolute<T extends number | string | bigint> =
  `${T}` extends `-${infer R}` ? R : `${T}`
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'
type Absolute<T extends number | string | bigint> = `${T}` extends `-${infer R}` ? R : `${T}`

// ---cut---
type cases = [
  Expect<Equal<Absolute<0>, '0'>>,
  Expect<Equal<Absolute<-0>, '0'>>,
  Expect<Equal<Absolute<10>, '10'>>,
  Expect<Equal<Absolute<-5>, '5'>>,
  Expect<Equal<Absolute<'0'>, '0'>>,
  Expect<Equal<Absolute<'-0'>, '0'>>,
  Expect<Equal<Absolute<'10'>, '10'>>,
  Expect<Equal<Absolute<'-5'>, '5'>>,
  Expect<Equal<Absolute<-1_000_000n>, '1000000'>>,
  Expect<Equal<Absolute<9_999n>, '9999'>>,
]
```

## 参考

* [模板字面量类型 Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [条件类型中的类型推断 Type Inference in Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
