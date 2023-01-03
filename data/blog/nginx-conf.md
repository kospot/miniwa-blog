---
layout: PostLayout
title: 'Nginx使用指南和常用配置'
date: 2020-08-17 20:31:28
tags: ['开发工具']
summary: Nginx常用的配置
---

### 1、常用的匹配规则

- location = /uri = 表示精确匹配，只有完全匹配上才能生效
- location ^~ /uri ^~ 开头对 URL 路径进行前缀匹配，并且在正则之前。
- location ~ pattern 开头表示区分大小写的正则匹配
- location ~\* pattern 开头表示不区分大小写的正则匹配
- location /uri 不带任何修饰符，也表示前缀匹配，但是在正则匹配之后
- location / 通用匹配，任何未匹配到其它 location 的请求都会匹配到，相当于 switch 中的 default

```
location  = / {
  # 只匹配 / 的查询.
  [ configuration A ]
}
location  / {
  # 匹配任何以 / 开始的查询，但是正则表达式与一些较长的字符串将被首先匹配。
  [ configuration B ]
}
location ^~ /images/ {
  # 匹配任何以 /images/ 开始的查询并且停止搜索，不检查正则表达式。
  [ configuration C ]
}
location ~* \.(gif|jpg|jpeg)$ {
  # 匹配任何以gif, jpg, or jpeg结尾的文件，但是所有 /images/ 目录的请求将在Configuration C中处理。
  [ configuration D ]
}
```

多个 location 配置的情况下匹配顺序为（参考资料而来，还未实际验证，试试就知道了，不必拘泥，仅供参考）:

- 首先精确匹配 =
- 其次前缀匹配 ^~
- 其次是按文件中顺序的正则匹配
- 然后匹配不带任何修饰的前缀匹配。
- 最后是交给 / 通用匹配
- 当有匹配成功时候，停止匹配，按当前匹配规则处理请求

注意：前缀匹配，如果有包含关系时，按最大匹配原则进行匹配。比如在前缀匹配：location /dir01 与 location /dir01/dir02，如有请求 http://localhost/dir01/dir02/file 将最终匹配到 location /dir01/dir02

### 2、proxy_pass，URL 结尾加斜线(/)与不加的区别

```

location /pss/ {
    proxy_pass http://127.0.0.1:18081/;
}
// 被代理的真实访问路径为：http://127.0.0.1:18081/bill.html

location /pss/ {
    proxy_pass http://127.0.0.1:18081;
}
// 被代理的真实访问路径为：http://127.0.0.1:18081/pss/bill.html
```

### 3、跨域

跨域形成之后，浏览器会根据请求的条件触发 options 请求，具体详细可见：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS

触发 options 请求之后，需要让请求响应 options 请求，可让后端支持，或者在 nginx 里配置

```
location / {
    if ( $request_method = 'OPTIONS' ) {
        add_header 'Access-Control-Allow-Origin' "$http_origin";
        add_header 'Access-Control-Allow-Credentials' 'true';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since,Content-Type';
        add_header 'Content-Length' 0;
        add_header 'Content-Type' 'text/plain charset=UTF-8';
        return 206;
    }
    ....
}
```

注意点：

- add_header 不具备层级继承，只会使用最近层的方法
- Access-Control-Allow-Headers，在火狐下不支持 \* 的匹配
- 避免给一个请求添加重复的头部，某些浏览器不支持

### 4、https 支持

```
# 如果需要支持http则把80端口也打开
listen       80;
listen      443;

ssl on;
ssl_certificate /root/.acme.sh/*.61info.cn/fullchain.cer ;
ssl_certificate_key /root/.acme.sh/*.61info.cn/*.61info.cn.key;
```

注意点：

- 每个服务器的证书存放位置有区别，具体可咨询运维或者看 一下别的配置

### 其他：

window 下重启 nginx 的 bat，通过 bat 脚本快速重启 nginx

```
@echo off
if "%1" == "h" goto begin
mshta vbscript:createobject("wscript.shell").run("""%~nx0"" h",0)(window.close)&&exit
:begin
taskkill /F /IM nginx.exe
cd D:\software\nginx-1.10.1
D:
nginx.exe
```
