---
url: /czxBlog/article/96gtr7pj/index.md
---
一个很常见的场景，在页面埋点的上报数据中，保存着多个状态，直接传输这组状态可能数据体积较大。
此时我们可以考虑使用 **二进制** 的方式进行优化。

## 为什么需要状态压缩？

在现代前端监控中，我们经常需要上报用户行为数据：

```json
{
  "isFirstView": true,
  "isHugeDocument": false,
  "isLoggedIn": true,
  "isMobile": true,
  "isDarkMode": false,
  "isSubscribed": true
  // ...
}
```

这样的JSON结构虽然可读性好，但存在两个致命问题：

* **数据冗余**：键名重复占用大量空间
* **传输成本**：每个状态至少占用5-10字节

当每日PV达到百万级时，这些冗余数据会让：

* 用户消耗更多流量
* 服务器承受更大压力
* 分析延迟增加

## 二进制位运算

想象有一排开关，每个开关控制一个状态：

```txt
   [开]     |    [关]        |   [开]     |   [开]   |   [关]     |   [开]
isFirstView | isHugeDocument | isLoggedIn | isMobile | isDarkMode | isSubscribed
```

计算机用 **二进制** 表示这些开关状态：

```txt
101101
```

如果我们将这个二进制转换为 十进制，那么就是：

```txt
45
```

可以发现，从原本的JSON 数据需要的大量字节空间压缩到了 **两个字节**。

这个神奇转换就是 **位掩码技术** 的核心！

那么我们如何将状态转换为二进制？以及如何从二进制中还原状态？

我们知道，在位运算中有三种常见的操作：

* **左移（`<<`）**

  [MDN - 运算符 - 左移](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Left_shift){.read-more}

  **左移操作符 (<<)** 将第一个操作数向左移动指定位数，左边超出的位数将会被清除，右边将会补零。

  ```ts
  const A = 1 << 0 // 000001 = 1
  const B = 1 << 1 // 000010 = 2
  const C = 1 << 2 // 000100 = 4
  ```

* **按位或 (`|`)**

  [MDN - 运算符 - 按位或](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_OR){.read-more}

  **按位或（|）** 运算符在其中一个或两个操作数对应的二进制位为 1 时，该位的结果值为 1。

  ```ts
  const AorB = A | B // 000011 = 3
  const BorC = A | B // 000110 = 6
  const AorBorC = A | B | C // 000111 = 7
  ```

* **按位与 (`&`)**

  [MDN - 运算符 - 按位与](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_AND){.read-more}

  **按位与（&）** 运算符在两个操作数对应的二进位都为 1 时，该位的结果值才为 1。

  ```ts
  const hasB = AorB & B // 000010 = 2
  const hasC = AorB & C // 000000 = 0
  ```

由此，我们可以：

* 通过 **左移** 运算，为不同的状态分配不同的二进制位。
* 通过 **按位或** 运算，将不同状态的二进制位进行合并。
* 通过 **按位与** 运算，判断合并后的二进制位是否有对应的状态。

## 实现方法

### 定义每个状态的二进制位

```ts
interface State {
  isFirstView: boolean
  isHugeDocument: boolean
  isLoggedIn: boolean
  isMobile: boolean
  isDarkMode: boolean
  isSubscribed: boolean
}

const STATE_MAP: Record<keyof State, number> = {
  isFirstView: 1 << 0,
  isHugeDocument: 1 << 1,
  isLoggedIn: 1 << 2,
  isMobile: 1 << 3,
  isDarkMode: 1 << 4,
  isSubscribed: 1 << 5,
}
```

### 状态压缩器

```ts
/**
 * 合并状态
 * @returns combinedState 合并后的状态
 */
function combineStates(state: Partial<State>): number {
  return (Object.keys(state) as (keyof typeof STATE_MAP)[]).reduce((combinedStates, key) => {
    return state[key] ? combinedStates | STATE_MAP[key] : combinedStates
  }, 0)
}
```

### 状态还原器

```ts
/**
 * 判断状态是否存在
 */
function hasState(combinedState: number, state: number): boolean {
  return (combinedState & state) === state
}

/**
 * 还原状态
 */
function restoreStates(combinedState: number): State {
  return (Object.keys(STATE_MAP) as (keyof typeof STATE_MAP)[]).reduce((result, key) => {
    result[key] = hasState(combinedState, STATE_MAP[key])
    return result
  }, {} as State)
}
```

### 使用示例

客户端压缩状态：

```ts
// 用户当前状态
const state: State = {
  isFirstView: false,
  isHugeDocument: false,
  isLoggedIn: true,
  isMobile: true,
  isDarkMode: true,
  isSubscribed: false
}
// 合并状态
const combinedState = combineStates(state) // 011100 = 28
```

后台服务还原状态:

```ts
restoreStates(combinedState /* 011100 = 28 */)
// 输出： {
//  isFirstView: false,
//  isHugeDocument: false,
//  isLoggedIn: true,
//  isMobile: true,
//  isDarkMode: true,
//  isSubscribed: false
// }
```

## 性能对比

假设有20个状态需要上报：

| 指标           | JSON格式 | 二进制压缩 | 优化效果 |
| -------------- | -------- | ---------- | -------- |
| 数据大小       | ~200字节 | 4字节      | 98%      |
| 百万次传输成本 | 200MB    | 4MB        | 98%      |

::: tip 在 Chrome 性能测试中，位运算操作比JSON解析快100倍以上
:::

## 注意事项

* **32位限制**：JavaScript位运算使用32位整数，最多支持31个状态（第32位是符号位）

  ```ts
  // 错误示例：超出32位
  const invalidStatus = 1 << 32
  ```

* **扩展性**：新增状态只需新增 `STATE_MAP` 键值对

  ```ts
  const STATE_MAP = {
    // ...
    isVip: 1 << 6,
  }
  ```

* **数据传输格式**：推荐使用紧凑结构

  ```ts
  // 优化后的上报数据结构
  const reportData = {
    t: Date.now(), // 时间戳
    u: 'user123', // 用户ID
    s: compressedStatus // 压缩状态
  }
  ```

## 总结

**位运算** 就像程序员的瑞士军刀——在特定场景下能发挥惊人效果。

下次当你面对膨胀的埋点数据时，不妨试试这个二进制方法。毕竟，在编程世界里，有时候 **少即是多，小即是美** ！
