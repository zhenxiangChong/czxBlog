---
url: /czxBlog/interview-question/yiutzl7y/index.md
---
::: tip 提问

1. http/2
2. http2有什么特性？

:::

## HTTP/2

HTTP/2 是对HTTP/1.1的升级，对HTTP/1.1做了优化。

## 特性

* 二进制协议

  在http/1.1 版中，报文的头信息必须是文本，数据体可是是文本或者二进制。
  而在HTTP/2中，头信息和数据体都是二进制，并且统称为`帧`。

* 多路复用

  HTTP/2 复用TCP连接，客户端和服务器都可以同一个TCP连接中并发请求或响应，且之间互不干扰。

* 数据流

  每个请求或响应的所有数据包，称为一个数据流。

* 头信息压缩

  头信息使用 gzip或 compress 压缩后再发送；客户端和服务器会同时维护一张头信息表，所有字段都会存入这张表，并生成
  一个索引号，对于相同字段，只发送索引号。

* 服务器推送

  允许服务器未经请求，主动向客户端发送资源。
