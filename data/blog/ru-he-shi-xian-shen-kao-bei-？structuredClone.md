---
layout: PostLayout
title: 如何实现深拷贝？structuredClone
date: 2024-09-10 07:07:49
tags: ['js原理']
summary: 经典的面试题：如何实现深拷贝。

常规的回答主要是通过JSON或者遍历对象递归。主要是考核对对象操作方法的熟悉程度。今天来介绍另一个方案`structuredClone()`。


![](https://files.mdnice.com/user/70043/19c11a61-e613-4025-a42c-298747db4a78.png)


什么是 `structuredClone()`？

---

经典的面试题：如何实现深拷贝。

常规的回答主要是通过 JSON 或者遍历对象递归。主要是考核对对象操作方法的熟悉程度。今天来介绍另一个方案`structuredClone()`。

![](https://files.mdnice.com/user/70043/19c11a61-e613-4025-a42c-298747db4a78.png)

什么是 `structuredClone()`？

`structuredClone()` 是在 2022 年引入的一个全局函数，它使得 JavaScript 对象的深度克隆变得可能。与传统的方法如 `JSON.stringify()` 和 `JSON.parse()` 不同，这些方法在处理复杂结构和循环引用时会遇到困难，`structuredClone()` 却能轻松应对这些挑战。

# 基本用法

它是一个强大的工具，用于创建真正的深度克隆，保持嵌套对象和循环引用的完整性，无需额外的逻辑或变通方法。此外，它在现代环境中可用，包括 Web Workers。

## 1. 简单对象克隆：基础

使用 `{...obj}`（浅拷贝）

```javascript
const original = {
  name: 'Alice',
  details: { age: 25 },
}

const shallowCopy = { ...original }

shallowCopy.details.age = 30

console.log(original.details.age) // 30
console.log(shallowCopy.details.age) // 30
```

发生了什么？

展开运算符 `{...obj}` 仅创建浅拷贝。`details` 对象没有被深度克隆，因此对 `shallowCopy.details` 的更改也会影响原始的 `details`。

使用 `JSON.stringify()` + `JSON.parse()`（深拷贝）

```javascript
const original = {
  name: 'Alice',
  details: { age: 25 },
}

const deepCopy = JSON.parse(JSON.stringify(original))

deepCopy.details.age = 30

console.log(original.details.age) // 25
console.log(deepCopy.details.age) // 30
```

这种方法创建了一个深拷贝，但它有局限性：它无法处理函数、`undefined` 或循环引用。

使用 `structuredClone()`（深拷贝）

```javascript
const original = {
  name: 'Alice',
  details: { age: 25 },
}

const clone = structuredClone(original)

clone.details.age = 30

console.log(original.details.age) // 25
console.log(clone.details.age) // 30
```

`structuredClone()` 创建了一个深拷贝，保留了结构，没有任何 `JSON.stringify()` 的限制，并能处理循环引用和 `undefined` 等复杂数据类型。

## 2. 循环引用

使用 `{...obj}` 处理循环引用

```javascript
const original = {
  name: 'Alice',
  self: null,
}

original.self = original // 这将导致错误：

const shallowCopy = { ...original }

// TypeError: Converting circular structure to JSON
```

`{...obj}` 无法处理循环引用，结果会导致错误。

使用 `JSON.stringify()` 处理循环引用

```javascript
const original = {
  name: 'Alice',
  self: null,
}

original.self = original // 这将导致错误：

const jsonCopy = JSON.parse(JSON.stringify(original))

// TypeError: Converting circular structure to JSON
```

`JSON.stringify()` 也无法处理循环引用，会抛出错误。

使用 `structuredClone()` 处理循环引用

```javascript
const original = {
  name: 'Alice',
  self: null,
}

original.self = original
const clone = structuredClone(original)

console.log(clone !== original) // true
console.log(clone.self === clone) // true
```

`structuredClone()` 轻松处理循环引用，创建了正确的深度克隆，没有错误。

## 3. 克隆函数和 `undefined`

使用 `{...obj}`

```javascript
const original = {
  name: 'Alice',
  greet: () => 'Hello!',
  value: undefined,
}

const shallowCopy = { ...original }

console.log(shallowCopy.greet()) // "Hello!"
console.log(shallowCopy.value) // undefined
```

发生了什么？

`{...obj}` 如预期那样拷贝函数和 `undefined`，但仅是浅拷贝。

使用 `JSON.stringify()`

```javascript
const original = {
  name: 'Alice',
  greet: () => 'Hello!',
  value: undefined,
}

const jsonCopy = JSON.parse(JSON.stringify(original))

console.log(jsonCopy.greet) // undefined
console.log(jsonCopy.value) // undefined
```

`JSON.stringify()` 无法序列化函数或 `undefined`，导致它们在克隆对象中丢失。

使用 `structuredClone()`

```javascript
const original = {
  name: 'Alice',
  greet: () => 'Hello!',
  value: undefined,
}

const clone = structuredClone(original)

console.log(clone.greet) // undefined
console.log(clone.value) // undefined
```

`structuredClone()` 也不克隆函数，但保留了 `undefined` 值，使其比 `JSON.stringify()` 更可靠，适用于复杂对象。

## 4. 速度和效率：性能说明

处理大数据的效率

```javascript
const largeArray = new Array(1e6).fill({ key: 'value' })

console.time('structuredClone')
const clone = structuredClone(largeArray)
console.timeEnd('structuredClone')

console.time('JSON.stringify + JSON.parse')
const jsonCopy = JSON.parse(JSON.stringify(largeArray))
console.timeEnd('JSON.stringify + JSON.parse')
```

对于大型、复杂的数据，`structuredClone()` 通常比 `JSON.stringify()` + `JSON.parse()` 更快，并且避免了序列化和反序列化的问题。

# 再深入了解一下

全局的 structuredClone() 方法使用结构化克隆算法将给定的值进行深拷贝。

该方法还支持把原值中的可转移对象转移（而不是拷贝）到新对象上。可转移对象与原始对象分离并附加到新对象；它们将无法在原始对象中被访问。

```
structuredClone(value, { transfer })
```

**value**

被克隆的对象。可以是任何结构化克隆支持的类型。

JavaScript 类型

- Array
- ArrayBuffer
- Boolean
- DataView
- Date
- Error 类型（仅限部分 Error 类型）。
- Map
- Object 对象：仅限简单对象（如使用对象字面量创建的）。
- 除 symbol 以外的基本类型。
- RegExp：lastIndex 字段不会被保留。
- Set
- String
- TypedArray

Error 类型

- 仅支持以下 Error 类型：Error、EvalError、RangeError、ReferenceError、SyntaxError、TypeError、URIError（或其他会被设置为 Error 的）。
- 浏览器必须序列化 name 和 message 字段，其他有意义的字段则可能会序列化，如 stack、cause 等。

**transfer 可选**

是一个可转移对象的数组，里面的 值 并没有被克隆，而是被转移到被拷贝对象上。

一个可能有用的场景是在保存 buffer 之前先异步的校验里面的数据。为了避免 buffer 在保存之前有其他修改，你可以先克隆这个 buffer 然后校验数据。为了防止意外的错误引用，在传输数据时，任何修改 buffer 的尝试都会失败。

```
var uInt8Array = new Uint8Array(1024 * 1024 * 16); // 16MB
for (var i = 0; i < uInt8Array.length; ++i) {
  uInt8Array[i] = i;
}

const transferred = structuredClone(uInt8Array, {
  transfer: [uInt8Array.buffer],
});
console.log(uInt8Array.byteLength); // 0
```

结构化克隆算法用于复制复杂 JavaScript 对象的算法。常用于浏览器内部的数据传递，例如 Worker 的 postMessage() 或使用 IndexedDB 存储对象用。它通过递归输入对象来构建克隆，同时保持先前访问过的引用的映射，以避免无限遍历循环。

结构化克隆所不能做到的

- Function 对象是不能被结构化克隆算法复制的；如果你尝试这样子去做，这会导致抛出 DATA_CLONE_ERR 的异常。
- 企图去克隆 DOM 节点同样会抛出 DATA_CLONE_ERR 异常。
- 对象的某些特定参数也不会被保留
  - RegExp 对象的 lastIndex 字段不会被保留
  - 属性描述符，setters 以及 getters（以及其他类似元数据的功能）同样不会被复制。例如，如果一个对象用属性描述符标记为 read-only，它将会被复制为 read-write，因为这是默认的情况下。
  - 原形链上的属性也不会被追踪以及复制。

# 总结

`structuredClone()`的优势如下：

- 可靠性：更可预测地处理循环引用、函数和 `undefined` 值。

- 效率：对于大型数据集执行深度克隆更快，不需要变通方法。

- 简洁性：一种方法统治它们所有 —— 不再需要在 `{...obj}`、`JSON.stringify()` 或自定义深度克隆函数之间选择。
