---
url: /czxBlog/interview-question/9m3js49s/index.md
---
::: tip 提问

1. 显式类型转换 （强制类型转换）
2. 隐式类型转换

:::

## 显示类型转换

### 转换为 String 类型

* `toString` 方法，除了 null、undefined，其他数据类型几乎都有 `toString`方法，
  该方法不转换值本身，而是将返回转换后的结果

* `String()`函数

### 转换为 Number 类型

* `Number()` 函数
* `parseInt` 、`parseFloat()` 函数

### 转换为 Boolean 类型

* `Boolean()` 函数

## 隐式类型转换

* 算术运算符 `- * /` 跟非Number类型进行运算时，会将这些值转换为 Number类型后进行运算
* 运算符 `+`，当 左右两边均非String类型时，会转换为 Number类型进行运算
* 运算符 `+`，当 左右两边有一个或两个String类型时，非String类型会转换为String类型后进行运算
* 条件运算时，空字符串、null、undefined、+0， -0 和 NaN 被转为布尔型 false，其他都是true
