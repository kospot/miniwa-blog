---
layout: post
title:  "css居中显示"
date:   2016-04-10 11:50:12
tags: ['CSS样式']
---

在页面中居中可以分为水平居中和垂直居中。对水平居中常用的是margin: 0 auto，浏览器会自动计算左右的margin，那同时要实现垂直居中呢？可以如下：
```
.absolute-center {
  margin: auto;
  position: absolute;
  overflow: auto;
  top: 0; left: 0; bottom: 0; right: 0;
  width: 50%;
  height: 50%;
}
```

这种做法可以兼容ie8-ie10，但是必须要有宽高。

除此之外，也可以通过left和top设置为50%，再加上margin-left和margin-right分别设为负的宽高的50%

