---
layout: PostLayout
title: 事件循环
date: 2024-06-04
tags: ['js原理']
summary: 浏览器事件循环（Event Loop）是理解JavaScript异步编程的重要概念。它决定了JavaScript代码在浏览器中如何执行，如何处理事件，以及如何与Web API交互。
---

![](https://files.mdnice.com/user/70043/6091dd2a-c65c-4dad-af97-584ec8ede028.png)

> 最近参与了一个面试，聊到了事件循环的一些细节，所以写个文章来复习一下。

浏览器事件循环（Event Loop）是理解 JavaScript 异步编程的重要概念。它决定了 JavaScript 代码在浏览器中如何执行，如何处理事件，以及如何与 Web API 交互。

### 背景

进程是 CPU 资源分配的最小单位；线程是 CPU 调度的最小单位。一个进程由一个或多个线程组成，线程是一个进程中代码的不同执行路线，并且一个进程的内存空间是共享的，每个线程都可用这些共享内存。

进程描述了 CPU 在运行指令及加载和保存上下文所需的时间，放在应用上来说就代表了一个程序。线程是进程中的更小单位，描述了执行一段指令所需的时间

以谷歌浏览器为例，当你打开一个 Tab 页时，其实就是创建了一个进程，一个进程中可以有多个线程，比如渲染线程、JS 引擎线程、HTTP 请求线程、定时触发器线程、事件触发线程等等。当你发起一个请求时，其实就是创建了一个线程，当请求结束后，该线程可能就会被销毁。

上文提到了 JS 引擎线程和渲染线程，大家应该都知道，在 JS 运行的时候可能会阻止 UI 渲染，这说明了两个线程是互斥的。这其中的原因是因为 JS 可以修改 DOM，如果在 JS 执行的时候 UI 线程还在工作，就可能导致不能安全的渲染 UI。这其实也是一个单线程的好处，得益于 JS 是单线程运行的，可以达到节省内存，节约上下文切换时间，但也有其局限性，比如在处理耗时任务时容易阻塞主线程，导致页面卡顿。为了应对这一问题，JavaScript 通过事件循环和异步编程模型来实现并发操作。

#### JS 主线程

![](https://files.mdnice.com/user/70043/55d7aaa2-56e7-4055-a093-c9545c1fead6.png)

JS 主线程在执行代码时，会调用浏览器的 API 与 DOM 交互并产生一些异步任务。这些异步任务将添加到事件队列或优先作业队列。一旦调用堆栈处理完，当前 tick（为空），事件循环就会为其提供一个新的 Tick。以下是各个模块的说明：

- 调用堆栈：这是执行代码的地方，它是一个 LIFO 堆栈（后进先出），当它为空时，即已完成所有当前 Tick 任务，并准备开启下一个 Tick

- 浏览器 API：代码与浏览器内部之间的桥梁，用于安排任务、与 DOM 交互等（例如 setTimeout、AJAX、createElement、querySelector、append、click 等）。如果是回调，会将回调代码添加到事件队列中，相反，如果是 then（promise 的方法），您的 then 代码将添加到作业队列中

- 宏任务队列：每次添加回调（例如通过 setTimeout 或 AJAX API）时，它都会添加到此队列中

- 微任务队列：这个队列是为 Promise 的 thens 保留的，它是一个优先级更高的队列，它的含义就像“稍后（= 异步）执行此代码，但要尽快！（在下一个 Event Loop tick 之前）”

- 事件循环：它监视调用堆栈，一旦堆栈为空（已完成当前 Tick 的处理），事件循环就会向其提供下一个 Tick

以上就是 JS 主线程的主要工作内容。需要注意的是事件循环不是独立运行的一个线程，而是作为 JS 主线程的一部分，协助主线程完成任务调度的最佳助手。

### 事件循环的案例解析

事件循环的核心工作机制可以简化为以下几个步骤：

1. 检查调用栈是否为空。
2. 如果调用栈为空，检查任务队列中是否有任务。
3. 如果任务队列中有任务，将第一个任务推入调用栈并执行。
4. 重复上述步骤。

让我们通过一个简单的代码示例来展示事件循环的工作方式：

```javascript
console.log('Start')

setTimeout(() => {
  console.log('Timeout')
}, 0)

console.log('End')
```

输出结果：

```
Start
End
Timeout
```

解释：

1. `console.log('Start')`被推入调用栈并执行，输出`Start`。
2. `setTimeout`被推入调用栈，浏览器注册一个定时器，并将回调函数放入任务队列中，随后`setTimeout`从调用栈中移除。
3. `console.log('End')`被推入调用栈并执行，输出`End`。
4. 调用栈为空，事件循环检查任务队列，将回调函数推入调用栈并执行，输出`Timeout`。

在事件循环中，任务分为宏任务（Macro Task）和微任务（Micro Task）。宏任务包括 setTimeout、setInterval、I/O 操作等，微任务包括 Promise 的回调函数、MutationObserver 等。

每次事件循环执行时，会先处理所有的微任务，然后再处理宏任务。这意味着微任务在每个宏任务之前执行。

以下是一个包含宏任务和微任务的示例：

```javascript
console.log('Script start')

setTimeout(() => {
  console.log('setTimeout')
}, 0)

Promise.resolve().then(() => {
  console.log('Promise')
})

console.log('Script end')
```

输出结果：

```
Script start
Script end
Promise
setTimeout
```

解释：

1. `console.log('Script start')`被推入调用栈并执行，输出`Script start`。
2. `setTimeout`注册一个定时器，并将回调函数放入宏任务队列。
3. `Promise.resolve().then`将回调函数放入微任务队列。
4. `console.log('Script end')`被推入调用栈并执行，输出`Script end`。
5. 调用栈为空，事件循环检查微任务队列，执行 Promise 回调，输出`Promise`。
6. 事件循环检查宏任务队列，执行 setTimeout 回调，输出`setTimeout`。

### 事件循环的类型

事件循环有多种不同的实现

**Chrome (Chromium)**

- **事件循环库**：基于 `libevent` 库。
- **描述**：Chromium 项目使用 `libevent` 库来管理底层的异步 I/O 操作。Chrome 的事件循环机制主要通过 `Message Loop` 实现，并在不同线程（如主线程、I/O 线程等）中运行。

**Firefox**

- **事件循环库**：基于 `nsIThread` 和 `nsIEventTarget`。
- **描述**：Firefox 使用的是自己实现的事件循环机制，主要通过 `nsIThread` 接口和 `nsIEventTarget` 接口来管理事件循环和任务调度。

**Safari (WebKit)**

- **事件循环库**：基于 `CFRunLoop` (在 macOS 和 iOS 上) 和 `GLib` (在其他平台上)。
- **描述**：WebKit 引擎在 macOS 和 iOS 上使用 Core Foundation 的 `CFRunLoop` 进行事件循环管理，而在其他平台上使用 `GLib` 实现事件循环。

**Edge (Chromium-based)**

- **事件循环库**：与 Chrome 相同，基于 `libevent` 库。
- **描述**：自从微软 Edge 切换到基于 Chromium 内核后，Edge 与 Chrome 共享同样的事件循环机制和库。

**Node.js**

- **事件循环库**： `libuv`
- **描述**：Node.js 使用 `libuv` 作为底层的事件循环库。`libuv` 是一个多平台支持异步 I/O 操作的库，为 Node.js 提供了高效的事件驱动机制。

**Electron**

- **事件循环库**：基于 `libevent` 和 `libuv`
- **描述**：Electron 基于 Chromium 和 Node.js，因此其事件循环机制结合了 `libevent` 和 `libuv`，用于处理浏览器环境和 Node.js 环境中的事件。

**Deno**

- **事件循环库**：基于 `tokio` 和 `rusty_v8`
- **描述**：Deno 使用 Rust 编写，使用 `tokio` 作为异步运行时，并通过 `rusty_v8` 集成 V8 引擎。这使得 Deno 在高效处理异步操作的同时提供了对 JavaScript 和 TypeScript 的支持。

## 总结

事件循环是 JavaScript 处理异步操作的关键，它通过调用堆栈、任务队列和事件循环本身，实现了高效的任务调度和执行。不同的浏览器和环境（如 Node.js、Electron、Deno）有着不同的事件循环实现，但它们的核心目标是一致的：在单线程环境中提供高效的异步 I/O 操作和事件处理能力。通过理解事件循环，开发者可以更好地编写高效、响应迅速的 JavaScript 应用。
