---
url: /czxBlog/interview-question/r3evwwd7/index.md
---
::: tip 提问

* 在 某某场景下，如何让某某元素垂直居中？
* 有哪些方式可以实现元素的垂直居中？

:::

**设立一个场景：在一个宽高不固定的容器中，实现一个宽高不固定的内容盒子，并垂直水平居中。**

```html
<!-- 假设 warpper、container 宽高不固定 实现container相对于wrapper垂直水平居中-->
<div class="wrapper">
  <div class="container"></div>
</div>
```

**方法一：** 使用 flex 布局

```css
.wrapper {
  display: flex;
}
.container {
  margin: auto;
}
```

适用于支持 flex布局的浏览器（IE11以上，其他现代浏览器）。这里是利用flex弹性布局的特性，弹性容器改变了其子元素填充可用空间的方式，子元素默认从容器左上角开始排列，在不设置宽高时，子元素填充空间由`flex`声明，默认值为`0 1 auto`,即
`flex-grow: 0;flex-shrink: 1;flex-basis: auto`; 其中 `flex-basis`定义了子元素的宽和高的尺寸大小，`auto`值表示自动尺寸，根据子元素内容计算宽高，在子元素上设置`margin: auto`，这是利用`auto`平均分配水平或垂直方向上的额外的空间，从而达到目的。（此方法实现的结果是“真正的”垂直水平居中）

或者

```css
.wrapper {
  display: flex;
  justify-content: center;
  align-content: center;
}
```

**方法二：** 使用 table 布局

```css
.wrapper {
  display: table-cell;
  vertical-align: middle;
}
.container {
  margin: auto;
}
```

利用的是table布局的特性，不过该方法有个缺点就是，`display: table-cell`元素的宽高设置百分比数值是“无效的”，原因是父元素非`table`元素或`display: table`元素，`display: table-cell`元素的宽高百分比数字是相对于`table`计算的。

**方法三：** `position` + `transform`

```css
.wrapper {
  position: relative;
}
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

该方法与前面两个方法的作用机理有很大的不同，首先第一点是`container`脱离了文档流，
并且`container`自身的宽高发生了坍塌，在不设置宽高属性下，尺寸由内容撑开，
`container`相对`wrapper`元素进行绝对定位，水平方向与垂直方向上，
`container`的左上角顶点偏移到`wrapper`中点，`container`的`transform`是相对于自身的，
`translate(-50%, -50%)`相对于自身，将左上角顶点做左上偏移自身的一半，从而实现了目的。

*有一些面试者给出了`container`元素上设置`margin-left: -50%; margin-top: -50%`的答案，然而，margin的百分比值，是相对于其父元素计算的。*

**方法四：** 使用 行内块元素

```css
.wrapper {
  text-align: center;
}
.wrapper:after {
  content: '';
  display: inline-block;
  vertical-align: middle;
  height: 100%;
}
.container {
  display: inline-block;
  vertical-align: middle;
  text-align: left;
}
```

该方法实现的垂直水平居中其实是一个近似垂直水平居中，兼容IE7以上的浏览器。
水平方向上`.wrapper`设置`text-align: center;`实现了水平居中；垂直方向上，
给定`container`声明行内块元素，并`vertical-align: middle`，但由于`container`高度不确定，
无法声明具体的行高，所以借助了父元素的伪类元素，创建了一个宽度为0高度为100%的行内块元素，
从而使`container`元素在垂直方向上实现了居中。
但由于`vertical-align: middle`是元素的中线与字符X的中心点对齐，大多数字体设计字体的中心点偏下，
也导致了实现的垂直居中并不是绝对的垂直居中。而要实现绝对的垂直居中，需要添加一下属性：

```css
.wrapper {
  font-size: 0;
  white-space: nowrap;
}
.container {
  font-size: 14px; /* 重置回默认字体大小 */
  white-space: normal;
}
```
