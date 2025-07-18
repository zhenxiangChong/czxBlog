---
url: /czxBlog/article/xhb2iacu/index.md
---
在现代前端中，SPA应用是一种主流的前端应用交互方案，其中，前端路由是实现SPA应用的关键技术之一。

## 路由

**路由（Router）** 一般指的是 URI 中 pathname + basename + hash + query 所组成的 路径。

在前端中， **路由** 一般指的是 **随着浏览器中的地址栏的变化，呈现不同的内容给用户**。
浏览器地址栏的变化，即是 访问链接的变化，具体指的就是 pathname + basename + hash + query 部分的变化。

示例：

```
/a/b
/a/b/#/hash
/a/b/#/hash?c=1
```

对于前端路由，一般会选择 监听 hash 部分的变化， 或者监听 pathname 部分的变化，从而一般有两种路由模式：

### hash 模式

通过监听 地址栏中 hash 部分的变化，从而呈现不同的内容。

::: center
**<https://example.com/index.html> ==#/a/b/==**
:::

在浏览器中，通过注册 **hashchange** 事件，监听 **hash** 变化。

```js
window.addEventListener('hashchange', () => {
  const hash = window.location.hash
  console.log(hash) // #/a/b/
})
```

通过 hash 实现路由的优势在于， hash 仅依赖于浏览器，且hash的变化不会直接导致页面刷新，天然适合于实现 前端路由。

### history 模式

通过监听 地址栏中 pathname 部分的变化，从而呈现不同的内容。

history模式是依赖于 浏览器端的 History API 而实现。
History API 允许我们对浏览器会话历史记录进行访问并操作。

::: center
**<https://example.com> ==/a/b/==**
:::

History API 通过 history.pushState() 和 history.replaceState() 方法，新增或者替换历史记录，
通过 popState 事件监听历史记录的变化。

直接操作历史记录的变化，结果会改变浏览器地址栏的显示内容，但不会引起浏览器刷新页面。
但是由于变化的部分一般是 `pathname + basename` 的部分，如果手动刷新页面，可能会导致浏览器通过当前路径
向服务器发起请求找不到对应的资源而返回404，所以一般需要在服务器端的HTTP服务器进行配置，将相关的路径请求资源，
都指向同一个html资源文件。

> [History API](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)

### 其他模式

除了上述两种一般用于浏览器端中的路由模式，为了满足其他的场景，比如 在SSR场景下，需要在服务端模拟路由在生成页面内容，
或者在 electron 桌面应用中。一般会基于 memory 实现一种 仅通过 memory 的变化的路由的模式。

在这个模式中，通过一个普通的 JavaScript 字符串或者对象，来实现模拟 路由路径地址以及相关功能。

## Router解析

前端路由在不同的库或者框架中实现，一般会采用一套通用的解析规则，在实现细节上有所差异。

一个路由地址，一般包含如下几个部分：

* **path** 表示路由的路径
* **params** 表示路由的路径动态匹配结果
* **query** 表示路由携带的参数，未解析前为 queryString, 解析后为 queryObject

如一个 路由地址： `/a/b/?c=1` 中， `/a/b/` 部分一般称为 **path** ， `?c=1` 部分一般被称为 `query`。

### 具名路由

具名路由，也称 静态路由 指在声明一个路由时，对地址栏路径地址使用 全等匹配，仅当声明的路由与路径地址全等时，才命中路由。

```js
// 浏览器地址栏： https://example.com/a/b/
// 声明路由：
const routes = [
  {
    path: '/a/b', // 命中当前路由
  },
  {
    path: '/a/c', // 不一致，未命中
  },
  {
    path: '/a', // 不一致，未命中
  },
  {
    path: '/a/b/c', // 不一致，未命中
  },
]
```

### 路由匹配

路由匹配，指通过 一套匹配规则，对地址栏路径地址 进行 规则匹配，当命中匹配规则时，则命中路由。
一般场景下， 通过 `/:pathname` 的格式来表示路由路径中的动态部分。

如 `/user/:id`， 则可以匹配 `/user/123`，`/user/456` 等满足规则的地址栏路径。

`/:pathname` 部分会被解析到 `params` 对象中，如上述的 通过`/user/:id`规则解析 `/user/123`，表示为：

```js
const currentRoute = {
  path: '/user/123',
  params: { id: 123 },
}
```

### 其他

在不同的框架或库中， 对路由解析会在基于上述的规则的基础上，进行补充和扩展，提供更加丰富的功能，以满足更多的场景。

比如， **Vue-Router** 使用了 `path-to-regexp` 库作为其路由解析的依赖，该库提供了非常丰富且灵活的路径匹配功能，
能够适配非常多的从简单到复杂的场景。**React-Router** 则在其内部实现了和扩展了相关的规则。
