---
url: /czxBlog/type-challenges/medium/replace-all/index.md
---
## 题目

Github: [ReplaceAll](https://github.com/type-challenges/type-challenges/blob/main/questions/00119-medium-replaceall/)

实现 `ReplaceAll<S, From, To>` 将一个字符串 `S` 中的所有子字符串 `From` 替换为 `To` 。

```ts
type replaced = ReplaceAll<'t y p e s', ' ', ''> // 期望是 'types'
```

## 解题思路

与 [`Replace`](./116.replace.md) 类似，在 **Replace** 挑战中，我们将字符串 `S` 拆分为 `F` 、 `From` 、 `R` 三个部分，
然后对 `From` 进行替换， 在完成替换后，我们需要继续对 `R` 进行替换，直到 `R` 为不包含 `From` 的字符串。

## 答案

```ts
type ReplaceAll<S extends string, From extends string, To extends string> =
  From extends ''
    ? S
    : S extends `${infer F}${From}${infer R}`
      ? `${F}${To}${ReplaceAll<R, From, To>}`
      : S
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type ReplaceAll<S extends string, From extends string, To extends string> =
  From extends ''
    ? S
    : S extends `${infer F}${From}${infer R}`
      ? `${F}${To}${ReplaceAll<R, From, To>}`
      : S
// ---cut---
type cases = [
  Expect<Equal<ReplaceAll<'foobar', 'bar', 'foo'>, 'foofoo'>>,
  Expect<Equal<ReplaceAll<'foobar', 'bag', 'foo'>, 'foobar'>>,
  Expect<Equal<ReplaceAll<'foobarbar', 'bar', 'foo'>, 'foofoofoo'>>,
  Expect<Equal<ReplaceAll<'t y p e s', ' ', ''>, 'types'>>,
  Expect<Equal<ReplaceAll<'foobarbar', '', 'foo'>, 'foobarbar'>>,
  Expect<Equal<ReplaceAll<'barfoo', 'bar', 'foo'>, 'foofoo'>>,
  Expect<Equal<ReplaceAll<'foobarfoobar', 'ob', 'b'>, 'fobarfobar'>>,
  Expect<Equal<ReplaceAll<'foboorfoboar', 'bo', 'b'>, 'foborfobar'>>,
  Expect<Equal<ReplaceAll<'', '', ''>, ''>>,
]
```

## 参考

* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [条件类型中的类型推断 Type Inference in Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
* [模板字面量类型 Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
