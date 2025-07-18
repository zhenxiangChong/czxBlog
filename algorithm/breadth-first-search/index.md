---
url: /czxBlog/algorithm/breadth-first-search/index.md
---
## 概述

\==广度优先搜索（Breadth-First Search）（BFS）== 是一种用于遍历或搜索树/图数据结构的算法。

是图上最基础、最重要的搜索算法之一。

所谓广度优先。就是每次都尝试访问同一层的节点。 如果同一层都访问完了，再访问下一层。

这样做的结果是，BFS 算法找到的路径是从起点开始的 最短 合法路径。换言之，这条路径所包含的边数最小。

在 BFS 结束时，每个节点都是通过从起点到该点的最短路径访问的。

## 核心思想

核心思想是 **逐层遍历**：

* 从起点开始，先访问所有直接邻居
* 再访问邻居的邻居
* 使用队列（FIFO）管理待访问节点
* 避免重复访问（通过记录已访问节点）

## 实现

### 图结构定义

```ts
type Graph = Record<string, string[]> // 邻接表表示法

// 示例图结构
const graph: Graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E']
}
// A → B → C
// B → D → E
// C → F ← E
```

### BFS基础实现

```ts
function bfs(graph: Graph, start: string): string[] {
  const visited = new Set<string>() // 记录已访问节点
  const queue: string[] = [start] // 初始化队列
  const result: string[] = [] // 存储遍历结果

  visited.add(start)

  while (queue.length > 0) {
    const current = queue.shift()! // 从队列头部取出节点
    result.push(current)

    // 遍历当前节点的所有邻居
    for (const neighbor of graph[current]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor) // 新节点加入队列尾部
      }
    }
  }

  return result
}

// 测试执行
console.log(bfs(graph, 'A'))
// 输出: ['A', 'B', 'C', 'D', 'E', 'F']
```

### 最短路径实现（无权图）

```ts
function shortestPath(
  graph: Graph,
  start: string,
  target: string
): string[] | null {
  const visited = new Set<string>([start])
  const queue: string[] = [start]
  const predecessor: Record<string, string> = {} // 记录前驱节点
  const distance: Record<string, number> = { [start]: 0 } // 记录距离

  while (queue.length > 0) {
    const current = queue.shift()!

    if (current === target) {
      // 回溯构建路径
      const path = [target]
      let node = target
      while (node !== start) {
        node = predecessor[node]
        path.unshift(node)
      }
      return path
    }

    for (const neighbor of graph[current]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        predecessor[neighbor] = current
        distance[neighbor] = distance[current] + 1
        queue.push(neighbor)
      }
    }
  }

  return null // 未找到路径
}

// 测试最短路径
console.log(shortestPath(graph, 'A', 'F'))
// 输出: ['A', 'C', 'F']（最短路径）
```

### 执行过程示例（从A开始）

| 步骤  | 队列状态   | 当前节点 | 新访问节点 | 访问顺序            |
| :---: | :--------- | :------: | :--------: | :------------------ |
|   1   | \[A]       |    A     |    B, C    | \[A]                |
|   2   | \[B, C]    |    B     |    D, E    | \[A, B]             |
|   3   | \[C, D, E] |    C     |     F      | \[A, B, C]          |
|   4   | \[D, E, F] |    D     | (无新节点) | \[A, B, C, D]       |
|   5   | \[E, F]    |    E     | (F已访问)  | \[A, B, C, D, E]    |
|   6   | \[F]       |    F     |     -      | \[A, B, C, D, E, F] |

## 关键解析

* **队列（Queue）**：

  * 使用数组模拟队列（push()入队，shift()出队）
  * 确保先进先出（FIFO）的访问顺序

* **访问记录（Visited Set）**：

  * 防止重复访问和循环
  * 空间换时间（O(1)时间复杂度检查）

* **前驱记录（Predecessor Map）**：

  * 存储节点的来源节点
  * 用于回溯构建完整路径

## 性能优化

* **双向BFS**：从起点和终点同时搜索（适合已知终点的场景）
* **层级记录**：使用level变量替代距离字典减少内存
* **队列选择**：使用链表实现真正O(1)出队的队列
* **剪枝策略**：提前终止不符合条件的路径

## 适用场景

* **社交网络**：查找N度好友关系
* **路径规划**：迷宫最短路径（无权图）
* **网络爬虫**：分层抓取网页
* **连通性检测**：判断岛屿数量（网格BFS）
* **状态转换**：解决华容道/八数码问题

## 相关问题

[**LeetCode** - 广度优先搜索 - Breadth-First Search](https://leetcode.cn/problem-list/breadth-first-search/){.read-more}

### 基础图遍历

* **LCP 07. 传递信息** （[LeetCode](https://leetcode.cn/problems/chuan-di-xin-xi/)）
* **547. 朋友圈**（[LeetCode](https://leetcode.cn/problems/friend-circles/)）

### 网格类问题（矩阵BFS）

* **542. 01 矩阵**（[LeetCode](https://leetcode.cn/problems/01-matrix/)）
* **994. 腐烂的橘子**（[LeetCode](https://leetcode.cn/problems/rotting-oranges/)）
* **1162. 地图分析（最短路径）**（[LeetCode](https://leetcode.cn/problems/maximum-distance-in-arrays/)）

### 二叉树层序遍历

* **199. 二叉树的右视图**（[LeetCode](https://leetcode.cn/problems/binary-tree-right-side-view/)）
* **1609. 奇偶树**（[LeetCode](https://leetcode.cn/problems/even-odd-tree/)）

### 进阶挑战题

* **127. 单词接龙**（[LeetCode](https://leetcode.cn/problems/word-ladder/)）
* **417. 太平洋大西洋水流问题**（[LeetCode](https://leetcode.cn/problems/pacific-atlantic-water-flow/)）
