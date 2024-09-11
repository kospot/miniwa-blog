---
layout: PostLayout
title: 再见了Try-Catch，ECMA增加安全赋值运算符提案
date: 2024-08-22
tags: ['js原理']
summary: JavaScript 的错误处理即将获得重大升级。新的 ECMAScript 安全赋值运算符提案（?=）旨在通过减少对传统 try-catch 代码块的需求，来简化您的代码。该提案将在8月25日的会议上讨论。
---

![](https://files.mdnice.com/user/70043/b6bc3954-bddc-441d-9271-49ff2bca49a0.png)

JavaScript 的错误处理即将获得重大升级。新的 ECMAScript 安全赋值运算符提案（?=）旨在通过减少对传统 try-catch 代码块的需求，来简化您的代码。该提案将在 8 月 25 日的会议上讨论。

让我们一起来看看这个提案如何简化您的错误管理，并使您的 JavaScript 代码更干净、更高效。

## 简单示例

传统的 try-catch 代码块常常导致代码深度嵌套，使得代码难以阅读和维护。提案通过引入新的运算法`?=` ，通过将函数的结果转换为元组来减少嵌套。如果发生错误，它返回 [错误, null]；否则，它返回 [null, 结果]。

直接来看一个示例：

```javascript
async function getData() {
  const [error, response] ?= await fetch('https://api.example.com/data');
  if (error) return handleError(error);
  return response;
}
```

`?=` 运算符使错误处理更加直观，保持代码线性且易于跟踪。同时通过统一的返回元组，使错误处理方式始终保持一致的风格。

通过以标准化的方式自动处理错误，`?=` 运算符减少了错过关键错误的机会。

## 错误定制

同时引入了`Symbol.result`支持定制错误处理逻辑。Symbol.result 方法应该返回一个元组 [错误, 结果]。

来看一个栗子：

```javascript
function example() {
  return {
    [Symbol.result]() {
      return [new Error('错误信息'), null];
    }
  };
}

const [error, result] ?= example();
```

`?=` 运算符还可以递归处理实现 Symbol.result 的嵌套对象，确保即使是复杂的错误场景也能顺利管理。

```javascript
const obj = {
  [Symbol.result]() {
    return {
      [Symbol.result]: () => [new Error('嵌套错误'), null];
    };
  }
};

const [error, data] ?= obj;
```

## 支持异步处理

`?=` 运算符可以与 Promises 和 async/await 无缝协作，使异步代码中的错误处理变得直接。

示例：

```javascript
const [error, data] ?= await fetch('https://api.example.com');
```

## 旧浏览器处理方案

该提案可以使用 polyfill.js 上提供的代码进行 polyfill。

然而，那个`?=`运算符本身不能直接填充。当针对较旧的 JavaScript 环境时，应该使用后处理器来转换`?=`运算符进入相应的[Symbol.result]调用。

```
const [error, data] ?= await asyncAction(arg1, arg2)
// should become
const [error, data] = await asyncAction[Symbol.result](arg1, arg2)


const [error, data] ?= action()
// should become
const [error, data] = action[Symbol.result]()


const [error, data] ?= obj
// should become
const [error, data] = obj[Symbol.result]()
```

## 设计理念

在 [错误, 数据] 的 `?=` 结构中首先放置错误，确保在处理数据之前先处理错误，减少了忽略错误的风险。

示例：

```javascript
const [error, data] ?= someFunction();
```

`?=` 运算符背后的模式受到 Go、Rust 和 Swift 等语言中类似结构的启发，这些语言早已采用了更结构化的错误处理。

这个提案的目的不是为了自动处理错误，也不是为了引入新的类型，其只是为了规范和统一错误处理的方式。

## 结论

安全赋值运算符（`?=`）是 JavaScript 错误处理的变革者，承诺减少对笨重的 try-catch 代码块的需求，使您的代码更干净、更安全。尽管仍在开发中，这个提案可能很快成为每个 JavaScript 开发者工具箱中的标准工具。

关于更详细的信息，可以查看：https://github.com/arthurfiorette/proposal-safe-assignment-operator?tab=readme-ov-file
