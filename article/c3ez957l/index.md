---
url: /czxBlog/article/c3ez957l/index.md
---
::: note
老生常谈！老生常谈！老生常谈啊！
:::

## 什么是HTTP缓存

当客户端向服务器发起资源请求时，会先抵达浏览器缓存，如果浏览器有要请求的资源的副本，
那么就可以直接从浏览器缓存中提取而不是从原始服务器中获取这个资源。

http缓存都是从对同一资源的第二次请求开始的。

* 第一次请求时，服务器返回资源，并在`response header`中回传资源的缓存参数；
* 第二次请求时，浏览器会根据这些缓存参数，判断是否使用浏览器缓存的资源副本还是从服务器获取资源。

## HTTP缓存分类

HTTP缓存，根据是否需要重新向服务器发起请求，可分为两大类：

* 强缓存： 强制缓存，在缓存有效时间内，不再向服务器发起资源请求，直接使用浏览器缓存的资源副本
* 协商缓存：在缓存有效时间内，需要向服务器询问资源是否需要更新，如果需要更新，则从服务器获取新的资源，
  如果不需要更新，则继续使用浏览器缓存的资源副本；

::: tip 另一种缓存分类
根据资源是否可以被单个用户或多个用户使用来分类，还可以分为 私有缓存和共享缓存。

这种一般是对于 代理服务器的，即 浏览器发起请求 -> 代理服务器 -> 原始服务器。

* 私有缓存： 在代理服务器中，仅针对单个用户使用的资源缓存，其他用户发起的对同一个资源的首次请求，仍然需要从原始服务器获取资源
  并为该用户建立新的缓存资源。

* 共享缓存：只要有一个用户发起的对同一个资源的首次到达代理服务器的请求，代理服务器对该资源缓存后，其他用户请求代理服务器上的资源，
  在缓存有效时间内，代理服务器不再向原始服务器获取新的资源，返回代理服务为缓存的资源副本。

:::

## 主要的HTTP Headers

* 通用首部字段

  | 字段          | 说明                                        |
  | ------------- | ------------------------------------------- |
  | Cache-Control | 控制缓存行为                                |
  | Pragma        | http1.0时代的产物，值为 no-cache 时禁用缓存 |

* 请求头部字段 Request Headers

  | 字段                | 说明                           |
  | ------------------- | ------------------------------ |
  | If-Match            | 比较 ETag 是否一致             |
  | If-None-Match       | 比较 ETag 是否不一致           |
  | If-Modified-Since   | 比较资源最后更新时间是否一致   |
  | If-Unmodified-Since | 比较资源最后更新时间是否不一致 |

* 响应头部字段 Response Headers

  | 字段 | 说明         |
  | ---- | ------------ |
  | ETag | 资源匹配信息 |

* 实体头部字段

  | 字段          | 说明                                |
  | ------------- | ----------------------------------- |
  | Expires       | http1.0时代的产物，实体主体过期时间 |
  | Last-Modified | 资源的最后一次更新时间              |

::: warning 提醒
`Pragma`、`Expires` 这两个header是 http1.0中的内容，在 http1.1及往后的版本中逐步被弃用。

但为了能够对浏览器向下兼容，大多数网站在设置 缓存机制时，仍然在 response headers 中保留这两个字段的声明。

本文同样也会对这两个字段进行说明，以及为什么http1.1后会使用 `Cache-Control` 代替。
:::

::: warning 提醒
在某些技术文章分享中，常常会直接把这些headers字段各自分类到 强缓存 或 协商缓存中，
个人认为这种简单粗暴的划分方式是有待商榷，就比如`Cache-Control`的不同取值，其行为会根据值表现为强缓存或协商缓存。
:::

### Pragma

`Pragma` 字段仅有一个 `no-cache`的可选值，会告知客户端不要对该资源进行缓存读取，应该每次都向服务器发送资源请求。

在客户端使用时，通常做法是在 HTML中加上一个 meta 标签：

```html
<meta http-equiv="Pragma" content="no-cache" />
```

::: caution 警告

* 这个标签声明仅有 IE才能识别含义，其他主流浏览器不兼容。
* 在IE浏览器中，虽然能够识别含义，但并不一定会在请求Request Header中加上Pragma，但确实会让当前页面每次都发起新请求。
  （仅限页面html文件，页面内使用的其他资源不受影响。）

:::

在服务端配置为 Response Header 时，浏览器读取到该字段，会禁用缓存行为，后续的对同一资源的请求会重新发起请求而不使用缓存。

::: warning 提醒
由于`Pragma` 在浏览器端的兼容问题，在服务器端又有其他字段能更好的控制缓存行为，Pragma 字段基本已经被抛弃，不再使用，

*除了部分网站出于兼容性考虑，还会带上该字段。*
:::

### Expires

在 http1.0中，Pragma 用于禁用缓存，也需要有一个字段用于启用缓存和定义缓存时间。Expires 就是用于这个目的。

Expires 的值是一个 GMT时间， 如：`Thu Jun 07 2018 14:26:45 GMT`，用于告诉浏览器资源的缓存过期时间，如果还没有超过该时间
则不发起新的资源请求。

在客户端，可以使用 meta标签来告知浏览器缓存时间

```html
<meta http-equiv="expires" content="Thu Jun 07 2018 14:26:45 GMT" />
```

如果希望不走缓存，每次页面请求都发起新的请求，可以把 content 设置为 -1 或 0。

::: caution 提醒
跟 Pragma 字段一样， 该 meta 标签只有 IE 能够正确识别。
而且该方式仅是告知 IE 缓存时间的标记，并不能在 Request Header 中找到该字段。
:::

服务端在 Response Headers 中设置 Expires 字段，则在任何浏览器中都能正确设置资源缓存时间；

::: info 说明
如果同时使用 Pragma 和 Expires 字段， 则 Pragma 优先级会更好，页面会发起新的请求
:::

::: warning 提醒
Expires 字段虽然能够定义缓存有效时间，但是这个时间的设置是相对于本地时间的。
如果在服务端定义，则这个时间是相对于服务端时间的，
这个时间返回到客户端， 客户端是拿着客户端的本地时间与返回的服务端时间做对比。
那么就会导致一种情况，当用户更改了客户端的时间，如超过了 Expires定义的缓存时间，那么缓存就立即失效了。

也正是应该存在着这样的问题，Expires并不能保证缓存能够达到预期的表现，所以也被逐步弃用。
:::

### Cache-Control

`Cache-Control` 是从 `http1.1` 开始支持的 header 属性，该属性的值描述了使用缓存的行为以及缓存的有效时间。

`Cache-Control` 可以在 发起请求时，在`Request Headers` 中声明该属性，（如果资源请求是通过代理服务器再到原始服务器，）
通知代理服务器对资源的缓存方式，以及是否向原始服务器请求最新的资源。

`Cache-Control` 做为 `Response Headers` 属性返回时，通知浏览器对该资源的缓存方式和有效时间。

Cache-Control 语法如下：

```
Cache-Control: <cache-directive>
```

* 作为 `Request Headers` 时， `cache-directive` 支持以下可选值

| 字段名称                   | 说明                                                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| no-cache                   | 告知(代理)服务器不直接使用缓存，要求从原始服务器发起请求                                                                  |
| no-store                   | 所有内容都不会被保存到缓存或 Internet临时文件中                                                                           |
| max-age=delta-seconds      | 告知服务器 客户端希望接收一个存在时间（age）不大于 delta-seconds 秒的资源                                                 |
| max-stale\[=delta-seconds] | 告知(代理)服务器 客户端愿意接收一个超过缓存时间的资源，若有定义delta-seconds，则为delta-seconds秒，若没有则为超过任意时间 |
| min-fresh=delta-seconds    | 告知(代理)服务器 客户端希望接收一个在delta-seconds秒内被更新过的资源                                                      |
| no-transform               | 告知(代理)服务器 客户端希望获取一个实体数据没有被转换(如压缩)过的资源                                                     |
| only-if-cached             | 告知(代理)服务器 客户端希望获取缓存的资源（若有）,而不用向原服务器发起请求                                                |

* 作为 `Response Headers`时，`cache-directive` 支持以下可选值

| 字段名称                | 说明                                                                                                                                   |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| public                  | 表明任何情况下都需要缓存该资源                                                                                                         |
| private\[="file-name"]   | 表明返回报文中全部或部分(若指定了*file-name*的字段数据)仅开放给某些用户(服务器指定的*share-use*)做缓存使用，其他用户则不能缓存这些数据 |
| no-cache                | 不直接使用缓存，要求向服务器发起（新鲜度校验）请求                                                                                     |
| no-store                | 所有内容都不会被保存到缓存或 Internet临时文件中                                                                                        |
| max-age=delta-seconds   | 告知客户端该资源在*delta-seconds*秒内是新鲜的，无需向服务器发起请求                                                                    |
| s-max-age=delta-seconds | 同 max-age，但仅应用于 共享缓存                                                                                                        |
| no-transform            | 告知客户端缓存文件时不得对实体数据做任何改变                                                                                           |
| must-revalidate         | 当前资源一定是向原始服务器发去验证请求的，若请求失败会返回504(而非代理服务器上的缓存)                                                  |
| proxy-revalidate        | 和 must-revalidate类似，但仅应用于 共享缓存                                                                                            |

* 可以直接在 HTML页面的`<head>` 中通过 meta标签来给请求头加上 `Cache-Control` 字段：

  ```html
  <meta http-equiv="Cache-Control" content="no-cache" />
  ```

* `Cache-Control` 允许自由组合可选值：

  ```
  Cache-Control: max-age=3600, must-revalidate
  ```

  这段声明表示，该资源必须从原始服务器获取，且其缓存有效时间为一个小时，在后续的一个小时内，用户重新访问该资源都无需发送请求。

### 缓存校验

`Pragma`、`Expires`、`Cache-Control` 字段能够让客户端决定是否向服务器发送请求，缓存未过期的从本地缓存获取资源，缓存过期的从服务器端获取资源。

但是，客户端向服务器发送了请求，是否以为着一定要读取并返回该资源的实体内容？

* 如果一个资源在客户端的缓存时间过期了，但服务器并没有更新过这个资源，那服务端是否一定要重新把资源的实体内容返回？

* 如果这个资源过大，虽然缓存过期，但又没有更新过，返回实体内容是否会浪费带宽和时间？

对于这些问题，其实只要采取某种策略，让服务器知道客户端现在保存的缓存文件跟服务端的资源文件是一致的，
然后通知客户端该资源可以继续使用缓存文件，不需要重新返回资源实体内容。
那么就可以解决上述的问题，同时为HTTP请求带来优化和加速。

http1.1 新增了 `Last-Modified`、`ETag`、 `If-Match`、`If-None-Match`、`If-Modified-Since`、
`If-Unmodified-Since` 这些字段，用于对缓存资源的校验，提高缓存的复用率。

### Last-Modified

服务器将资源发送给客户端时，会将资源的最后更新时间以如下格式加载实体首部，一起返回给客户端。

客户端会为该资源标记上该信息，下次在请求时，会把该信息添加在请求报文中发送给服务端去做检查。
如果客户端上报字段时间值和服务端的对应资源的最后修改时间一致，则说明改资源没有被修改过，直接返回 304状态码。

客户端在上报 Last-Modified 时，可以使用的 Request Headers 字段有两个：

* `If-Modified-Since`: 该字段格式如下

  ```
  If-Modified-Since: <Last-Modified-Value>
  ```

  字段告诉服务端，如果客户端上报的最后修改时间和服务器上的最后修改时间一致，则直接返回304和响应报头即可。

  当前各浏览器默认使用该字段用来向服务端上报保存的 Last-Modified 值。

* `If-Unmodified-Since`: 该字段格式如下

  ```
  If-Unmodified-Since: <Last-Modified-Value>
  ```

  字段告诉服务端，如果客户端上报的最后修改时间和服务端上的最后修改时间不一致，
  则应当返回 412（Precondition Failed）状态码给客户端。

Last-Modified 由于是使用的资源最后修改时间来确定资源是否有被修改，
但是在实际情况中，往往存在着一个资源被修改了但实际内容没有发生改变，
而由于资源最后修改时间已经发生改变，依然会返回整个实体内容给客户端，而其实内容跟客户端缓存内容一致。

### ETag

为了解决 `Last-Modified` 可能存在的不准确的问题，http1.1 还推出了 ETag 实体首部字段。

服务器会通过某种算法，给资源计算得出一个唯一标识符，在把资源响应给客户端的时候，会在实体首部加上该字段一起返回给客户端。

```
ETag: ETag-Value
```

客户端为资源标记上该信息，下次在请求时，会把该信息添加在请求报文中发送给服务端去做检查。
服务端只需要比较客户端传来的ETag和对应的该资源的ETag是否一致，就可以判断资源相对于客户端资源是否被修改过。
如果ETag是一致的，那么就直接返回304状态码，否则就返回新的资源实体内容给客户端。

客户端在上报 ETag 时，可以使用的 Request Headers 字段有两个：

* `If-None-Match` 该字段格式如下

  ```
  If-None-Match: <ETag-Value>
  ```

  字段告诉服务端，如果ETag没有匹配上，需要重新返回新的资源实体内容，否则直接返回 304 状态码。

  当前各浏览器默认使用该字段用来向服务端上报保存的 ETag 值。

* `If-Match` 该字段格式如下

  ```
  If-Match: <ETag-Value>
  ```

  字段告诉服务端，如果ETag没匹配到，或者收到了`"*"`值而当前没有该资源实体，
  则应当返回412（Precondition Failed）状态码给客户端。否则服务器直接忽略该字段。

::: tip 提醒
如果 `Last-Modified` 和 `ETag` 同时被使用，则要求它们的验证必须同时通过才返回 304，
若其中一个没有通过，则服务器会按照常规返回资源的实体以及200状态码。
:::

## 次要的 HTTP Headers

以下的字段虽然跟缓存有关系，但没有那么重要。

### Vary

`Vary` 表示 服务端会以什么基准字段来区分、筛选缓存版本。

首先考虑一个问题，服务端有一个请求地址，如果是IE用户则返回针对IE开发的内容，否则返回另一个主流浏览器版本的内容。

一般来说，服务端获取到请求的 `User-Agent` 字段做处理即可。
但是如果用户请求的是代理服务器而非原始服务器，且代理服务器如果直接把缓存的IE版本资源发给了非IE的客户端，那就出问题了。

而 Vary 则是用于处理这类问题的头部字段，只需要在响应报文加上：

```
Vary: User-Agent
```

字段告知代理服务器需要以 User-Agent 这个请求头部字段来区别缓存版本，确定传递给客户端的版本。

Vary 字段也接受条件组合的形式

```
Vary: User-Agent, Accept-Encoding
```

字段告知代理服务器需要以 User-Agent 和 Accept-Encoding 两个请求头部字段来区别缓存版本。

### Date、Age

Date 字段表示原始服务器发送该资源的响应报文时间（GMT时间）。
该字段的作用可以帮助我们判断该资源命中的是原始服务器还是代理服务器。

* 如果`Date`的时间与当前时间差别较大，或者连续F5刷新发现Date值没有变化，那么说明当前请求命中的是代理服务器的缓存。
* 如果每次刷新页面，浏览器每次都会重新发起这条请求，那么其Date的值会不断变化，说明该资源是直接从原始服务器返回的。

Age 字段表示某个文件在代理服务器中存在的时间（秒），如果文件被修改或替换，Age会重新从0开始累计。

## 浏览器表现

### 强缓存

对于强缓存的资源：

* 当用户第一次访问该资源时，服务器返回 200状态码，以及资源实体内容。

* 如果用户访问完第一次后，在没有关闭浏览器的前提下，进行了第二次或更多次资源访问，那么浏览器不再请求服务器，
  而是从 浏览器的内存缓存区取出资源，并且 状态码 标记为 `200 (memory cache)`

* 如果用户访问完第一次后，关闭浏览器后，重新打开浏览器，进行第二次或更多次资源访问，那么浏览器也不会请求服务器，

* 而是从 浏览器的磁盘缓存区取出资源，并且 状态码 标记为 `200（disk cache）`

### 协商缓存

* 当用户第一次访问该资源时，服务器返回 200状态码，以及资源实体内容。

* 如果用户进行第二次访问时，进行缓存校验。 或在缓存时间内，或 资源未被修改，那么 直接返回 304状态码

* 如果用户进行第二次访问时，服务器资源已被更新，则返回 状态码 200 ，以及新的资源实体内容。
