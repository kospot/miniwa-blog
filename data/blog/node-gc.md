---
layout: PostLayout
title: 'V8垃圾回收'
date: 2022-12-05 12:47:28
tags: ['js原理']
summary: V8的堆内存分为3部分，分别为年轻分代，年老分代，大对象空间。
---

名词解析：

JIT：即时编译技术，直接将 JavaScript 代码编译成本地平台的机器码，其步骤为 JavaScript 源码--抽象语法树--本地机器码。

## 内存管理

javascript 的对象在 V8 引擎中的堆创建，V8 会自动回收不被引用的对象。采用这种方式，降低了内存管理的负担，但也造成了不便，执行垃圾回收会阻塞 JavaScript 代码执行，如果内存过大就会导致回收执行时间过长，为了避免时间超长，还需要限制堆的大小，于是有了 V8 的堆内存大小的限制，在 32 位上限制为 0.7G，64 位位 1.4G。
V8 的堆分为 3 部分，分别为年轻分代，年老分代，大对象空间。这三者保存不同类型的对象。

### 年轻分代

年轻分代的堆空间不大，处理速度快，回收频率较高。采用 Scavenge GC 垃圾回收算法，在算法实现时主要采用 Cheney 算法，讲空间一分为二，只有一半处于使用中，另外一半用于垃圾清理。
年轻分代主要保存那些生命周期短暂的对象，例如函数中的局部变量。他们类似于在栈上分配的对象，当函数返回时，调用栈中的局部变量都会被析构掉。V8 了解内存的使用情况，当发现内存空间不够，需要清理时，才进行回收。具体步骤是将还被引用的对象复制到另一半区域，然后释放当前一半的空间，把当前释放的空间留作备用，两者角色交换。

### 年老分代

年老分代的大小远大于年轻分代，主要包含从年轻分代移动过来的对象、JIT 之后的代码、全局对象。主要采用标记清除法和标记整理算法。其思路是将垃圾回收分成两个过程，标记清楚阶段遍历堆中的所有对象，把有效的对象标记出来，之后清理垃圾对象。当执行 1 次清除后，堆内存变得不连续，内存碎片较多，不利于后续的分配。但 V8 发现没有足够的空间可分配时就会执行标记整理算法，标记整理移动对象，紧缩堆空间，将碎片内存整理成大块内存。实际上，V8 在执行这些算法时，不会一次做完，而是走走停停，因为垃圾回收会阻塞代码执行，所以采用交替执行的方式，避免对应用程序的影响。

新生代内存晋升老分代条件

- 1、如果一个对象他经历了两次的新生代的更替，还没有被回收内存，就需要晋升为老生代，让老生代的算法来对付他。
- 2、如果一个对象在 To 的内存占比超过了 25%，在第一次更替的时候就直接将他晋升为老生代

### 大对象空间

大对象空间主要存放需要较大内存的对象，也包括数据和 JIT 生成的代码。垃圾回收不会移动大对象，这部分内存使用的特点是，整块分配，一次性整块回收。

需要留意 Buffer 是一个 JavaScript 与 C++结合的模块，与性能有关的用 C++来实现，JavaScript 负责衔接和提供接口。Buffer 所占的内存不是 V8 分配的，是独立于 V8 堆内存之外的内存，通过 C++层面实现内存申请、JavaScript 分配内存。每当我们使用 Buffer.alloc(size) 请求一个 Buffer 内存时，Buffer 会以 8KB 为界限来判断分配的是大对象还是小对象，小对象存入剩余内存池，不够再申请一个 8KB 的内存池；大对象直接采用 C++层面申请的内存。

## 内存泄漏（Memory Leak）

是指程序中已动态分配的堆内存由于某种原因程序未释放或无法释放，造成系统内存的浪费，导致程序运行速度减慢甚至系统崩溃等严重后果。

内存泄漏的核心还是已分配的无法释放，所以排查的主要手段还是去看哪里存在不释放的内存。

在 Node.js 的启动参数中，提供了暴露手动调用 GC 方法的参数，即 --expose-gc。我们用这个参数来启动应用后，就可以在代码中调用 global.gc() 手动触发垃圾回收操作。同时，使用 process.memoryUsage().heapUsed 获取进程运行时所占用的内存。如果 GC 之后，内存依然没有下降，就可以确定是内存泄露了。

另外通过对比多个不同的内存快照，也能较快地发现内存泄漏问题。

JavaScript 里有两个类型，WeakMap 与 WeakSet，也可以从技术上避免内存泄漏。Map 是简单的 key-value。而且 key 可以为任意类型，比如引用类型，如果我们的 key 是引用类型那么他所占据的内存就无法被释放了。除了这种场景，如果如果要往对象上添加数据，又不想干扰垃圾回收机制，也可以使用 WeakMap。一个典型应用场景是，在网页的 DOM 元素上添加数据，就可以使用 WeakMap 结构。当该 DOM 元素被清除，其所对应的 WeakMap 记录就会自动被移除。

```
const wm = new WeakMap();

const element = document.getElementById('example');

wm.set(element, 'some information');
wm.get(element) // "some information"
```

上面代码中，先新建一个 Weakmap 实例。然后，将一个 DOM 节点作为键名存入该实例，并将一些附加信息作为键值，一起存放在 WeakMap 里面。这时，WeakMap 里面对 element 的引用就是弱引用，不会被计入垃圾回收机制。也就是说，上面的 DOM 节点对象的引用计数是 1，而不是 2。这时，一旦消除对该节点的引用，它占用的内存就会被垃圾回收机制释放。Weakmap 保存的这个键值对，也会自动消失。