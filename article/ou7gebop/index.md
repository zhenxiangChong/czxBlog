---
url: /czxBlog/article/ou7gebop/index.md
---
TypeScript 提供了许多内置的类型方法和工具类型，用于处理和操作类型。以下是其中一些常用的内置类型方法：

## 分类

### Utility Types（工具类型）

* `Partial<T>` : 将类型 T 的所有属性变为可选。
* `Required<T>` : 将类型 T 的所有属性变为必选。
* `Readonly<T>` : 将类型 T 的所有属性变为只读。
* `Record<K, T>` : 创建一个具有指定键类型 K 和值类型 T 的新对象类型。
* `Pick<T, K>` : 从类型 T 中选择指定属性 K 形成新类型。
* `Omit<T, K>` : 从类型 T 中排除指定属性 K 形成新类型。
* `Exclude<T, U>` : 从类型 T 中排除可以赋值给类型 U 的类型。
* `Extract<T, U>` : 从类型 T 中提取可以赋值给类型 U 的类型。
* `NonNullable<T>` : 从类型 T 中排除 null 和 undefined 类型。
* `ReturnType<T>` : 获取函数类型 T 的返回类型。
* `Parameters<T>` : 获取函数类型 T 的参数类型组成的元组类型。
* `Awaited<T>`: 模拟 `async` 函数中的 `await` 操作，或者 `promise` 上的 `.then()` 方法。
* `ConstructorParameters<T>`: 获取构造函数类型 T 的参数类型组成的元组类型。
* `InstanceType<T>`: 获取构造函数类型 T 的实例类型。
* `ThisParameterType<T>`: 获取函数类型 T 的 `this` 类型。
* `OmitThisParameter<T>`: 从函数类型 T 中移除 `this` 类型。
* `ThisType<T>`: 获取函数类型 T 的 `this` 类型。

### 条件判定类型

* `Conditional Types（条件类型）`: 根据类型关系进行条件判断生成不同的类型。
* `Distribute Conditional Types（分布式条件类型）`: 分发条件类型，允许条件类型在联合类型上进行分发。

### Mapped Types（映射类型）

根据已有类型创建新类型，通过映射类型可以生成新的类型结构。

### Template Literal Types（模板文字类型）

使用字符串模板创建新类型。

### 类型推断关键字

* `typeof`: 关键字允许在条件类型中推断类型变量。
* `keyof`：关键字允许在泛型条件类型中推断类型变量。
* `instanceof`：运算符用于检查对象是否是特定类的实例。
* `in`：用于检查对象是否具有特定属性。
* `type guard`：类型守卫是自定义的函数或条件语句，用于在代码块内缩小变量的类型范围。
* `as`：用于类型断言，允许将一个变量断言为特定的类型。

## Utility Types

### Partial\<T>

构造一个将 `T` 的所有属性设置为可选的类型。

```ts twoslash
interface Todo {
  title: string
  description: string
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate }
}

const todo1 = {
  title: 'organize desk',
  description: 'clear clutter',
}

const todo2 = updateTodo(todo1, {
  description: 'throw out trash',
})

//
```

### Required\<T>

该类型将类型 `T` 的所有属性变为必选。

```ts twoslash
// @errors: 2741
interface Props {
  a?: number
  b?: string
}
const obj: Props = { a: 5 }
const obj2: Required<Props> = { a: 5 }
```

### Readonly\<T>

将类型 `T` 的所有属性变为只读。

```ts twoslash
// @errors: 2540
interface Todo {
  title: string
}
const todo: Readonly<Todo> = {
  title: 'Delete inactive users',
}
todo.title = 'Hello'
```

### Record\<K, T>

创建一个具有指定键类型 K 和值类型 T 的新对象类型。

```ts twoslash
interface CatInfo {
  age: number
  breed: string
}
type CatName = 'miffy' | 'boris' | 'mordred'

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: 'Persian' },
  boris: { age: 5, breed: 'Maine Coon' },
  mordred: { age: 16, breed: 'British Shorthair' },
}

cats.boris
//    ^?
//
```

### Pick\<T, K>

从类型 T 中选择指定属性 K 形成新类型。

```ts twoslash
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = Pick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false,
}

todo
// ^?
//
```

### Omit\<T, K>

与 Pick 相反，该类型从类型 T 中排除指定属性 K 形成新类型。

```ts twoslash
interface Todo {
  title: string
  description: string
  completed: boolean
  createdAt: number
}

type TodoPreview = Omit<Todo, 'description'>

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false,
  createdAt: 1615544252770,
}

todo
// ^?

type TodoInfo = Omit<Todo, 'completed' | 'createdAt'>

const todoInfo: TodoInfo = {
  title: 'Pick up kids',
  description: 'Kindergarten closes at 5pm',
}

todoInfo
// ^?
//
```

### Exclude\<T, U>

从类型 T 中排除可以赋值给类型 U 的类型。

```ts twoslash
type T0 = Exclude<'a' | 'b' | 'c', 'a'>
//   ^?

type T1 = Exclude<'a' | 'b' | 'c', 'a' | 'b'>
//   ^?

type T2 = Exclude<string | number | (() => void), Function>
//   ^?

type Shape =
  | { kind: 'circle', radius: number }
  | { kind: 'square', x: number }
  | { kind: 'triangle', x: number, y: number }

type T3 = Exclude<Shape, { kind: 'circle' }>
//   ^?

//
```

### Extract\<T, U>

从类型 T 中提取可以赋值给类型 U 的类型。

```ts twoslash
type T0 = Extract<'a' | 'b' | 'c', 'a' | 'f'>
//   ^?

type T1 = Extract<string | number | (() => void), Function>
//   ^?

type Shape =
  | { kind: 'circle', radius: number }
  | { kind: 'square', x: number }
  | { kind: 'triangle', x: number, y: number }

type T2 = Extract<Shape, { kind: 'circle' }>
//   ^?

//
```

### NonNullable\<T>

从类型 T 中排除 null 和 undefined 类型。

```ts twoslash
type T0 = NonNullable<string | number | undefined>
//   ^?

type T1 = NonNullable<string[] | null | undefined>
//   ^?

//
```

### ReturnType\<T>

获取函数类型 T 的返回类型。

```ts twoslash
// @errors: 2344
declare function f1(): { a: number, b: string }

type T0 = ReturnType<() => string>
//   ^?

type T1 = ReturnType<(s: string) => void>
//   ^?

type T2 = ReturnType<<T>() => T>
//   ^?

type T3 = ReturnType<<T extends U, U extends number[]>() => T>
//   ^?

type T4 = ReturnType<typeof f1>
//   ^?

type T5 = ReturnType<any>
//   ^?

type T6 = ReturnType<never>
//   ^?

type T7 = ReturnType<string>

type T8 = ReturnType<Function>
```

### Parameters\<T>

获取函数类型 T 的参数类型组成的元组类型。

```ts twoslash
// @errors: 2344
declare function f1(arg: { a: number, b: string }): void

type T0 = Parameters<() => string>
//   ^?

type T1 = Parameters<(s: string) => void>
//   ^?

type T2 = Parameters<<T>(arg: T) => T>
//   ^?

type T3 = Parameters<typeof f1>
//   ^?

type T4 = Parameters<any>
//   ^?

type T5 = Parameters<never>
//   ^?

type T6 = Parameters<string>

type T7 = Parameters<Function>
```

### Awaited\<T>

模拟 `async` 函数中的 `await` 操作，或者 `promise` 上的 `.then()` 方法。

```ts twoslash
type A = Awaited<Promise<string>>
//   ^?

type B = Awaited<Promise<Promise<number>>>
//   ^?

type C = Awaited<boolean | Promise<number>>
//   ^?

//
```

### ConstructorParameters\<T>

获取构造函数类型 T 的参数类型组成的元组类型。

```ts twoslash
// @errors: 2344
type T0 = ConstructorParameters<ErrorConstructor>
//   ^?

type T1 = ConstructorParameters<FunctionConstructor>
//   ^?

type T2 = ConstructorParameters<RegExpConstructor>
//   ^?

class C {
  constructor(a: number, b: string) {}
}
type T3 = ConstructorParameters<typeof C>
//   ^?

type T4 = ConstructorParameters<any>
//   ^?

type T5 = ConstructorParameters<Function>
```

### InstanceType\<T>

获取构造函数类型 T 的实例类型。

```ts twoslash
// @errors: 2344
class C {
  x = 0
  y = 0
}

type T0 = InstanceType<typeof C>
//   ^?

type T1 = InstanceType<any>
//   ^?

type T2 = InstanceType<never>
//   ^?

type T3 = InstanceType<string>

type T4 = InstanceType<Function>
```

### ThisParameterType\<T>

获取函数类型 T 的 `this` 类型。

```ts twoslash
function toHex(this: number) {
  return this.toString(16)
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n)
}
```

### OmitThisParameter\<T>

从函数类型 T 中移除 `this` 类型。

```ts twoslash
function toHex(this: number) {
  return this.toString(16)
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5)

console.log(fiveToHex())

//
```

### ThisType\<T>

获取函数类型 T 的 `this` 类型。

```ts twoslash
interface ObjectDescriptor<D, M> {
  data?: D
  methods?: M & ThisType<D & M> // Type of 'this' in methods is D & M
}

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {}
  let methods: object = desc.methods || {}
  return { ...data, ...methods } as D & M
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx // Strongly typed this
      this.y += dy // Strongly typed this
    },
  },
})

obj.x = 10
obj.y = 20
obj.moveBy(5, 5)

//
```

## 条件判定类型

条件类型是 `TypeScript` 中强大且灵活的类型构造方式，它允许根据类型关系进行条件判断生成不同的类型。
分布式条件类型是条件类型的一种特殊形式，它允许条件类型在联合类型上进行分发，以便更精确地推断和处理类型。

### Conditional Types（条件类型）

条件类型基于输入的类型关系来确定最终的类型。它使用 `infer` 关键字来推断和定义类型。
条件类型通常结合了 `TypeScript` 中的 `extends` 关键字，这样就可以根据条件来确定最终的类型。

#### 根据输入类型选择不同的类型

条件类型基于输入的类型关系来确定最终的类型。它使用 `infer` 关键字来推断和定义类型。
条件类型通常结合了 `TypeScript` 中的 `extends` 关键字，这样就可以根据条件来确定最终的类型。

示例：

```ts twoslash
type TypeName<T> = T extends string ? 'string' : T extends number ? 'number' : T extends boolean ? 'boolean' : 'other'

type A = TypeName<string>
//   ^?

type B = TypeName<number>
//   ^?

type C = TypeName<boolean>
//   ^?

type D = TypeName<object>
//   ^?

type E = TypeName<string | number>
//   ^?

//
```

在这个例子中，`TypeName<T>` 条件类型根据传入的类型 T 来确定最终返回的类型字符串。如果 T 是 `string`、`number` 或 `boolean` 类型，则返回对应的类型字符串，否则返回 `'other'`。

### 条件类型中使用 `infer` 关键字

`infer` 关键字通常与extends结合使用，用于在条件类型内部声明一个类型变量，并从中提取或推断出一个类型。
它允许我们在泛型条件类型中推断出待推断类型的部分。

具体左右有以下两点：

1. TypeScript 支持 infer 来提取类型的一部分，通过模式匹配的方式。

示例：

```ts twoslash
type ExtractReturnType<T> = T extends (...args: any[]) => infer R ? R : never

function greet(): string {
  return 'Hello!'
}

type GreetReturnType = ExtractReturnType<typeof greet>
//     ^?
//
```

这个例子中的 `ExtractReturnType<T>` 条件类型获取函数类型 `T` 的返回类型。它使用了 `infer` 关键字来推断函数的返回类型，如果 `T` 是一个函数类型，则返回其返回类型，否则返回 `never`。

2. `infer extends` 用来做类型转换，比如 `string` 转 `number`、转 `boolean` 等；

```ts twoslash
enum Code {
  a = 111,
  b = 222,
  c = 'ccc',
}

type StrToNum<Str> = Str extends `${infer Num extends number}` ? Num : Str

type res = StrToNum<`${Code}`>
//    ^?
//
```

3. 条件类型配合泛型使用

```ts twoslash
type Diff<T, U> = T extends U ? never : T

type FilterOut<T, U> = T extends any ? Diff<T, U> : never

type Result = FilterOut<'a' | 'b' | 'c' | 'd', 'a' | 'c'>
//    ^?
//
```

在这个例子中，`FilterOut<T, U>` 条件类型根据传入的两个联合类型 T 和 U，从 T 中过滤掉属于 U 类型的成员，
返回剩余的类型。通过 `Diff<T, U>` 辅助实现了这个操作。这种方式可以在处理类型时非常有用，比如过滤掉某些特定类型。

### Distributive Conditional Types（分布式条件类型）

分布式条件类型是条件类型的一种特殊形式，它在联合类型上进行推断和分发，并返回联合类型中每个成员的条件类型。

```ts twoslash
type ToArray<T> = T extends any ? T[] : never

type StrArray = ToArray<string>
//    ^?

type NumArray = ToArray<number>
//    ^?

type UnionArray = ToArray<string | number>
//    ^?
//
```

在这个例子中，`ToArray<T>` 条件类型以联合类型 T 为输入，并将其分发到联合类型的每个成员上，返回一个数组类型。
这种分布式行为使得条件类型在处理联合类型时更加灵活和强大。

条件类型和分布式条件类型为 TypeScript 中的类型系统增加了极大的灵活性和表达能力，
允许开发者根据复杂的类型关系来定义和推断类型。

## Mapped Types（映射类型）

`映射类型（Mapped Types）` 是 TypeScript 中一种强大的类型操作，它允许你通过已有类型来创建新类型，
通常通过映射现有类型的属性、方法或者创建新的属性来实现。

常见的映射类型是利用 `keyof` 关键字配合索引类型来生成新的类型。一个经典的例子是 `Partial<T>` 类型。它接受一个类型 T 并将所有属性设置为可选的：

```ts twoslash
type MyPartial<T> = {
  [P in keyof T]?: T[P]
}

interface User {
  name: string
  age: number
}

type PartialUser = MyPartial<User>
//    ^?

//
```

在这个例子中，`Partial<T>` 使用了映射类型，通过遍历 T 类型的所有属性（由 `keyof T` 获取），
创建了一个新类型，该类型包含了原类型 T 的所有属性，并将它们设为可选的。

除了 `Partial`，还有一些其他常见的映射类型：

* `Readonly<T>`：将类型 T 中所有属性设置为只读。
* `Pick<T, K>`：选择类型 T 中的特定属性 K。
* `Record<K, T>`：根据键类型 K 创建一个新类型，其属性为类型 T。
* `Exclude<T, U>` 和 `Extract<T, U>`：从类型 T 中排除或提取符合类型 U 的部分。

映射类型可以使类型操作更加灵活，能够根据现有类型创建出符合特定需求的新类型。
这种功能特别适用于工具类型（Utility Types）的定义，使得类型系统更具表现力和可维护性。

## Template Literal Types（模板文字类型）

Template Literal Types（模板文字类型）是 TypeScript 4.1 引入的一项新特性，它允许在类型系统中对字符串文本进行操作和转换。这项功能利用了模板字符串的灵活性，使得可以在类型声明中使用类似于模板字符串的语法。

在模板文字类型中，可以使用模板字符串的 `${}` 语法来动态地创建字符串字面量类型。
这使得类型系统更具表现力，能够进行更复杂的字符串类型操作。

举个例子，假设有一个类型 WelcomeMessage，用于根据用户类型生成不同的欢迎消息：

```ts twoslash
type User = 'admin' | 'user'

type WelcomeMessage<T extends User> = `Welcome, ${Capitalize<T>}!`

type AdminWelcome = WelcomeMessage<'admin'>
//     ^?

type UserWelcome = WelcomeMessage<'user'>
//    ^?
//
```

在这个例子中，`WelcomeMessage` 是一个模板文字类型，利用了模板字符串中的 `${}` 语法。
它动态地根据传入的用户类型（"admin" 或 "user"）生成相应的欢迎消息。
这里使用了 `Capitalize<T>` 来确保用户名的首字母大写。

模板文字类型在类型定义中能够进行字符串的拼接、转换等操作，使得在类型层面上能够更灵活地处理和操作字符串类型。

## 类型推断关键字

在 TypeScript 中，有几个关键字和操作符用于类型判定。
这些关键字和操作符帮助你在代码中进行类型检查、类型判断和类型转换。

### typeof

`typeof` 是一个类型查询操作符，用于获取变量或表达式的类型。它可以返回该值的类型字符串表示。
比如 `typeof variable` 返回变量的类型，如 'number'、'string'、'object' 等。

```ts twoslash
const numberVar = 10

type NumberType = typeof numberVar
//     ^?
//
```

### instanceof

`instanceof` 运算符用于检查对象是否是特定类的实例。它返回一个布尔值表示检查结果。

```ts
class Animal {}
class Dog extends Animal {}

const dog = new Dog()
if (dog instanceof Dog) {
  console.log('It is a dog!')
}
```

### in

`in` 关键字用于检查对象是否具有特定属性。它在条件语句中常用于判断对象是否包含某个属性。

```ts
interface Person {
  name: string
  age: number
}

const person: Person = { name: 'Alice', age: 30 }
if ('age' in person) {
  console.log('Person has age property.')
}
```

### type guards

类型守卫是自定义的函数或条件语句，用于在代码块内缩小变量的类型范围。
它们可以是 `typeof`、`instanceof` 或者其他自定义条件的组合。

```ts twoslash
function isNumber(value: any): value is number {
  return typeof value === 'number'
}

function process(value: any) {
  if (isNumber(value)) {
    //           ^?

    // value 在此处被缩小为 number 类型
    console.log(value.toFixed(2))
    //            ^?
  }
  else {
    console.log('Value is not a number')
  }
}
```

### as

`as` 关键字用于类型断言，允许将一个变量断言为特定的类型。

```ts
const someValue: any = 'hello'
const length = (someValue as string).length
```

这些关键字和操作符能够在 TypeScript 中进行类型判断、类型检查和类型转换，有助于确保代码的类型安全性和正确性。
