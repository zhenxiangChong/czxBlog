---
url: /czxBlog/type-challenges/medium/join/index.md
---
## 题目

Github: [Join](https://github.com/type-challenges/type-challenges/blob/main/questions/05310-medium-join/)

实现数组类型的 `Array.join` 版本，`Join<T, U>` 接受一个数组 `T`，字符串或数字 `U`，并返回用 `U` 拼接后的数组 `T`。

```ts
type Res = Join<['a', 'p', 'p', 'l', 'e'], '-'> // expected to be 'a-p-p-l-e'
type Res1 = Join<['Hello', 'World'], ' '> // expected to be 'Hello World'
type Res2 = Join<['2', '2', '2'], 1> // expected to be '21212'
type Res3 = Join<['o'], 'u'> // expected to be 'o'
```

## 解题思路

略。

## 答案

```ts
type Join<T extends any[], U extends string | number = ','> =
  T extends [infer F, ...infer O]
    ? O['length'] extends 0
      ? `${F & string}`
      : `${F & string}${U}${Join<O, U>}`
    : ''
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type Join<T extends any[], U extends string | number = ','> =
  T extends [infer F, ...infer O]
    ? O['length'] extends 0
      ? `${F & string}`
      : `${F & string}${U}${Join<O, U>}`
    : ''

// ---cut---
type cases = [
  Expect<Equal<Join<['a', 'p', 'p', 'l', 'e'], '-'>, 'a-p-p-l-e'>>,
  Expect<Equal<Join<['Hello', 'World'], ' '>, 'Hello World'>>,
  Expect<Equal<Join<['2', '2', '2'], 1>, '21212'>>,
  Expect<Equal<Join<['o'], 'u'>, 'o'>>,
  Expect<Equal<Join<[], 'u'>, ''>>,
  Expect<Equal<Join<['1', '1', '1']>, '1,1,1'>>,
]
```

## 参考

* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [条件类型中的类型推断 Type Inference in Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
* [模板字面量类型 Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
