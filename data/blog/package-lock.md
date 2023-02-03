---
layout: PostLayout
title: 'NPM锁版本'
date: 2022-06-12 20:31:28
tags: ['js原理']
summary: NPM v5 引入了 package-lock.json， 作为依赖树一致性的保障机制。由于npm以semver version作为版本管理工具，其描述的是一个版本的范围，并不是精确的版本，很容易导致不同人或者不同环境安装的版本不一致。
---

## 锁版本的引入

NPM v5 引入了 package-lock.json， 作为依赖树一致性的保障机制。由于 npm 以 semver version 作为版本管理工具，其描述的是一个版本的范围，并不是精确的版本，很容易导致不同人或者不同环境安装的版本不一致；第三方开源的包管理模式，虽然使得包的数量得到了爆发式的增长，但也使得包的质量参差不齐，依赖了一个有 bug 的包，可能会使得我们调试大半天。

在此之前，NPM 也有一个 shrinkwrap 的功能可以做类似的事情，需要我们手动的执行`npm shrinkwrap`来生成 shrinkwrap.json，在执行 npm install 的时候，shrinkwrap.json 的版本会覆盖 package.json 下的版本。

package-lock.json 和 shrinkwrap.json 都是 npm 里的锁文件，那这两者有什么区别呢？

- package-lock.json 不能发布到 npm，而 npm-shrinkwrap 默认情况下会发布到 npm
- package-lock.json 只能存在根目录，而非顶级的 shrinkwrap 文件也会被识别
- npm-shrinkwrap.json 向后兼容 npm 版本 2,3 和 4,而 package-lock.json 只有 npm 5+才能识别
- 根目录存在 npm-shrinkwrap.json，会自动忽略 package-lock.json

因此，package-lock.json 一般是我们开发项目会使用，如果要发布私有库，可以使用 npm-shrinkwrap.json。而且我们也应该把 package-lock.json 文件提交到项目仓库中，避免引包版本不一致，出现不同环境的差异。

## package-lock 如何维护

package-lock.json 文件不应该手动修改，而是由 NPM 自动处理。npm install、npm uninstall、npm update 都会触发 package-lock.json 文件的变更。如果不期望修改 package-lock.json 文件，则可以使用 npm ci，一般测试环境或者生产环境安装可以使用这个。

npm ci 接触的可能比较少，它是在 5.7 之后支持的。与 npm i 的区别如下：

- npm i 依赖 package.json，而 npm ci 依赖 package-lock.json。
- 当 package-lock.json 中的依赖于 package.json 不一致时，npm ci 退出但不会修改 package-lock.json。
- npm ci 只可以一次性的安装整个项目依赖，但无法添加单个依赖项。
- npm ci 安装包之前，会删除掉 node_modules 文件夹，因此他不需要去校验已下载文件版本与控制版本的关系，也不用校验是否存在最新版本的库，所以下载的速度更快。
  npm 安装时，不会修改 package.json 与 package-lock.json。

## package-lock 能锁定所有版本？

package-lock.json 也并非一直有效的，其可以锁定 package.json 的依赖，但不能锁定依赖的依赖。看下面的一个列子。

element-ui 在业务使用过程中，发现了一个 bug，el-tree 不会自动展开指定的菜单节点，发现其在 2.12.0 的版本修复了这个问题，于是把 element-ui 的版本升级了一下。升级之后，发现构建时出现了如下异常

```js showLineNumbers
Happy[babel]: All set; signaling webpack to proceed.
 ERROR  Failed to compile with 4 errors9:20:56 AM

These dependencies were not found:

* throttle-debounce/debounce in ./node_modules/_element-ui@2.12.0@element-ui/lib/element-ui.common.js, ./node_modules/_element-ui@2.12.0@element-ui/lib/tooltip.js and 1 other
* throttle-debounce/throttle in ./node_modules/_element-ui@2.12.0@element-ui/lib/element-ui.common.js

To install them, you can run: npm install --save throttle-debounce/debounce throttle-debounce/throttle
Hash: [1m24a0b21a8b734824a55f[39m[22m
Version: webpack [1m4.41.2[39m[22m
Time: [1m4797[39m[22mms
Built at: 10/30/2019 [1m9:20:56 AM[39m[22m
                                                     [1mAsset[39m[22m      [1mSize[39m[22m  [1mChunks[39m[22m  [1m[39m[22m             [1m[39m[22m[1mChunk Names[39m[22m
[1m[32mpages/invitation/pages.invitation.css?24a0b21a8b734824a55f[39m[22m  36.6 KiB       [1m0[39m[22m  [1m[32m[immutable][39m[22m  pages.invitation
           [1m[32mpages/invitation/pages.invitation.js?24a0b21a8b[39m[22m   108 KiB       [1m0[39m[22m  [1m[32m[immutable][39m[22m  pages.invitation
                      [1m[32mpages/invitation/static/bg_1833a.jpg[39m[22m  40.8 KiB        [1m[39m[22m  [1m[32m[39m[22m
          [1m[32mpages/invitation/static/element-icons-53587.woff[39m[22m  27.5 KiB        [1m[39m[22m  [1m[32m[39m[22m
           [1m[32mpages/invitation/static/element-icons-73238.ttf[39m[22m  54.6 KiB        [1m[39m[22m  [1m[32m[39m[22m
                 [1m[32mpages/invitation/static/success_3f48a.png[39m[22m  37.5 KiB        [1m[39m[22m  [1m[32m[39m[22m
                    [1m[32mpages/invitation/vendor.chunk.js?7f127[39m[22m   997 KiB       [1m1[39m[22m  [1m[32m[immutable][39m[22m  vendor
          [1m[32mpages/invitation/vendor.css?24a0b21a8b734824a55f[39m[22m   264 KiB       [1m1[39m[22m  [1m[32m[immutable][39m[22m  vendor
Entrypoint [1mpages.invitation[39m[22m = [1m[32mpages/invitation/vendor.css?24a0b21a8b734824a55f[39m[22m [1m[32mpages/invitation/vendor.chunk.js?7f127[39m[22m [1m[32mpages/invitation/pages.invitation.css?24a0b21a8b734824a55f[39m[22m [1m[32mpages/invitation/pages.invitation.js?24a0b21a8b[39m[22m

[1m[31mERROR in ./node_modules/_element-ui@2.12.0@element-ui/lib/element-ui.common.js
Module not found: Error: Can't resolve 'throttle-debounce/debounce' in '/var/lib/jenkins/workspace/oa前端/node_modules/_element-ui@2.12.0@element-ui/lib'
 @ ./node_modules/_element-ui@2.12.0@element-ui/lib/element-ui.common.js 170:17-54
 @ ./node_modules/_happypack@5.0.1@happypack/loader.js?id=babel!./node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./pages/invitation/views/invitate.vue?vue&type=script&lang=js&
 @ ./pages/invitation/views/invitate.vue?vue&type=script&lang=js&
 @ ./pages/invitation/views/invitate.vue
 @ ./pages/invitation/router/index.js
 @ ./pages/invitation/index.js[39m[22m

[1m[31mERROR in ./node_modules/_element-ui@2.12.0@element-ui/lib/tooltip.js
Module not found: Error: Can't resolve 'throttle-debounce/debounce' in '/var/lib/jenkins/workspace/oa前端/node_modules/_element-ui@2.12.0@element-ui/lib'
 @ ./node_modules/_element-ui@2.12.0@element-ui/lib/tooltip.js 391:17-54
 @ ./node_modules/_element-ui@2.12.0@element-ui/lib/element-ui.common.js
 @ ./node_modules/_happypack@5.0.1@happypack/loader.js?id=babel!./node_modules/_vue-loader@15.7.1@vue-loader/lib??vue-loader-options!./pages/invitation/views/invitate.vue?vue&type=script&lang=js&
 @ ./pages/invitation/views/invitate.vue?vue&type=script&lang=js&
 @ ./pages/invitation/views/invitate.vue
 @ ./pages/invitation/router/index.js
 @ ./pages/invitation/index.js[39m[22m
```

去 throttle-debounce 包看了一下，确实是没有 debounce 这个文件
![](/static/images/image2019-10-30_11-28-8.png)

猜测可能跟版本有关，于是回退到了旧版本看看

![](/static/images/image2019-10-30_11-28-22.png)

目前 element-ui 的版本如下，重新安装时会自动升级到最新的版本。

![](/static/images/image2019-10-30_11-50-0.png)

因此，package-lock.json 并不能完全锁定所有包的版本，只能锁定一级依赖包的版本，对于二级依赖包是不锁定的。
