---
url: /czxBlog/type-challenges/medium/mutable/index.md
---
## 题目

Github: [Mutable](https://github.com/type-challenges/type-challenges/blob/main/questions/02793-medium-mutable/)

实现一个通用的类型 `Mutable<T>` ，使类型 `T` 的全部属性可变（非只读）。

```ts
interface Todo {
  readonly title: string
  readonly description: string
  readonly completed: boolean
}

type MutableTodo = Mutable<Todo>
// { title: string; description: string; completed: boolean; }
```

## 解题思路

略。

## 答案

```ts
type Mutable<T extends object> = {
  -readonly [P in keyof T]: T[P]
}
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type Mutable<T extends object> = {
  -readonly [P in keyof T]: T[P]
}

// ---cut---
interface Todo1 {
  title: string
  description: string
  completed: boolean
  meta: {
    author: string
  }
}

type List = [1, 2, 3]

type cases = [
  Expect<Equal<Mutable<Readonly<Todo1>>, Todo1>>,
  Expect<Equal<Mutable<Readonly<List>>, List>>,
]

type errors = [
  // @ts-expect-error
  Mutable<'string'>,
  // @ts-expect-error
  Mutable<0>,
]
```

## 参考

* [映射类型 Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
* [映射修饰符 Mapping modifiers](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers)
