---
layout: PostLayout
title: 'Vue.observable原理'
date: 2022-12-25 15:12:28
tags: ['设计原理']
summary: Vue.observable，让一个对象变成响应式数据。Vue 内部会用它来处理 data 函数返回的对象。
---

## 一、Observable 是什么

我们先来看一下其在 Vue 中的定义

> Vue.observable，让一个对象变成响应式数据。Vue 内部会用它来处理 data 函数返回的对象

返回的对象可以直接用于渲染函数和计算属性内，并且会在发生变更时触发相应的更新。也可以作为最小化的跨组件状态存储器。通俗点说是一个用来创建响应式对象的功能。它能够监视一个对象或值的变化，并在变化发生时自动通知相关的订阅者。

```javascript
Vue.observable({ count: 1 })
```

其作用等同于

```javascript
new vue({ count: 1 })
```

在 Vue 2.x 中，被传入的对象会直接被 Vue.observable 变更，它和被返回的对象是同一个对象

在 Vue 3.x 中，则会返回一个可响应的代理，而对源对象直接进行变更仍然是不可响应的

## 二、使用场景

在非父子组件通信时，可以使用通常的 bus 或者使用 vuex，但是实现的功能不是太复杂，而使用上面两个又有点繁琐。这时，observable 就是一个很好的选择

```javascript
// 引入vue
import Vue from 'vue'
// 创建state对象，使用observable让state对象可响应
export let state = Vue.observable({
  counter: 0,
})
// 创建对应的方法
export let mutations = {
  add() {
    state.counter = state.counter + 1
  },
}
```

在.vue 文件中直接使用即可

```vue
<template>
  <div>
    计数：{{ counter }}
    <button @click="add">增加</button>
  </div>
</template>
<script>
import { state, mutations } from '@/store'
export default {
  // 在计算属性中拿到值
  computed: {
    counter() {
      return state.counter
    },
  },
  // 调用mutations里面的方法，更新数据
  methods: {
    add: mutations.add,
  },
}
</script>
```

## 三、原理分析

源码位置：src\core\observer\index.js

```javascript
export function observe(value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  // 判断是否存在__ob__响应式属性
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    // 实例化Observer响应式对象
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```

Observer 类

```javascript
export class Observer {
    value: any;
    dep: Dep;
    vmCount: number; // number of vms that have this object as root $data

    constructor (value: any) {
        this.value = value
        this.dep = new Dep()
        this.vmCount = 0
        def(value, '__ob__', this)
        if (Array.isArray(value)) {
          // 是否支持原型，支持的话，直接把经过拦截处理的方法挂载到原型上，否则就手动增加
          if (hasProto) {
              protoAugment(value, arrayMethods)
          } else {
              copyAugment(value, arrayMethods, arrayKeys)
          }
          // 遍历所有item元素，有一个递归创建Observer的处理
          this.observeArray(value)
        } else {
          // 实例化对象是一个对象，进入walk方法
          this.walk(value)
        }
}
```

walk 函数

```javascript
walk (obj: Object) {
    const keys = Object.keys(obj)
    // 遍历key，通过defineReactive创建响应式对象
    for (let i = 0; i < keys.length; i++) {
        defineReactive(obj, keys[i])
    }
}
```

defineReactive 方法

```javascript
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  // 接下来调用Object.defineProperty()给对象定义响应式属性
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      // 对观察者watchers进行通知,state就成了全局响应式对象
      dep.notify()
    },
  })
}
```

总结：

- observable 是使用 getter/setter 或者是拦截数组方法的形式做切入点增加拦截的
- 对象是否被 observable 可以看是否存在**ob**，大多时候丢失响应式是因为对象不是 observable
- 每个属性都会 new 一个 Dep 对象，在访问 getter 的时候增加依赖，可以被多个 watch 依赖，如果已经依赖过的就不添加了
- 如果对象层级过多，或者数组个数较多，都会导致性能上有一定的损耗
