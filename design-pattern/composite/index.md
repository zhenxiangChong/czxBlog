---
url: /czxBlog/design-pattern/composite/index.md
---
## 什么是组合模式？

\==Composite（组合）模式== 是一种结构型设计模式。

它用于将对象组织成树形结构，以表示 **“部分-整体”** 的层次关系。
它允许客户端以统一的方式处理单个对象和组合对象，忽略对象层次结构的差异。

组合模式主要由以下部分组成：

### Component（抽象构件）

* 定义所有对象的通用接口（包括叶子节点和容器）。
* 声明操作子节点的方法（如 add、remove）。

### Leaf（叶子节点）

* 表示树中的末端对象（无子节点）。
* 实现 Component 接口的基本行为。

### Composite（容器节点）

* 包含子节点（Leaf 或 Composite）。
* 实现操作和管理子节点的方法。

## 实现组合模式

```js
// 1. 抽象构件
class Component {
  constructor(name) {
    this.name = name
  }

  // 默认抛出错误（叶子节点需重写）
  add(component) {
    throw new Error('Leaf nodes cannot add children.')
  }

  remove(component) {
    throw new Error('Leaf nodes cannot remove children.')
  }

  // 核心方法（所有构件必须实现）
  operation(depth = 0) {
    throw new Error('Subclass must implement operation().')
  }
}

// 2. 叶子节点（无子节点）
class Leaf extends Component {
  operation(depth = 0) {
    console.log(`${' '.repeat(depth * 2)}Leaf: ${this.name}`)
  }
}

// 3. 容器节点（可包含子节点）
class Composite extends Component {
  constructor(name) {
    super(name)
    this.children = []
  }

  add(component) {
    this.children.push(component)
  }

  remove(component) {
    const index = this.children.indexOf(component)
    if (index !== -1)
      this.children.splice(index, 1)
  }

  operation(depth = 0) {
    console.log(`${' '.repeat(depth * 2)}Composite: ${this.name}`)
    // 递归调用子节点的 operation()
    this.children.forEach(child =>
      child.operation(depth + 1)
    )
  }
}

// 客户端使用
const root = new Composite('Root')
const branch1 = new Composite('Branch 1')
const branch2 = new Composite('Branch 2')

root.add(branch1)
root.add(branch2)

branch1.add(new Leaf('Leaf A'))
branch1.add(new Leaf('Leaf B'))
branch2.add(new Leaf('Leaf C'))

root.operation()
```

```console
Composite: Root
  Composite: Branch 1
    Leaf: Leaf A
    Leaf: Leaf B
  Composite: Branch 2
    Leaf: Leaf C
```

## 优点

* **统一处理**：客户端无需区分叶子节点和容器节点。
* **开闭原则**：新增节点类型无需修改现有代码。
* **简化复杂结构**：通过递归机制处理树形结构，代码简洁。
* **灵活性**：动态组合对象，构建任意复杂度的结构。

## 缺点

* **违反单一职责**：Component 需同时管理叶子/容器逻辑（通过异常处理限制叶子节点）。
* **过度泛化**：所有构件使用相同接口，可能包含不适用方法（如叶子节点的 add()）。
* **类型检查问题**：需在运行时检查节点类型（如避免在叶子上调用 add()）。

## 适用场景

* **树形结构处理**：

  * 文件系统（文件是叶子，文件夹是容器）。
  * 组织架构（员工是叶子，部门是容器）。
  * UI 组件库（按钮是叶子，面板是容器）。

* **统一操作需求**：

  * 递归计算（如目录总大小）。
  * 批量执行（如禁用整个表单控件）。

* **嵌套菜单/导航**：

  菜单项（叶子）和子菜单（容器）的统一渲染。
