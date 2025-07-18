---
url: /czxBlog/article/extends-prototype/index.md
---
当谈到继承时，javascript只有一种结构：对象。
每个实例对象（object）都有一个私有属性`__proto__`指向它的构造函数的原型对象 **prototype**。
该原型对象也有自己的原型对象`__proto__`，层层向上，直到有一个的原型对象为null。根据定义，null没有原型，并作为这个原型链的最后一个环节。

几乎所有javascript中的对象，都是位于原型链顶端的`Object`的实例。

## 基于原型链的继承

### 继承属性

`javascript` 对象是动态的属性"包裹"（指自身的属性）。同时，对象还有一个指向一个原型对象的链。
当访问一个对象的属性时，不仅会在该对象上查找，也会在该对象的原型上查找，进而在该对象的原型的原型上查找，
依次层层向上查找，直到找到匹配的属性，或者到达原型链的末尾。

::: info ECMAScript标准
`obj.[[Prototype]]`符号用于指向`obj`的原型。从`ES6`开始`[[Prototype]]`
可以通过`Object.getPrototypeof()`和 `Object.setPrototypeof()` 访问器进行访问。
等同于许多浏览器实现的属性`__proto__`。
:::

从代码示例来分析继承属性：

在这个示例中，定义了一个函数`Foo`， 它拥有自身属性 `a`和`b`。

然后创建一个 `Foo` 的示例 `foo`。

```js
function Foo() {
  this.a = 1
  this.b = 2
}
let foo = new Foo()

Foo.prototype.c = 3
Foo.prototype.d = 4

// 输出自身的所有属性
console.log(foo) // { a: 1, b: 2 }

// 自身拥有属性 a
console.log(foo.a) // 1
// 自身拥有属性 b
console.log(foo.b) // 2
// 自身没有属性 c, 但其原型上有属性 c
console.log(foo.c) // 3
// 自身没有属性 d，但其原型上有属性 d
console.log(foo.d) // 4
```

在这个示例中， 整个原型链如下

```js
// { a: 1, b: 2 } => { c: 3, d: 4 } => Object.prototype => null
```

### 继承方法

在`Javascript` 中，并没有其他基于类的语言所定义的 方法。
任何函数都可以添加到对象上做为对象的属性。
函数属性的继承与其他属性的继承没有差别。

当继承的函数被调用时，`this`指向的是当前继承的对象，而不是继承的函数所在的原型对象。

```js
let o = {
  a: 1,
  f() {
    return this.a + 1
  },
}

// 此时 函数f 中的 this 指向了 o
console.log(o.f()) // 2

let p = Object.create(0)
p.a = 3

// p从o上继承了函数f， 此时函数f中的 this 指向了 p
console.log(p.f()) // 4
```

## 创建对象和生成原型链

### 使用语法结构创建的对象

```js
let o = { a: 1 }
// 原型链： o => Object.prototype => null

let arr = ['a', 'b']
// 原型链： arr => Array.prototype => Object.prototype => null

function f() {}
// 原型链： f => Function.prototype => Object.prototype => null
```

### 使用构造器创建对象

```js
function Person() {
  this.a = 1
}
Person.prototype = {
  f() {
    return this.a
  },
}
let p = new Person()
// 原型链： p => Person.prototype => Object.prototype => null
```

### 使用`Object.create`创建的对象

```js
let a = { a: 1 }
let b = Object.create(a)
// 原型链 b => a => Object.prototype => null

let c = Object.create(null)
// 原型链 c => null
```

## 扩展原型链的方法

### 构造器创建对象，原型赋值给另一个构造函数原型

```js
function Foo() {}
foo.prototype = {
  a: 'foo',
}

function Bar() {}

let proto = new Foo()
proto.b = 'bar'
Bar.prototype = proto

let p = new Bar()
console.log(p.a) // foo
console.log(p.b) // bar
```

### Object.create

```js
function Foo() {}
Foo.prototype = {
  a: 'foo',
}
function Bar() {}

let proto = Object.create(Foo.prototype)
proto.b = 'bar'
Bar.prototype = proto

let p = new Bar()
console.log(p.a) // foo
console.log(p.b) // bar
```

```js
function Foo() {}
Foo.prototype = {
  a: 'foo',
}

function Bar() {}

let proto = Object.create(Foo.prototype, { b: 'bar' })
Bar.prototype = proto

let p = new Bar()
console.log(p.a) // foo
console.log(p.b) // bar
```
