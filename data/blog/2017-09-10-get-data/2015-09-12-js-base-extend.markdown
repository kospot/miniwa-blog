---
layout: post
title:  "javascript的继承"
date:   2015-09-12 19:23:19
tags: ['js原理']
---

### 继承的基础

Brendan Eich在设计js语言时，面向对象编程正值兴盛之期，而定位为简易脚本语言的js需不需要兼顾面向对象的功能呢？Brendan Eich的答案是肯定的。但是js里面，函数、Object、Array等一切都是对象，也没有Class的类概念。那得用什么机制让对象联系起来呢？Brendan Eich想到了构造函数，通过new直接接一个构造函数来生成一个实例，也就是把类的概念和function糅合在一起，但是简单的构造函数与类的区别是无法共享属性和方法，function内部的都是实例new出来的对象特有的属性或方法。考虑到这一点，Brendan Eich给每个函数添加了prototype的属性，作为new出来的实例的公共属性或者方法。于是乎，在new出来的实例里都会有一个引用指向其构造函数的prototype对象。

```
var Man = function(name){
    this.name = name;
}
Man.prototype.say = function(){
    console.log("my name is " + this.name);
}
var manA = new Man("A");
var manB = new Man("B");
```

这里的say方法在内存中只有一份，manA和manB都引用了该方法。实际上，在new的时候执行了以下几步：

1. 创建一个新的空对象，这个对象的类型是object；
2. 设置对象的构造函数（prototype.construtor所指向的构造函数），以及一些基础属性；
3. 执行构造函数，当this关键字被提及的时候，使用新创建的对象的属性；
4. 返回新创建的对象；

由于每个实例都保存了构造函数的prototype，而且prototype里有每个实例的公共方法或者属性，那如果构造函数里自定义了一些属性与prototype里的重名了（js里函数名是唯一的标识，形参不作为函数的标识），那怎么办？js里是以实例的属性优先，找不到的时候再去prototype里面查找，并会沿着prototype的链条查找；

### 继承的方式

继承是为了达到子承父业的效果，可以对一个对象拓展，得到一个功能更加强大的新对象。那js里可以如何实现这种效果呢？

**方式一** 

在执行构造函数的时候，直接绑定子与父的关系，即通过call或者apply在子类的构造函数里，用子类的上下文执行以下父类的方法，从而把父类的属性绑定到子类，实现继承。
```
var Man = function(name){
    this.name = name;
}
var ChildMan = function(name){
    Man.apply(this, arguments);
    this.age = 12;
}
var manA = new ChildMan("A");
```

这里的不足之处是：子类的实例里，每一个都拥有了一份独立的属性，并没有共享，只是形式上的继承，同源不同宗。

**方式二** 

利用原型链的上溯特性实现继承，把父类的prototype赋值给子类的prototype。这里就可以灵活实现了
- 如果不介意修改父类会影响子类，可以直接把ChildMan.prototype = Man.prototype；
- 否则需要用把父对象的实例赋值给子类的prototype，即ChildMan.prototype = new Man()；
- 再则，不想执行父类构造函数，可以先利用一个空的构造函数来实例化一个Man，如下
```
var F = function(){};
F.prototype = Man.prototype;
ChildMan.prototype = new F();
```

方式很多，原理都是拿到父类的prototype，但是上面的方法都需要注意子类的构造函数，修改了子类的prototype之后，其构造函数也会跟着改变，这时候还需要改回来，加上ChildMan.prototype.constructor = ChildMan；为什么一定要加上？因为当调用instanceOf的时候，会通过对象的构造函数来区分。


> 继承的方式各种各样，没有最好的，只有最适合的。如果是一个单例模式的对象，根本就不用考虑是否会影响到父类；但是如果对象会有很多实例的，则完全不同。所以，选择最合适的，才是最好的。
