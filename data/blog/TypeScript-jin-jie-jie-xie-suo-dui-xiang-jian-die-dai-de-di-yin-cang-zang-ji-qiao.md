---
layout: PostLayout
title: TypeScript进阶：解锁对象键迭代的隐藏技巧
date: 2024-09-05 09:09:03
tags: ['js原理']
summary: 

在TypeScript中迭代对象键可能会出现一些令人抓狂的情况。来看一个例子，应该大多数人都会经历过：

```
type User = {
  name: string;
  age: number;
};

function printUser(user: User) {
  Object.keys(user).forEach((key) => {
    // Doesn't work!
---

在 TypeScript 中迭代对象键可能会出现一些令人抓狂的情况。来看一个例子，应该大多数人都会经历过：

```
type User = {
  name: string;
  age: number;
};

function printUser(user: User) {
  Object.keys(user).forEach((key) => {
    // Doesn't work!
    console.log(user[key]);
  });
}
```

![](https://files.mdnice.com/user/70043/e5239430-6adb-4526-8a72-2103f4947d35.png)

除非你知道一些技巧，否则这并不简单。这里是我所知道的所有解决方案。

# 原因分析

使用 Object.keys 进行迭代不起作用，因为 Object.keys 返回的是一个字符串数组，而不是所有键的联合。这是 TypeScript 有意为之，不能修改的。

![](https://files.mdnice.com/user/70043/eedb7118-67c5-46cf-a0d7-e6d4df2333b5.png)

常见的解决方法是通过 keyof typeof，将 key 的类型强制转换为对象的 key 值枚举：

```typescript
const user = {
  name: 'Daniel',
  age: 26,
}

const keys = Object.keys(user) as Array<keyof typeof user>
keys.forEach((key) => {
  console.log(user[key as keyof typeof user])
})
```

又或者通过内联缩小类型来解决。

```typescript
function isKey<T extends object>(x: T, k: PropertyKey): k is keyof T {
  return k in x
}

const keys = Object.keys(user)
keys.forEach((key) => {
  if (isKey(user, key as keyof typeof user)) {
    console.log(user[key])
  }
})
```

这里的问题在于：使用 Object.keys 没有按你预想的那样返回你需要的类型。

Typescript 没有返回包含所有键的类型，而是将其推测为字符串数组。

![](https://files.mdnice.com/user/70043/5f6df21c-bc2d-47a5-bc23-65aec948c555.png)

TypeScript 对于对象类型的设计是开放式的。不可否认，在许多情况下，我们不能保证 Object.keys 返回的键实际上存在于对象上，所以将它们推测为字符串数组是唯一个退一步海阔天空的解决方案。这里有这个问题相关的讨论：[github issue](https://github.com/Microsoft/TypeScript/issues/12870)

for...in 循环，也同样有类似的问题。

![](https://files.mdnice.com/user/70043/bbbff501-e504-450c-be1e-276196f0ff48.png)

# 解决方案

也许在许多情况下，你是知道对象的 key 值有哪些的。

那么，你该怎么做呢？

## 解决方案 1：将类型转换为 keyof typeof

第一个方案是使用 keyof typeof 将键转换为更具体的类型。

在下面的示例中，我们将 Object.keys 的结果转换为包含这些键的数组。

```typescript
const user = {
  name: 'Daniel',
  age: 26,
}

const keys = Object.keys(user) as Array<keyof typeof user>
keys.forEach((key) => {
  console.log(user[key])
})
```

也可以将 key 强制转换为对应的类型。

```typescript
const keys = Object.keys(user)
keys.forEach((key) => {
  console.log(user[key as keyof typeof user])
})
```

使用 as 在任何形式上通常是不安全的，确实如此，它会对现在或者将来存在一些风险，因为它是人为的指认。

```typescript
const user = {
  name: 'Daniel',
  age: 26,
}

const nonExistentKey = 'id' as keyof typeof user
const value = user[nonExistentKey]
// 没有错误！
```

## 解决方案 2：类型谓词

让我们看看一些更智能、更安全的解决方案。如何使用类型谓词？

通过使用 isKey，我们可以在索引之前检查键是否真的在对象上。

我们通过在 isKey 的返回类型中使用 is 语法，让 TypeScript 正确推断。

```typescript
function isKey<T extends object>(x: T, k: PropertyKey): k is keyof T {
  return k in x
}

const keys = Object.keys(user)
keys.forEach((key) => {
  if (isKey(user, key)) {
    console.log(user[key])
  }
})
```

## 解决方案 3：泛型函数

让我们看看一个稍微奇怪的解决方案。在泛型函数内，使用 in 操作符确实会将类型缩小到键。

```typescript
function printEachKey<T extends object>(obj: T) {
  for (const key in obj) {
    console.log(obj[key])
  }
}

printEachKey({
  name: 'Daniel',
  age: 26,
})
```

## 解决方案 4：将 Object.keys 包装在函数中

另一个解决方案是将 Object.keys 包装在一个返回转换后类型的函数中。

```typescript
const objectKeys = <T extends object>(obj: T) => {
  return Object.keys(obj) as Array<keyof T>
}

const keys = objectKeys({
  name: 'Daniel',
  age: 26,
})
console.log(keys)
```

# 结论

个人更加推荐方案一，因为它更具可读性，理解上也更直观。
