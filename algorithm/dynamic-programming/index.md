---
url: /czxBlog/algorithm/dynamic-programming/index.md
---
::: important **动态规划** 学习需要长时间的练习和强化，此篇目前仅处于 ==草稿=={.warning} 状态，在未来会引入更多的 DP 问题进行更为深入的学习。
:::

## 概述

\==动态规划（Dynamic Programming== 一种 **通过将复杂问题分解为重叠子问题，并存储子问题解以避免重复计算的优化技术**。

它适用于具有 **最优子结构** 和 **重叠子问题** 特性的问题。

## 动态规划原理

能用动态规划解决的问题，需要满足三个条件：**最优子结构** ，**无后效性** 和 **子问题重叠** 。

### 最优子结构

具有最优子结构也可能是适合用贪心的方法求解。

注意要确保我们考察了最优解中用到的所有子问题。

1. 证明问题最优解的第一个组成部分是做出一个选择；
2. 对于一个给定问题，在其可能的第一步选择中，假定你已经知道哪种选择才会得到最优解。你现在并不关心这种选择具体是如何得到的，只是假定已经知道了这种选择；
3. 给定可获得的最优解的选择后，确定这次选择会产生哪些子问题，以及如何最好地刻画子问题空间；
4. 证明作为构成原问题最优解的组成部分，每个子问题的解就是它本身的最优解。方法是反证法，考虑加入某个子问题的解不是其自身的最优解，那么就可以从原问题的解中用该子问题的最优解替换掉当前的非最优解，从而得到原问题的一个更优的解，从而与原问题最优解的假设矛盾。

要保持子问题空间尽量简单，只在必要时扩展。

最优子结构的不同体现在两个方面：

1. 原问题的最优解中涉及多少个子问题；
2. 确定最优解使用哪些子问题时，需要考察多少种选择。

子问题图中每个定点对应一个子问题，而需要考察的选择对应关联至子问题顶点的边。

### 无后效性

已经求解的子问题，不会再受到后续决策的影响。

### 子问题重叠

如果有大量的重叠子问题，我们可以用空间将这些子问题的解存储下来，避免重复求解相同的子问题，从而提升效率。

### 基本思路

对于一个能用动态规划解决的问题，一般采用如下思路解决：

1. 将原问题划分为若干 **阶段**，每个阶段对应若干个子问题，提取这些子问题的特征（称之为 **状态**）；
2. 寻找每一个状态的可能 **决策**，或者说是各状态间的相互转移方式（用数学的语言描述就是 **状态转移方程**）。
3. 按顺序求解每一个阶段的问题。

## 示例

### 斐波那契数列（基础入门）

```ts
// 自底向上（迭代）
function fib(n: number): number {
  if (n < 2)
    return n
  const dp: number[] = [0, 1]
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }
  return dp[n]
}

// 空间优化（滚动数组）
function fibOpt(n: number): number {
  if (n < 2)
    return n
  let prev = 0
  let curr = 1
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr]
  }
  return curr
}
```

### 背包问题（0-1 Knapsack）

:::info 有 $n$ 个物品和一个容量为 $W$ 的背包，每个物品有重量 $w\_{i}$ 和价值 $v\_{i}$ 两种属性，要求选若干物品放入背包使背包中物品的总价值最大且背包中物品的总重量不超过背包的容量。
:::

```ts
function knapSack(
  capacity: number, // 背包的最大容量
  weights: number[], // 每个物品的重量
  values: number[], // 每个物品的价值
  n: number // 物品个数
): number {
  // dp[i][w] 表示前i个物品在容量w时的最大价值
  const dp: number[][] = Array.from({ length: n + 1 })
    .fill(0)
    .map(() => Array.from({ length: capacity + 1 }).fill(0))

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        )
      }
      else {
        dp[i][w] = dp[i - 1][w]
      }
    }
  }
  return dp[n][capacity]
}

// 使用示例
const values = [60, 100, 120]
const weights = [10, 20, 30]
const capacity = 50
console.log(knapSack(capacity, weights, values, values.length)) // 220
```

### 最长公共子序列（LCS）

:::info 给定一个长度为 $n$ 的序列 $A$ 和一个 长度为 $m$ 的序列 $B \text{（}n,m \leq 5000\text{）}$，求出一个最长的序列，使得该序列既是 $A$ 的子序列，也是 $B$ 的子序列。
:::

```ts
function lcs(text1: string, text2: string): number {
  const m = text1.length
  const n = text2.length
  // dp[i][j] 表示 text1[0..i-1] 和 text2[0..j-1] 的 LCS 长度
  const dp: number[][] = Array.from({ length: m + 1 })
    .fill(0)
    .map(() => Array.from({ length: n + 1 }).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      }
      else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }
  return dp[m][n]
}
```

## 记忆化搜索

\==记忆化搜索== 是一种通过记录已经遍历过的状态的信息，从而避免对同一状态重复遍历的搜索实现方式。

因为记忆化搜索确保了每个状态只访问一次，它也是一种常见的动态规划实现方式。

```ts
const memo: number[] = []
function fib(n: number): number {
  if (n < 2)
    return n
  if (memo[n] !== undefined)
    return memo[n]
  memo[n] = fib(n - 1) + fib(n - 2)
  return memo[n]
}
```

## 相关问题

[**LeetCode** - 动态规划](https://leetcode.cn/problem-list/dynamic-programming/){.read-more}

### 基础

* **70. 爬楼梯**（[LeetCode](https://leetcode.cn/problems/climbing-stairs/)）
* **509. 斐波那契数列**（[LeetCode](https://leetcode.cn/problems/fibonacci-number/)）
* **LCR 127. 跳跃训练**（[LeetCode](https://leetcode.cn/problems/qing-wa-tiao-tai-jie-wen-ti-lcof)）
* **118. 杨辉三角**（[LeetCode](https://leetcode.cn/problems/pascals-triangle/)）
* **198. 打家劫舍**（[LeetCode](https://leetcode.cn/problems/house-robber/)）
* **53. 最大子序和**（[LeetCode](https://leetcode.cn/problems/maximum-subarray/)）

### 二维DP (路径、序列)

* **62. 不同路径**（[LeetCode](https://leetcode.cn/problems/unique-paths/)）
* **63. 不同路径 II**（[LeetCode](https://leetcode.cn/problems/unique-paths-ii/)）
* **64. 最小路径和**（[LeetCode](https://leetcode.cn/problems/minimum-path-sum/)）
* **1143. 最长公共子序列**（[LeetCode](https://leetcode.cn/problems/longest-common-subsequence/)）
* **72. 编辑距离**（[LeetCode](https://leetcode.cn/problems/edit-distance/)）
* **5. 最长回文子串**（[LeetCode](https://leetcode.cn/problems/longest-palindromic-substring/)）
* **300. 最长递增子序列**（[LeetCode](https://leetcode.cn/problems/longest-increasing-subsequence/)）

### 背包问题 (组合优化)

* **416. 分割等和子集**（[LeetCode](https://leetcode.cn/problems/partition-equal-subset-sum/)）
* **322. 零钱兑换**（[LeetCode](https://leetcode.cn/problems/coin-change/)）
* **518. 零钱兑换 II**（[LeetCode](https://leetcode.cn/problems/coin-change-2/)）
* **139. 单词拆分**（[LeetCode](https://leetcode.cn/problems/word-break/)）

### 状态机DP (复杂状态转移)

* **121. 买卖股票的最佳时机**（[LeetCode](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)）
* **122. 买卖股票的最佳时机 II**（[LeetCode](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/)）
* **123. 买卖股票的最佳时机 III**（[LeetCode](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iii/)）
* **188. 买卖股票的最佳时机 IV**（[LeetCode](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iv/)）
* **309. 最佳买卖股票时机含冷冻期**（[LeetCode](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-cooldown/)）
* **714. 最佳买卖股票时机含手续费**（[LeetCode](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/)）

### 其他经典问题

* **322. 零钱兑换**（[LeetCode](https://leetcode.cn/problems/coin-change/)）
* **96. 不同的二叉搜索树**（[LeetCode](https://leetcode.cn/problems/unique-binary-search-trees/)）
* **211. 添加与搜索单词**（[LeetCode](https://leetcode.cn/problems/add-and-search-word-data-structure-design/)）
* **337. 打家劫舍 III**（[LeetCode](https://leetcode.cn/problems/house-robber-iii/)）
