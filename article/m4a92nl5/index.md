---
url: /czxBlog/article/m4a92nl5/index.md
---
我们知道，在 `ECMAScrip` 中， 函数的参数是 **按值传递** 的。

那么怎么理解 **按值传递** ？

简单来说， **把函数外部的值复制给函数内部的参数**，即 **把值从一个变量复制到另一个变量**。

那么也就是说，在函数内部，修改函数参数的值，不会改变外部变量的值。

我们来看一个例子：2

**示例1：**

```js
let a = 1
function foo(arg) {
  arg = 2
  console.log(arg)
}
foo(a) // 2
console.log(a) // 1
```

可以看出，外部变量`a`作为 函数 `foo` 的执行时参数值， 在函数内部修改传入的参数值进行修改，
函数执行后，并不会对外部变量`a` 发生修改。

这个例子确实说明了函数参数是按值传递的。

但是再来看另一个例子：

**示例2：**

```js
let obj1 = {
  a: 1,
}
function foo(arg) {
  arg.a = 2
  console.log(arg)
}
foo(obj1) // { a: 2 }
console.log(obj1) // { a: 2 }

let obj2 = {
  a: 1,
}
function bar(arg) {
  arg = 2
  console.log(arg)
}
bar(obj2) // 2
console.log(obj2) // { a: 1 }
```

在这个例子中， 函数`foo` 执行完后， 打印的 `obj1` 值发生了变化，说明函数`foo` 内部修改了外部变量`obj1`，
为什么会发生修改？而在 函数`bar` 执行后，`obj2` 值保持不变，这又是为什么？ 函数参数是否真的是 **按值传递**？

那么该如何理解 `函数参数是按值传递的`?

在理解这个之前，我们首先需要知道，`JavaScript` 的数据类型，以及不同数据类型的存储方式。

## 数据类型及其存储方式

我们知道， 在 `JavaScript` 中， 有两种 数据类型，分别是：**(1)基本数据类型**和 **(2)引用数据类型**，

* 基本数据类型：值 直接保存在 **栈（stack）** 中。

  ```js
  let a = 1
  let b = a
  a = 2
  console.log(a, b) // 2 1
  ```

  基本类型在 **栈** 中的赋值变动如下：
  ::: center
  ![function-value-stack](/images/func-value-stack.png){ style=width:500px; }
  :::

* 引用数据类型：值 保存在 **堆（heap）** 中， 并在 **栈（stack）** 中保存 值 在 **堆（heap）** 中的内存地址。

  ```js
  let a = { name: 'Mark' }
  let b = a
  b.name = 'John'
  console.log(a) // { name: 'John' }
  ```

  引用类型在 **栈** 和 **堆** 中的复制变动如下：
  ::: center
  ![function-value-stack](/images/func-value-heap.png){ style=width:680px; }
  :::

## 按值传递

我们从 数据类型来理解 `按值传递`, 那么可以发现， **传递** 的值， 是指在 **栈（stack）** 中保存的值。

即， 无论 **参数值** 是 基本数据类型还是引用数据类型， **传递** 的是 **栈（stack）** 中的值。

* 对于基本数据类型， 函数内部修改参数的值，实际上是修改的是 函数参数重新在 **栈（stack）** 中的内存片段保存的值。

* 对于引用数据类型， 函数参数 传递是的 引用类型在 **栈（stack）** 中的内存地址：
  * 如果直接修改参数的值，函数参数在 **栈（stack）** 中的内存片段保存的内存地址被覆盖。
  * 如果修改 参数对象的属性值，修改的是根据 函数参数在 **栈（stack）** 中的内存片段保存的内存地址对应的在 **堆（heap）** 中的值。

所以回头重新看 **示例1** 和 **示例2**， 均正确表述了 函数的参数是 **按值传递** 的。
