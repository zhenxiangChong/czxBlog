---
url: /czxBlog/type-challenges/medium/trim/index.md
---
## 题目

Github: [Trim](https://github.com/type-challenges/type-challenges/blob/main/questions/00108-medium-trim/)

实现 `Trim<T>`，它接受一个明确的字符串类型，并返回一个新字符串，其中两端的空白符都已被删除。

```ts
type trimed = Trim<'  Hello World  '> // 应推导出 'Hello World'
```

## 解题思路

此挑战的解题思路与 [中等 > 去除左侧空白](./trimRight.md) 类似，只是需要处理两端的空白字符。
因此我们可以将问题拆解为，先删除左边的空白字符，然后再删除右边的空白字符。

## 答案

```ts
type Whitespace = ' ' | '\n' | '\t'
type Trim<S extends string> = S extends `${Whitespace}${infer R}`
  ? Trim<R>
  : S extends `${infer L}${Whitespace}`
    ? Trim<L>
    : S
```

## 验证

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type Whitespace = ' ' | '\n' | '\t'
type Trim<S extends string> = S extends `${Whitespace}${infer R}`
  ? Trim<R>
  : S extends `${infer L}${Whitespace}`
    ? Trim<L>
    : S

// ---cut---
type cases = [
  Expect<Equal<Trim<'str'>, 'str'>>,
  Expect<Equal<Trim<' str'>, 'str'>>,
  Expect<Equal<Trim<'     str'>, 'str'>>,
  Expect<Equal<Trim<'str   '>, 'str'>>,
  Expect<Equal<Trim<'     str     '>, 'str'>>,
  Expect<Equal<Trim<'   \n\t foo bar \t'>, 'foo bar'>>,
  Expect<Equal<Trim<''>, ''>>,
  Expect<Equal<Trim<' \n\t '>, ''>>,
]
```

## 参考

* [联合类型 Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [条件类型中的类型推断 Type Inference in Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
* [递归条件类型 Recursive Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types)
* [模板字面量类型 Template Literal Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types)
