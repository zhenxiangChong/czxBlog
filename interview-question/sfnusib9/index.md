---
url: /czxBlog/interview-question/sfnusib9/index.md
---
::: tip 提问

* 请简述 CSS 盒模型。
* 盒模型有哪些类型？有什么区别？

:::

盒模型是CSS规范定义的模块，它规定了一个矩形盒子（标准盒模型），描述任意元素在文档树中占据的空间区域。每个盒子有四个边：

* `外边距边（margin edge or outer edge）`
* `边框边（border edge）`
* `内填充边（padding edge）`
* `内容边（content edge or inner edge）`

可以划分四个区域：

* `外边距区域（margin area）`
* `边框区域（border area）`
* `内填充区域（padding area）`
* `内容区域（content area）`

![css box model](https://drafts.csswg.org/css-box-3/images/box.png)

为什么会有盒模型类型，严格来说，多数浏览器都按照规范实现了标准盒模型，而盒模型的类型主要是来自于不同浏览器对元素宽高的方式不同而导致，IE浏览器认为元素的`width/height`应该是由元素的`内容+内填充+边框`组成，而W3C规定的元素的`width/height`应该是元素的`内容`，从而衍生了不同的盒子模型。到`CSS3`，添加了`box-sizing`属性，用于更改用于计算元素宽高的默认盒子模型，并将IE浏览器和W3C规范纳入了实现中。可以使用此属性来模拟不正确支持CSS盒子模型规范的浏览器的行为。

*注：`width/height`最终并不能完全决定元素的实际占用宽高。*

```css
/* 关键字值 */
box-sizing: border-box; /* 默认值 */
box-sizing: content-box;
/* 全局值 */
box-sizing: inherit;
box-sizing: initial;
box-sizing: unset;
```

`border-box`规定了元素的`width`由`内容+内填充+边框`组成，即IE浏览器的实现。 元素的实际占据宽度由 width属性+外边距。内容宽度为`width - padding - border`。

`content-box`规定了元素的`width`即`内容宽度`, W3C规范的标准。元素的实际占据宽度由`widht + padding + border + margin`。内容宽度为`width`。

`box-sizing`还有一个待废除的值`padding-box`，`width` 和 `height` 属性包括内容和内边距，但是不包括边框和外边距。只有Firefox实现了这个值，它在Firefox 50中被删除。

在高度计算上以上规则同样适用，但对非替换行内元素，尽管内容周围存在内边距与边框，但其占用空间受到`line-height`属性影响。
