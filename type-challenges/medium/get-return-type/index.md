---
url: /czxBlog/type-challenges/medium/get-return-type/index.md
---
## 题目

Github: [Get return type](https://github.com/type-challenges/type-challenges/blob/main/questions/00002-medium-return-type/)

不使用 `ReturnType` 实现 `TypeScript` 的 `ReturnType<T>` 泛型。

```ts
function fn(v: boolean) {
  if (v)
    return 1
  else return 2
}

type a = MyReturnType<typeof fn> // 应推导出 "1 | 2"
```

## 解题思路

使用条件类型中的类型推断，泛型参数 `T` 是否可以分配给 `() => void`。

通过类型参数从条件类型推断为真时，获取函数返回类型 `() => infer R` 。

我们并不关心函数是否带参数，需要带上参数 `...args: any[]` 表示可以接受任何参数。

## 答案

```ts
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never

// ---cut---
type cases = [
  Expect<Equal<string, MyReturnType<() => string>>>,
  Expect<Equal<123, MyReturnType<() => 123>>>,
  Expect<Equal<ComplexObject, MyReturnType<() => ComplexObject>>>,
  Expect<Equal<Promise<boolean>, MyReturnType<() => Promise<boolean>>>>,
  Expect<Equal<() => 'foo', MyReturnType<() => () => 'foo'>>>,
  Expect<Equal<1 | 2, MyReturnType<typeof fn>>>,
  Expect<Equal<1 | 2, MyReturnType<typeof fn1>>>,
]

interface ComplexObject {
  a: [12, 'foo']
  bar: 'hello'
  prev: () => number
}

const fn = (v: boolean) => v ? 1 : 2
const fn1 = (v: boolean, w: any) => v ? 1 : 2
```

## 参考

> * [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
> * [条件类型中的类型推断 Type Inference in Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
