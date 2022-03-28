---
layout: PostLayout
title: '循环对比：For-in和For-of'
date: 2019-01-12 20:13:32
tags: ['js原理']
---

# 问题

For-in 循环常用于处理对象的遍历，For-of 循环常用于处理列表的遍历。这是我们对两者使用上的大体印象。
那除此之外，他们还有没有其它细节可探究的呢？

要看区别，先看一下各自的定义：

## for-in

> for...in 语句以任意顺序遍历一个对象的除 Symbol 以外的可枚举属性，包括继承的可枚举属性。

重点特征：

- 非 Symbol，延伸一下，Symbol 在 ES6 中引入，是为了防止属性名冲突避免被覆盖，能保证属性值独一无二
- 可枚举属性，指可以被遍历的属性
- 包括了原型链上的可枚举属性

关于可枚举，还跟以下几个 API 有关 Object.keys JSON.stringify Object.assign。

判断是否可枚举，propertyIsEnumerable，仅适用于自身属性，不适合原型链上的。

可枚举是为了让部分属性规避循环的操作，例如：toString length

## for-of

> for...of 语句在可迭代对象（包括  Array，Map，Set，String，TypedArray，arguments  对象等等）上创建一个迭代循环，调用自定义迭代钩子，并为每个不同属性的值执行语句

重点特征：

- 可迭代对象：实现了 Symbol.iterator 接口的对象

## 对比

| 对比项   | for-in                                              | for-of                         |
| -------- | --------------------------------------------------- | ------------------------------ |
| 目标类型 | for-in 的 key 是在循环开始前就决定，后续不会变化    | 动态决定的                     |
| 数据     | 任意顺序迭代对象的可枚举属性                        | 遍历可迭代对象定义要迭代的数据 |
| 效率     | 数据量大时效率较低，据说会对属性做校验，hash 之类的 | 与其它循环正常                 |

```
//for-in 是在loop前就决定
var arr = [10,20,30]
for(let k in arr) {
    if(k==='2'){
        arr.push(999)      //push的值不会被遍历到
    };
    console.log(k);
}
0
1
2
> arr
[ 10, 20, 30, 999 ]
>
```

```
//for-of
var arr = [10,20,30]
var c = 0
for(let each of arr) {
    console.log(c,each,arr.length)
    if(c===1) {
        arr.push(999)
    } else {
    }
    c = c +1;
}

0 10 3
1 20 3
2 30 4    ==========>
3 999 4   ==========>动态添加 会被遍历到
4        //
> arr
[ 10, 20, 30, 999 ]
```

```
Object.prototype.objCustom = function() {};
Array.prototype.arrCustom = function() {};

let iterable = [3, 5, 7];
iterable.foo = 'hello';

for (let i in iterable) {
  console.log(i); // logs 0, 1, 2, "foo", "arrCustom", "objCustom"
}

for (let i in iterable) {
  if (iterable.hasOwnProperty(i)) {
    console.log(i); // logs 0, 1, 2, "foo"
  }
}

for (let i of iterable) {
  console.log(i); // logs 3, 5, 7
}
```
