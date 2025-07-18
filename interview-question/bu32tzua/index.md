---
url: /czxBlog/interview-question/bu32tzua/index.md
---
::: tip 提问

1. 行内元素和块级元素
2. HTML5元素的分类
3. 空元素的定义

:::

## 行内元素和块级元素

在 HTML4 中，元素被分为两大类， inline（内联元素）和 block（块级元素）

1. 内联元素

   内联元素 只占据它对应的标签的边框所包含的空间。

   常见的内联元素有： `<a>`, `<span>`, `<img>`, `<button>`, `<input>`, `strong`, `<label>`,
   `<select>`, `<textarea>` 等

2. 块级元素

   块级元素占据其父元素（容器）的整个宽度，创建了一个`块`。

   常见的块级元素有： `<div>`, `<ul>`, `<ol>`, `<li>`, `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`,
   `<h6>`, `<p>` 等

## HTML5元素的分类

由于 CSS 属性 `display` 可以直接声明 元素是 `block` 或 `inline` 或`inline-block` 等，
所以简单的将 元素分类为 内联元素和块级元素已不再符合需求。

在HTML5中，元素主要分为 7 类， 并且每个元素可以归属于一个或多个类型：

* Metadata 元数据元素

  `<base>`, `<link>`, `<link>`, `<meta>`, `<script>`, `<noscript>`, `<style>`, `<title>`

* Flow 流式元素

  `<a>`, `<abbr>`, `<address>`, `<article>`, `<aside>`, `<audio>`, `<br>`, `<button>`,
  `<blockquote>`, `<canvas>`, `<div>`, `<footer>`, `<form>`, `<h1>`, `<h2>`, `<h3>`,
  `<h4>`, `<h5>`,`<h6>`, `<p>` 等

* Sectioning 章节元素

  `<article>`, `<aside>`, `<nav>`, `<section>` 等

* Heading 标题元素

  `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`,`<h6>`, `<hgroup>`等

* Phrasing 短语元素

  `<abbr>`, `<br>`, `<button>`, `<canvas>`, `<code>`, `<img>`, `<i>`, `<strong>`, `<iframe>`,
  `<input>`, `<small>`, `<select>` 等

* Embedded 嵌入元素

  `<audio>`, `<video>`, `<canvas>`, `<iframe>`, `<img>`, `<embed>`, `<svg>` 等

* Interactive 交互元素

  `<a>`, `<button>`, `<details>`, `<embed>`, `<iframe>`, `<label>`, `<textarea>`, `<select>`

## 空元素的定义

标签内没有内容的 HTML 标签被称为空元素。

空元素是在开始标签中关闭的，也称 自闭合元素。

`<br>`, `<hr>`, `<img>`, `<input>`, `<link>`, `<meta>`
