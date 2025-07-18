---
url: /czxBlog/design-pattern/interceptor/index.md
---
## 什么是拦截过滤器模式？

\==Interceptor(拦截过滤器)模式== 是一种结构型设计模式。

它用于在请求处理流程中动态添加预处理（如验证、日志）和后处理逻辑。
它通过可插拔的过滤器链在核心业务逻辑执行前后拦截请求/响应，实现横切关注点（Cross-Cutting Concerns）的解耦。

它主要由 四个部分 组成：

### 过滤器（Filter）

执行具体拦截任务的独立模块（如身份验证、日志记录）。

### 过滤器链（Filter Chain）

管理过滤器的有序执行，控制流程传递。

### 目标对象（Target）

核心业务逻辑（如 API 处理器）。

### 过滤器管理器（Filter Manager）

创建和组装过滤器链（可选）。

## 实现拦截过滤器模式

::: steps

* 创建过滤器接口

  ```js
  class Filter {
    execute(request, response, chain) {
      throw new Error('execute() must be implemented')
    }
  }
  ```

* 实现具体过滤器

  ```js
  // 身份验证过滤器
  class AuthFilter extends Filter {
    execute(request, response, chain) {
      console.log('AuthFilter: Checking authentication')
      if (!request.headers.token) {
        throw new Error('Unauthorized!')
      }
      chain.execute(request, response) // 传递到下一个过滤器
    }
  }

  // 日志过滤器
  class LogFilter extends Filter {
    execute(request, response, chain) {
      console.log(`LogFilter: ${request.url} at ${new Date()}`)
      chainexecute(request, response)
      consolelog('LogFilter: Response sent')
    }
  }
  ```

* 创建过滤器链

  ```js
  class FilterChain {
    constructor() {
      this.filters = []
      this.target = null
    }

    addFilter(filter) {
      this.filters.push(filter)
      return this // 支持链式调用
    }

    setTarget(target) {
      this.target = target
    }

    execute(request, response) {
      if (this.filters.length === 0) {
        this.target?.execute(request, response)
        return
      }

      const [currentFilter, ...remainingFilters] = this.filters
      const nextChain = new FilterChain()
      nextChain.filters = remainingFilters
      nextChain.target = this.target

      currentFilter.execute(request, response, nextChain)
    }
  }
  ```

* 目标对象（业务逻辑）

  ```js
  class ApiHandler {
    execute(request, response) {
      console.log('Processing API request')
      response.status = 200
      response.body = { data: 'Success' }
    }
  }
  ```

* 客户端使用

  ```js
  // 组装过滤器链
  const chain = new FilterChain()
  chain
    .addFilter(new AuthFilter())
    .addFilter(new LogFilter())
    .setTarget(new ApiHandler())

  // 模拟请求
  const request = { url: '/api/data', headers: { token: 'abc123' } }
  const response = {}

  try {
    chain.execute(request, response)
    console.log('Response:', response)
  }
  catch (err) {
    console.error('Error:', err.message)
  }

  // 输出顺序:
  // AuthFilter: Checking authentication
  // LogFilter: /api/data at [timestamp]
  // Processing API request
  // LogFilter: Response sent
  // Response: { status: 200, body: { data: "Success" } }
  ```

:::

## 优点

* **解耦性**

  业务逻辑与横切关注点（如日志、安全）分离。

* **可复用性**

  过滤器可在不同场景重复使用。

* **灵活扩展**

  动态增删过滤器，无需修改核心代码。

* **职责清晰**

  每个过滤器专注单一任务。

## 缺点

* **性能开销**

  链式调用增加额外处理时间。

* **调试复杂度**

  多级过滤增加调试难度。

* **过度设计风险**

  简单场景可能引入不必要的复杂性。
