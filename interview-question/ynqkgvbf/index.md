---
url: /czxBlog/interview-question/ynqkgvbf/index.md
---
[![vue@2](https://img.shields.io/badge/vue-%402-brightgreen)](https://cn.vuejs.org/)

::: tip 提问

1. 简单介绍一下Vue2的响应式原理

:::

* Vue会将传入`data` 选项的普通javascript对象，对它的所有 `property` 进行遍历，
  并使用 `Object.defineProperty` 把这些 `property` 全部转换为 `getter/setter`。

* Vue 通过 `getter/setter` 来实现监听数据的变化，通过 `getter` 进行依赖收集，通过`setter`观察数据变化。

* Vue 的每个组件实例，都对应一个 `Watcher` 实例，`Watcher` 会在组件渲染过程中，把 "接触" 过的数据 property
  记录为依赖，当依赖项的 `setter` 触发时，会通知 `Watcher` ,使关联的组件重新渲染。

* Vue 更新 DOM 是异步的，Vue 会开启一个队列，在同一个事件循环中，Vue会缓冲所有数据变更，
  如果同一个 `Watcher` 被触发多次，只会被推入到队列一次。在下一个事件循环`tick`中，
  Vue刷新队列并执行实际的工作。这种异步方式，可以去除重复的数据，可以避免不必要的计算和DOM的操作。

由于 Vue2 是通过 `Object.defineProperty` 实现的 数据劫持，

* 无法检测对象是否有新增和删除 `property`

  需要通过 `this.$set` 来添加为对象添加新的`property`，或者重新进行变量的对象赋值。

* 无法检测通过数组下标进行的赋值操作，无法检测 通过 `length` 修改数组长度

  需要通过 `this.$set` 为数组的子元素重新赋值，或者用 splice 方法替换子元素

* 需要对数组的方法进行重写，实现对数组的数据监听
