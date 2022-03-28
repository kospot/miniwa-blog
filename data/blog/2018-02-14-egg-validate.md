---
title: egg整合数据校验
date: 2018-02-14 00:05:45
tags: ['实战应用']
images: ['https://cn.bing.com/az/hprichbg/rb/happychildday_ZH-CN9412524114_1920x1080.jpg']
summary: 'eggjs整合数据官方的校验插件'
---

egg 官方的插件 egg-validate 依赖了[parameter](https://github.com/node-modules/parameter/blob/master/README.md)包，其只做了两个处理

```
// egg-validate/app.js
app.validator = new Parameter();

// egg-validate/app/extend/context.js
validate(rules, data) {
	data = data || this.request.body;
	const errors = this.app.validator.validate(rules, data);
	if (errors) {
	  this.throw(422, 'Validation Failed', {
	    code: 'invalid_param',
	    errors,
	  });
	}
}
```

可见其做了两件事：

- 1、启动时创建了一个实例
- 2、封装了一个调用方法，和错误的时候自定义了一个 http 状态，抛出

---

```
[
	{message: 'should not be empty', code: 'invalid', field: 'name'},
	{message: 'should be an integer', code: 'invalid', field: 'age'}
]
```

这里有几个不好的地方：

- 1、没有暴露自定义 parameter 校验返回的信息，只能用这些提示。不能满足业务需求
- 2、封装的 validate 方法个人感觉不够友好，直接抛出错误
- 3、parameter 的实现比较简单，使用比较方便，但对于自定义要求比较高需求灵活性还不够，例如它在对 string 校验时，为空的提示语不能自定义，只有配置了 format 的才可以自定义提示

前两点覆盖的方式重写，但重写了，跟直接引用 parameter 并没有太大区别。所以建议还是直接用 parameter 这个插件。用法比较简单，直接拓展 context 上下文。

```
// extend/context.js
const VALIDATOR = Symbol('Application#validator');	// 定义一个全局唯一的属性
var Parameter = require('parameter');

module.exports = {
    get validator () {
        const that = this
        if (!this[VALIDATOR]) {
            this[VALIDATOR] = new Parameter({
                translate () {	// 翻译成多语言
                    const arg = [...arguments]
                    return that.__(...arg)
                }
            })
        }
        return this[VALIDATOR]
    },
    validate(rules, data) {
        data = data || this.request.body;
        const errors = this.validator.validate(rules, data);
        console.log(errors)
        return errors
    }
};
```

### parameter 的使用

- 1、插件提示语是英文的，那需要支持多语言，所幸其暴露了 translate 的配置项，引入 egg-i18n 即可

- 2、定义了一些简写：
- `'int'` => `{type: 'int', required: true}`
- `'integer'` => `{type: 'integer', required: true}`
- `'number'` => `{type: 'number', required: true}`
- `'date'` => `{type: 'date', required: true}`
- `'dateTime'` => `{type: 'dateTime', required: true}`
- `'id'` => `{type: 'id', required: true}`
- `'boolean'` => `{type: 'boolean', required: true}`
- `'bool'` => `{type: 'bool', required: true}`
- `'string'` => `{type: 'string', required: true, allowEmpty: false}`
- `'email'` => `{type: 'email', required: true, allowEmpty: false, format: EMAIL_RE}`
- `'password'` => `{type: 'password', required: true, allowEmpty: false, format: PASSWORD_RE, min: 6}`
- `'object'` => `{type: 'object', required: true}`
- `'array'` => `{type: 'array', required: true}`
- `[1, 2]` => `{type: 'enum', values: [1, 2]}`
- `/\d+/` => `{type: 'string', required: true, allowEmpty: false, format: /\d+/}`

- 3、一个简单的例子：

```
const error = this.ctx.validate({
    content: 'string',
    difficulty: ['1', '2', '3', '4', '5'],
    type: ['1', '2', '3', '4'],
    options: {
        type: 'array',
        itemType: 'object',
        required: false,
        rule: {
            text: {type: 'string', format: /^\S{6,}$/, message: '选项的内容不能少于3个字'}
        }
    }
})
```

需要注意一点，ctx.request.body 或者 ctx.request.query 里拿到的只有字符串或者对象，没有数字类型，所以别用 int 或者 integer
