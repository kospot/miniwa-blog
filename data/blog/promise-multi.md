---
layout: PostLayout
title: 如何控制并发Promise的数量
date: 2024-03-17
tags: ['js原理']
summary: 在某些情况下，我们可能需要控制并发请求的数量。例如，当我们编写下载或爬虫工具时，一些网站可能对并发请求的数量有限制。
---

在某些情况下，我们可能需要控制并发请求的数量。

例如，当我们编写下载或爬虫工具时，一些网站可能对并发请求的数量有限制。

在浏览器中，来自同一来源的最大 TCP 连接数被限制为 6。这意味着，如果你使用 HTTP1.1 同时发送超过 6 个请求，那么第 7 个请求将等待前面的请求处理完毕后才会开始。

我们可以使用以下简单示例来测试它。首先是客户端代码：

```javascript
async function test() {
  await Promise.all([...new Array(12)].map((_, i) => fetch(`http://127.0.0.1:3001/get/${i}`)))
}
```

接下来是服务端的简要代码：

```javascript
router.get('/get/:id', async (ctx) => {
  const order = Number(ctx.params.id)
  if (order % 2 === 0) {
    await sleep(2000)
  } else {
    await sleep(1000)
  }
  ctx.body = 'done'
})
```

在前 6 个请求中，如果序号是偶数，则等待 2 秒，如果不是，则等待 1 秒。然后打开 DevTools 中的 Network，你可以得到以下画面：

![](https://files.mdnice.com/user/70043/e0c838fd-aadc-48d5-92a8-da2a8957016b.png)

查看 Time 和 Waterfall 列显示，这是请求并发限制的模型。

可能你会问：既然浏览器有并发限制了，那我们为何还要自己去实现这个功能呢？我觉得原因如下：

- 资源管理，让重要的请求优先发起
- 避免请求排队过久，超时而取消
- 防止服务器过载，提高响应效率
- 在请求失败时更容易进行重试或错误处理

所以我如何实现类似的功能呢？

```javascript
class Queue {
  constructor() {
    this.tasks = []
  }

  enqueue(task) {
    this.tasks.push(task)
  }

  dequeue() {
    return this.tasks.shift()
  }

  clear() {
    this.tasks = []
  }

  size() {
    return this.tasks.length
  }
}
```

队列类，负责管理请求列表，通过 enqueue 入队，dequeue 出队。

```
class PromiseLimiter {
  constructor(limitCount) {
    this.queue = new Queue();
    this.runningCount = 0;
    this.limitCount = limitCount;
  }

  get activeCount() {
    return this.runningCount;
  }

  get pendingCount() {
    return this.queue.size();
  }

  async next() {
    if (this.runningCount < this.limitCount && this.queue.size > 0) {
      this.queue.dequeue()?.();
    }
  }

  async run(fn) {
    return new Promise((resolve, reject) => {
      this.runningCount++;
      const result = fn();
      resolve(result);
      result.then(() => {
        this.runningCount--;
        this.next();
      }).catch(() => {
        // 忽略
        this.runningCount--;
        this.next();
      });
    });
  }

  limit(fn) {
    return new Promise((resolve) => {
      this.queue.enqueue(() => {
        this.run(fn).then(resolve);
      });
      this.next();
    });
  }
}

export default PromiseLimiter;
```

PromiseLimiter 负责调度，使用的时候只需要调用 limit 即可。其会先把函数入队，并执行其他函数，直至达到限制值。多余的请求，会在任意一个请求完成的时候重新获取队列里的函数执行。

```
const limiter = new PromiseLimiter(3)
const mockPromise = (i: number) => new Promise((resolve) => setTimeout(() => resolve(i), 1000));

(async () => {
  const results = await Promise.allSettled(
    [...new Array(6)].map((_, i) => limiter.limit(() => mockPromise(i)))
  );
  console.log('results: ', results);
})();
```
