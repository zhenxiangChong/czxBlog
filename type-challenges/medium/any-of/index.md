---
url: /czxBlog/type-challenges/medium/any-of/index.md
---
## 题目

Github: [AnyOf](https://github.com/type-challenges/type-challenges/blob/main/questions/00949-medium-anyof/)

在类型系统中实现类似于 `Python` 中 `any` 函数。类型接收一个数组，如果数组中任一个元素为真，
则返回 `true`，否则返回 `false`。如果数组为空，返回 `false`。

```ts
type Sample1 = AnyOf<[1, '', false, [], {}]> // expected to be true.
type Sample2 = AnyOf<[0, '', false, [], {}]> // expected to be false.
```

## 解题思路

我们可以使用 `T[number]` 从 `T` 中获取每个元素的类型，然后使用 `extends` 来判断每个元素是否不为真。

为方便比较，我们可以使用 `Falsely` 类型来表示不为真的元素。

## 答案

```ts
type Falsely = 0 | '' | false | undefined | null | [] | { [k: string]: never }
type AnyOf<T extends readonly any[]> = T[number] extends Falsely ? false : true
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type Falsely = 0 | '' | false | undefined | null | [] | { [k: string]: never }
type AnyOf<T extends readonly any[]> = T[number] extends Falsely ? false : true

// ---cut---
type cases = [
  Expect<Equal<AnyOf<[1, 'test', true, [1], { name: 'test' }, { 1: 'test' }]>, true>>,
  Expect<Equal<AnyOf<[1, '', false, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, 'test', false, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, '', true, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [1], {}]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [], { name: 'test' }]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [], { 1: 'test' }]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [], { name: 'test' }, { 1: 'test' }]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [], {}, undefined, null]>, false>>,
  Expect<Equal<AnyOf<[]>, false>>,
]
```

## 参考

* [联合类型 Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [可变元组类型 Variadic Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)
* [泛型 Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
