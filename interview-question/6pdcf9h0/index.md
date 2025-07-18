---
url: /czxBlog/interview-question/6pdcf9h0/index.md
---
::: tip 提问

1. http协议
2. http 状态码
3. https 协议
4. post和get区别？
5. options请求有什么用？

:::

## http协议

http 是超文本传输协议，定义了客户端和服务器之间交换报文的格式和方式。
http使用TCP作为传输层协议，保证了数据传输的可靠性。
http是一个无状态协议，http服务器不会保存关于客户的任何信息。

http报文有两种：

* 请求报文，包括 请求行和 首部行 和实体主体。请求行包括了请求方法和 URL字段等。
* 响应报文，包括 状态行和首部航和实体主体。 状态行包括了 状态码 和 状态信息 等。

## http 状态码

http 状态吗 是由三个十进制的数字组成，可以分为五类。

* `1**` 信息响应，服务器接受到请求，需要请求者继续执行操作
* `2**` 成功响应，操作被成功接收并处理
* `3**` 重定向，需要进一步的操作以完成请求
* `4**` 客户端错误，请求包含语法错误或无法完成请求
* `5**` 服务器错误，服务器在处理请求的过程中发生了错误

常见的状态码

* `200` 请求成功
* `204` 无内容。请求成功，服务器成功处理，但未返回内容
* `304` 未修改。所请求的资源未修改，服务器返回此状态码时，不会返回任何资源。
* `400` 客户端请求语法错误，服务器无法理解
* `401` 请求要求用户的身份认证
* `403` 服务器拒绝执行请求
* `404` 服务器无法根据客户端的请求找到资源

## HTTPS 协议

https 是超文本传输安全协议，是基于HTTP协议的，使用 TLS/SSL来对数据加密。

## Post 和 Get 的区别

* 从应用场景上来说，GET请求是一个幂等请求，一般GET请求用于对服务器资源不会产生影响的场景，比如说请求一个网页。
  而POST请求不是一个幂等请求，一般用于对服务器资源会产生影响的请求。比如注册用户等操作。

* 由于不同的应用场景，浏览器一般会对 GET请求缓存，但很少对POST请求缓存

* 从发送的报文格式来说，GET请求的报文实体不为空，POST请求的报文实体部分一般为向服务器发送的数据

* GET 请求的请求参数一般是放入到URL中想服务器发送，POST请求一般是在请求实体中发送数据

## OPTIONS 请求的作用

一般是用于客户端 请求服务端返回该资源所支持的所有HTTP请求方法。

该方法会用 `*` 来代替资源名称，向服务器发送OPTIONS请求，测试服务器功能是否可用。

JS的XMLHttpRequest对象进行 CORS 跨域资源共享时，对复杂请求，会使用OPTIONS方法发送嗅探请求，判断是否有对指定资源的访问权限。
