---
url: /czxBlog/algorithm/depth-first-search/index.md
---
## 概述

\==深度优先搜索（Depth-First Search）（DFS）== 是一种用于遍历或搜索树或图的算法。

其核心思想是尽可能深地探索分支，直到达到末端，然后回溯并探索其他分支。

::: note 该算法常常与 BFS 并列，但两者除了都能遍历图的连通块以外，用途完全不同，很少有能混用两种算法的情况。
:::

## 过程

DFS 最显著的特征在于其 **递归调用自身**。
同时与 BFS 类似，DFS 会对其访问过的点打上访问标记，在遍历图时跳过已打过标记的点，以确保 **每个点仅访问一次** 。
符合以上两条规则的函数，便是广义上的 DFS。

具体地说，DFS 大致结构如下：

```txt title="伪代码"
DFS(v) // v 可以是图中的一个顶点，也可以是抽象的概念，如 dp 状态等。
  在 v 上打访问标记
  for u in v 的相邻节点
    if u 没有打过访问标记 then
      DFS(u)
    end
  end
end
```

## 核心原理

* **深度优先**：从起始节点开始，沿一条路径不断深入直到末端，再回溯探索其他路径。
* **递归/栈结构**：天然适合递归实现（隐式栈），也可用显式栈迭代实现。
* **回溯机制**：当节点无未访问邻居时，回退到上一个节点。
* **避免重复访问**：需记录已访问节点（通常用 Set 或数组）。

## 复杂度分析

该算法通常的时间复杂度为 $O(n+m)$，空间复杂度为 $O(n)$，其中 $n$ 表示点数，$m$ 表示边数。

注意空间复杂度包含了栈空间，栈空间的空间复杂度是 $O(n)$ 的。
在平均 $O(1)$ 遍历一条边的条件下才能达到此时间复杂度，例如用前向星或邻接表存储图；
如果用邻接矩阵则不一定能达到此复杂度。

## 实现方式

### 递归实现

```ts
type Graph = Record<string, string[]>

function dfsRecursive(
  graph: Graph,
  node: string,
  visited: Set<string> = new Set()
): void {
  // 1. 访问当前节点
  console.log(node)
  visited.add(node)

  // 2. 递归访问所有未访问的邻居
  for (const neighbor of graph[node] || []) {
    if (!visited.has(neighbor)) {
      dfsRecursive(graph, neighbor, visited)
    }
  }
}
```

### 迭代实现（显式栈）

```ts
function dfsIterative(graph: Graph, start: string): void {
  const stack: string[] = [start]
  const visited = new Set<string>()

  while (stack.length > 0) {
    const node = stack.pop()! // 从栈顶弹出节点
    if (visited.has(node))
      continue

    // 访问节点
    console.log(node)
    visited.add(node)

    // 将邻居逆序入栈（保持与递归相同顺序）
    const neighbors = graph[node] || []
    for (let i = neighbors.length - 1; i >= 0; i--) {
      if (!visited.has(neighbors[i])) {
        stack.push(neighbors[i])
      }
    }
  }
}
```

## 注意事项

* **栈溢出**：深度过大时递归可能导致栈溢出，可改用迭代法。
* **环检测**：在递归中若遇到已访问节点且非父节点，说明存在环。
* **非连通图**：需遍历所有未访问节点作为新起点。

## 相关题目

[**LeetCode** - 深度优先搜索 Depth-First Search](https://leetcode.cn/problem-list/depth-first-search/){.read-more}

### 矩阵遍历类（二维网格DFS）

* **200. 岛屿数量**（[LeetCode](https://leetcode.cn/problems/number-of-islands/)）
* **417. 太平洋大西洋水流问题**（[LeetCode](https://leetcode.cn/problems/pacific-atlantic-water-flow/)）
* **LCR 129. 字符迷宫** （[LeetCode](https://leetcode.cn/problems/ju-zhen-zhong-de-lu-jing-lcof/)）

### 树与图遍历类（递归/隐式栈）

* **1038. 从二叉搜索树到更大树**（[LeetCode](https://leetcode.cn/problems/binary-search-tree-to-greater-sum-tree/)）
* **100. 相同的树**（[LeetCode](https://leetcode.cn/problems/same-tree/)）
* **105. 从前序与中序遍历序列构造二叉树**（[LeetCode](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)）


### 回溯与组合类（路径/状态管理）

* **39. 组合总和**（[LeetCode](https://leetcode.cn/problems/combination-sum/)）
* **40. 组合总和 II**（[LeetCode](https://leetcode.cn/problems/combination-sum-ii/)）
* **LCP 07. 传递信息** （[LeetCode](https://leetcode.cn/problems/chuan-di-xin-xi/)）

### 进阶挑战题

* **79. 单词搜索**（[LeetCode](https://leetcode.cn/problems/word-search/)）
* **301. 删除无效的括号**（[LeetCode](https://leetcode.cn/problems/remove-invalid-parentheses/)）
* **694. 不同的岛屿数量**（[LeetCode](https://leetcode.cn/problems/number-of-distinct-islands/)）
