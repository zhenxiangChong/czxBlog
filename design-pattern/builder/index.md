---
url: /czxBlog/design-pattern/builder/index.md
---
## 什么是建造者模式？

\==Builder(建造者)模式== 是一种创建型设计模式。

它用于分步骤构建复杂对象。
它通过将对象的构造过程与其表示分离，允许相同的构建过程创建不同的表示。

该模式的核心思想是：

* **分离构建步骤**：将对象的构建分解为多个独立步骤。
* **统一构建流程**：通过一个指挥者（Director）控制构建顺序。
* **灵活组合**：通过不同建造者（Builder）实现不同配置的对象。

## 实现建造者模式

下面是一个简单的示例，展示了建造者模式的实现：

```js
// 1. 产品类（最终要构建的复杂对象）
class Pizza {
  constructor() {
    this.base = null
    this.sauce = null
    this.toppings = []
  }

  describe() {
    return `Pizza with ${this.base} base, ${this.sauce} sauce, and toppings: ${this.toppings.join(', ')}`
  }
}

// 2. 建造者接口（定义构建步骤）
class PizzaBuilder {
  constructor() {
    this.pizza = new Pizza()
  }

  prepareBase(base) {
    this.pizza.base = base
    return this // 返回this支持链式调用
  }

  addSauce(sauce) {
    this.pizza.sauce = sauce
    return this
  }

  addTopping(topping) {
    this.pizza.toppings.push(topping)
    return this
  }

  build() {
    return this.pizza
  }
}

// 3. 指挥者（可选，封装构建流程）
class PizzaDirector {
  constructor(builder) {
    this.builder = builder
  }

  makeMargherita() {
    return this.builder
      .prepareBase('thin crust')
      .addSauce('tomato')
      .addTopping('mozzarella')
      .addTopping('basil')
      .build()
  }

  makePepperoni() {
    return this.builder
      .prepareBase('thick crust')
      .addSauce('spicy tomato')
      .addTopping('pepperoni')
      .addTopping('cheese')
      .build()
  }
}

// 使用示例
const builder = new PizzaBuilder()

// 方式1: 直接使用建造者（链式调用）
const customPizza = builder
  .prepareBase('gluten-free')
  .addSauce('pesto')
  .addTopping('mushrooms')
  .addTopping('olives')
  .build()
console.log(customPizza.describe()) // Pizza with gluten-free base...

// 方式2: 通过指挥者创建预定义对象
const director = new PizzaDirector(builder)
const margherita = director.makeMargherita()
console.log(margherita.describe()) // Pizza with thin crust base...
```

## 优点

* **分离构造与表示**：将对象的构建细节封装在建造者中，客户端无需了解内部结构。
* **灵活扩展**：新增建造者即可支持新类型的对象，符合开闭原则。
* **精细控制构建过程**：分步构建允许精确控制对象配置。
* **复用构建逻辑**：指挥者封装通用构建流程，避免代码重复。
* **链式调用**：提供流畅接口（Fluent Interface），提升代码可读性。

## 缺点

* **增加代码复杂度**：需创建多个新类（产品、建造者、指挥者）。
* **过度设计风险**：简单对象直接构造更高效，无需使用此模式。
* **建造者依赖**：产品类发生变更时，所有建造者都需要同步修改。

## 适用场景

* **构造复杂对象**：当对象需要多个步骤/组件组合时（如配置复杂的 UI 组件）。
* **不同对象变体**：需要创建多个相似但配置不同的对象（如不同套餐的 Pizza）。
* **避免构造函数参数爆炸**：当构造函数参数过多（>4个）且部分可选时。
* **不可变对象**：配合返回新对象的链式调用，适合构建不可变对象。
* **多步骤构造过程**：当对象构造需要特定顺序或条件检查时。
