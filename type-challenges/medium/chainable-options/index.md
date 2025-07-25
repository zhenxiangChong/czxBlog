---
url: /czxBlog/type-challenges/medium/chainable-options/index.md
---
## 题目

Github: [Chainable options](https://github.com/type-challenges/type-challenges/blob/main/questions/00012-medium-chainable-options/)

在 `JavaScript` 中我们经常会使用可串联（Chainable/Pipeline）的函数构造一个对象，
但在 `TypeScript` 中，你能合理的给它赋上类型吗？

在这个挑战中，你可以使用任意你喜欢的方式实现这个类型 - `Interface`, `Type` 或 `Class` 都行。
你需要提供两个函数 `option(key, value)` 和 `get()`。
在 `option` 中你需要使用提供的 `key` 和 `value` 扩展当前的对象类型，通过 `get` 获取最终结果。

```ts
declare const config: Chainable

const result = config
  .option('foo', 123)
  .option('name', 'type-challenges')
  .option('bar', { value: 'Hello World' })
  .get()

// 期望 result 的类型是：
interface Result {
  foo: number
  name: string
  bar: {
    value: string
  }
}
```

你只需要在类型层面实现这个功能 - 不需要实现任何 `TS/JS` 的实际逻辑。

你可以假设 `key` 只接受字符串而 `value` 接受任何类型，你只需要暴露它传递的类型而不需要进行任何处理。
同样的 `key` 只会被使用一次。

## 解题思路

这是一个实用性非常高的挑战。我们很容易会想到可以在 [`webpack-chain`](https://github.com/neutrinojs/webpack-chain)
\~~(此库以归档不再维护)~~ 中使用它。

在这个挑战中，我们需要实现 `options(key, value)` 和 `get()` 两个方法。
在每次调用 `options(key, value)` 方法时，需要累加 `key` 和 `value` 的类型信息，
累加操作需要持续进行，直到 `get()` 被调用，返回最终的类型信息。

我们从最基础的类型开始，定义一个 `Chainable` 接口，它包含了 `option` 方法和 `get` 方法。

```ts
interface Chainable {
  option: (key: any, value: any) => any
  get: () => any
}
```

首先我们需要得到 `options(key, value)` 的类型信息，这里我们可以使用 类型参数替换 `any`，
以便 TypeScript 可以推断出它们的类 型并将其分配给类型参数。

`option(key, value)` 需要被连续调用，因此，`option(key, value)` 需要返回 `Chainable` 类型本身。

```ts
interface Chainable {
  option: <K, V>(key: K, value: V) => Chainable
  get: () => any
}
```

TypeScript 会将 `key` 推断 为字符串字面量类型，而将 `value` 推断为常见的类型。
例如，调用 `option('foo', 123)` 将得出的类型为：`key = 'foo'` 和 `value = number`。

接下来，我们需要保存 `key` 和 `value` 的类型信息，它必须在能够在连续调用 `option` 方法后能够保存
其状态，因此我们可以把这些信息保存在 `Chainable` 的类型参数中。

```ts
interface Chainable<T = {}> {
  option: <K, V>(key: K, value: V) => Chainable<T & { [P in K]: V }>
  get: () => any
}
```

这里我们使用 交叉类型，将 `T` 的类型信息和 `key` 和 `value` 的类型信息进行了合并，
最终得到的类型是：`T & { [P in K]: V }`。

但在这里我们还需要对 `K` 进行类型检查，因为 `K` 的类型可能不是字符串字面量类型。

```ts
interface Chainable<T = {}> {
  option: <K extends string, V>(key: K, value: V) => Chainable<T & { [P in K]: V }>
  get: () => any
}
```

接下来，我们需要在 `get` 方法 返回 `T` 的类型信息。

```ts
interface Chainable<T = {}> {
  option: <K extends string, V>(key: K, value: V) => Chainable<T & { [P in K]: V }>
  get: () => T
}
```

到这一步，已经基本可以满足挑战的要求了。

但我们还可以进一步思考，当连续调用`option(key, value)` 时传入的 相同的 `key` ，又或者 给相同的 `key` 传入
不同类型的 `value` 时，会发生什么情况？

```ts twoslash
interface Chainable<T = {}> {
  option: <K extends string, V>(key: K, value: V) => Chainable<T & { [P in K]: V }>
  get: () => T
}
// ---cut---
declare const config: Chainable

const result = config
  .option('name', 'foo') // step 1
  .option('name', 'bar') // step 2
  .option('name', 123) // step 3
  .get()
```

很明显可以看到，属性 `name` 的值类型被合并为 `string | number`。

我们不妨增加一些挑战难度，
**不允许合并 `key` 值的类型，重复调用的 `key` 的值类型应该与上一次调用的值类型保持一致，允许值被覆盖。**

这里需要对 `K` 进行类型检查，当 `K` 满足 `keyof T` 约束，即在 `T` 类型上已存在 `K` 这个属性时,
我们需要对 `V` 也进行类型检查，`V` 的类型是否可以分配给 `T[K]`，如果可以的话，那么 `K` 就可以作为 `key`，
否则应该返回 `never`，抛出错误。（由于 `never` 不能给其他类型使用，此时传入其他类型都会报错）

`K extends keyof T ? (V extends T[K] ? K : never) : K`

还需要对 `option()` 的返回类型进行检查，如果 `K` 满足 `keyof T` 约束时，需要先 `T` 上移除 `K` 这个属性，
然后再和 `V` 进行交叉类型，最终得到的类型是：`Omit<T, K> & { [P in K]: V }`。
而不满足 `keyof T` 约束时，直接和 `V` 进行交叉类型，最终得到的类型是：`T & { [P in K]: V }`。

## 答案

```ts
interface Chainable<T extends Record<string, unknown> = object> {
  option: <K extends string, V>(
    key: K extends keyof T ? (V extends T[K] ? K : never) : K,
    value: V,
  ) => K extends keyof T
    ? Chainable<Omit<T, K> & { [P in K]: V }>
    : Chainable<T & { [P in K]: V }>
  get: () => T
}
```

## 验证

```ts twoslash
import type { Alike, Expect } from '~/tc-utils'

interface Chainable<T extends Record<string, unknown> = {}> {
  option: <K extends string, V>(
    key: K extends keyof T ? (V extends T[K] ? K : never) : K,
    value: V
  ) => K extends keyof T
    ? Chainable<Omit<T, K> & { [P in K]: V }>
    : Chainable<T & { [P in K]: V }>
  get: () => T
}

// ---cut---
declare const a: Chainable

const result1 = a
  .option('foo', 123)
  .option('bar', { value: 'Hello World' })
  .option('name', 'type-challenges')
  .get()

const result2 = a
  .option('name', 'another name')
  .option('name', 'last name')
  .get()

const result3 = a
  .option('name', 'another name')
  // @ts-expect-error ignore
  .option('name', 123)
  .get()

type cases = [
  Expect<Alike<typeof result1, Expected1>>,
  Expect<Alike<typeof result2, Expected2>>,
  Expect<Alike<typeof result3, Expected3>>,
]

interface Expected1 {
  foo: number
  bar: {
    value: string
  }
  name: string
}

interface Expected2 {
  name: string
}

interface Expected3 {
  name: number
}
```

## 参考

* [交叉类型 Intersection Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types)
* [映射类型 Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
* [泛型 Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
