---
title: 虚拟滚动（定高）
createTime: 2025/07/28 14:31:27
permalink: /article/13hl56wx/
tags:
  - javascript
  - 优化
---

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>优化版虚拟滚动</title>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
      }
      .container {
        height: 500px;
        overflow-y: auto;
        border: 1px solid #ddd;
        position: relative;
        width: 400px;
        margin: 20px auto;
      }
      .scroll-content {
        position: relative;
        height: 100%;
      }
      .visible-viewport {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
      }
      .item {
        height: 50px;
        line-height: 50px;
        padding: 0 16px;
        border-bottom: 1px solid #eee;
        background-color: #fff;
      }
    </style>
  </head>
  <body>
    <div class="container" id="container">
      <div class="scroll-content" id="scrollContent">
        <div class="visible-viewport" id="visibleViewport"></div>
      </div>
    </div>

    <script>
      // 模拟 10 万条数据
      const data = Array.from({ length: 100000 }, (_, i) => `Item ${i + 1}`);
      const ITEM_HEIGHT = 50; // 每项固定高度

      const container = document.getElementById("container");
      const scrollContent = document.getElementById("scrollContent");
      const visibleViewport = document.getElementById("visibleViewport");

      // 设置总高度（模拟滚动轨道）
      scrollContent.style.height = `${data.length * ITEM_HEIGHT}px`;

      /**
       * 渲染可见区域的内容
       * @param {number} scrollTop - 当前滚动位置
       */
      function renderVisibleItems(scrollTop) {
        const startIdx = Math.floor(scrollTop / ITEM_HEIGHT);
        const endIdx = Math.ceil(
          (scrollTop + container.clientHeight) / ITEM_HEIGHT
        );
        const visibleData = data.slice(startIdx, endIdx);

        // 计算偏移量（保持视觉位置正确）
        const offsetTop = startIdx * ITEM_HEIGHT;
        visibleViewport.style.transform = `translateY(${offsetTop}px)`;

        // 创建文档片段，避免多次重排
        const fragment = document.createDocumentFragment();

        visibleData.forEach((text) => {
          const item = document.createElement("div");
          item.className = "item";
          item.textContent = text;
          fragment.appendChild(item);
        });

        // 替换内容，只执行一次 DOM 操作
        visibleViewport.innerHTML = "";
        visibleViewport.appendChild(fragment);
      }

      /**
       * 节流函数，防止频繁触发滚动事件
       * @param {Function} func - 要执行的函数
       * @param {number} delay - 延迟时间（毫秒）
       * @returns {Function}
       */
      function throttle(func, delay) {
        let lastCall = 0;
        return function (...args) {
          const now = new Date().getTime();
          if (now - lastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
          }
        };
      }

      // // 监听滚动事件
      // container.addEventListener(
      //   "scroll",
      //   throttle(() => {
      //     renderVisibleItems(container.scrollTop);
      //   }, 16)
      // ); // 16ms ≈ 60fps

      // 下面是通过requestAnimationFrame优化比节流更高效

      // 用于标记是否已有动画帧请求
      let isAnimating = false;

      // 监听滚动事件
      container.addEventListener("scroll", () => {
        // 如果没有等待执行的动画帧，则发起新的请求
        if (!isAnimating) {
          isAnimating = true;
          // 与浏览器刷新频率同步执行渲染
          requestAnimationFrame(() => {
            // 执行可视区域元素渲染逻辑
            renderVisibleItems(container.scrollTop);
            // 重置标记，允许下一次动画帧请求
            isAnimating = false;
          });
        }
      });

      // 初始渲染
      renderVisibleItems(0);
    </script>
  </body>
</html>
```
