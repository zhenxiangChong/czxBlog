---
url: /czxBlog/algorithm/greedy/index.md
---
## 概述

\==贪心算法（Greedy Algorithm）== 是用计算机来模拟一个 **贪心** 的人做出决策的过程。
这个人十分贪婪，每一步行动总是按某种指标选取最优的操作。而且他目光短浅，总是只看眼前，并不考虑以后可能造成的影响。

可想而知，并不是所有的时候贪心法都能获得最优解，所以一般使用贪心法的时候，都要确保自己能证明其正确性。

### 适用范围

贪心算法在 **有最优子结构的问题** 中尤为有效。

最优子结构的意思是 **问题能够分解成子问题来解决，子问题的最优解能递推到最终问题的最优解** 。

### 证明

贪心算法有两种证明方法：反证法和归纳法。一般情况下，一道题只会用到其中的一种方法来证明。

* **反证法**：如果交换方案中任意两个元素/相邻的两个元素后，答案不会变得更好，那么可以推定目前的解已经是最优解了。
* **归纳法**：先算得出边界情况（例如 $n = 1$ ）的最优解 $F\_{1}$，
  然后再证明：对于每个 $n$，$F\_{n+1}$ 都可以由 $F\_{n}$ 推导出结果。

## 核心特点

* **局部最优 → 全局最优**：通过局部最优决策的累积达到全局最优
* **不可回溯**：一旦做出选择不再改变
* **高效性**：通常时间复杂度较低
* **不保证全局最优**：仅适用于特定问题类型

## 设计步骤

* **建立数学模型**：明确优化目标
* **分解子问题**：将问题分解为多个决策阶段
* **制定贪心策略**：确定局部最优的选择标准
* **证明正确性**：验证问题具有贪心选择性质
* **实现算法**：编写高效代码实现

## 示例

### 找零问题

用最少硬币数凑出指定金额（假设硬币无限供应）

```ts
function minCoins(coins: number[], amount: number): number {
  coins.sort((a, b) => b - a) // 降序排列
  let count = 0
  let remaining = amount

  for (const coin of coins) {
    while (remaining >= coin) {
      remaining -= coin
      count++
    }
    if (remaining === 0)
      break
  }

  return remaining === 0 ? count : -1
}

// 测试
const coins = [1, 2, 5, 10, 20]
console.log(minCoins(coins, 36)) // 输出：3 (20+10+5+1)
```

### 活动选择问题

在竞争活动中选择最大兼容活动子集

```ts
interface Activity {
  start: number
  end: number
}

function selectActivities(activities: Activity[]): Activity[] {
  activities.sort((a, b) => a.end - b.end) // 按结束时间排序

  const selected: Activity[] = [activities[0]]
  let lastEnd = activities[0].end

  for (let i = 1; i < activities.length; i++) {
    if (activities[i].start >= lastEnd) {
      selected.push(activities[i])
      lastEnd = activities[i].end
    }
  }

  return selected
}

// 测试
const activities: Activity[] = [
  { start: 1, end: 4 },
  { start: 3, end: 5 },
  { start: 0, end: 6 },
  { start: 5, end: 7 },
  { start: 8, end: 9 }
]

console.log(selectActivities(activities))
// 输出：[ {start:1, end:4}, {start:5, end:7}, {start:8, end:9} ]
```

## 局限性

* **非全局最优**：如0-1背包问题无法使用贪心
* **证明困难**：需要严格数学证明正确性
* **策略敏感**：排序方式直接影响结果

## 区别

### 与动态规划的区别

贪心算法与动态规划的不同在于它对每个子问题的解决方案都做出选择，不能回退。

动态规划则会保存以前的运算结果，并根据以前的结果对当前进行选择，有回退功能。

## 相关问题

[**LeetCode** - 贪心算法](https://leetcode.cn/problem-list/greedy/){.read-more}

### 基础（掌握贪心选择策略）

* **455. 分发饼干**（[LeetCode](https://leetcode.cn/problems/assign-cookies/)）
* **860. 柠檬水找零**（[LeetCode](https://leetcode.cn/problems/lemonade-change/)）
* **122. 买卖股票的最佳时机 II**（[LeetCode](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/)）

### 进阶（区间处理与路径选择）

* **435. 无重叠区间**（[LeetCode](https://leetcode.cn/problems/non-overlapping-intervals/)）
* **452. 用最少数量的箭引爆气球**（[LeetCode](https://leetcode.cn/problems/minimum-number-of-arrows-to-burst-balloons/)）
* **55. 跳跃游戏**（[LeetCode](https://leetcode.cn/problems/jump-game/)）
* **45. 跳跃游戏 II**（[LeetCode](https://leetcode.cn/problems/jump-game-ii/)）

### 挑战 （多维度贪心策略）

* **135. 分发糖果**（[LeetCode](https://leetcode.cn/problems/candy/)）
* **406. 根据身高重建队列**（[LeetCode](https://leetcode.cn/problems/queue-reconstruction-by-height/)）
* **765. 情侣牵手**（[LeetCode](https://leetcode.cn/problems/couples-holding-hands/)）
