---
url: /czxBlog/interview-question/lzbk7vkc/index.md
---
::: tip 提问

1. javascript有哪些数据类型？
2. 什么是基本数据类型？
3. 什么是引用数据类型？
4. 如何做数据类型判断？

:::

## 数据类型

javascript 有两种数据类型，分别是 基本数据类型 和 引用数据类型。

## 基本数据类型

javascript一共有7中基本数据类型，包括：
`undefined`, `null`, `Boolean`, `Number`,
`String`, `BigInt`, `Symbol`。

特性：

* 存放在栈区
* 进行值比较时，`==` 只进行值的比较，会进行数据类型转换， `===` 不仅进行值的比较，还要进行数据类型的比较。

## 引用数据类型

引用数据类型指 Object 类型， 所有其他的如 Array、Date、Function等类型都可以理解为Object类型的子类。

特性：

* 同时保存在栈内存和堆内存中。解释器寻找引用值是，会首先检索它在栈中的地址，取得地址后从堆中获得实体。
* 比较时是引用的比较

## 数据类型判断

### typeof

`typeof` 返回一个表示数据类型的字符串，可以用来判断 `number`, `boolean`, `string`,`symbol`,`object`,
`undefined`, `function` 等7种数据类型，但不能判断 `null`，`Object`的子类等。

### instanceof

`instanceof` 用来判断 A是否为B的实例。 一般用于判断引用类型。但在 类的原型继承中，结果不一定准确。

### constructor

`constructor` 和 `instanceof` 类似， 但还可以处理除了 null、undefined 之外的基本数据类型的检测。

`constructor`不是稳定的，如果把类的原型重写，可能会把之前的`constructor`给覆盖了。

### Object.prototype.toString.call(someObj)

最准确也是最常用的数据类型检测方式。 该方法会将数据类型的检测结果以`[object <type>]` 的形式返回。

### 其他

除了上述的方式，一些数据类型也提供了方法进行数据类型判断，如：

* Array.isArray()
* Number.isNaN()
