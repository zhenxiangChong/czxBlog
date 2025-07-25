---
url: /czxBlog/type-challenges/medium/omit/index.md
---
## 题目

Github: [Omit](https://github.com/type-challenges/type-challenges/blob/main/questions/00003-medium-omit/)

不使用 `Omit` 实现 `TypeScript` 的 `Omit<T, K>` 泛型。

`Omit` 会创建一个省略 `K` 中字段的 `T` 对象。

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

const todo: TodoPreview = {
  completed: false,
}
```

## 解题思路

首先这里需要创建一个新的对象类型，但不指定健，因此这里需要使用 **映射类型**。

```ts
type MyOmit<T, K> = {
  [P in keyof T]: T[P]
}
```

这里通过 `keyof` 遍历 `T` 中的所有键，然后将其映射到类型 `P`，使其成为新对象类型的键，其值为 `T[P]` 。

在此基础上，还需要对 `keyof T` 进行过滤，排除 `K` 中的所有健。

这里可以使用 `as` 语法重新映射键类型，最后新对象的值为 原类型的相对应键的值类型。

## 答案

```ts
type MyOmit<T, K extends keyof T> = {
  [Key in keyof T as Key extends K ? never : Key]: T[Key]
}
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'
type MyOmit<T, K extends keyof T> = {
  [Key in keyof T as Key extends K ? never : Key]: T[Key]
}
// ---cut---
type cases = [
  Expect<Equal<Expected1, MyOmit<Todo, 'description'>>>,
  Expect<Equal<Expected2, MyOmit<Todo, 'description' | 'completed'>>>,
  Expect<Equal<Expected3, MyOmit<Todo1, 'description' | 'completed'>>>,
]

// @ts-expect-error ignore
type error = MyOmit<Todo, 'description' | 'invalid'>

interface Todo {
  title: string
  description: string
  completed: boolean
}

interface Todo1 {
  readonly title: string
  description: string
  completed: boolean
}

interface Expected1 {
  title: string
  completed: boolean
}

interface Expected2 {
  title: string
}

interface Expected3 {
  readonly title: string
}
```

## 参考

> * [映射类型 Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
> * [索引类型 indexed Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
> * [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
> * [映射类型中的键重映射 Key Remapping in Mapped Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#key-remapping-in-mapped-types)
