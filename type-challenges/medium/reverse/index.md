---
url: /czxBlog/type-challenges/medium/reverse/index.md
---
## 题目

Github: [Reverse](https://github.com/type-challenges/type-challenges/blob/main/questions/03192-medium-reverse/README.zh-CN.md)

实现类型版本的数组反转 `Array.reverse`

```ts
type a = Reverse<['a', 'b']> // ['b', 'a']
type b = Reverse<['a', 'b', 'c']> // ['c', 'b', 'a']
```

## 解题思路

略。

## 答案

```ts
type Reverse<T extends unknown[]> = T extends [infer L, ...infer O]
  ? [...Reverse<O>, L]
  : T
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type Reverse<T extends unknown[]> = T extends [infer L, ...infer O]
  ? [...Reverse<O>, L]
  : T

// ---cut---
type cases = [
  Expect<Equal<Reverse<[]>, []>>,
  Expect<Equal<Reverse<['a', 'b']>, ['b', 'a']>>,
  Expect<Equal<Reverse<['a', 'b', 'c']>, ['c', 'b', 'a']>>,
]

type errors = [
  // @ts-expect-error
  Reverse<'string'>,
  // @ts-expect-error
  Reverse<{ key: 'value' }>,
]
```

## 参考

* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [在条件类型中进行推断 Inferring within conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
* [递归条件类型 Recursive conditional types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types)
