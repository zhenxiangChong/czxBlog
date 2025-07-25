---
url: /czxBlog/interview-question/1416a8f5/index.md
---
::: tip 提问

1. 什么是 浅/深拷贝？
2. 如何实现？

:::

## 浅拷贝

浅拷贝是 创建一个新的对象，这个对象有着原始对象属性值的一份精确拷贝。

如果属性是基本类型，拷贝的就是基本类型的值。

如果属性是引用类型，拷贝的就是内存地址，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。

## 深拷贝

从堆内存中开辟一个新的区域存放新对象，对对象中的子对象进行递归拷贝，拷贝前后的两个对象互不影响。

## 浅拷贝的实现方式

* `Object.assign()`
* 展开运算符 `...`
* `Array.prototype.concat()`
* `Array.prototype.slice()`
* 第三方库，如 `lodash.clone()`

## 深拷贝的实现方式

* `JSON.parse(JSON.stringify(plainObj)))`:
  该方法仅能处理原始对象的属性不包括 函数和正则的对象。

* 第三方库，如 `lodash.deepClone()`

* 对原始对象进行 递归克隆，根据属性值的数据类型进行递归拷贝。

## 手写深拷贝实现

```js
function checkType(target) {
  return Object.prototype.toString.call(target).slice(8, -1)
}

function deepClone(target) {
  let result
  const type = checkType(target)
  if (type === 'Object') {
    result = {}
  }
  else if (type === 'Array') {
    result = []
  }
  else {
    return target
  }
  for (const key in target) {
    const value = target[key]
    const type = checkType(value)
    if (type === 'Array' || type === 'Object') {
      result[key] = deepClone(value, map)
    }
    else {
      result[key] = value
    }
  }
  return result
}
```

但是上述代码存在以下问题：

* 未解决循环引用问题
* 如果对象的属性是 Symbol 类型， for...in 不会获取到
* 拷贝对象的原型可能发生改变

所以需要进行如下改造：

```js
function deepClone(obj) {
  // 使用 WeakMap<target, result> 数据结构保存对象的引用
  // 使用WeakMap的好处是及时被垃圾回收
  const map = new WeakMap()
  function check(val) {
    return Object.prototype.toString.call(val).slice(8, -1)
  }
  function clone(target) {
    let result
    const type = check(target)
    if (type === 'Object') {
      // 从目标的构造函数上的原型创建一个新的对象
      result = Object.create(target.constructor.prototype)
    }
    else if (type === 'Array') {
      result = []
    }
    else {
      return target
    }
    // 判断是否有循环引用
    if (map.has(target)) {
      return map.get(target)
    }
    else {
      map.set(target, result)
    }
    // 获取目标对象所有的属性，包括 Symbol类型
    ;[...Object.keys(target), ...Object.getOwnPropertySymbols(target)].forEach((key) => {
      const value = target[key]
      const type = check(value)
      if (type === 'Object' || type === 'Array') {
        result[key] = clone(value)
      }
      else {
        result[key] = value
      }
    })
    return result
  }
  return clone(obj)
}
```
