---
url: /czxBlog/article/hx3h2vvj/index.md
---
在 `JavaScript` 的世界中，我们常常会通过 构造函数 来创建一个 **实例对象**：

```js
function Person(name) {
  this.name = name
}
const person = new Person('Mark')
console.log(person.name) // Mark
```

我们使用构造函数`Person`，通过 `new` 创建了一个实例对象 `person`。

在实例对象 `person` 上， 有一个私有属性 `__proto__` 指向了它的构造函数的原型对象`prototype`，

那么，什么是 `prototype`, 什么是 `__proto__` ?

接下来，我们开始进入正题。

## prototype

在 `JavaScript` 中，每个函数都有一个 `prototype` 属性，这个属性指向了该函数的原型对象。

```js
function Person(name) {
  this.name = name
}
Person.prototype.age = 18

const person1 = new Person('Mark')
const person2 = new Person('John')
console.log(person1.name, person1.age) // Mark 18
console.log(person2.name, person2.age) // John 18
```

可以看到，当 `person1` 和 `person2` 均打印 `age` 属性值为 `18`。

这是因为 `Person.prototype` 正是 实例对象 `person1` 和 `person2` 的原型。

既然 `prototype` 指向的是原型， 那么，**原型** 又是什么？

简单的理解，在 `JavaScript` 中，每一个对象在创建时，都有一个与之关联的另一个对象，这个关联的对象就是指原型。

::: warning 注意
`null` 是没有原型的。
:::

对象会从其原型对象，**继承** 属性。这也是为什么 `person1` 和 `person2` 均打印 `age` 属性值为 `18`。

## \_\_proto\_\_

在 `JavaScript` 中，每个对象（`null` 除外）都有一个 私有属性 `__proto__`，
这个属性指向了该对象的构造函数的原型`prototype`。

```js
function Person(name) {
  this.name = name
}
const person = new Person('Mark')
console.log(person.__proto__ === Person.prototype) // true
```

到这里就会发现，既然构造函数有原型 `prototype`，原型也是一个对象，而对象有 `__proto__` 指向它的构造函数的原型对象，
那么 构造函数的原型对象，是否也有其原型对象呢？

## constructor

在说明 原型的原型前，需要了解原型上的一个属性 `constructor`, 它指向了原型对象关联的构造函数：

```js
function Person(name) {
  this.name = name
}
const person = new Person('Mark')
console.log(person.prototype.constructor === Person) // true
```

它有助于帮我们理解 找到原型的原型的构造函数。

## 原型的原型

当我们在控制台打印并输出 `Person.prototype.__proto__` 时，发现打印了一个对象：

```js
function Person(name) {
  this.name = name
}
console.log(Person.prototype.__proto__)
```

`output`:

![Person.prototype.proto](/images/js-prototype-1.png)

既然 `Person` 的原型也有原型， 那么 这个原型的原型对象，它的构造函数又是什么呢？

我们可以使用 `constructor` 来获取 它的构造函数：

```js
function Person(name) {
  this.name = name
}
console.log(Person.prototype.__proto__.constructor)
```

`output`:
![Person.prototype.proto.constructor](/images/js-prototype-2.png)

可以发现 `Person` 的原型对象的原型对象，指向的构造函数是 `Object`。

即 `Person.prototype` 的原型，指向的是 `Object.prototype`。

那么， `Object.prototype` 有没有自己的原型呢？

![Object.prototype.proto](/images/js-prototype-3.png)

可以发现，`Object.prototype` 的原型，指向的是 `null`。

而`null` 是表示 **没有对象**，它没有原型。

## 原型链

`Person.prototype` -> `Object.prototype` -> `null`

(通过 `__proto__` 进行关联)

这种 对象有一个原型对象，它的原型对象又有它的原型对象，一层层如同链式一样，向上关联，称为 `原型链`。

几乎所有 `JavaScript` 中的对象都是位于原型链顶端的 `Object` 的实例。

::: tip
`__proto__` 是一个非标准的属性，但绝大部分浏览器都支持通过这个属性来访问原型。

`__proto__` 在实现上是`Object` 上的一个 `getter/setter`访问器 ，使用 `obj.__proto__` 时，可以理解成返回了 `Object.getPrototypeOf(obj)`。
:::

## 基于原型链的继承

`JavaScript` 对象是动态的属性“包”（指其自己的属性）。`JavaScript` 对象有一个指向一个原型对象的链。当试图访问一个对象的属性时，它不仅仅在该对象上搜寻，还会搜寻该对象的原型，以及该对象的原型的原型，依次层层向上搜索，直到找到一个名字匹配的属性或到达原型链的末尾。

```js
function Person(name) {
  this.name = name
}
Person.prototype.age = 18

const person1 = new Person('Mark')
const person2 = new Person('John')
console.log(person1.name, person1.age) // Mark 18
console.log(person2.name, person2.age) // John 18
```

在这个示例中， 虽然`Person` 的实例对象自身并没有`age` 属性，但由于它的原型对象上有 `age` 属性，
实例对象从它的原型对象 **继承** 了属性 `age` 。 从而其 `age` 属性的值为 `18`。
