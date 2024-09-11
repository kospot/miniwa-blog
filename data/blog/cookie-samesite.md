---
layout: PostLayout
title: 关于Cookie里的SameSite
date: 2024-03-26
tags: ['js原理']
summary: 在确保用户隐私的同时安全地浏览网络是我们的首要任务。在使用Cookie时，重要的是要确保它们安全并按预期目的服务，而不损害用户隐私。一个需要考虑的关键属性是SameSite，它规定了跨站点请求中Cookie的发送方式。
---

在确保用户隐私的同时安全地浏览网络是我们的首要任务。在使用 Cookie 时，重要的是要确保它们安全并按预期目的服务，而不损害用户隐私。

一个需要考虑的关键属性是 SameSite，它规定了跨站点请求中 Cookie 的发送方式。

什么是 Cookie？

Cookie 是网站请求浏览器保存在用户设备上的小数据片段。它们帮助网站记住有关用户的信息，比如他们的偏好或购物车中的内容。

然而，随着对不想要的数据共享和潜在安全风险的担忧日益增加，有必要控制这些 Cookie 何时何地被使用。这就是 SameSite 属性发挥作用的地方，允许开发者根据请求来源指定何时发送 Cookie。这个属性可以设置为 Strict（严格）、Lax（宽松）或 None（无限制），以适应不同的需求。

```js
app.use(function (req, res, next) {
  res.cookie('name', 'value', { sameSite: 'strict' })
  next()
})
```

**Strict（严格）**

当 Cookie 的 SameSite 属性设置为 Strict 时，意味着只有在请求来自同一站点时，Cookie 才会被发送。

![image_56.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbf8001b53e04f61b66a3543df3ceae0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2396&h=724&s=43523&e=png&a=1&b=1f1f1f)

使用场景：

- 非常适合高安全应用，如在线银行业务。
- 防止任何跨站点使用，确保数据保密性达到高水平。

**Lax（宽松）**

Lax 设置在可用性和安全性之间取得了平衡。使用此设置时，Cookie：

- 不会在跨站点子资源请求中发送，例如图片、样式表和脚本。
- 会在顶级导航中发送，比如当用户点击链接进入站点时。

![image_34.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea94ab2592114e959cc0a25dff9bc6e7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2342&h=620&s=41562&e=png&a=1&b=121318)

使用场景：

- 适用于在其他网站上嵌入的内容，其中一定程度的跨站点交互是可以接受的。
- 通过在用户从外部链接到达时保持会话，增强浏览体验。

如果未设置 SameSite 属性，浏览器将把 Cookie 视为设置为 Lax。

**None（无限制）**

为了让 Cookie 随每个请求一起发送，包括跨站点请求，SameSite 属性应该设置为 None。

然而，当使用 SameSite=None 时，Cookie 还必须标记为 Secure（安全），这意味着它只能通过 HTTPS 传输。如果您尝试在 HTTPS 站点上设置 SameSite=None 而没有 Secure 属性的 Cookie，浏览器可能会在控制台显示警告，Cookie 将无法按预期工作！

使用场景：

- 通常由广告平台使用的跨站点跟踪。
- 需要在多个域之间进行身份验证的单点登录系统。
- 旨在直接供外部网站使用的功能性。

选择哪种配置取决于您的具体用例。

- 想要顶级安全？选择 Strict。这保证了 Cookie 仅在发送到其原始站点，最小化了 CSRF 攻击或意外泄露的风险。
- 想要用户友好性和安全性的混合？选择 Lax。这确保了更流畅的用户体验，同时仍然提供对潜在威胁的保护。
- 需要跨站点共享 Cookie 数据？选择 None。只要记得也要将其设置为 Secure。

**结论**

SameSite 属性为 Web 开发者提供了对 Cookie 的细粒度控制，增强了网络安全并确保了更好的用户体验。通过理解 Strict、Lax 和 None 的细微差别，您可以做出更明智的决策，既让用户满意又安全。
