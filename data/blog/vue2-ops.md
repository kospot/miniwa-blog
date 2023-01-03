---
layout: PostLayout
title: 'Vue常用技巧推荐'
date: 2021-09-21 15:31:28
tags: ['设计原理']
summary: Vue2常用技巧。
---

1、HookEvent，了解一下

Vue 中提供的一类与生命周期相关的事件，这些事件的触发与生命周期函数调用存在关联。

Vue2.x 提供了一些生命周期函数，用于提供开发者对于特殊逻辑点的逻辑处理。实际上分为 2 个部分：

- 生命周期函数调用
- HookEvent

HookEvent 是 Vue 定义的与生命周期相关的事件类型，其具体形式是：当实例注册了 hook:开头的事件后，会在生命周期钩子函数调用时触发对应的 hook 事件，例如 hook:created、hook:mounted 等

例子：

```
<script>
  export default {
    mounted() {
      const timer = setInterval(() => { ... }, 1000);
      this.$once('hook:beforeDestroy', () => clearInterval(timer);)
    }
  };
</script>

<v-chart
    @hook:mounted="loading = false"
    @hook:beforeUpdated="loading = true"
    @hook:updated="loading = false"
    :data="data"
/>
```

2、vue 中的$props、$attrs 和$listeners(可用来二次封装组件)

- $props：将当前组件接收到的 props 对象传递给子组件
- $attrs 将原生属性直接传递给子组件
- $listeners：包含了父作用域中的 (不含 .native修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件

```
<input v-bind="$props"  v-bind="$attrs" v-on="$listeners">
```

3、.sync 语法糖

sync 就是为了实现 prop 进行“双向绑定”仅此而已（父对子，子对父，来回传）

当你有需要在子组件修改父组件值的时候这个方法很好用，它的实现机制和 v-model 是一样的。

```
<comp :foo.sync="bar" />

// 等价于

<child :bar="foo" @update:bar="e => foo = e">

this.$emit('update:bar', 2)
```

4、immediate 立即执行

当需要 watch 属性变化，又需要第一次时先跑一次时，有时候会写成：

```
{
  watch: {
    cityName: {
      handler(newName, oldName) {
        this.changeCity()
      },
      immediate: true
    }
  }
}
```
