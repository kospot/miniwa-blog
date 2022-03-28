---
layout: PostLayout
title: 'javascript模板'
date: 2016-06-08 19:23:19
tags: ['基础知识']
---

最早使用的 js 模板是这样子的

```
String.prototype.template = function(e, t) {
  return this.replace(t || /\${([^{}]*)}/g, function(t, r) {
      return e[r] !== undefined && e[r] !== null  && e[r].toString() || ""
    }
  )
}
```

主要是通过正则来匹配，替换数据，不足之处是不能嵌入 js 的语句，对于一些需要遍历输出的就略显蛋疼了！想起 underscore 的 template 和 ejs 的模板，于是去看了一下它们的实现，主要原理还是：把不需要 js 的当作字符串，把需要 js 执行的直接用 js 执行，通过动态创建函数，执行模板。具体实现如下：

```
<script type="text/template" id="tplStr">
  <ul>
       <% for(var i=0; i <users.length; i++) { %>
	    <li><a href="<%=users[i].url%>"><%=users[i].name%></a></li>
	<% } %>
   </ul>
</script>
function template(tplStr){
   var result = "var _ary =[]; with(data){_ary.push('" + tplStr
	.replace(/[\r|\s|\t]/ig, ' ')
	.replace(/<%=(.*?)%>/g, "');_ary.push($1);_ary.push('")
	.replace(/<%/g, "');")
	.replace(/%>/g, ";_ary.push('")
	+ "');}return _ary.join('')";

   var fun = new Function("data", result);
        return {
		  render: function(data){
			console.log("by function: ", fun.apply(data, arguments));
		   }
		}
	}
```

```
步骤如下：

1. 前面加上 var \_ary =[]; with(data){\_ary.push('

2. <%=users[i].url%> 替换成');\_ary.push(users[i].url);\_ary.push('

3. <% 替换成 ');

4. %> 替换成 ;\_ary.push('

5. 尾部加上');}return \_ary.join('')

```

这里需要用 with 来暂时改变作用域链，以避免数据对象未知引起的错误，通过 with 可以忽略顶级的数据变量。最后通过 apply 来执行函数，可以使 this 指向当前的数据。

总的来说，难点在于如何把不变的当成字符串，需要就是执行的，让其直接执行。
