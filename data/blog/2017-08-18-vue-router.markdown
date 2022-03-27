---
layout: post
title:  "vue-router的使用"
date:   2017-08-18 20:23:19
tags: ['基础知识']
---

vue-router作为一个官方的路由组件，是应用开发的必备神器。比较突出的有以下几点：
- 提供了视图渲染的详尽钩子、和路由的携带信息meta
- 可以方便地切换history模式和hash模式
- 在视图组件里可以方便地使用路由信息和路由对象
- 支持路由嵌套，可以拿到路由的匹配路径方便显示激活菜单
- 组件化的调用方式route-link和route-view，并自动关联
- 提供了常用方法的封装如：back, go, redirect

如此优秀的组件，下面我们来看看怎么使用。第一步，肯定是初始化了：

```
// 注入组件
Vue.use(Router)
export default new Router({
    mode: 'history',  // history模式，看着像活生生的后端渲染
    routes: [
        {
            path: '/view/index',    //路径
            name: 'index',  // 别名，通过别名跳转可以避免url变更需要修改多处地方
            component: Index    // 对应的视图组件
        }
    ]
})
```

想成为一个优秀的组件，这样人性化的初始方式是必不可少的了，而它更强大的地方在于，可以支持redirect配置，如果你想把一个路由重定向到另外一个地方，可以这样子

```
export default new Router({
    mode: 'history',  // history模式，看着像活生生的后端渲染
    routes: [
        {
            path: '/view/index',
            name: 'index',
            redirect: {name: 'xxxxx'}
        }
    ]
})
```

路由的嵌套如下所示：

```
export default new Router({
    mode: 'history',  // history模式，看着像活生生的后端渲染
    routes: [
        {
            path: '/view/index',
            name: 'index',
            component： Index,
            children: [
                path: 'test',
                component： Test
            ]
        }
    ]
})
```

路由嵌套需要注意的地方有两个：
- 上面栗子中children的path实际为 /view/index/test，如果children的path以斜杠开头，则表示为绝对路径，不收父的path影响
- 嵌套路由是一个新的视图，不会替换掉父视图；Index里必须包含一个route-view组件，否则不会渲染Test

需要注意的是如果path有相应的route-link，那视图激活的时候也会在该route-link下自动增加active的class，可以利用这个显示激活的菜单。
如果这个不能满足，也可以根据route的matched属性，该属性会记录当前所有已匹配的路由。如上面这个例子的/view/index/test，matched属性会有两个路由信息'/view/index'和'/view/index/test'，
根据这个可以把一级和二级的菜单也激活起来


在视图的component里，可以通过this.$route访问当前路由的数据信息，this.$router访问路由封装的方法。这两个对象可以很方便地操作页面的跳转和获取页面的参数

this.$route常用的参数如下：
- params 记录路径参数
- query 记录search参数
- meta 记录路由自定义的元信息
- name 当前路由的别名
- path 当前路由的路径

this.$router常用方法：
- push 路由跳转，并压入历史的堆栈
- replace 路由替换，不会压入历史堆栈，也就是说back的时候，会忽略掉
- back 返回
- redirect 重定向

上面的push和replace，redirect都可以写到name，params，query等参数



总的来说，vue router是一个用起来十分顺手和顺心的组件。唯一遇到坑的是在微信浏览器里，微信浏览器对history支持不友好，可以切换路由哦，但是不会改变url。其实这也不能怪vue router，它也是有心无力。
