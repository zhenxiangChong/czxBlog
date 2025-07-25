---
url: /czxBlog/interview-question/z7aq1w36/index.md
---
::: tip 提问

1. eslint
2. prettier
3. stylelint

:::

## eslint

eslint 是一个 javascript 代码风格检查工具，提供了完全插件化的模式，允许自定义各种各样的规则。

比较通用的开源配置有：

* eslint-config-standard
* eslint-config-airbnb
* eslint-config-vue
* eslint-config-prettier

## prettier

prettier 是一个代码格式化工具，支持多数编程语言，prettier自身提供了一种通用代码风格，并仅支持少量的配置。
这样做的好处是，当选择prettier时，就已经选择了使用它的代码风格，避免了团队成员再去纠结代码风格的某些规则。

## stylelint

stylelint 是一个 类似于 eslint 的专注于 css 代码风格检查工具。

同时还支持对 LESS、 SCSS 的代码风格检查

## 使用

过去在使用 以上的 代码风格工具时，比如在 使用 webpack作为构建工具的项目中，会通过 webpack plugin 或 loader，将
代码风格工具内置到 开发时进行实时检查，每次对代码的修改，都会通过 webpack plugin 或 loader 调用 工具进行代码检查。

但是这样做带来了不必要的开发时时间开销。

目前个人在使用时，不再 通过 webpack plugin 去添加 代码风格检查支持。 而是借助于 编辑器插件，已经 git hook。

比如，在 VSCode 中安装 eslint、prettier、stylelint 插件，并设置在文件修改时对当前文件进行检查。
这样的好处是，不影响 webpack的开发时编译速度，更好的利用 VSCode相关插件的错误提示支持。

再利用 git hook，在 pre-commit 阶段启动 代码风格检查工具，对整个项目进行检查，通过后再提交和推送。
