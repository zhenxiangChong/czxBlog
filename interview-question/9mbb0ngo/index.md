---
url: /czxBlog/interview-question/9mbb0ngo/index.md
---
::: tip 提问

1. 如果优化关键渲染路径？
2. 渲染页面时常会出现哪些不好的现象？

:::

## 渲染页面常见问题

* 无样式内容闪烁

  由于浏览器的渲染机制，在CSS加载之前，先呈现了HTML，就会导致展示出无样式的内容，然后样式突然呈现的现象。
  这个问题出现的原因是由于CSS加载时间过长，或者CSS被放在了文档的底部。

* 白屏

  有些浏览器渲染机制要先构建DOM树和 CSSOM树，构建完成后在进行渲染，如果CSS部分放在HTML尾部，由于CSS加载未完成，
  浏览器迟迟未渲染，从而导致白屏；也可能是把JS文件放在头部，脚本的加载会阻塞后面文档的内容解析，从而页面迟迟未
  渲染出来，导致了白屏问题。

## 优化关键渲染路径

优化关键渲染路径，首要是尽快完成首次渲染。要达到这个目的，就需要尽快让 文档解析完成并渲染。

所以需要最大限度的减小以下三种可变因素：

1. 关键资源数量
2. 关键路径长度
3. 关键字节数量

* 关键资源是可能阻止网页首次渲染的资源。这些资源越少，浏览器的工作量就越少，对CPU以及其他资源的占用也越少。
* 关键路径长度受所有关键资源与其字节大小之间依赖关系图的影响，某些资源只能在上一个资源处理完毕后才能开始下载，
  并且资源越大，下载所需要的往返次数就越多。
* 浏览器需要下载的关键字节越少，处理内容并让其出现在屏幕上的速度就越快。
  要减少字节数，可以减少资源数（将它们删除或者设为非关键资源），此外还需要压缩和优化各项资源，确保最大限度减少
  传输大小。

优化关键路径的常规步骤如下：

* 对关键路径进行分析和特性描述：资源数、字节数、长度。
* 最大限度减少关键资源的数量：删除、延迟下载，标记为异步等。
* 优化关键字节数以缩短下载时间（往返次数）
* 优化其余关键资源的加载顺序。
