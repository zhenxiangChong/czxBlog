---
url: /czxBlog/type-challenges/medium/type-lookup/index.md
---
## 题目

Github: [Type lookup](https://github.com/type-challenges/type-challenges/blob/main/questions/00062-medium-type-lookup/)

有时，您可能希望根据某个属性在联合类型中查找类型。

在此挑战中，我们想通过在联合类型 `Cat | Dog` 中搜索公共type字段来获取相应的类型。
换句话说，在以下示例中，我们期望 `LookUp<Dog | Cat, 'dog'>` 获得 `Dog` ，`LookUp<Dog | Cat, 'cat'>` 获得 `Cat`。

```ts
interface Cat {
  type: 'cat'
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
}

interface Dog {
  type: 'dog'
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
  color: 'brown' | 'white' | 'black'
}

type MyDog = LookUp<Cat | Dog, 'dog'> // expected to be `Dog`
```

## 解题思路

利用 TypeScript 中 的 **条件类型** 来 检查类型是否可分配给某些特定布局。
检查 `U` 是否可以赋值给 `{ type: T }` 。

值得注意的是，条件类型在 TypeScript 中是分布式的，因此联合类型中的每个成员都将按照条件进行检查。

## 答案

```ts
type LookUp<U, T> = U extends { type: T } ? U : never
```

## 验证

```ts twoslash
import type { Equal, Expect } from '~/tc-utils'

type LookUp<U, T> = U extends { type: T } ? U : never

// ---cut---
interface Cat {
  type: 'cat'
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
}

interface Dog {
  type: 'dog'
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
  color: 'brown' | 'white' | 'black'
}

type Animal = Cat | Dog

type cases = [
  Expect<Equal<LookUp<Animal, 'dog'>, Dog>>,
  Expect<Equal<LookUp<Animal, 'cat'>, Cat>>,
]
```

## 参考

* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [条件类型分支 Distributive Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)
