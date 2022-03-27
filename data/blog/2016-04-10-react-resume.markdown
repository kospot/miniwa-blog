---
layout: post
title:  "reactjs总结"
date:   2016-04-10 11:50:12
tags: ['基础知识']
---

在项目中使用了reactjs框架，其对组件更加彻底，编写起来也更加方便。对外暴露的接口、api也不多。在这里想总结一下：

ReactElement：拥有四个属性type，props，key，ref，不携带方法，原型上什么都没有

ReactNode：可以是ReactElement、string、number、ReactNode实例数组（ReactFragment）

ReactComponent：组件，一个简单的js类，构造函数



- React.unmountComponentAtNode只可以移除有React.render方法渲染的组件，而对其内部的子组件无效，会返回false
- React.componentWillReceiveProps接口的this.props是旧的props，新的props需要在形参里获取；初次渲染时，不会触发
- this.forceUpdate在界面的数据不只是包含state还有别的时候调用
- 特殊的DOM属性key，在差异检查的时候会确保组件是否保留，在diff的时候，如果前后key一样，则改组件还保留在dom中只会更新数据，不一样的时候，才会移除重新生成
- this.props.children返回的不是自己的子组件，而是父组件传递给你的子组件
- JSX并不会返回组件的引用，而是一个ReactElement，一个描述组件结构的对象，通过Render.render函数返回的才是组件的实例
- JSX只是函数调用和对象创建的语法糖，只能用表达式不能使用if else for等
- 同一个组件调用React.render获取到的实例是同一个对象，不会生成多个；如需重新生成一个新的饿，需先移除旧的

