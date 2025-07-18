---
url: /czxBlog/interview-question/f4snyn2e/index.md
---
::: tip 提问

1. 什么是重绘和回流
2. 哪些属性会引起重绘和回流
3. 如何减少回流

:::

## 重绘和回流

* 重绘

  当渲染树中的一些元素需要更新属性，而这些属性只影响元素的外观、风格，而不会影响布局的操作，称之为重绘

* 回流

  当渲染树中的一部分（或全部）因为元素的规模尺寸、布局、隐藏等改变而需要重新构建的操作，会影响到布局的操作，
  称之为回流。

回流必定会发生重绘，重绘不一定会引起回流。

回流所需的成本比重绘高得多，改变父节点里的子节点可能会导致父节点的一系列回流。

### 常见引起重绘的属性

`border-styl` , `border-radius` , `border-color` , `color`,
, `background` , `background-image` , `background-position` , `background-repeat` ,
, `visibility` , `outline` , `box-shadow`, `text-decoration` 等

### 常见引起回流的方式

* 页面首次渲染

* 浏览器窗口大小发生改变

* 元素尺寸或位置发生改变

* 元素内容发生变化

* 元素字体大小变化

* 添加或删除可见的DOM元素

* 激活 CSS 伪类

* 查询某些属性或者调用某些方法

* `width`, `height`, `margin`, `padding`, `display`, `border`, `position`, `overflow`,

* `clientWidth`, `clientHeight`, `clientTop`, `clientLeft`,

* `offsetWidth`, `offsetHeight`,`offsetLeft`, `offsetTop`,

* `scrollWidth`, `scrollHeight`, `scrollTop`, `scrollLeft`,

* `scrollIntoView()`, `scrollIntoViewIfNeeded()`,

* `getComputedStyle()`

* `getBoundingClientRect()`

* `scrollTo()`

## 减少回流的方式

* 避免使用 table 布局，因为可能一个很小的改变，都会造成整个 table 的重新布局
* 避免一条一条的修改DOM样式，可以采用预定义的css的class，或者将所有修改都保存起来，再一次性修改
* 避免设置多层内联样式
* 避免频繁的操作DOM
* 避免频繁读取会引发回流的属性
* 对具有复杂动画的元素，将其脱离文档流
