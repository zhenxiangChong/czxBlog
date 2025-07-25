---
url: /czxBlog/type-challenges/medium/required-by-keys/index.md
---
## 题目

Github: [requiredByKeys](https://github.com/type-challenges/type-challenges/blob/main/questions/02759-medium-requiredbykeys/)

实现一个通用的`RequiredByKeys<T, K>`，它接收两个类型参数`T`和`K`。

`K`指定应设为必选的`T`的属性集。当没有提供`K`时，它就和普通的`Required<T>`一样使所有的属性成为必选的。

```ts
interface User {
  name?: string
  age?: number
  address?: string
}

type UserRequiredName = RequiredByKeys<User, 'name'>
// { name: string; age?: number; address?: string }
```

## 解题思路

略。

## 答案

```ts
type RequiredByKeys<T, K extends keyof T = keyof T> = Omit<{
  [P in keyof T as P extends K ? P : never]-?: T[P]
} & {
  [P in keyof T as P extends K ? never : P]: T[P]
}, never>
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type RequiredByKeys<T, K extends keyof T = keyof T> = Omit<{
  [P in keyof T as P extends K ? P : never]-?: T[P]
} & {
  [P in keyof T as P extends K ? never : P]: T[P]
}, never>

// ---cut---
interface User {
  name?: string
  age?: number
  address?: string
}

interface UserRequiredName {
  name: string
  age?: number
  address?: string
}

interface UserRequiredNameAndAge {
  name: string
  age: number
  address?: string
}

type cases = [
  Expect<Equal<RequiredByKeys<User, 'name'>, UserRequiredName>>,
  Expect<Equal<RequiredByKeys<User, 'name' | 'age'>, UserRequiredNameAndAge>>,
  Expect<Equal<RequiredByKeys<User>, Required<User>>>,
  // @ts-expect-error
  Expect<Equal<RequiredByKeys<User, 'name' | 'unknown'>, UserRequiredName>>,
]
```

## 参考

* [映射类型 Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
* [映射修饰符 Mapping modifiers](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers)
* [通过 `as` 进行按键重映射 Key remapping via `as`](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as)
* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [`keyof` 和查找类型 `keyof` and lookup types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#keyof-and-lookup-types)
* [交叉类型 Intersection Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types)
