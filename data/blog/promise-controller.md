---
layout: PostLayout
title: 如何实现可随时取消的控制器
date: 2024-03-15
tags: ['js原理']
summary: 在JavaScript中，您可能已经知道如何取消请求：XHR可以通过abort方法，而fetch可以结合AbortController实现请求取消。但是，如何取消一个普通的Promise呢？
---

### 取消 JavaScript 中的 Promise

在 JavaScript 中，您可能已经知道如何取消请求：XHR 可以通过 abort 方法，而 fetch 可以结合 AbortController 实现请求取消。但是，如何取消一个普通的 Promise 呢？

目前，JavaScript 的 Promise 并没有提供原生的 API 来取消一个普通的 Promise。因此，但我们可以通过一些技巧实现类似于取消的功能。本文介绍了两种方法：使用新的`Promise.withResolvers()`和`AbortController`。

#### 方法一：使用`Promise.withResolvers()`

`Promise.withResolvers()`返回一个包含新的 Promise 对象和两个函数（resolve 和 reject）的对象。我们可以利用它来创建一个可取消的任务。

**示例代码：**

```javascript
const buildCancelableTask = (asyncFn) => {
  let rejected = false
  const { promise, resolve, reject } = Promise.withResolvers()

  return {
    run: () => {
      if (!rejected) {
        asyncFn().then(resolve, reject)
      }
      return promise
    },
    cancel: () => {
      rejected = true
      reject(new Error('CanceledError'))
    },
  }
}
```

在运行任务时，如果在任务完成前调用`cancel`方法，Promise 会被拒绝。

#### 方法二：使用`AbortController`

`AbortController`可以用来取消 fetch 请求，同时我们也可以用它来实现可取消的 Promise。

**示例代码：**

```javascript
const buildCancelableTask = (asyncFn) => {
  const abortController = new AbortController()

  return {
    run: () =>
      new Promise((resolve, reject) => {
        const cancelTask = () => reject(new Error('CanceledError'))

        if (abortController.signal.aborted) {
          cancelTask()
          return
        }

        asyncFn().then(resolve, reject)
        abortController.signal.addEventListener('abort', cancelTask)
      }),
    cancel: () => {
      abortController.abort()
    },
  }
}
```

这种方法不仅可以用于普通的 Promise，还可以用于 fetch 请求，以确保在新的请求发出时取消前一个未完成的请求。

#### 构建简单的顺序请求 React Hook

基于上述代码，我们可以进一步封装一个简单的顺序请求 React Hook，用于确保只处理最新的请求数据。

**示例代码：**

```javascript
import { useCallback, useRef } from 'react'

function useLatest(value) {
  const ref = useRef(value)
  ref.current = value
  return ref
}

export function useSequentialRequest(requestFn) {
  const requestFnRef = useLatest(requestFn)
  const currentRequest = useRef(null)

  return useCallback(() => {
    if (currentRequest.current) {
      currentRequest.current.cancel()
    }

    const { run, cancel } = buildCancelableTask(requestFnRef.current)
    currentRequest.current = { cancel }

    const promise = run().then((res) => {
      currentRequest.current = null
      return res
    })

    return promise
  }, [requestFnRef])
}
```

这个 Hook 可以确保在用户快速多次点击时，只处理最新的一次请求。

#### 结论

通过使用`Promise.withResolvers()`和`AbortController`，我们可以实现对 Promise 的类似取消功能，确保在需要的时候能够拒绝或取消未完成的任务。这在实际开发中尤其有用，可以提高应用的响应速度和用户体验。

#### 参考资料

- [如何取消 JavaScript 中的 Promise](https://webdeveloper.beehiiv.com/p/cancel-promises-javascript)

你可以使用以上方法和代码示例来处理 Promise 取消的问题，确保你的应用在处理异步任务时更加灵活和高效。
