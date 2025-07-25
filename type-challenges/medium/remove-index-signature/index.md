---
url: /czxBlog/type-challenges/medium/remove-index-signature/index.md
---
## 题目

Github: [RemoveIndexSignature](https://github.com/type-challenges/type-challenges/blob/main/questions/01367-medium-remove-index-signature/README.md)

实现 `RemoveIndexSignature<T>`，从对象类型中排除索引签名。

```ts
interface Foo {
  [key: string]: any
  foo: () => void
}

type A = RemoveIndexSignature<Foo> // expected { foo(): void }
```

## 解题思路

这个挑战需要我们从 对象类型 中排除以 `{ [key: string]: any }` 形式声明的签名，同时需要保留如
`{ name: any }` 形式声明的签名。

这很明显需要使用 映射类型 和 条件类型 来解决。

首先我们知道， `'name' extends string` 的结果为 真，但是反过来，`string extends 'name'` 结果为 假 。
因为 `'name'` 本身就是 `string`，但 `string` 不止 `'name'` 。 我们可以利用这一特性，完成这个挑战。

我们可以使用 Typescript 的内置类型 `PropertyKey` ，它表示 `string | number | symbol` ，即 键类型，
先完成最基础的类型声明：

```ts
type RemoveIndexSignature<T, K extends PropertyKey = PropertyKey> = {
  [P in keyof T]: T[P]
}
```

接下来，我们对 `P` 进行约束，当 `K extends P` 为真时，这表示 `P` 可能是 `string` 、`number` 或 `symbol`。
我们需要排除这些情况：

```ts
type RemoveIndexSignature<T, K extends PropertyKey = PropertyKey> = {
  [P in keyof T as K extends P ? never : P]: T[P]
}
```

这发生了什么？`K` 表示的是 `string | number | symbol`，`K extends P` 相当于：

```ts
type a = string extends P ? never : P
type b = number extends P ? never : P
type c = symbol extends P ? never : P
```

这直接从 键类型中过滤了 `string`, `number`, `symbol` 的 索引签名。

当然这还不够，还需要限制 `P` 应该是一个合法的 键，因此我们还需要使用 `P extends K` 约束 键类型：

```ts
type RemoveIndexSignature<T, K extends PropertyKey = PropertyKey> = {
  [P in keyof T as K extends P ? never : P extends K ? P : never]: T[P]
}
```

这相当于，如果 `P` 为对象中的 `name` 属性，则发生了以下检查：

```ts
type P = 'name' extends string | number | symbol ? 'name' : never
```

此时 `name` 满足 `K` 的约束。

## 答案

```ts
type RemoveIndexSignature<T, K extends PropertyKey = PropertyKey> = {
  [P in keyof T as K extends P
    ? never
    : P extends K
      ? P
      : never
  ]: T[P]
}
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'
type RemoveIndexSignature<T, K extends PropertyKey = PropertyKey> = {
  [P in keyof T as K extends P ? never : P extends K ? P : never]: T[P]
}

// ---cut---
interface Foo {
  [key: string]: any
  foo: () => void
}

interface Bar {
  [key: number]: any
  bar: () => void
  0: string
}

const foobar = Symbol('foobar')
interface FooBar {
  [key: symbol]: any
  [foobar]: () => void
}

interface Baz {
  bar: () => void
  baz: string
}

type cases = [
  Expect<Equal<RemoveIndexSignature<Foo>, { foo: () => void }>>,
  Expect<Equal<RemoveIndexSignature<Bar>, { bar: () => void, 0: string }>>,
  Expect<Equal<RemoveIndexSignature<FooBar>, { [foobar]: () => void }>>,
  Expect<Equal<RemoveIndexSignature<Baz>, { bar: () => void, baz: string }>>,
]
```

## 参考

* [映射类型 Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [索引访问类型 Indexed Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
