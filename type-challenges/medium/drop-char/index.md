---
url: /czxBlog/type-challenges/medium/drop-char/index.md
---
## 题目

Github: [DropChar](https://github.com/type-challenges/type-challenges/blob/main/questions/02070-medium-drop-char/)

从字符串中剔除指定字符。

```ts
type Butterfly = DropChar<' b u t t e r f l y ! ', ' '> // 'butterfly!'
```

## 解题思路

这个挑战相对来说很简单，可以通过 模板字面量类型 和 条件类型 快速解决。

需要注意的是， 当`C` 是 `''` 时，可能会导致递归太深的问题，因此当 `C` 为 `''` 时，需要直接返回 `S` 。

## 答案

```ts
type DropChar<S extends string, C extends string> = C extends ''
  ? S
  : S extends `${infer L}${C}${infer R}`
    ? DropChar<`${L}${R}`, C>
    : S
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type DropChar<S extends string, C extends string> = C extends ''
  ? S
  : S extends `${infer L}${C}${infer R}`
    ? DropChar<`${L}${R}`, C>
    : S

// ---cut---
type cases = [
  // @ts-expect-error
  Expect<Equal<DropChar<'butter fly!', ''>, 'butterfly!'>>,
  Expect<Equal<DropChar<'butter fly!', ' '>, 'butterfly!'>>,
  Expect<Equal<DropChar<'butter fly!', '!'>, 'butter fly'>>,
  Expect<Equal<DropChar<'    butter fly!        ', ' '>, 'butterfly!'>>,
  Expect<Equal<DropChar<' b u t t e r f l y ! ', ' '>, 'butterfly!'>>,
  Expect<Equal<DropChar<' b u t t e r f l y ! ', 'b'>, '  u t t e r f l y ! '>>,
  Expect<Equal<DropChar<' b u t t e r f l y ! ', 't'>, ' b u   e r f l y ! '>>,
]
```

## 参考

* [模板字面量类型 Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [条件类型中的类型推断 Type Inference in Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
* [递归条件类型 Recursive Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types)
