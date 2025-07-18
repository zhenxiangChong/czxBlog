---
url: /czxBlog/interview-question/kby2ggwi/index.md
---
::: tip 提问

1. ajax
2. Fetch API
3. jsonp

:::

## ajax

ajax（Asynchronous JavaScript and XML）是指通过 javascript的异步通信，从服务端获取XML文档，
从中提取数据，再将数据更新到当前网页的对应部分，而不需要刷新网页。

一般来说，ajax 包括以下几个步骤：

* 通过 XMLHttpRequest 对象创建一个异步调用对象；
* 创建一个新的 HTTP 请求，并指定该 HTTP 请求的方法、URL 及验证信息
* 设置响应HTTP请求状态变化的函数
* 发送HTTP请求
* 获取异步调用返回的数据
* 使用javascript和 DOM 实现局部更新

## Fetch API

Fetch API 提供了一个 JavaScript 接口，用于访问和操纵 HTTP 管道的一些具体部分，例如请求和响应。它还提供了一个全局 fetch() 方法，该方法提供了一种简单，合理的方式来跨网络异步获取资源。

## jsonp

jsonp 是一种利用 `<script>` 标签 来实现的 支持跨域的异步通信方案。

前端将函数名作为参数传递到后端服务，后端服务在函数中注入需要返回的数据后，作为动态脚本返回给前端，
前端通过 script 标签加载这个动态脚本后，调用该函数，获取到返回的数据。
