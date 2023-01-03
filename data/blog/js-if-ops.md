---
layout: PostLayout
title: '关于条件判断优化'
date: 2021-08-21 20:31:28
tags: ['设计原理']
summary: if else、switch case 是日常开发中最常见的条件判断语句，这种看似简单的语句，当遇到复杂的业务场景时，如果处理不善，就会出现大量的逻辑嵌套，可读性差并且难以扩展。
---

if else、switch case 是日常开发中最常见的条件判断语句，这种看似简单的语句，当遇到复杂的业务场景时，如果处理不善，就会出现大量的逻辑嵌套，可读性差并且难以扩展。

## 1、嵌套层级优化

```
function supply(fruit, quantity) {
  const redFruits = ['apple', 'strawberry', 'cherry', 'cranberries'];
  // 条件 1: 水果存在
  if(fruit) {
    // 条件 2: 属于红色水果
    if(redFruits.includes(fruit)) {
      console.log('红色水果');
      // 条件 3: 水果数量大于 10 个
      if (quantity > 10) {
        console.log('数量大于 10 个');
      }
    }
  } else {
    throw new Error('没有水果啦!');
  }
}
```

分析上面的条件判断，存在三层 if 条件嵌套。

如果提前 return 掉无效条件，将 if else 的多重嵌套层次减少到一层，更容易理解和维护。

```
function supply(fruit, quantity) {
  const redFruits = ['apple', 'strawberry', 'cherry', 'cranberries'];
  if(!fruit) throw new Error('没有水果啦');     // 条件 1: 当 fruit 无效时，提前处理错误
  if(!redFruits.includes(fruit)) return; // 条件 2: 当不是红色水果时，提前 return

  console.log('红色水果');

  // 条件 3: 水果数量大于 10 个
  if (quantity > 10) {
    console.log('数量大于 10 个');
  }
}
```

## 2、多条件分支的优化处理

当需要枚举值处理不同的业务分支逻辑时，第一反应是写下 if else ？我们来看一下：

```
function pick(color) {
  // 根据颜色选择水果
  if(color === 'red') {
    return ['apple', 'strawberry'];
  } else if (color === 'yellow') {
    return ['banana', 'pineapple'];
  } else if (color === 'purple') {
    return ['grape', 'plum'];
  } else {
    return [];
  }
}
```

在上面的实现中：

- if else 分支太多
- if else 更适合于条件区间判断，而 switch case 更适合于具体枚举值的分支判断

使用 switch case 优化上面的代码后：

```
function pick(color) {
  // 根据颜色选择水果
  switch (color) {
    case 'red':
      return ['apple', 'strawberry'];
    case 'yellow':
      return ['banana', 'pineapple'];
    case 'purple':
      return ['grape', 'plum'];
    default:
      return [];
  }
}
```

switch case 优化之后的代码看上去格式整齐，思路很清晰，但还是很冗长。继续优化：

方式一：借助 Object 的 `{ key: value }` 结构，我们可以在 Object 中枚举所有的情况，然后将 key 作为索引，直接通过 Object.key 或者 Object[key] 来获取内容

```
const fruitColor = {
  red: ['apple', 'strawberry'],
  yellow: ['banana', 'pineapple'],
  purple: ['grape', 'plum'],
}
function pick(color) {
  return fruitColor[color] || [];
}
```

方式二：使用 Map 数据结构，真正的 (key, value) 键值对结构

```
const fruitColor = new Map()
.set('red', ['apple', 'strawberry'])
.set('yellow', ['banana', 'pineapple'])
.set('purple', ['grape', 'plum']);

function pick(color) {
  return fruitColor.get(color) || [];
}
```

优化之后，代码更简洁、更容易扩展。

为了更好的可读性，还可以通过更加语义化的方式定义对象，然后使用 Array.filter 达到同样的效果。

```
const fruits = [
  { name: 'apple', color: 'red' },
  { name: 'strawberry', color: 'red' },
  { name: 'banana', color: 'yellow' },
  { name: 'pineapple', color: 'yellow' },
  { name: 'grape', color: 'purple' },
  { name: 'plum', color: 'purple' }
];

function pick(color) {
  return fruits.filter(f => f.color == color);
}
```

## 3、使用 Array.includes 简化逻辑判断

编码时遇到多个判断条件时，本能的写下下面的代码（其实也是最能表达业务逻辑的面向过程编码）。

```
function judge(fruit) {
  if (fruit === 'apple' || fruit === 'strawberry' || fruit === 'cherry' || fruit === 'cranberries' ) {
    console.log('red');
  }
}
```

但是当 type 未来到 10 种甚至更多时， 我们只能继续添加 || 来维护代码么？

```
// 将判断条件抽取成一个数组
const redFruits = ['apple', 'strawberry', 'cherry', 'cranberries'];
function judge(type) {
  if (redFruits.includes(fruit)) {
    console.log('red');
  }
}
```

## 4、使用 Array.every 优化逻辑判断

判断数组中是否所有项都满足某条件

```
const fruits = [
  { name: 'apple', color: 'red' },
  { name: 'banana', color: 'yellow' },
  { name: 'grape', color: 'purple' }
];

function match() {
  let isAllRed = true;

  // 判断条件：所有的水果都必须是红色
  for (let f of fruits) {
    if (!isAllRed) break;
    isAllRed = (f.color === 'red');
  }

  console.log(isAllRed); // false
}
```

可调整成如下：

```
const fruits = [
  { name: 'apple', color: 'red' },
  { name: 'banana', color: 'yellow' },
  { name: 'grape', color: 'purple' }
];

function match() {
  // 条件：所有水果都必须是红色
  const isAllRed = fruits.every(f => f.color == 'red');

  console.log(isAllRed); // false
}
```

## 5、使用 Array.some 优化逻辑判断

判断数组中是否有某一项满足条件

如果想知道是否有红色水果，可以直接使用 Array.some 方法：

```
const fruits = [
    { name: 'apple', color: 'red' },
    { name: 'banana', color: 'yellow' },
    { name: 'grape', color: 'purple' }
  ];

// 条件：是否有红色水果
const isAnyRed = fruits.some(f => f.color == 'red');
```

还有许多其他数组新特性，比如 Array.find、Array.slice、Array.findIndex、Array.reduce、Array.splice 等，在实际场景中可以根据需要选择使用。

## 6、策略模式优化分支逻辑处理

策略模式：定义一系列的算法，把它们一个个封装起来， 并且使它们可相互替换。

使用场景：策略模式属于对象行为模式，当遇到具有相同行为接口、行为内部不同逻辑实现的实例对象时，可以采用策略模式；或者是一组对象可以根据需要动态的选择几种行为中的某一种时，也可以采用策略模式；这里以第二种情况作为示例：

```
const TYPE = {
  JUICE:'juice',
  SALAD:'salad',
  JAM:'jam'
}
function enjoy({type = TYPE.JUICE,fruits}){
  if(!fruits || !fruits.length) {
    console.log('请先采购水果！');
    return;
 }
  if(type === TYPE.JUICE) {
    console.log('榨果汁中...');
    return '果汁';
  }
  if(type === TYPE.SALAD) {
    console.log('做沙拉中...');
    return '拉沙';
  }
  if(type === TYPE.JAM) {
    console.log('做果酱中...');
    return '果酱';
  }
  return;
}

enjoy({type:'juice',fruits});
```

使用思路：定义策略对象封装不同行为、提供策略选择接口，在不同的规则时调用相应的行为。

```
const TYPE = {
  JUICE:'juice',
  SALAD:'salad',
  JAM:'jam'
}

const strategies = {
  [TYPE.JUICE]: function(fruits){
    console.log('榨果汁中...');
    return '果汁';
  },
  [TYPE.SALAD]:function(fruits){
    console.log('做沙拉中...');
    return '沙拉';
  },
  [TYPE.JAM]:function(fruits){
    console.log('做果酱中...');
    return '果酱';
  },
}

function enjoy({type = TYPE.JUICE,fruits}) {
  if(!type) {
    console.log('请直接享用！');
    return;
 }
  if(!fruits || !fruits.length) {
    console.log('请先采购水果！');
    return;
 }
   return strategies[type](fruits);
}

enjoy({type:'juice',fruits});
```
