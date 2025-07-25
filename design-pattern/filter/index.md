---
url: /czxBlog/design-pattern/filter/index.md
---
## 什么是过滤器模式？

\==Filter(过滤器)模式== 是一种结构型设计模式。

它允许使用不同标准过滤一组对象，并通过逻辑操作（AND、OR）组合这些标准。
核心思想是 **解耦过滤逻辑与业务代码，使系统更灵活、可扩展**。
在 JavaScript 中，通常结合高阶函数（如 `filter()`）实现。

## 实现 Filter(过滤器)模式

### 简单实现（函数式风格）

```js
// 过滤器函数
function genderFilter(gender) {
  return persons =>
    persons.filter(p => p.gender === gender)
}

function statusFilter(status) {
  return persons =>
    persons.filter(p => p.maritalStatus === status)
}

// 组合过滤器
const andFilter = (f1, f2) => persons => f2(f1(persons))
function orFilter(f1, f2) {
  return persons =>
    [...new Set([...f1(persons), ...f2(persons)])]
}

// 使用示例
const getSingleFemales = andFilter(
  genderFilter('Female'),
  statusFilter('Single')
)

console.log(getSingleFemales(persons)) // [Alice]
```

### 类实现（对象方面）

```js
// 1. 定义数据对象
class Person {
  constructor(name, gender, maritalStatus) {
    this.name = name
    this.gender = gender
    this.maritalStatus = maritalStatus
  }
}

// 2. 定义过滤器接口
class Criteria {
  meetCriteria(persons) {
    throw new Error('必须实现 meetCriteria 方法')
  }
}

// 3. 具体过滤器实现
class GenderCriteria extends Criteria {
  constructor(gender) {
    super()
    this.gender = gender
  }

  meetCriteria(persons) {
    return persons.filter(p => p.gender === this.gender)
  }
}

class MaritalStatusCriteria extends Criteria {
  constructor(status) {
    super()
    this.status = status
  }

  meetCriteria(persons) {
    return persons.filter(p => p.maritalStatus === this.status)
  }
}

// 4. 组合过滤器 (AND/OR)
class AndCriteria extends Criteria {
  constructor(criteria1, criteria2) {
    super()
    this.criteria1 = criteria1
    this.criteria2 = criteria2
  }

  meetCriteria(persons) {
    return this.criteria2.meetCriteria(this.criteria1.meetCriteria(persons))
  }
}

class OrCriteria extends Criteria {
  constructor(criteria1, criteria2) {
    super()
    this.criteria1 = criteria1
    this.criteria2 = criteria2
  }

  meetCriteria(persons) {
    const result1 = this.criteria1.meetCriteria(persons)
    const result2 = this.criteria2.meetCriteria(persons)
    // 合并并去重
    return [...new Set([...result1, ...result2])]
  }
}

// 5. 使用示例
const persons = [
  new Person('Alice', 'Female', 'Single'),
  new Person('Bob', 'Male', 'Single'),
  new Person('Charlie', 'Male', 'Married')
]

// 创建过滤器
const female = new GenderCriteria('Female')
const single = new MaritalStatusCriteria('Single')
const singleFemale = new AndCriteria(female, single)
const maleOrSingle = new OrCriteria(
  new GenderCriteria('Male'),
  single
)

// 应用过滤器
console.log(singleFemale.meetCriteria(persons))
// 输出: [Person{name: 'Alice', ...}]

console.log(maleOrSingle.meetCriteria(persons))
// 输出: [Bob, Charlie, Alice] (男性或单身)
```

## 优点

* **开闭原则**：新增过滤标准无需修改已有代码。
* **解耦**：过滤逻辑与业务逻辑分离。
* **可组合性**：通过 AND/OR 轻松组合多个条件。
* **复用性**：过滤器可在多处重复使用。
* **函数式友好**：天然契合 JavaScript 的高阶函数特性。

## 缺点

* **性能开销**：链式过滤可能需多次遍历数据（大型数据集需优化）。
* **类膨胀**：每个新标准需创建新类（可改用函数式简化）。
* **过度设计**：简单场景下直接使用 Array.filter() 更合适。

## 适用场景

* **动态查询条件**：如电商产品的多维度筛选（价格、品牌、评分）。
* **数据报表**：按不同业务标准过滤统计信息。
* **权限系统**：组合角色/权限规则过滤用户。
* **API 数据过滤**：后端返回数据集，前端按需过滤展示。
* **复杂条件组合**：需要支持 AND/OR/NOT 逻辑的查询。
