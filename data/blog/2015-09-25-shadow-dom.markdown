---
layout: post
title:  "影子(shadow)DOM"
date:   2015-09-20 15:23:12
tags: ['基础知识']
---

shadow dom是一种把类的概念迁移到html上的实践，主要是解决一个文档中可能需要大量交互的多个dom树的建立以及其各自的功能边界问题。目前只有少量浏览器支持，下面一起来了解webkit中的shadow dom。

在代码编写过程中，我们常常会定义一个组件，把只关乎自身的东西内聚。例如：react的自定义组件、或者其他MV*框架中的组件。但这其实只是逻辑上的独立，再HTML中，它并没有独立开来，所有的节点也都是交由最顶级的HTML管理。对DOM树的遍历或者样式的选择，都会当来潜在的弊端。如果我们可以实现DOM树的封装和独立，使不同的DOM树之间可以相互独立，又可以独自渲染；那势必会使得组件化更加彻底。W3C工作组于是提出了影子DOM的概念，其使得一些DOM在特定范围内可见，而在网页的DOM树中不可见，但是渲染的结果中却包含了该节点。

HTML5新支持的特性，例如视频、音频等也都是影子DOM的思想，或许有人会疑惑，既然它不可见，那在事件传播中如何处理？W3C规定，其目标会变为包含该影子DOM的节点对象。那如何创建一个影子DOM呢？如下所示：

```
<div id="div"></div>
<script>
var div = document.getElementById("div"),
    root = div.webkitCreateShadowRoot(),
    shdowImg = document.createElement("img"),
    txtP = document.createElement("p");
    
shdowImg.src = "http://miniwa.com.cn/img/favicon.png";
txtp.innerHTML = "this is a test";

root.appendChild(shdowImg);
root.appendChild(txtp);
    
</script>
```

