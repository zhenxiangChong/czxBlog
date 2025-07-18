---
url: /czxBlog/type-challenges/medium/unique/index.md
---
## 题目

Github: [Unique](https://github.com/type-challenges/type-challenges/blob/main/questions/05360-medium-unique/)

实现类型版本的 Lodash.uniq 方法, Unique 接收数组类型 T, 返回去重后的数组类型.

```ts
type Res = Unique<[1, 1, 2, 2, 3, 3]> // expected to be [1, 2, 3]
type Res1 = Unique<[1, 2, 3, 4, 4, 5, 6, 7]> // expected to be [1, 2, 3, 4, 5, 6, 7]
type Res2 = Unique<[1, 'a', 2, 'b', 2, 'a']> // expected to be [1, "a", 2, "b"]
type Res3 = Unique<[string, number, 1, 'a', 1, string, 2, 'b', 2, number]> // expected to be [string, number, 1, "a", 2, "b"]
type Res4 = Unique<[unknown, unknown, any, any, never, never]> // expected to be [unknown, any, never]
```

## 解题思路

本挑战有两个难点：判断数组中是否包含某个元素；判断两个类型是否严格相等。

**判断两个类型是否严格相等**，请参考 [类型系统的真假美猴王：破解 IsEqual\<X, Y> 之谜](../../../1.前端/12.TypeScript/isEqual.md)

```ts
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false
```

有了 `Equal<X, Y>` 类型工具，就可以实现 `Include<T, U>` 类型工具，判断数组 `T` 中是否包含元素 `U`。

```ts
type Include<T extends unknown[], U> = T extends [infer F, ...infer O]
  ? Equal<F, U> extends true
    ? true
    : Include<O, U>
  : false
```

接下来，就可以实现 `Unique<T>` 类型工具，通过 条件类型 `infer`，从数组 `T` 中，
通过递归的方式从末尾取出一个个元素，判断是否严格等于类型 `U`。

## 答案

```ts
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false

type Include<T extends unknown[], U> = T extends [infer F, ...infer O]
  ? Equal<F, U> extends true
    ? true
    : Include<O, U>
  : false

type Unique<T extends unknown[],> = T extends [...infer O, infer F]
  ? Include<O, F> extends true
    ? Unique<O>
    : [...Unique<O>, F]
  : []
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type Include<T extends unknown[], U> = T extends [infer F, ...infer O]
  ? Equal<F, U> extends true
    ? true
    : Include<O, U>
  : false

type Unique<T extends unknown[],> = T extends [...infer O, infer F]
  ? Include<O, F> extends true
    ? Unique<O>
    : [...Unique<O>, F]
  : []

// ---cut---
type cases = [
  Expect<Equal<Unique<[1, 1, 2, 2, 3, 3]>, [1, 2, 3]>>,
  Expect<Equal<Unique<[1, 2, 3, 4, 4, 5, 6, 7]>, [1, 2, 3, 4, 5, 6, 7]>>,
  Expect<Equal<Unique<[1, 'a', 2, 'b', 2, 'a']>, [1, 'a', 2, 'b']>>,
  Expect<Equal<Unique<[string, number, 1, 'a', 1, string, 2, 'b', 2, number]>, [string, number, 1, 'a', 2, 'b']>>,
  Expect<Equal<Unique<[unknown, unknown, any, any, never, never]>, [unknown, any, never]>>,
]
```

## 参考

* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [条件类型中的类型推断 Type Inference in Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
* [递归条件类型 Recursive Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types)
