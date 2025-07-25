---
url: /czxBlog/type-challenges/medium/trim-left/index.md
---
## 题目

Github: [TrimLeft](https://github.com/type-challenges/type-challenges/blob/main/questions/00106-medium-trimleft/)

实现 `TrimLeft<T>` ，它接收确定的字符串类型并返回一个新的字符串，
其中新返回的字符串删除了原字符串开头的空白字符串。

```ts
type trimed = TrimLeft<'  Hello World  '> // 应推导出 'Hello World  '
```

## 解题思路

这里我们需要使用 [模板字面量类型](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types) ，对 字符串进行建模。

我们需要处理两种情况，左边有空格的字符串和没有空格的字符串。
如果我们有空格，我们需要推断字符串的另一部分并再次检查它是否有空格，否则，我们返回推断的部分而不做任何更改。

```ts
type TrimLeft<S extends string> = S extends `${' '}${infer R}` ? TrimLeft<R> : S
```

除了需要检查 空格，还需要检查换行符和制表符。

## 答案

```ts
type TrimLeft<S extends string> =
  S extends `${' ' | '\n' | '\t'}${infer R}` ? TrimLeft<R> : S
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type TrimLeft<S extends string> =
  S extends `${' ' | '\n' | '\t'}${infer R}` ? TrimLeft<R> : S

// ---cut---
type cases = [
  Expect<Equal<TrimLeft<'str'>, 'str'>>,
  Expect<Equal<TrimLeft<' str'>, 'str'>>,
  Expect<Equal<TrimLeft<'     str'>, 'str'>>,
  Expect<Equal<TrimLeft<'     str     '>, 'str     '>>,
  Expect<Equal<TrimLeft<'   \n\t foo bar '>, 'foo bar '>>,
  Expect<Equal<TrimLeft<''>, ''>>,
  Expect<Equal<TrimLeft<' \n\t'>, ''>>,
]
```

## 参考

* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [条件类型中的类型推断 Type Inference in Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
* [递归条件类型 Recursive Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types)
* [模板字面量类型 Template Literal Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types)
