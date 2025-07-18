---
url: /czxBlog/type-challenges/medium/all-combinations/index.md
---
## 题目

Github: [AllCombinations](https://github.com/type-challenges/type-challenges/blob/main/questions/04260-medium-nomiwase/README.md)

实现类型 `AllCombinations<S>` ，该类型返回使用 `S` 中的字符且每个字符最多使用一次的所有字符串组合。

```ts
type AllCombinations_ABC = AllCombinations<'ABC'>
// should be '' | 'A' | 'B' | 'C' | 'AB' | 'AC' | 'BA' | 'BC' | 'CA' | 'CB' | 'ABC' | 'ACB' | 'BAC' | 'BCA' | 'CAB' | 'CBA'
```

## 解题思路

参考 [#16430](https://github.com/type-challenges/type-challenges/issues/16430)

## 答案

```ts
type StringToUnion<S extends string> = S extends `${infer F}${infer O}`
  ? F | StringToUnion<O>
  : never

type AllCombinations<
  S extends string,
  U extends string = StringToUnion<S>
> = [U] extends [never]
  ? ''
  : '' | {
    [P in U]: `${P}${AllCombinations<never, Exclude<U, P>>}`
  }[U]
```

## 验证

```ts twoslash
import type { Equal, Expect, NotEqual } from '~/tc-utils'

type StringToUnion<S extends string> = S extends `${infer F}${infer O}`
  ? F | StringToUnion<O>
  : never

type AllCombinations<
  S extends string,
  U extends string = StringToUnion<S>
> = [U] extends [never]
  ? ''
  : '' | {
    [P in U]: `${P}${AllCombinations<never, Exclude<U, P>>}`
  }[U]

// ---cut---
type cases = [
  Expect<Equal<AllCombinations<''>, ''>>,
  Expect<Equal<AllCombinations<'A'>, '' | 'A'>>,
  Expect<Equal<AllCombinations<'AB'>, '' | 'A' | 'B' | 'AB' | 'BA'>>,
  Expect<Equal<AllCombinations<'ABC'>, '' | 'A' | 'B' | 'C' | 'AB' | 'AC' | 'BA' | 'BC' | 'CA' | 'CB' | 'ABC' | 'ACB' | 'BAC' | 'BCA' | 'CAB' | 'CBA'>>,
  Expect<Equal<AllCombinations<'ABCD'>, '' | 'A' | 'B' | 'C' | 'D' | 'AB' | 'AC' | 'AD' | 'BA' | 'BC' | 'BD' | 'CA' | 'CB' | 'CD' | 'DA' | 'DB' | 'DC' | 'ABC' | 'ABD' | 'ACB' | 'ACD' | 'ADB' | 'ADC' | 'BAC' | 'BAD' | 'BCA' | 'BCD' | 'BDA' | 'BDC' | 'CAB' | 'CAD' | 'CBA' | 'CBD' | 'CDA' | 'CDB' | 'DAB' | 'DAC' | 'DBA' | 'DBC' | 'DCA' | 'DCB' | 'ABCD' | 'ABDC' | 'ACBD' | 'ACDB' | 'ADBC' | 'ADCB' | 'BACD' | 'BADC' | 'BCAD' | 'BCDA' | 'BDAC' | 'BDCA' | 'CABD' | 'CADB' | 'CBAD' | 'CBDA' | 'CDAB' | 'CDBA' | 'DABC' | 'DACB' | 'DBAC' | 'DBCA' | 'DCAB' | 'DCBA'>>,
]
```

## 参考

* [映射类型 Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
* [条件类型 Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [索引访问类型 Indexed Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
* [联合类型 Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
