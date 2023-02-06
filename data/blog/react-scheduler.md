---
layout: PostLayout
title: 'ReactScheduler梳理'
date: 2022-12-05 12:47:28
tags: ['js原理']
summary: V8的堆内存分为3部分，分别为年轻分代，年老分代，大对象空间。
---

是 react 的内部包，md 里声明的是用于浏览器环境协同调度的，也有计划把它推广出去。

react15 的弊端之一是 Reconciler 和 Renderer 是同步递归进行的，Reconciler 负责虚拟 DOM 的维护，Renderer 负责视图渲染，递归无法保存中间状态或者中断执行，且浏览器里 js 执行和视图渲染是互斥的，于是当视图渲染遇到瓶颈，无法在一帧时间完成时，页面就出现了卡顿。虽然通过批量更新做优化，减少 Reconciler 的计算频率，但治标不治本，还是有可能出现 Renderer 过于繁忙的情况。而且批量更新无法识别异步任务里的，为确保结果正确，异步里的也只能按照顺序执行，不做合并更新了。

为了解决这个问题，react16 引入了 Fiber 支持异步可中断更新。通过把整个虚拟 DOM 树微观化，变成链表，按照子元素->兄弟元素->父元素的逻辑遍历节点，利用浏览器的空闲时间计算 Diff。一旦浏览器有需求，把没计算完的任务放在一旁，把主进程控制权还给浏览器，让浏览器可以有足够的时间渲染 UI（不可中断）。这种架构虽然没有减少运算量，但是巧妙地利用空闲实现计算，解决了卡顿的问题。

到这里可能就会疑问了，怎么中断任务、什么时间执行、怎么划分优先级，而这个正是 Scheduler 所负责的工作，时间切片和优先级调度。

实现原理

要解决卡顿，就要先了解浏览器的渲染过程。浏览器的每一帧的操作，https://github.com/hushicai/hushicai.github.io/issues/5。

- 接受输入事件
- 执行事件回调
- 开始一帧
- 执行 RAF (RequestAnimationFrame)
- 页面布局，样式计算
- 绘制渲染
- 执行 RIC (RequestIdelCallback)

可以看到，当所有事情都做完了之后，会调用一个 requestIdleCallback 函数，在这个函数里我们可以拿到浏览器当前一祯的剩余时间。借助这个 API ，我们就可以让浏览器仅在空闲时期的时候执行脚本。时间切片的本质，也就是模拟实现 requestIdleCallback 这个函数。

由于兼容性和刷新帧率（requestIdleCallback 工作帧率低，只有 20FPS）的问题，React 并没有直接使用 requestIdleCallback ， 而是用 requestAnimationFrame 和 MessageChannel 进行 polyfill，原理是一样的。

在 Chrome 87 版本，React 团队和 Chrome 团队合作，在浏览器上加入了一个新的 API isInputPending。这也是第一个将中断这个操作系统概念用于网页开发的 API。

合理使用 isInputPending 方法，我们可以在页面渲染的时候及时响应用户输入，并且，当有长耗时的 JS 任务要执行时，可以通过 isInputPending 来中断 JS 的执行，将控制权交还给浏览器来执行用户响应。

Scheduler 对外暴露了一个方法 unstable_runWithPriority，这个方法可以用来获取优先级

```
switch (priorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
    case LowPriority:
    case IdlePriority:
      break;
    default:
      priorityLevel = NormalPriority;
  }
```

可以看到有 5 种优先级，比如，我们知道 commit 阶段是同步执行的。可以看到，commit 阶段的起点 commitRoot 方法的优先级为 ImmediateSchedulerPriority。
ImmediateSchedulerPriority 即 ImmediatePriority 的别名，为最高优先级，会立即执行。可是优先级只是一个名称，react 如何判断优先级的高低呢，这里我觉得和操作系统里面的一些概念还是挺相似的
给不同任务给上过期时间，谁快过期了就先执行谁

```
var timeout;
switch (priorityLevel) {
  case ImmediatePriority:
    timeout = IMMEDIATE_PRIORITY_TIMEOUT;
    break;
  case UserBlockingPriority:
    timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
    break;
  case IdlePriority:
    timeout = IDLE_PRIORITY_TIMEOUT;
    break;
  case LowPriority:
    timeout = LOW_PRIORITY_TIMEOUT;
    break;
  case NormalPriority:
  default:
    timeout = NORMAL_PRIORITY_TIMEOUT;
    break;
}

var expirationTime = startTime + timeout;
// Times out immediately
var IMMEDIATE_PRIORITY_TIMEOUT = -1;
// Eventually times out
var USER_BLOCKING_PRIORITY_TIMEOUT = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000;
// Never times out
var IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt;
```

可以看到 `IMMEDIATE_PRIORITY_TIMEOUT = -1`，说明比当前时间还早，已经过期，必须快执行，初此之外，react 新增了两个队列：已就绪任务 ，未就绪任务
所以，Scheduler 存在两个队列：timerQueue：保存未就绪任务，taskQueue：保存已就绪任务

每当有新的未就绪的任务被注册，我们将其插入 timerQueue 并根据开始时间重新排列 timerQueue 中任务的顺序。当 timerQueue 中有任务就绪，即 startTime <= currentTime，我们将其取出并加入 taskQueue。取出 taskQueue 中最早过期的任务并执行他。
