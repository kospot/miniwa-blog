---
layout: PostLayout
title: 聊聊Nodejs里的Async&Await
date: 2024-09-03 17:36:11
tags: ['js原理']
summary: 
在这篇文章中，咱们聊聊如何用 `async/await` 来简化那些让人头疼的回调和 Promise 代码。

Node.js 这货，它是个异步事件驱动的 JavaScript 运行环境，特别适合用来搭建那些需要高并发的网络应用。它聪明得很，没有锁机制，所以死锁这事儿在它这儿是不存在的。


![](https://files.mdnice.com/user/70043/72874471-97f
---

在这篇文章中，咱们聊聊如何用 `async/await` 来简化那些让人头疼的回调和 Promise 代码。

Node.js 这货，它是个异步事件驱动的 JavaScript 运行环境，特别适合用来搭建那些需要高并发的网络应用。它聪明得很，没有锁机制，所以死锁这事儿在它这儿是不存在的。

![](https://files.mdnice.com/user/70043/72874471-97fd-4e60-8f3e-ff819af82f42.png)

## 啥是 Node.js 里的异步函数？

在 Node.js 里，异步函数是内置的，你只需要在函数前面加个 `async` 关键词，它就自动变身了。这种函数总是返回一个 Promise，哪怕你啥也不返回。而且，`await` 这哥们儿只能在异步函数里用，全局作用域里它可不认账。

在异步函数里，你可以等待任何一个 `Promise`，或者捕获它的拒绝原因。

比如说，你有一段用 Promise 实现的逻辑：

```javascript
function handler(req, res) {
  return request('https://user-handler-service')
    .catch((err) => {
      logger.error('Http error', err)
      error.logged = true
      throw err
    })
    .then((response) => Mongo.findOne({ user: response.body.user }))
    .catch((err) => {
      !error.logged && logger.error('Mongo error', err)
      error.logged = true
      throw err
    })
    .then((document) => executeLogic(req, res, document))
    .catch((err) => {
      !error.logged && console.error(err)
      res.status(500).send()
    })
}
```

用 `async/await` 一改，代码就像同步的一样清晰：

```javascript
async function handler(req, res) {
  let response
  try {
    response = await request('https://user-handler-service')
  } catch (err) {
    logger.error('Http error', err)
    return res.status(500).send()
  }

  let document
  try {
    document = await Mongo.findOne({ user: response.body.user })
  } catch (err) {
    logger.error('Mongo error', err)
    return res.status(500).send()
  }

  executeLogic(document, req, res)
}
```

在 Node.js 里，如果你不管那些未处理的 Promise 拒绝，它会警告你。所以，你最好在这种情况下让应用崩溃，因为你没处理错误，应用可能就处于一个未知状态了。这可以通过 `--unhandled-rejections=strict` 这个命令行标志来实现，或者像下面这样：

```javascript
process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})
```

将来的 Node.js 版本会自动退出进程——为你的代码做好准备并不难，这样下次更新版本时你就不用担心这个问题了。

## JavaScript 中的异步函数

异步函数能让异步操作看起来像同步操作一样，不需要额外的回调函数，减少了代码的嵌套。

### 带指数退避的重试

用 Promises 实现重试逻辑挺麻烦的：

```javascript
function request(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(`Network error when trying to reach ${url}`)
    }, 500)
  })
}

function requestWithRetry(url, retryCount, currentTries = 1) {
  return new Promise((resolve, reject) => {
    if (currentTries <= retryCount) {
      const timeout = (Math.pow(2, currentTries) - 1) * 100
      request(url)
        .then(resolve)
        .catch((error) => {
          setTimeout(() => {
            console.log('Error: ', error)
            console.log(`Waiting ${timeout} ms`)
            requestWithRetry(url, retryCount, currentTries + 1)
          }, timeout)
        })
    } else {
      console.log('No retries left, giving up.')
      reject('No retries left, giving up.')
    }
  })
}

requestWithRetry('http://localhost:3000')
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.error(err)
  })
```

用 `async/await` 重写一下，代码就简洁多了：

```javascript
function wait(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}

async function requestWithRetry(url) {
  const MAX_RETRIES = 10
  for (let i = 0; i <= MAX_RETRIES; i++) {
    try {
      return await request(url)
    } catch (err) {
      const timeout = Math.pow(2, i)
      console.log('Waiting', timeout, 'ms')
      await wait(timeout)
      console.log('Retrying', err.message, i)
    }
  }
}
```

看起来是不是更清晰简洁了？

### 中间值

如果你有三个异步函数相互依赖，你得从几个不那么优雅的解决方案中选一个。

> 比如 `functionA` 返回一个 Promise，然后 `functionB` 需要那个值，`functionC` 需要 `functionA` 和 `functionB` 的 Promise 解析值。

#### 解决方案 1: `.then` 深层嵌套

```javascript
function executeAsyncTask() {
  return functionA().then((valueA) => {
    return functionB(valueA).then((valueB) => {
      return functionC(valueA, valueB)
    })
  })
}
```

这个解决方案，我们从外围闭包中获取 `valueA`，`valueB` 作为前一个 Promise 解析的值。不能像我们希望的那样压平嵌套，因为如果我们失去了闭包，`valueA` 将无法用于 `functionC`。

#### 解决方案 2: 移动到更高的作用域

```javascript
function executeAsyncTask() {
  let valueA
  return functionA()
    .then((v) => {
      valueA = v
      return functionB(valueA)
    })
    .then((valueB) => {
      return functionC(valueA, valueB)
    })
}
```

在深层嵌套中，我们使用更高的作用域使 `valueA` 可用。这个案例工作方式类似，但现在我们在 `.then` 的作用域之外创建了变量 `valueA`，所以我们可以将第一个解析的 Promise 的值赋给它。

这种方法绝对有效，压平了 `.then` 链，并且语义正确。然而，它也开辟了新的错误方式，以防变量名 `valueA` 在函数中的其他地方被使用。我们还需要使用两个名字 — `valueA` 和 `v` — 表示相同的值。

#### 解决方案 3: 没必要的数组

```javascript
function executeAsyncTask() {
  return functionA()
    .then((valueA) => {
      return Promise.all([valueA, functionB(valueA)])
    })
    .then(([valueA, valueB]) => {
      return functionC(valueA, valueB)
    })
}
```

没有其他原因需要将 `valueA` 传递在一个数组中，与 Promise `functionB` 一起，以便能够压平嵌套。它们可能是完全不同的类型，所以它们根本不属于数组的可能性很高。

#### 解决方案 4: 编写一个辅助函数

```javascript
const converge =
  (...promises) =>
  (...args) => {
    let [head, ...tail] = promises
    if (tail.length) {
      return head(...args).then((value) => converge(...tail)(...args.concat([value])))
    } else {
      return head(...args)
    }
  }

functionA(2).then((valueA) => converge(functionB, functionC)(valueA))
```

你当然可以编写一个辅助函数来隐藏上下文的杂耍，但它非常难以阅读，并且对于不熟悉函数魔术的人来说可能不是直截了当的。

#### 使用 `async/await` 我们的问题神奇地消失了：

```javascript
async function executeAsyncTask() {
  const valueA = await functionA()
  const valueB = await functionB(valueA)
  return function3(valueA, valueB)
}
```

### 多个并行请求与 async/await

这与前一个类似。如果你想同时执行几个异步任务，然后在不同的地方使用它们的值，你可以很容易地使用 `async/await` 来做到这一点：

```javascript
async function executeParallelAsyncTasks() {
  const [valueA, valueB, valueC] = await Promise.all([functionA(), functionB(), functionC()])
  doSomethingWith(valueA)
  doSomethingElseWith(valueB)
  doAnotherThingWith(valueC)
}
```

正如我们在前一个例子中看到的，我们要么需要将这些值移动到更高的作用域，要么创建一个非语义化的数组来传递这些值。

### 数组迭代方法

你可以使用 `map`、`filter` 和 `reduce` 与异步函数一起，尽管它们的行为相当不符合直觉。试着猜猜以下脚本将打印到控制台什么：

1. _map_

```javascript
function asyncThing(value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), 100)
  })
}

async function main() {
  return [1, 2, 3, 4].map(async (value) => {
    const v = await asyncThing(value)
    return v * 2
  })
}

main()
  .then((v) => console.log(v))
  .catch((err) => console.error(err))
```

2. _filter_

```javascript
function asyncThing(value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), 100)
  })
}

async function main() {
  return [1, 2, 3, 4].filter(async (value) => {
    const v = await asyncThing(value)
    return v % 2 === 0
  })
}

main()
  .then((v) => console.log(v))
  .catch((err) => console.error(err))
```

3. _reduce_

```javascript
function asyncThing(value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), 100)
  })
}

async function main() {
  return [1, 2, 3, 4].reduce(async (acc, value) => {
    return (await acc) + (await asyncThing(value))
  }, Promise.resolve(0))
}

main()
  .then((v) => console.log(v))
  .catch((err) => console.error(err))
```

**解决方案：**

1. `[ Promise { <pending> }, Promise { <pending> }, Promise { <pending> }, Promise { <pending> } ]`
2. `[ 1, 2, 3, 4 ]`
3. `10`

如果你使用 **`map`** 打印迭代器返回的值，你将看到我们期望的数组：`[ 2, 4, 6, 8 ]`。唯一的问题是每个值都被 `AsyncFunction` 包装在 Promise 中。

所以如果你想得到你的值，你需要通过将返回的数组传递给 `Promise.all` 来解包它们：

```javascript
main()
  .then((v) => Promise.all(v))
  .then((v) => console.log(v))
  .catch((err) => console.error(err))
```

最初，你会先等待所有的 Promise 解析，然后映射值：

```javascript
function main() {
  return Promise.all([1, 2, 3, 4].map((value) => asyncThing(value)))
}

main()
  .then((values) => values.map((value) => value * 2))
  .then((v) => console.log(v))
  .catch((err) => console.error(err))
```

**这看起来更简单，不是吗？**

`async/await` 版本仍然很有用，如果你的迭代器有一些长时间运行的同步逻辑和另一个长时间运行的异步任务。

这样你可以在得到第一个值后立即开始计算 — 你不必等待所有的 Promise 解析就可以运行你的计算。尽管结果仍然会被包装在 Promise 中，但它们的解析速度比顺序方式要快得多。

**`filter` 呢？显然有些不对劲…**

嗯，你猜对了：尽管返回的值是 `[ false, true, false, true ]`，但它们会被包装在 Promise 中，这些 Promise 是真值，所以你将得到原始数组中的所有值。不幸的是，你能做的就是解析所有值，然后过滤它们。

**`reduce`** 相当直接。但请记住，你需要将初始值包装在 `Promise.resolve` 中，因为返回的累加器也会被包装，并且必须被 `await`。

.. 正如它非常清楚地打算用于命令式代码风格。

要使你的 `.then` 链看起来更“纯”，你可以使用 Ramda 的 `pipeP` 和 `composeP` 函数。

## 重写基于回调的 Node.js 应用程序

异步函数默认返回一个 `Promise`，所以你可以将任何基于回调的函数重写为使用 Promises，然后 `await` 它们的解析。你可以使用 Node.js 中的 `util.promisify` 函数将基于回调的函数转换为返回基于 Promise 的函数。

## 重写基于 Promise 的应用程序

简单的 `.then` 链可以以相当直接的方式升级，这样你可以立即开始使用 `async/await`。

```javascript
function asyncTask() {
  return functionA()
    .then((valueA) => functionB(valueA))
    .then((valueB) => functionC(valueB))
    .then((valueC) => functionD(valueC))
    .catch((err) => logger.error(err))
}
```

将变成

```javascript
async function asyncTask() {
  try {
    const valueA = await functionA()
    const valueB = await functionB(valueA)
    const valueC = await functionC(valueB)
    return await functionD(valueC)
  } catch (err) {
    logger.error(err)
  }
}
```

## 使用 async/await 重写 Node.js 应用程序

- 如果你喜欢旧概念的 `if-else` 条件和 `for/while` 循环，
- 如果你认为 `try-catch` 块是错误处理的方式，

**你将非常享受使用 `async/await` 重写你的服务。**

正如我们所见，它可以使得几种模式更容易编码和阅读，所以在许多情况下，它比 `Promise.then()` 链更适合。
