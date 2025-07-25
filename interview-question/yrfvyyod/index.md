---
url: /czxBlog/interview-question/yrfvyyod/index.md
---
[![vue@3](https://img.shields.io/badge/vue-%403-brightgreen)](https://staging-cn.vuejs.org/)

::: tip 提问
vue3 有哪几种组件通信方式？
:::

在vue2 中能够使用的 组件通信方式，在 vue3 中同样的都能够使用，但有部分有区别，同时，还扩展了其他的通信方式

[vue2 组件通信方式](/interview-question/1ryrldbc/)

## 组件通信方式

::: info
仅列出跟vue2有区别的部分，以及新增的方式
:::

### $parent / refs / expose

相比于 vue3 ，vue2 删除了 `$children` ，可以使用 `refs` 获取子组件的实例。

子组件还可以通过 `expose` 选项 控制允许哪些内容暴露给父组件

适用场景：

* 父子组件通信

### $attr

在 vue3 中， 已经移除了 `$listener`， 并将其合并到了 `$attr` 中，所以可以直接使用 `attr`向后代组件传递数据

### 共享响应式对象

使用 `reactive` 创建一个响应式对象，并在不同组件中导入它。

这种方式可以创建一个简单的共享状态管理， 但由于任何导入它的组件都可以对其进行修改，这种做法不好维护。
而且仅适用于纯客户端前端页面，如果需要使用 `SSR`，那么这种方式可能会导致 **跨请求状态污染**

适用场景：

* 父子组件通信
* 兄弟组件通信
* 隔代组件通信

这种方式虽然可以进行各种组件间关系的通信，但不适合用于有复杂变更状态的场景。

### Pinia

一个 替代 `Vuex` 的 状态管理库。
