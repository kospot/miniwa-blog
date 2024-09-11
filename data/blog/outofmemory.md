---
layout: PostLayout
title: 内存泄漏：关于定时器的引用
date: 2024-08-13
tags: ['js原理']
summary: TypeScript 作为一种静态类型检查的语言，不仅提高了代码的安全性，还大大增强了开发者的编程体验。本文将通过一些实用技巧和实例，帮助你更好地掌握和应用 TypeScript。
---

## 背景

```javascript
function demo() {
  const bigArrayBuffer = new ArrayBuffer(999_000_000)
  const id = setTimeout(() => {
    console.log(bigArrayBuffer.byteLength)
  }, 1000)

  return () => clearTimeout(id)
}

globalThis.cancelDemo = demo()
```

使用上述代码，`bigArrayBuffer` 将永远泄漏。我没想到会这样，因为：

- 一秒钟后，引用 `bigArrayBuffer` 的函数不再可调用。
- 返回的取消函数不引用 `bigArrayBuffer`。

![](https://files.mdnice.com/user/70043/d0e9a165-a15d-4346-b4b6-524d33bef59e.png)

## 关于垃圾回收

### 垃圾回收的基本原理

下面我们一起看看为什么。先来了解一下 JavaScript 中的垃圾回收（Garbage Collection, GC）是自动进行的，开发者无需手动管理内存。JavaScript 引擎（如 V8 引擎）会自动检测不再使用的对象，并释放其占用的内存。为了了解和优化 JavaScript 应用的内存使用，理解垃圾回收的基本原理和机制是很重要的。

JavaScript 的垃圾回收主要基于两个基本算法：**标记-清除（Mark-and-Sweep）**和**引用计数（Reference Counting）**。

#### 1. 标记-清除算法（Mark-and-Sweep）

这是现代 JavaScript 引擎中最常用的垃圾回收算法。

- **标记阶段**：从根对象（通常是全局对象，如`window`）开始，遍历所有可达对象，并标记它们为“活动的”。
- **清除阶段**：遍历内存中的所有对象，清除那些未被标记的对象，释放其内存。

标记-清除算法解决了循环引用的问题，因为它仅关注对象是否可达，而不考虑对象的引用计数。

#### 2. 引用计数算法（Reference Counting）

这种算法较简单，但在现代 JavaScript 引擎中不常使用。

- 每个对象都有一个引用计数，当一个对象被引用时计数加 1，当引用被移除时计数减 1。
- 引用计数为 0 的对象会立即被回收。

引用计数算法无法处理循环引用的问题，因为循环引用的对象即使彼此引用，引用计数不为 0，但实际上是不可达的。

### V8 引擎中的垃圾回收

V8 引擎（Chrome 和 Node.js 使用的 JavaScript 引擎）使用了一种分代垃圾回收（Generational Garbage Collection）机制，将内存分为新生代（New Space）和老生代（Old Space）。

#### 新生代（New Space）

新分配的对象存储在新生代，内存较小且回收频繁。V8 使用一种称为**Scavenge**的算法进行回收：

- 新生代分为两个半空间：使用空间（From Space）和空闲空间（To Space）。
- 当使用空间满时，将活动对象复制到空闲空间，并清除使用空间。
- 角色互换，空闲空间变为使用空间，原使用空间变为空闲空间。

#### 老生代（Old Space）

存活时间较长的对象存储在老生代，内存较大且回收不频繁。V8 使用标记-清除和标记-压缩（Mark-and-Compact）算法：

- **标记-清除**：标记活动对象，清除未标记对象。
- **标记-压缩**：标记活动对象后，将其压缩到内存的一端，减少内存碎片。

### 垃圾回收的触发

JavaScript 引擎会自动触发垃圾回收，开发者无需手动干预。以下情况可能触发垃圾回收：

- 新生代内存达到阈值。
- 老生代内存达到阈值。
- 显式调用内存密集操作。

### 示例代码

以下是一些避免内存泄漏的示例代码：

```javascript
// 示例1：避免全局变量
function createScope() {
  let localVariable = 'I am local' // 使用局部变量
  console.log(localVariable)
}
createScope()

// 示例2：合理使用闭包
function createClosure() {
  let closureVariable = 'I am a closure variable'
  return function () {
    console.log(closureVariable)
  }
}
let closure = createClosure()
closure() // 调用闭包
closure = null // 解除闭包引用

// 示例3：清理定时器
let timerId = setTimeout(() => {
  console.log('This is a timer')
}, 1000)
clearTimeout(timerId) // 清除定时器

// 示例4：清理事件监听器
let element = document.getElementById('myElement')
function handleClick() {
  console.log('Element clicked')
}
element.addEventListener('click', handleClick)
element.removeEventListener('click', handleClick) // 移除事件监听器
```

## 原因分析

我们再来看看刚才的情况，如果是以下情况，不会出现泄漏：

```javascript
function demo() {
  const bigArrayBuffer = new ArrayBuffer(999_000_000)
  console.log(bigArrayBuffer.byteLength)
}

demo()
```

函数执行后，`bigArrayBuffer` 不再需要，可以被垃圾回收。

还有这样也不会泄漏：

```javascript
function demo() {
  const bigArrayBuffer = new ArrayBuffer(999_000_000)

  setTimeout(() => {
    console.log(bigArrayBuffer.byteLength)
  }, 1000)
}

demo()
```

在这种情况下：

- 引擎看到 `bigArrayBuffer` 被内部函数引用，所以会保留它。它与调用 `demo()` 时创建的作用域关联。
- 一秒钟后，引用 `bigArrayBuffer` 的函数不再可调用。
- 由于作用域内没有任何可调用的内容，作用域以及 `bigArrayBuffer` 可以被垃圾回收。

还有这样也不会泄漏：

```javascript
function demo() {
  const bigArrayBuffer = new ArrayBuffer(999_000_000)

  const id = setTimeout(() => {
    console.log('hello')
  }, 1000)

  return () => clearTimeout(id)
}

globalThis.cancelDemo = demo()
```

在这种情况下，引擎知道它不需要保留 `bigArrayBuffer`，因为内部可调用的函数没有访问它。

如果改成如下，这里情况就变得混乱了：

```javascript
function demo() {
  const bigArrayBuffer = new ArrayBuffer(999_000_000)

  const id = setTimeout(() => {
    console.log(bigArrayBuffer.byteLength)
  }, 1000)

  return () => clearTimeout(id)
}

globalThis.cancelDemo = demo()
```

这样子会泄漏，因为：

- 引擎看到 `bigArrayBuffer` 被内部函数引用，所以会保留它。它与调用 `demo()` 时创建的作用域关联。
- 一秒钟后，引用 `bigArrayBuffer` 的函数不再可调用。
- 但是，作用域仍然存在，因为 'cancel' 函数仍然可调用。
- `bigArrayBuffer` 与作用域关联，所以它仍然保留在内存中。

我以为引擎会识别这种情况，在 `bigArrayBuffer` 不再可访问时进行垃圾回收，但事实并非如此。

```javascript
globalThis.cancelDemo = null
```

现在 `bigArrayBuffer` 可以被垃圾回收了，因为作用域内没有任何可调用的内容。

又或者我们在清除定时器时同时清除`bigArrayBuffer`

````
```javascript
function demo() {
  let bigArrayBuffer = new ArrayBuffer(999_000_000);

  const id = setTimeout(() => {
    console.log(bigArrayBuffer.byteLength);
  }, 1000);

  return () => {
    clearTimeout(id);
    bigArrayBuffer = null
  }
}

globalThis.cancelDemo = demo();
````

那么在我们执行`cancelDemo`的时候内存将被回收。

## 结论

所以，如果你在定时器（setTimeout）的回调中使用了大对象的话，请确保解除回调函数中对大对象的引用。
