---
layout: PostLayout
title: 'reactjs总结'
date: 2016-04-10 11:50:12
tags: ['基础知识']
---

在项目中使用了 reactjs 框架，其对组件更加彻底，编写起来也更加方便。对外暴露的接口、api 也不多。在这里想总结一下：

ReactElement：拥有四个属性 type，props，key，ref，不携带方法，原型上什么都没有

ReactNode：可以是 ReactElement、string、number、ReactNode 实例数组（ReactFragment）

ReactComponent：组件，一个简单的 js 类，构造函数

- React.unmountComponentAtNode 只可以移除有 React.render 方法渲染的组件，而对其内部的子组件无效，会返回 false
- React.componentWillReceiveProps 接口的 this.props 是旧的 props，新的 props 需要在形参里获取；初次渲染时，不会触发
- this.forceUpdate 在界面的数据不只是包含 state 还有别的时候调用
- 特殊的 DOM 属性 key，在差异检查的时候会确保组件是否保留，在 diff 的时候，如果前后 key 一样，则改组件还保留在 dom 中只会更新数据，不一样的时候，才会移除重新生成
- this.props.children 返回的不是自己的子组件，而是父组件传递给你的子组件
- JSX 并不会返回组件的引用，而是一个 ReactElement，一个描述组件结构的对象，通过 Render.render 函数返回的才是组件的实例
- JSX 只是函数调用和对象创建的语法糖，只能用表达式不能使用 if else for 等
- 同一个组件调用 React.render 获取到的实例是同一个对象，不会生成多个；如需重新生成一个新的饿，需先移除旧的
