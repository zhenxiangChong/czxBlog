---
url: /czxBlog/type-challenges/medium/flip-arguments/index.md
---
## 题目

Github: [FlipArguments](https://github.com/type-challenges/type-challenges/blob/main/questions/03196-medium-flip-arguments/)

实现 `lodash` 的 `_.flip` 的类型版本。

类型 `FlipArguments<T>` 要求函数类型 `T`，并返回一个新的函数类型，该类型具有与 `T` 相同的返回类型，但参数顺序相反。

```ts
type Flipped = FlipArguments<(arg0: string, arg1: number, arg2: boolean) => void>
// (arg0: boolean, arg1: number, arg2: string) => void
```

## 解题思路

由于我们已经在 [Reverse](./3192.reverse.md) 中实现了数组翻转。此挑战剩余的问题已十分简单，
利用条件类型推断获取 参数数组，对齐翻转 即可完成挑战。

## 答案

```ts
type Reverse<T extends unknown[]> = T extends [infer L, ...infer O]
  ? [...Reverse<O>, L]
  : T

type FlipArguments<
  T extends (...args: any[]) => any
> = T extends (...args: infer P) => infer R
  ? (...args: Reverse<P>) => R
  : never
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type Reverse<T extends unknown[]> = T extends [infer L, ...infer O]
  ? [...Reverse<O>, L]
  : T

type FlipArguments<
  T extends (...args: any[]) => any
> = T extends (...args: infer P) => infer R
  ? (...args: Reverse<P>) => R
  : never

// ---cut---
type cases = [
  Expect<Equal<FlipArguments<() => boolean>, () => boolean>>,
  Expect<Equal<FlipArguments<(foo: string) => number>, (foo: string) => number>>,
  Expect<Equal<FlipArguments<(arg0: string, arg1: number, arg2: boolean) => void>, (arg0: boolean, arg1: number, arg2: string) => void>>,
]

type errors = [
  // @ts-expect-error
  FlipArguments<'string'>,
  // @ts-expect-error
  FlipArguments<{ key: 'value' }>,
  // @ts-expect-error
  FlipArguments<['apple', 'banana', 100, { a: 1 }]>,
  // @ts-expect-error
  FlipArguments<null | undefined>,
]
```

## 参考

* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [递归条件类型 Recursive conditional types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types)
