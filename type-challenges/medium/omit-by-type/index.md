---
url: /czxBlog/type-challenges/medium/omit-by-type/index.md
---
## 题目

Github: [OmitByType](https://github.com/type-challenges/type-challenges/blob/main/questions/02852-medium-omitbytype/README.md)

从 `T` 中选取一组属性，这些属性的类型不可分配给 `U` 。

```ts
type OmitBoolean = OmitByType<{
  name: string
  count: number
  isReadonly: boolean
  isEnable: boolean
}, boolean> // { name: string; count: number }
```

## 解题思路

略。

## 答案

```ts
type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P]
}
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P]
}

// ---cut---
interface Model {
  name: string
  count: number
  isReadonly: boolean
  isEnable: boolean
}

type cases = [
  Expect<Equal<OmitByType<Model, boolean>, { name: string, count: number }>>,
  Expect<Equal<OmitByType<Model, string>, { count: number, isReadonly: boolean, isEnable: boolean }>>,
  Expect<Equal<OmitByType<Model, number>, { name: string, isReadonly: boolean, isEnable: boolean }>>,
]
```

## 参考

* [映射类型 Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
* [通过 `as` 进行按键重映射 Key remapping via `as`](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as)
* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [`keyof` 和查找类型 `keyof` and lookup types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#keyof-and-lookup-types)
