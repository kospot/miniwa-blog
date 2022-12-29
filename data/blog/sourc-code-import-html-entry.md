---
layout: PostLayout
title: '源码解读：import-html-entry'
date: 2022-03-12 20:13:32
draft: false
tags: ['源码']
summary: import-html-entry是qiankun框架主要的依赖包之一，负责从html页面里提取微前端所需的入口、css、html资源。本文主要走查一下它的代码，介绍提取的主要流程和组件内部使用的一些技巧。最后通过这个库的一些处理过程，我们也可以更好的了解微前端的特性。
---

# import-html-entry 介绍

这个包的由来，需要追溯一下微前端的入口配置功能。

一个前端站点通常涉及的内容有 js、css、html，当然后两者都可以转化成 js，但一般都不这么做。

所以我们要描述一个站点的话，只提供这几个即可：

```
{
    jsfiles: [],
    cssfiles: [],
    htmlContent: ''
}
```

在微前端的场景下，那子应用就是多个站点的资源集合，无论是基座模式、去中心模式还是自组织模式，都离不开对站点资源的描述。

而 import-html-entry 就是为了实现对站点资源描述对象的提取。为了适配 qiankun，它还提供了对入口导出的功能。

## 组件使用

组件的名字还是很生动的，导入 html 获取入口。直观理解是接受一个站点的入口地址作为入参，自动拉取 html 的 mainfest 和资源（css|js）,从入口的脚本里获取导出数据。

对外暴露的 API 主要是三个：

- importHTML
- importEntry
- execScripts

其中 importEntry 是 importHTML 的一个包装，如果传的是 url 则跑 importHTML，如果是对象则直接使用；

execScripts 是在沙箱里执行脚本，并获取入口函数的导出。

最核心的还是 importHTML、execScripts。

```
import importHTML from 'import-html-entry';

const opts = {
    fetch: {
        fn: (...args) => window.fetch(...args),
        autoDecodeResponse: true,
    },
    getPublicPath: (entry) => `${entry}/newPublicPath/`,
    getTemplate: (tpl) => tpl.replace(/SOME_RULES/, '\n//Replaced\n'),
}

importHTML('./subApp/index.html')
    .then(res => {
        res.execScripts().then(exports => {
            console.log(exports);
        })
});
```

## 组件分析

核心解决的问题是：

- 解析 html：从 html 里面解析获取到相关的 html、css 和 js
- 执行脚本：执行里面的脚本，获取到入口里的导出对象

### 解析 html

解析 html 里，需要注意的情况有

- 提取内联脚本和样式
- 提取外部样式和外部脚本
- 提取入口脚本，因为后面需要用到入口脚本的导出对象

区分是否内联脚本或者样式，里面比较暴力的直接做了符号内的判断，当然这个的前提是它没有外部脚本/样式的前提下

```
export function getInlineCode(match) {
	const start = match.indexOf('>') + 1;
	const end = match.lastIndexOf('<');
	return match.substring(start, end);
}
```

用到的一些正则还是挺复杂的，不知道是手写的还是有工具

```
const ALL_SCRIPT_REGEX = /(<script[\s\S]*?>)[\s\S]*?<\/script>/gi;
const SCRIPT_TAG_REGEX = /<(script)\s+((?!type=('|")text\/ng-template\3).)*?>.*?<\/\1>/is;
const SCRIPT_SRC_REGEX = /.*\ssrc=('|")?([^>'"\s]+)/;
const SCRIPT_TYPE_REGEX = /.*\stype=('|")?([^>'"\s]+)/;
const SCRIPT_ENTRY_REGEX = /.*\sentry\s*.*/;
const SCRIPT_ASYNC_REGEX = /.*\sasync\s*.*/;
const SCRIPT_NO_MODULE_REGEX = /.*\snomodule\s*.*/;
const SCRIPT_MODULE_REGEX = /.*\stype=('|")?module('|")?\s*.*/;
const LINK_TAG_REGEX = /<(link)\s+.*?>/isg;
const LINK_PRELOAD_OR_PREFETCH_REGEX = /\srel=('|")?(preload|prefetch)\1/;
const LINK_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;
const LINK_AS_FONT = /.*\sas=('|")?font\1.*/;
const STYLE_TAG_REGEX = /<style[^>]*>[\s\S]*?<\/style>/gi;
const STYLE_TYPE_REGEX = /\s+rel=('|")?stylesheet\1.*/;
const STYLE_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;
const HTML_COMMENT_REGEX = /<!--([\s\S]*?)-->/g;
const LINK_IGNORE_REGEX = /<link(\s+|\s+.+\s+)ignore(\s*|\s+.*|=.*)>/is;
const STYLE_IGNORE_REGEX = /<style(\s+|\s+.+\s+)ignore(\s*|\s+.*|=.*)>/is;
const SCRIPT_IGNORE_REGEX = /<script(\s+|\s+.+\s+)ignore(\s*|\s+.*|=.*)>/is;
```

里面除了一些 script、style 之外，也对特定的一些脚本样式做了标识，如 entry、ignore、ng-template；

正则只是辅助提取，还会有代码做二次确认，例如对于前端使用的一些特定 script 模板，如 type="html/text"之类的，是在代码里去排除的。

经过这一番操作，就拿到了这样一个导出结果。

```
let tplResult = {
    template,
    scripts,
    styles,
    // set the last script as entry if have not set
    entry: entry || scripts[scripts.length - 1],
}
```

从上面可见，默认的 qiankun 入口是最后一个 js 文件。

### 执行脚本

这里需要解决的问题主要是两个：

- script 执行，在 js 沙箱环境中
- 入口函数提取

#### script 执行

script 执行，这个不会是难点，常规的方法就有 eval、new Function 之类的。

作者是封装了一个`evalCode`方法，通过 eval 执行一个临时的全局变量，然后把临时变量给删除掉。
这一步挺重要的，code 通常比较大，如果常驻内存有可能会造成内存泄漏。

```
export function evalCode(scriptSrc, code) {
	const key = scriptSrc;
	if (!evalCache[key]) {
		const functionWrappedCode = `window.__TEMP_EVAL_FUNC__ = function(){${code}}`;
		(0, eval)(functionWrappedCode);
		evalCache[key] = window.__TEMP_EVAL_FUNC__;
		delete window.__TEMP_EVAL_FUNC__;
	}
	const evalFunc = evalCache[key];
	evalFunc.call(window);
}
```

麻烦的可能会是脚本需要执行在子应用的 js 沙箱里，或者是开发、调试不方便之类的。作者是通过增加 souceUrl 以及使用 with 来解决。

这里也提醒了我们，如果想在子应用里获取到全局的 window，可以使用`(0, eval)('window')`，虽然不建议，但终归在紧急且合理的情况下开了一道门。

```
function getExecutableScript(scriptSrc, scriptText, proxy, strictGlobal) {
	const sourceUrl = isInlineCode(scriptSrc) ? '' : `//# sourceURL=${scriptSrc}\n`;

	// 通过这种方式获取全局 window，因为 script 也是在全局作用域下运行的，所以我们通过 window.proxy 绑定时也必须确保绑定到全局 window 上
	// 否则在嵌套场景下， window.proxy 设置的是内层应用的 window，而代码其实是在全局作用域运行的，会导致闭包里的 window.proxy 取的是最外层的微应用的 proxy
	const globalWindow = (0, eval)('window');
	globalWindow.proxy = proxy;
	// TODO 通过 strictGlobal 方式切换 with 闭包，待 with 方式坑趟平后再合并
	return strictGlobal
		? `;(function(window, self, globalThis){with(window){;${scriptText}\n${sourceUrl}}}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);`
		: `;(function(window, self, globalThis){;${scriptText}\n${sourceUrl}}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);`;
}
```

#### 入口函数提取

在子应用中，会导出一个生命周期给主应用，所以需要在这里去拿到子应用导出的入口函数。

先看代码，以下是截取了部分代码

```
if (scriptSrc === entry) {
    noteGlobalProps(strictGlobal ? proxy : window);

    try {
        // bind window.proxy to change `this` reference in script
        geval(scriptSrc, inlineScript);
        const exports = proxy[getGlobalProp(strictGlobal ? proxy : window)] || {};
        resolve(exports);
    } catch (e) {
        // entry error must be thrown to make the promise settled
        console.error(`[import-html-entry]: error occurs while executing entry script ${scriptSrc}`);
        throw e;
    }
}
```

关键点在于 noteGlobalProps 和 getGlobalProp，相当于在执行前打个标识，执行后就能拿到导出。看着挺神奇的，也是我觉得这个库最投机取巧的一个地方了。这个也是为什么要求一定要打包成 umd 的原因。

大致的原理就是，最后挂载到 window 上的对象，会排到最后一个位置。

先看代码，noteGlobalProps 对全局对象做打了两个标识，为什么是打两个，看注释是为了兼容 safari。

```
export function noteGlobalProps(global) {
	// alternatively Object.keys(global).pop()
	// but this may be faster (pending benchmarks)
	firstGlobalProp = secondGlobalProp = undefined;

	for (let p in global) {
		if (shouldSkipProperty(global, p))
			continue;
		if (!firstGlobalProp)
			firstGlobalProp = p;
		else if (!secondGlobalProp)
			secondGlobalProp = p;
		lastGlobalProp = p;
	}

	return lastGlobalProp;
}
```

getGlobalProp 则是去取最后一个属性，里面还有一些特殊情况需要判断处理。

也可以简单验证一下：

```
window.mysize=12345
//12345
Object.keys(window).at(-1)
'mysize'
```

至此，差不多整个过程就完结了。这里最后再补充一个图：

![](/static/images/html-import-entry.png)

## 总结

从这个库里面了解到的主要有以下几点：

- qiankun 支持 ignore 忽略一些第三方的脚本，entry 支持标识或者让它默认取最后一个；
- qiankun 要求应用需要打包成 umd，是为了能用标记法提取导出对象，所以对于变量叫什么名字其它并不是那么关心
- 要打破 proxy 的封锁获取原生 window，可以用`(0, eval)('window')`
- API 里面还预留了一些可选的 hook，通过 hook 提供定制是一个不错的设计
- 入口是通过正则匹配来解析 html 的，如果我们的 html 过大，会导致解析特别慢，影响子应用加载。但听过这个文件来提取配置，确实是一个不错的想法。
- API 的设计简洁、形象，还把 css、js 的链接也暴露出去了，方便触发预加载
- 资源加载使用的是 fetch，所以要求静态资源要支持 cors
