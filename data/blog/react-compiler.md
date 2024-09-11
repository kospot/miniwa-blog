---
layout: PostLayout
title: ReactCompiler的探索和测试
date: 2024-04-12
tags: ['js原理']
summary: React 19 版本引入了一个重要的新特性，即 React Compiler。这个编译器是 React 团队为了解决在状态变化时 UI 过度重新渲染的问题而开发的。React Compiler 旨在自动优化应用程序，通过在构建时分析代码，理解 JavaScript 和 React 的规则，从而自动地进行记忆化（memoization）处理，减少不必要的组件重新渲染
---

# 背景

React 19 版本引入了一个重要的新特性，即 React Compiler。这个编译器是 React 团队为了解决在状态变化时 UI 过度重新渲染的问题而开发的。React Compiler 旨在自动优化应用程序，通过在构建时分析代码，理解 JavaScript 和 React 的规则，从而自动地进行记忆化（memoization）处理，减少不必要的组件重新渲染

# **什么是 React 编译器**

我们先来了解什么是编译器，它解决了什么问题，以及如何开始使用它？

**问题：**React 中的重新渲染是自发的。每次你在 React 组件中更改状态时，你都会触发该组件的重新渲染，包括组件内使用到的其它组件。

如果这些下游的重新渲染影响到一些重量级的组件或者发生得过于频繁，这可能会导致我们的应用程序出现性能问题。

虽然 react 提供了优化的方案以阻止不必要的重复渲染，如 React.memo、useMemo、useCallback。只要我们把组件用 React.memo 包裹，组件的 props 也用 useMemo、useCallback 包裹，那么即使父组件发生重复渲染，子组件也不会重新渲染。要正确使用这些工具很难，非常难。

这就是 React 编译器的用武之地。编译器是由 React 核心团队开发的工具。它插入我们的构建系统，通过分析原始组件的代码，让组件默认就能识别 props 和 hooks 的依赖变化。实现类似于用 memo、useMemo 或 useCallbac 的效果。

如果你想自己尝试编译器，只需按照文档操作即可：[https://react.dev/learn/react-compiler](https://react.dev/learn/react-compiler)。记住：这仍然是一个实验性的功能，不要用在生产。

---

# **测试一下编译器**

这篇文章的主要目的是调查编译器的期望是否符合现实。我们先来看看它能做什么

- 编译器是即插即用的：你安装它，它就能工作；不需要重写现有代码。

- 在安装之后，我们将不再考虑 React.memo、useMemo 和 useCallback：将不再需要它们。

为了测试这些假设，我实现了一些简单的示例来单独测试编译器，然后在我可用的三个不同的应用程序上运行它。

---

**简单示例：单独测试编译器**

从头开始使用编译器的最简单方法是安装 Next.js 的金丝雀版本。基本上，这将给你提供你需要的一切：

```
npm install next@canary babel-plugin-react-compiler
```

然后我们可以在`next.config.js`中打开编译器：

```javascript
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
}

module.exports = nextConfig
```

然后，我们就可以在 React 开发工具中立即看到自动 memoized 的组件。

![](https://files.mdnice.com/user/70043/2122ed99-0701-4ee7-85d0-1727d561e99d.png)

到目前为止，假设一是正确的：安装非常简单，它确实有效。

让我们开始编写代码，看看编译器如何处理它。

**第一个示例：简单的状态变化。**

```javascript
const SimpleCase1 = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? '关闭' : '打开'}对话框</button>
      {isOpen && <Dialog />}
      <VerySlowComponent />
    </div>
  )
}
```

我们有一个`isOpen`状态变量，控制模态对话框是否打开，以及在同一组件中渲染的`VerySlowComponent`。正常的 React 行为会在`isOpen`状态变化时重新渲染`VerySlowComponent`，导致对话框弹出有延迟。

通常，如果我们要通过 memoization 解决这种情况（尽管当然还有其他方法），我们会用`React.memo`包装`VerySlowComponent`：

```javascript
const VerySlowComponentMemo = React.memo(VerySlowComponent)

const SimpleCase1 = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div>
      {/* ... */}
      <VerySlowComponentMemo />
      {/* ... */}
    </div>
  )
}
```

有了编译器，我们可以丢弃`React.memo`，仍然可以在开发工具中看到`VerySlowComponent`被 memoized，延迟消失了，如果我们在`VerySlowComponent`内部放置`console.log`，我们会看到它确实不再在状态变化时重新渲染了。

好的，我将继续翻译剩余的内容。

---

**第二个示例：慢组件的 props。**

到目前为止一切顺利，但前一个示例是最简单的。让我们使它更复杂一些，引入 props 到等式中。

假设我们的`VerySlowComponent`有一个期望函数的`onSubmit` prop，以及一个接受数组的`data` prop：

```javascript
const SimpleCase2 = () => {
  const [isOpen, setIsOpen] = useState(false)
  const onSubmit = (data) => {
    // handle submission
  }
  const data = { id: 'bla' }
  return (
    <div>
      {/* ... */}
      <VerySlowComponent onSubmit={onSubmit} data={data} />
      {/* ... */}
    </div>
  )
}
```

现在，在手动 memoization 的情况下，除了用`React.memo`包装`VerySlowComponent`，我们还需要用`useMemo`包装数组（假设我们不能仅仅将其移出），以及用`useCallback`包装`onSubmit`：

```javascript
const VerySlowComponentMemo = React.memo(VerySlowComponent)

export const SimpleCase2Memo = () => {
  const [isOpen, setIsOpen] = useState(false)
  const onSubmit = useCallback(
    (data) => {
      // handle submission
    },
    [data]
  )
  const data = useMemo(() => ({ id: 'bla' }), [])
  return (
    <div>
      {/* ... */}
      <VerySlowComponentMemo onSubmit={onSubmit} data={data} />
      {/* ... */}
    </div>
  )
}
```

但是有了编译器，我们仍然不需要这么做！在 React 开发工具中，`VerySlowComponent`仍然显示为 memoized，而且里面的“控制”`console.log`仍然没有触发。

**第三个示例：子元素。**

好的，第三个示例，在测试真实应用之前。如果我们的慢组件接受子元素怎么办？几乎没有人能正确地进行 memoization。我们假设`VerySlowComponent`接受子元素：

```javascript
export const SimpleCase3 = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      {/* ... */}
      <VerySlowComponent>
        <SomeOtherComponent />
      </VerySlowComponent>
      {/* ... */}
    </>
  )
}
```

你能立即想到如何在这里正确地 memoize`VerySlowComponent`吗？

大多数人会假设我们需要用`React.memo`包装`VerySlowComponent`和`SomeOtherComponent`。这是错误的。我们需要用`useMemo`包装`<SomeOtherComponent />`元素，像这样：

```javascript
const VerySlowComponentMemo = React.memo(VerySlowComponent)

export const SimpleCase3 = () => {
  const [isOpen, setIsOpen] = useState(false)
  const child = useMemo(() => <SomeOtherComponent />, [])
  return (
    <>
      {/* ... */}
      <VerySlowComponentMemo child={child} />
      {/* ... */}
    </>
  )
}
```

React 编译器在这里仍然发挥了它的魔力！一切都是 memoized 的，非常慢的组件不会重新渲染。

# 总结

到目前为止三个示例都成功了，这令人印象深刻！那有什么场景是它不能解决的吗？

例如使用到了一些自定义的 hook 或者是一些动态的 props 等场景，React 编译器并不能完美地运行。所以即便有了编译器后，我们也不可以忘记 memo、useMemo 和 useCallback。至少不是在目前的状态下。相反，您需要比现在更了解它们，只有深入了解之后才能更好地和它配合工作。

当然，这是假设我们想修复那些漏网之鱼的情况下。事实上，一半的重新渲染仍然存在，没有人会注意到，因为无论如何，大多数重新渲染对性能的影响可以忽略不计。而真有影响的时候，我们也可以通过一些组合的手段更容易修复它们。
