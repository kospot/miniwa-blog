---
layout: PostLayout
title: 'Vue3新特性学习'
date: 2021-07-12 20:13:32
tags: ['设计原理']
---

目的：介绍 vue3 的新特性，以及项目开发过程中的差异

## 一、Vue3 新特性

- Teleport
- 触发组件选项
- 单文件组件增强（mutiple node、css var、setup）
- 组合式 API

### 1.1Teleport

作用：把模板传送到目标节点渲染

https://v3.cn.vuejs.org/api/built-in-components.html#teleport

```
<teleport to="#popup" :disabled="displayVideoInline">
  <video src="./my-movie.mp4">
</teleport>
```

### 1.2 触发组件选项

调整：事件可定义检验函数

https://v3.cn.vuejs.org/guide/component-custom-events.html#%E4%BA%8B%E4%BB%B6%E5%90%8D

```
app.component('custom-form', {
  emits: {
    // 没有验证
    click: null,

    // 验证submit 事件
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  },
  methods: {
    submitForm() {
      this.$emit('submit', { email, password })
    }
  }
})
```

### 1.3 单文件组件增强

支持了多根节点的组件，也就是片段

```
<teleport to="#popup" :disabled="displayVideoInline">
  <video src="./my-movie.mp4">
</teleport>
```

setup 启动函数

```
<template>
  <button @click="inc">{{ count }}</button>
</template>

<script setup>
  import { ref } from 'vue'

  export const count = ref(0)
  export const inc = () => count.value++
</script>
```

css 变量

```
<template>
  <div class="text">hello</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style vars="{ color }">
.text {
  color: var(--color);
}
</style>
```

### 1.4 组合式 API

组合式 API 不同于 OptionApi，重点在关注点分离，组合式 API 的基础主要是基于以下几点：

#### 1.4.1setup 提供切入点

setup 执行时，组件实例尚未创建，因此函数中没有 this 指向，除了 props 之外，不能访问其它的成员变量和方法。

#### 1.4.2 相对独立的响应式变量

```
import { ref } from 'vue'

const counter = ref(0)
```

#### 1.4.3 支持完备的 optionAPI 功能

watch、生命周期、computed

Vue3 不兼容变更：https://v3.cn.vuejs.org/guide/migration/introduction.html#%E9%9D%9E%E5%85%BC%E5%AE%B9%E7%9A%84%E5%8F%98%E6%9B%B4

## 二、项目应用

基于功能的关注点分离

先将复杂问题做合理的分解,再分别仔细研究问题的不同侧面(关注点)，最后综合各方面的结果，合成整体的解决方案。

分离关注点把解决特定领域问题的代码从业务逻辑中独立出来，业务逻辑的代码中不再含有针对特定领域问题代码的调用，业务逻辑同特定领域问题的关系通过侧面来封装、维护，这样原本分散在在整个应用程序中的变动就可以很好的管理起来。

```
<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { useDeviceCreate } from "./create";
import { useDeviceQuery } from "./query";
import { useDeviceDelete } from "./delete";
import { useUnbind } from "./unbind";
import { useBind } from "./bind";
import { useDeviceEdit } from "./edit";
import { useState } from "./state";
import { useAssign } from "./assign";

export default defineComponent({
  setup() {
    const queryObj = useDeviceQuery();
    const { query, devices } = queryObj;
    const reload = query;
    return {
      ...toRefs(useDeviceCreate(reload)),
      ...toRefs(queryObj),
      ...toRefs(useDeviceDelete(reload)),
      ...toRefs(useUnbind(reload)),
      ...toRefs(useBind(reload)),
      ...toRefs(useDeviceEdit(reload)),
      ...toRefs(useState(devices)),
      ...toRefs(useAssign()),
    };
  },
});
</script>
```

1、hook 支持互相引用和组合

2、减少组件的使用

3、Mixins 的缺点：

隐式依赖

命名冲突

滚雪球

Mixins 被认为是有害的：https://zh-hans.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html

mixins 的缺点是 Composition API 背后的主要动因之一

Composition API 的关键思想是，我们将组件的功能（如状态、方法、计算属性等）定义为对象属性，而不是将其定义为从新的设置函数中返回的 JavaScript 变量。

实际上是在 setup 函数里使用 hook 组合功能
