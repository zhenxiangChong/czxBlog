---
url: /czxBlog/type-challenges/medium/flip/index.md
---
## 题目

Github: [Flip](https://github.com/type-challenges/type-challenges/blob/main/questions/04179-medium-flip/)

实现仅翻转对象的类型。

```ts
Flip<{ a: 'x', b: 'y', c: 'z' }> // {x: 'a', y: 'b', z: 'c'}
Flip<{ a: 1, b: 2, c: 3 }> // {1: 'a', 2: 'b', 3: 'c'}
Flip<{ a: false, b: true }> // {false: 'a', true: 'b'}
```

无需支持嵌套对象以及无法作为对象键的值（如数组）。

## 解题思路

这道题目相对简单，只需使用 映射类型，然后对 对象的 `key` 重映射为预期的类型即可。

## 答案

```ts
type AllowedTypes = string | number | boolean

type Flip<T> = {
  [P in keyof T as T[P] extends AllowedTypes ? `${T[P]}` : never]: P
}
```

## 验证

```ts twoslash
import type { Equal, Expect, NotEqual } from '~/tc-utils'

type AllowedTypes = string | number | boolean

type Flip<T> = {
  [P in keyof T as T[P] extends AllowedTypes ? `${T[P]}` : never]: P
}

// ---cut---
type cases = [
  Expect<Equal<{ a: 'pi' }, Flip<{ pi: 'a' }>>>,
  Expect<NotEqual<{ b: 'pi' }, Flip<{ pi: 'a' }>>>,
  Expect<Equal<{ 3.14: 'pi', true: 'bool' }, Flip<{ pi: 3.14, bool: true }>>>,
  Expect<Equal<{ val2: 'prop2', val: 'prop' }, Flip<{ prop: 'val', prop2: 'val2' }>>>,
]
```

## 参考

* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [映射类型 Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
* [通过 `as` 进行按键重映射 Key remapping via `as`](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as)
