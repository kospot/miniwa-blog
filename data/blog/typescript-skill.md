---
layout: PostLayout
title: 实用主义的 TypeScript 技巧
date: 2024-07-29
tags: ['js原理']
summary: TypeScript 作为一种静态类型检查的语言，不仅提高了代码的安全性，还大大增强了开发者的编程体验。本文将通过一些实用技巧和实例，帮助你更好地掌握和应用 TypeScript。
---

TypeScript 作为一种静态类型检查的语言，不仅提高了代码的安全性，还大大增强了开发者的编程体验。本文将通过一些实用技巧和实例，帮助你更好地掌握和应用 TypeScript。

### 1. 使用 `never` 类型检查 `switch case` 语句

在 `switch case` 语句中，`never` 类型可以帮助我们确保所有可能的情况都被处理，避免漏掉某些情况。

```typescript
type Fruit = 'apple' | 'banana' | 'orange'

function getFruitColor(fruit: Fruit): string {
  switch (fruit) {
    case 'apple':
      return 'red'
    case 'banana':
      return 'yellow'
    case 'orange':
      return 'orange'
    default:
      const exhaustiveCheck: never = fruit
      return exhaustiveCheck
  }
}
```

在上面的例子中，如果我们在 `Fruit` 类型中添加了新的水果类型，但没有在 `switch` 语句中处理这个新类型，TypeScript 将会在 `default` 分支的 `exhaustiveCheck` 处报错，从而提醒我们处理新情况。

### 2. 使用互斥类型替代联合类型

在处理联合类型时，使用互斥类型可以让类型系统更清晰，避免意外情况。

```typescript
type Square = { kind: 'square'; size: number }
type Rectangle = { kind: 'rectangle'; width: number; height: number }
type Shape = Square | Rectangle

function getShapeArea(shape: Shape): number {
  if (shape.kind === 'square') {
    return shape.size * shape.size
  } else if (shape.kind === 'rectangle') {
    return shape.width * shape.height
  } else {
    const exhaustiveCheck: never = shape
    return exhaustiveCheck
  }
}
```

通过使用互斥类型，我们可以确保每个类型都有唯一的 `kind` 属性，这样在类型检查时更容易处理。

### 3. 保留联合类型的提示

有时候，我们希望在编写代码时保留联合类型的提示，这样在开发过程中可以更方便地知道哪些类型是可能的。

```typescript
type Status = 'success' | 'error' | 'loading'

function handleStatus(status: Status) {
  switch (status) {
    case 'success':
      console.log('Operation was successful')
      break
    case 'error':
      console.log('There was an error')
      break
    case 'loading':
      console.log('Loading...')
      break
    default:
      const exhaustiveCheck: never = status
      return exhaustiveCheck
  }
}
```

在这里，通过 `switch case` 语句，我们可以保留对 `Status` 类型所有可能值的提示，方便在开发过程中进行处理。

### 4. `satisfies` 关键字

TypeScript 4.9 引入了 `satisfies` 关键字，可以帮助我们更好地进行类型检查，确保对象满足某种类型但不限制其具体的形状。

```typescript
type Point = { x: number; y: number }

const point = {
  x: 5,
  y: 10,
  z: 20,
} satisfies Point
```

在上面的例子中，`point` 对象不仅满足 `Point` 类型的要求，还可以有其他属性。使用 `satisfies` 关键字，我们可以确保对象符合预期类型，同时保留其他可能的属性。

### 5. 模板字符串类型的排列组合

模板字符串类型允许我们在类型层面上进行字符串拼接和组合，极大地增强了类型系统的灵活性。

```typescript
type Color = 'red' | 'green' | 'blue'
type Size = 'small' | 'medium' | 'large'

type ColorSize = `${Color}-${Size}`

const colorSize: ColorSize = 'red-small' // 合法
```

在这里，`ColorSize` 类型表示所有可能的颜色和大小的组合，极大地增强了类型系统的表达能力。

### 6. 提取类型

有时候，我们需要从某个复杂类型中提取出某个部分的类型，TypeScript 提供了工具类型来帮助我们实现这一点。

```typescript
type Person = {
  name: string
  age: number
  address: {
    street: string
    city: string
  }
}

type Address = Person['address']

const address: Address = {
  street: '123 Main St',
  city: 'New York',
}
```

通过使用 `Person['address']`，我们可以轻松提取出 `Person` 类型中的 `address` 部分类型，方便在代码中复用。

### 结语

本文介绍了几个实用的 TypeScript 技巧，包括使用 `never` 类型检查 `switch case` 语句、使用互斥类型替代联合类型、保留联合类型的提示、`satisfies` 关键字、模板字符串类型的排列组合以及提取类型。这些技巧不仅能提高代码的类型安全性，还能增强开发者的编程体验。希望这些技巧能对你的 TypeScript 开发有所帮助。
