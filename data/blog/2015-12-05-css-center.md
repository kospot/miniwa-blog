---
layout: PostLayout
title: 'css居中显示'
date: 2016-04-10 11:50:12
tags: ['CSS样式']
---

在页面中居中可以分为水平居中和垂直居中。对水平居中常用的是 margin: 0 auto，浏览器会自动计算左右的 margin，那同时要实现垂直居中呢？可以如下：

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

这种做法可以兼容 ie8-ie10，但是必须要有宽高。

除此之外，也可以通过 left 和 top 设置为 50%，再加上 margin-left 和 margin-right 分别设为负的宽高的 50%
