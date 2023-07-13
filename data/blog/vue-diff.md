---
layout: PostLayout
title: 'Vue2的Diff算法'
date: 2022-12-21 11:31:28
tags: ['设计原理']
summary: diff是什么？先说一下Vue的响应式。Vue的template会转换成render函数，render函数会返回VNode。VNode是一个js对象，是对真实Dom的映射。Vue会通过Object的defineProperty或者Proxy监听js对象的变更，当数据变更后，需要更新到真实Dom上。如果每次都从0开始重新渲染，那会有较大损耗，可能有部分组件根本不需要更新。为了提高渲染的效率，就需要找到一个最高效的渲染方式。diff就是为了对比新的VNode和旧VNode的差异，实现最小化的更新。在vue里面 diff 算法是通过patch函数来完成的，所以有的时候也叫patch算法。
---

## 一、是什么

diff 是什么？先说一下 Vue 的响应式。Vue 的 template 会转换成 render 函数，render 函数会返回 VNode。VNode 是一个 js 对象，是对真实 Dom 的映射。Vue 会通过 Object 的 defineProperty 或者 Proxy 监听 js 对象的变更，当数据变更后，需要更新到真实 Dom 上。如果每次都从 0 开始重新渲染，那会有较大损耗，可能有部分组件根本不需要更新。为了提高渲染的效率，就需要找到一个最高效的渲染方式。diff 就是为了对比新的 VNode 和旧 VNode 的差异，实现最小化的更新。在 vue 里面 diff 算法是通过 patch 函数来完成的，所以有的时候也叫 patch 算法。在学术上，与之相似的理论基础树的编辑距离。当严格意义上来说 diff 算法也不是树的编辑距离。

树的编辑距离算法是指计算两个树之间的编辑距离，即通过增加、删除或修改节点来将一个树转换为另一个树所需的最小操作数。以下是一些常见的树的编辑距离算法：

- 精确匹配算法：这种算法要求两个树在结构和节点值上都完全匹配。如果两个树完全相同，则它们的编辑距离为 0。否则，编辑距离等于删除或添加一个节点的操作数。
  子树删除算法：这种算法将一个树转换为另一个树时，允许删除一个子树。具体来说，如果两个树具有相同的根节点，但它们的子树不同，则可以通过删除其中一个子树来完成转换。
- 子树插入算法：这种算法将一个树转换为另一个树时，允许插入一个子树。具体来说，如果两个树具有相同的根节点，但它们的子树不同，则可以通过插入一个子树来完成转换。
- 重构算法：这种算法允许对树进行重构，即通过交换子树的位置来转换一个树到另一个树。具体来说，如果两个树具有相同的根节点，但它们的子树不同，则可以通过交换子树的位置来完成转换。
- 扩展子树删除算法：这种算法将一个树转换为另一个树时，允许删除一个扩展的子树。具体来说，如果两个树具有相同的根节点，但它们的子树不同，则可以通过删除一个扩展的子树来完成转换。
- 扩展子树插入算法：这种算法将一个树转换为另一个树时，允许插入一个扩展的子树。具体来说，如果两个树具有相同的根节点，但它们的子树不同，则可以通过插入一个扩展的子树来完成转换。

Vue 的 diff 处于对性能的考虑，没有严格遵守最小的编辑距离，做了一个平衡取舍。其有两个特点：

- 只在同层级进行比较, 不会跨层级比较
- 比较的过程中，循环从两边向中间比较

整体策略为：深度优先，同层比较。

## 二、过程分析

比较只会在同层级进行, 不会跨层级比较

![](/static/images/vue-diff/1.webp)

比较的过程中，循环从两边向中间收拢

![](/static/images/vue-diff/2.webp)

下面举个 vue 通过 diff 算法更新的例子：

1、新旧 VNode 节点如下图所示：

![](/static/images/vue-diff/3.webp)

2、第一次循环后，发现旧节点 D 与新节点 D 相同，直接复用旧节点 D 作为 diff 后的第一个真实节点，同时旧节点 endIndex 移动到 C，新节点的 startIndex 移动到了 C

![](/static/images/vue-diff/4.webp)

3、第二次循环后，同样是旧节点的末尾和新节点的开头(都是 C)相同，同理，diff 后创建了 C 的真实节点插入到第一次创建的 D 节点后面。同时旧节点的 endIndex 移动到了 B，新节点的 startIndex 移动到了 E

![](/static/images/vue-diff/5.webp)

4、第三次循环中，发现 E 没有找到，这时候只能直接创建新的真实节点 E，插入到第二次创建的 C 节点之后。同时新节点的 startIndex 移动到了 A。旧节点的 startIndex 和 endIndex 都保持不动

![](/static/images/vue-diff/6.webp)

5、第四次循环中，发现了新旧节点的开头(都是 A)相同，于是 diff 后创建了 A 的真实节点，插入到前一次创建的 E 节点后面。同时旧节点的 startIndex 移动到了 B，新节点的 startIndex 移动到了 B

![](/static/images/vue-diff/7.webp)

6、第五次循环中，情形同第四次循环一样，因此 diff 后创建了 B 真实节点 插入到前一次创建的 A 节点后面。同时旧节点的 startIndex 移动到了 C，新节点的 startIndex 移动到了 F

![](/static/images/vue-diff/8.webp)

7、新节点的 startIndex 已经大于 endIndex 了，需要创建 newStartIdx 和 newEndIdx 之间的所有节点，也就是节点 F，直接创建 F 节点对应的真实节点放到 B 节点后面

![](/static/images/vue-diff/9.webp)

## 三、源码分析

当数据发生改变时，set 方法会调用 Dep.notify 通知所有订阅者 Watcher，订阅者就会调用 patch 给真实的 DOM 打补丁，更新相应的视图

源码位置：src/core/vdom/patch.js

```javascript
function patch(oldVnode, vnode, hydrating, removeOnly) {
  if (isUndef(vnode)) {
    // 没有新节点，直接执行destory钩子函数
    if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
    return
  }

  let isInitialPatch = false
  const insertedVnodeQueue = []

  if (isUndef(oldVnode)) {
    isInitialPatch = true
    createElm(vnode, insertedVnodeQueue) // 没有旧节点，直接用新节点生成dom元素
  } else {
    const isRealElement = isDef(oldVnode.nodeType)
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // 判断旧节点和新节点自身一样，一致执行patchVnode
      patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
    } else {
      // 否则直接销毁及旧节点，根据新节点生成dom元素
      if (isRealElement) {
        if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
          oldVnode.removeAttribute(SSR_ATTR)
          hydrating = true
        }
        if (isTrue(hydrating)) {
          if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
            invokeInsertHook(vnode, insertedVnodeQueue, true)
            return oldVnode
          }
        }
        oldVnode = emptyNodeAt(oldVnode)
      }
      return vnode.elm
    }
  }
}
```

patch 函数前两个参数位为 oldVnode 和 Vnode ，分别代表新的节点和之前的旧节点，主要做了四个判断：

- 没有新节点，直接触发旧节点的 destory 钩子
- 没有旧节点，说明是页面刚开始初始化的时候，此时，根本不需要比较了，直接全是新建，所以只调用 createElm
- 旧节点和新节点自身一样，通过 sameVnode 判断节点是否一样，一样时，直接调用 patchVnode 去处理这两个节点
- 旧节点和新节点自身不一样，当两个节点不一样的时候，直接创建新节点，删除旧节点

下面主要讲的是 patchVnode 部分

```javascript
function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
  // 如果新旧节点一致，什么都不做
  if (oldVnode === vnode) {
    return
  }

  // 让vnode.el引用到现在的真实dom，当el修改时，vnode.el会同步变化
  const elm = (vnode.elm = oldVnode.elm)

  // 异步占位符
  if (isTrue(oldVnode.isAsyncPlaceholder)) {
    if (isDef(vnode.asyncFactory.resolved)) {
      hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
    } else {
      vnode.isAsyncPlaceholder = true
    }
    return
  }
  // 如果新旧都是静态节点，并且具有相同的key
  // 当vnode是克隆节点或是v-once指令控制的节点时，只需要把oldVnode.elm和oldVnode.child都复制到vnode上
  // 也不用再有其他操作
  if (
    isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
  ) {
    vnode.componentInstance = oldVnode.componentInstance
    return
  }

  let i
  const data = vnode.data
  if (isDef(data) && isDef((i = data.hook)) && isDef((i = i.prepatch))) {
    i(oldVnode, vnode)
  }

  const oldCh = oldVnode.children
  const ch = vnode.children
  if (isDef(data) && isPatchable(vnode)) {
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
    if (isDef((i = data.hook)) && isDef((i = i.update))) i(oldVnode, vnode)
  }
  // 如果vnode不是文本节点或者注释节点
  if (isUndef(vnode.text)) {
    // 并且都有子节点
    if (isDef(oldCh) && isDef(ch)) {
      // 并且子节点不完全一致，则调用updateChildren
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)

      // 如果只有新的vnode有子节点
    } else if (isDef(ch)) {
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
      // elm已经引用了老的dom节点，在老的dom节点上添加子节点
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)

      // 如果新vnode没有子节点，而vnode有子节点，直接删除老的oldCh
    } else if (isDef(oldCh)) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)

      // 如果老节点是文本节点
    } else if (isDef(oldVnode.text)) {
      nodeOps.setTextContent(elm, '')
    }

    // 如果新vnode和老vnode是文本节点或注释节点
    // 但是vnode.text != oldVnode.text时，只需要更新vnode.elm的文本内容就可以
  } else if (oldVnode.text !== vnode.text) {
    nodeOps.setTextContent(elm, vnode.text)
  }
  if (isDef(data)) {
    if (isDef((i = data.hook)) && isDef((i = i.postpatch))) i(oldVnode, vnode)
  }
}
```

patchVnode 主要做了几个判断：

- 新节点是否是文本节点，如果是，则直接更新 dom 的文本内容为新节点的文本内容
- 新节点和旧节点如果都有子节点，则处理比较更新子节点
- 只有新节点有子节点，旧节点没有，那么不用比较了，所有节点都是全新的，所以直接全部新建就好了，新建是指创建出所有新 DOM，并且添加进父节点
- 只有旧节点有子节点而新节点没有，说明更新后的页面，旧节点全部都不见了，那么要做的，就是把所有的旧节点删除，也就是直接把 DOM 删除

子节点不完全一致，则调用 updateChildren

```javascript
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0 // 旧头索引
    let newStartIdx = 0 // 新头索引
    let oldEndIdx = oldCh.length - 1 // 旧尾索引
    let newEndIdx = newCh.length - 1 // 新尾索引
    let oldStartVnode = oldCh[0] // oldVnode的第一个child
    let oldEndVnode = oldCh[oldEndIdx] // oldVnode的最后一个child
    let newStartVnode = newCh[0] // newVnode的第一个child
    let newEndVnode = newCh[newEndIdx] // newVnode的最后一个child
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly

    // 如果oldStartVnode和oldEndVnode重合，并且新的也都重合了，证明diff完了，循环结束
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      // 如果oldVnode的第一个child不存在
      if (isUndef(oldStartVnode)) {
        // oldStart索引右移
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left

      // 如果oldVnode的最后一个child不存在
      } else if (isUndef(oldEndVnode)) {
        // oldEnd索引左移
        oldEndVnode = oldCh[--oldEndIdx]

      // oldStartVnode和newStartVnode是同一个节点
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // patch oldStartVnode和newStartVnode， 索引左移，继续循环
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]

      // oldEndVnode和newEndVnode是同一个节点
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // patch oldEndVnode和newEndVnode，索引右移，继续循环
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]

      // oldStartVnode和newEndVnode是同一个节点
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        // patch oldStartVnode和newEndVnode
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
        // 如果removeOnly是false，则将oldStartVnode.eml移动到oldEndVnode.elm之后
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        // oldStart索引右移，newEnd索引左移
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]

      // 如果oldEndVnode和newStartVnode是同一个节点
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        // patch oldEndVnode和newStartVnode
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
        // 如果removeOnly是false，则将oldEndVnode.elm移动到oldStartVnode.elm之前
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        // oldEnd索引左移，newStart索引右移
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]

      // 如果都不匹配
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)

        // 尝试在oldChildren中寻找和newStartVnode的具有相同的key的Vnode
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)

        // 如果未找到，说明newStartVnode是一个新的节点
        if (isUndef(idxInOld)) { // New element
          // 创建一个新Vnode
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)

        // 如果找到了和newStartVnodej具有相同的key的Vnode，叫vnodeToMove
        } else {
          vnodeToMove = oldCh[idxInOld]
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !vnodeToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            )
          }

          // 比较两个具有相同的key的新节点是否是同一个节点
          //不设key，newCh和oldCh只会进行头尾两端的相互比较，设key后，除了头尾两端的比较外，还会从用key生成的对象oldKeyToIdx中查找匹配的节点，所以为节点设置key可以更高效的利用dom。
          if (sameVnode(vnodeToMove, newStartVnode)) {
            // patch vnodeToMove和newStartVnode
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
            // 清除
            oldCh[idxInOld] = undefined
            // 如果removeOnly是false，则将找到的和newStartVnodej具有相同的key的Vnode，叫vnodeToMove.elm
            // 移动到oldStartVnode.elm之前
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)

          // 如果key相同，但是节点不相同，则创建一个新的节点
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
          }
        }

        // 右移
        newStartVnode = newCh[++newStartIdx]
      }
    }

```

while 循环主要处理了以下五种情景：

- 当新老 VNode 节点的 start 相同时，直接 patchVnode ，同时新老 VNode 节点的开始索引都加 1
- 当新老 VNode 节点的 end 相同时，同样直接 patchVnode ，同时新老 VNode 节点的结束索引都减 1
- 当老 VNode 节点的 start 和新 VNode 节点的 end 相同时，这时候在 patchVnode 后，还需要将当前真实 dom 节点移动到 oldEndVnode 的后面，同时老 VNode 节点开始索引加 1，新 VNode 节点的结束索引减 1
- 当老 VNode 节点的 end 和新 VNode 节点的 start 相同时，这时候在 patchVnode 后，还需要将当前真实 dom 节点移动到 oldStartVnode 的前面，同时老 VNode 节点结束索引减 1，新 VNode 节点的开始索引加 1
- 如果都不满足以上四种情形，那说明没有相同的节点可以复用，则会分为以下两种情况：
  - 从旧的 VNode 为 key 值，对应 index 序列为 value 值的哈希表中找到与 newStartVnode 一致 key 的旧的 VNode 节点，再进行 patchVnode，同时将这个真实 dom 移动到 oldStartVnode 对应的真实 dom 的前面
  - 调用 createElm 创建一个新的 dom 节点放到当前 newStartIdx 的位置

## 流程总结

Vue2 的 diff 流程总体如下：

- 当数据发生改变时，订阅者 watcher 就会调用 patch 给真实的 DOM 打补丁
- 通过 isSameVnode 进行判断，相同则调用 patchVnode 方法
- patchVnode 做了以下操作：
  - 找到对应的真实 dom，称为 el
  - 如果都有都有文本节点且不相等，将 el 文本节点设置为 Vnode 的文本节点
  - 如果 oldVnode 有子节点而 VNode 没有，则删除 el 子节点
  - 如果 oldVnode 没有子节点而 VNode 有，则将 VNode 的子节点真实化后添加到 el
  - 如果两者都有子节点，则执行 updateChildren 函数比较子节点
- updateChildren 主要做了以下操作：
  - 设置新旧 VNode 的头尾指针
  - 新旧头尾指针进行比较，循环向中间靠拢，根据情况调用 patchVnode 进行 patch 重复流程、调用 createElem 创建一个新节点，从哈希表寻找 key 一致的 VNode 节点再分情况操作

不足的地方：

- 对于静态节点（即在编译时就已经确定的节点），其处理效率较低。这是因为在运行时，Vue2 会对静态节点进行重复对比，从而增加了处理时间和性能开销。
- 对于列表中的节点顺序变化和节点内容变化等情况，Vue2 的 diff 算法也需要进行额外的处理，从而增加了处理时间和性能开销。
- 对于嵌套循环的场景处理不佳，容易造成性能瓶颈。例如，在列表中包含多个子列表时，Vue2 的 diff 算法需要对每个子列表进行对比，增加了处理时间和性能开销
- 对于包含大量节点的场景，Vue2 的 diff 算法可能会出现性能问题。这是因为 Vue2 的 diff 算法在处理大型虚拟 DOM 树时需要消耗大量的计算资源，导致性能下降

参考文献

- https://juejin.cn/post/6881907432541552648#heading-1
- https://www.infoq.cn/article/udlcpkh4iqb0cr5wgy7f
