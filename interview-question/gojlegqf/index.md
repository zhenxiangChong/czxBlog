---
url: /czxBlog/interview-question/gojlegqf/index.md
---
::: tip 提问
写一个通用事件侦听器
:::

一个通用事件侦听器 需要考虑到 浏览器的兼容问题，
在旧浏览器、IE浏览器、现代浏览器中，事件侦听的绑定和移除均有所差别，而且 event 也有差别。

```js
const DomEvent = {
  add(el, type, handler) {
    if (el.addEventListener) {
      el.addEventListener(type, handle, false)
    }
    else if (el.attachEvent) {
      el.attachEvent(`on${type}`, handler)
    }
    else {
      el[`on${type}`] = handler
    }
  },
  remove(el, type, handler) {
    if (el.removeEventListener) {
      el.removeEventListener(type, handler, false)
    }
    else if (el.detachEvent) {
      el.detachEvent(`on${type}`, handler)
    }
    else {
      el[`on${type}`] = null
    }
  },
  getTarget(event) {
    return event.target || event.srcElement
  },
  getEvent(event) {
    return event || window.event
  },
  stopPropagation(event) {
    if (event.stopPropagation) {
      event.stopPropagation()
    }
    else {
      event.cancelBubble = true
    }
  },
  preventDefault(event) {
    if (event.preventDefault) {
      event.preventDefault()
    }
    else {
      event.returnValue = false
    }
  }
}
```
