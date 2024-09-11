---
layout: PostLayout
title: 探索React重新渲染的奥秘
date: 2021-05-09
tags: ['设计原理']
summary: 这篇文章探讨了React元素、子组件与父组件之间的关系，以及它们是如何影响重新渲染的。这里的子组件或许会有一些烧脑。
---

这篇文章探讨了 React 元素、子组件与父组件之间的关系，以及它们是如何影响重新渲染的。这里的子组件或许会有一些烧脑。

**子组件、父组件以及它们如何影响重新渲染**

在 React 中，组件是构建用户界面的基本单元。组件可以分为父组件和子组件，它们之间的关系以及如何影响重新渲染是 React 中非常重要的概念。让我们一起深入探索 React 元素的奥秘，了解父组件、子组件之间的交互关系，以及它们如何影响重新渲染过程。

**“子组件”模式及其一些谜团**

这个模式本身是这样的：想象一下，你在组件中有一些频繁的状态变化。例如，在 onMouseMove 回调中更新状态。

```jsx
const MovingComponent = () => {
  const [state, setState] = useState({ x: 100, y: 100 })
  return (
    <div
      onMouseMove={(e) => setState({ x: e.clientX, y: e.clientY })}
      style={{ left: state.x, top: state.y }}
    >
      <ChildComponent />
    </div>
  )
}
```

现在，我们知道当状态更新时，React 组件会重新渲染自己和它们所有的子组件。

在这种情况下，每次鼠标移动时，MovingComponent 的状态都会更新，它的重新渲染就会被触发，结果就是 ChildComponent 也会重新渲染。

![](https://files.mdnice.com/user/70043/4ee8b72f-b401-41c1-a8dd-d670ad9cf6e4.png)

如果 ChildComponent 很重，它频繁的重新渲染可能会导致你的应用程序出现性能问题。

除了 React.memo 之外，解决这个问题的方法是将 ChildComponent 提取出来，并将其作为子组件传递。

```jsx
const MovingComponent = ({ children }) => {
  const [state, setState] = useState({ x: 100, y: 100 })
  return (
    <div
      onMouseMove={(e) => setState({ x: e.clientX, y: e.clientY })}
      style={{ left: state.x, top: state.y }}
    >
      {/* 现在子组件不会被重新渲染 */}
      {children}
    </div>
  )
}

const SomeOutsideComponent = () => {
  return (
    <MovingComponent>
      <ChildComponent />
    </MovingComponent>
  )
}
```

ChildComponent 现在“属于”SomeOutsideComponent，这是 MovingComponent 的父组件，不受其状态变化的影响。因此，它不会在每次鼠标移动时重新渲染。

![](https://files.mdnice.com/user/70043/6a367c72-6581-4da6-a2e5-c3805a5fe450.png)

**谜题 1：但等等，它们仍然是子组件！它们被渲染在一个每次鼠标移动都会改变样式的 div 内部`<div style={{ left: state.x, top: state.y }} />`，即这个 div 是重新渲染的父组件。为什么这里子组件不重新渲染呢？**

情况变得更加有趣。

\*\*谜题 2：子组件作为渲染函数。如果我将子组件作为渲染函数传递（跨组件数据共享的常见模式），ChildComponent 又开始重新渲染自己，即使它不依赖于更改的状态：

```jsx
const MovingComponent = ({ children }) => {
  // ...
  return (
    <div>
      {/* 子组件作为具有一些数据的渲染函数 */}
      {/* 数据不依赖于改变的状态！ */}
      {children((data) => (
        <ChildComponent data={'something'} />
      ))}
    </div>
  )
}

const SomeOutsideComponent = () => {
  return (
    <MovingComponent>
      {/* ChildComponent在MovingComponent的状态改变时重新渲染！ */}
      {/* 即使它不使用从它传递的数据 */}
      {() => <ChildComponent />}
    </MovingComponent>
  )
}
```

![](https://files.mdnice.com/user/70043/08154fae-cd26-4559-b391-289ee77e3030.png)

但为什么呢？它仍然“属于”SomeOutsideComponent 组件，而且这个组件并没有重新渲染。

**谜题 3：为什么将“父”组件包装在 React.memo 中不会阻止来自外部的“子”组件重新渲染？为什么如果将“子”组件包装在其中，就不需要包装父组件呢？**

```jsx
const MovingComponentMemo = React.memo(MovingComponent)

const SomeOutsideComponent = () => {
  const [state, setState] = useState(/* ... */)
  return (
    <MovingComponentMemo>
      {/* ChildComponent将在SomeOutsideComponent重新渲染时重新渲染 */}
      <ChildComponent />
    </MovingComponentMemo>
  )
}
```

如果我只记忆化 ChildComponent 而不包括其父组件，它就会工作：

```jsx
const ChildComponentMemo = React.memo(ChildComponent)

const SomeOutsideComponent = () => {
  const [state, setState] = useState(/* ... */)
  return (
    <MovingComponent>
      {/* ChildComponent不会重新渲染，即使父组件没有记忆化 */}
      <ChildComponentMemo />
    </MovingComponent>
  )
}
```

![](https://files.mdnice.com/user/70043/d04b5ee6-7ba7-458b-8756-cce0660a68e3.png)

**谜题 4：当将子组件作为函数传递时，为什么记忆化这个函数不起作用呢？**

```jsx
const SomeOutsideComponent = () => {
  const [state, setState] = useState(/* ... */)
  const child = useCallback(() => <ChildComponent />, [])
  return (
    <MovingComponent>
      {/* 记忆化了的渲染函数。对重新渲染没有帮助 */}
      {child}
    </MovingComponent>
  )
}
```

如果你现在就想知道答案，在我们跳入解决方案之前，我们需要首先理解一些关键概念。

**什么是 React“子组件”？**

首先，当它们这样传递时，到底是什么是“子组件”？

```jsx
const Parent = ({ children }) => {
  return <div>{children}</div>
}

;<Parent>
  <Child />
</Parent>
```

答案很简单 - 它们只是一个属性。我们通过其余属性来访问它们的事实有点暴露了这一点。

```jsx
const Parent = (props) => {
  return <div>{props.children}</div>
}
```

我们使用的花哨的“组合”模式不过是对我们方便的语法糖。我们甚至可以将其重写为显式的属性，它将是完全相同的：

```jsx
<Parent children={<Child />} />
```

和任何其他属性一样，我们可以将组件作为元素、函数或组件传递 - 这就是“子组件中的渲染函数”模式的来源。我们完全可以这样做：

```jsx
const Parent = ({ children }) => {
  return <div>{children(<Child />)}</div>
}
```

或者这样：

```jsx
const Parent = ({ children }) => {
  return <div>{children(Child)}</div>
}
```

尽管最后一个可能不应该这样做，你的团队没有人会欣赏它。

在某种程度上，这为我们提供了第一个谜题的答案，如果答案是“作为属性传递的组件不会重新渲染，因为它们只是属性”，这是可以接受的。

**什么是 React 元素？**

第二个需要理解的重要事情是，当我这样做时到底发生了什么：

```jsx
const child = <Child />
```

人们通常认为这是组件的渲染方式，这就是 Child 组件的渲染周期开始的时候。这不是真的。

`<Child />`被称为一个“元素”。这不过是函数`React.createElement`返回一个对象的语法糖。这个对象只是当你这个元素最终出现在渲染树中时，你想要在屏幕上看到的东西的描述。

基本上，如果我这样做：

```jsx
const Parent = () => {
  const child = <Child />
  return <div>{child}</div>
}
```

child 常量将只是一个包含一个对象的常量，这个对象就坐在那里闲置。

我们甚至可以用直接的函数调用替换这个语法糖：

```jsx
const Parent = () => {
  const child = React.createElement(Child, null, null)
  return <div>{child}</div>
}
```

只有当我实际上将它包含在返回结果中，只有在 Parent 组件渲染自身之后，Child 组件的实际渲染才会被触发。

```jsx
const Parent = () => {
  const child = <Child />
  return <div>{child}</div>
}
```

**更新元素**

元素是不可变对象。更新元素并触发其对应组件重新渲染的唯一方法是重新创建对象本身。这正是在重新渲染期间发生的事情：

```jsx
const Parent = () => {
  const child = <Child />
  return <div>{child}</div>
}
```

如果 Parent 组件重新渲染，child 常量的内容将从头开始重新创建，这是可以的，超级便宜，因为它只是一个对象。从 React 的角度来看，child 是一个新的元素（我们重新创建了对象），但在完全相同的位置和完全相同的类型，所以 React 只会用新数据更新现有组件（重新渲染现有的 Child）。

这就是允许记忆化工作的方式：如果我将 Child 包装在 React.memo 中

```jsx
const ChildMemo = React.memo(Child)

const Parent = () => {
  const child = <ChildMemo />
  return <div>{child}</div>
}
```

或者记忆化函数调用的结果

```jsx
const Parent = () => {
  const child = useMemo(() => <Child />, [])
  return <div>{child}</div>
}
```

定义对象将不会被重新创建，React 会认为它不需要更新，Child 的重新渲染也不会发生。

**解开谜团**

现在我们知道了上述所有内容，解开所有引发这次调查的谜团就非常容易了。要记住的关键点：

- 我们写`const child = <Child />`时，我们只是创建了一个元素，即组件定义，而不是渲染它。这个定义是一个不可变对象。
- 这个定义的组件只有在它最终出现在实际的渲染树中时才会被渲染。对于函数组件来说，就是当你实际上从组件返回它时。
- 重新创建定义对象将触发相应组件的重新渲染。

现在来解答谜团。

**谜题 1：为什么作为属性传递的组件不会重新渲染？**

```jsx
const MovingComponent = ({ children }) => {
  const [state, setState] = useState({
    /* ... */
  })
  return (
    <div style={{ left: state.x, top: state.y }}>
      {/* 由于状态改变，这些不会重新渲染 */}
      {children}
    </div>
  )
}

const SomeOutsideComponent = () => {
  return (
    <MovingComponent>
      <ChildComponent />
    </MovingComponent>
  )
}
```

"children"是`<ChildComponent />`元素，在`SomeOutsideComponent`中创建。当`MovingComponent`由于其状态改变而重新渲染时，它的属性保持不变。因此，来自属性的任何元素（即定义对象）不会被重新创建，因此这些组件的重新渲染不会发生。

**谜题 2：如果子组件作为渲染函数传递，它们为什么会开始重新渲染？**

```jsx
const MovingComponent = ({ children }) => {
  const [state, setState] = useState({
    /* ... */
  })
  return (
    <div>
      {/* 由于状态改变，这些将重新渲染 */}
      {children()}
    </div>
  )
}

const SomeOutsideComponent = () => {
  return <MovingComponent>{() => <ChildComponent />}</MovingComponent>
}
```

在这种情况下，"children"是一个函数，元素（定义对象）是调用这个函数的结果。我们在`MovingComponent`内部调用这个函数，即我们将在每次重新渲染时调用它。因此，在每次重新渲染时，我们将重新创建定义对象`<ChildComponent />`，这将触发`ChildComponent`的重新渲染。

**谜题 3：为什么将“父”组件包装在 React.memo 中不会阻止来自外部的“子”组件重新渲染？为什么如果将“子”组件包装在其中，就不需要包装父组件？**

```jsx
const MovingComponentMemo = React.memo(MovingComponent)

const SomeOutsideComponent = () => {
  const [state, setState] = useState(/* ... */)
  return (
    <MovingComponentMemo>
      {/* 当SomeOutsideComponent重新渲染时，ChildComponent将重新渲染 */}
      <ChildComponent />
    </MovingComponentMemo>
  )
}
```

记住，子组件只是属性。我们可以重写上述代码，使流程更清晰：

```jsx
const SomeOutsideComponent = () => {
  return <MovingComponentMemo children={<ChildComponent />} />
}
```

我们这里只记忆化了`MovingComponentMemo`，但它仍然有`children`属性，它接受一个元素（即一个对象）。我们在每次重新渲染时重新创建这个对象，记忆化的组件将尝试进行属性检查，会检测到`children`属性发生了变化，并触发`MovingComponentMemo`的重新渲染。由于`ChildComponent`的定义被重新创建了，它也将触发其重新渲染。

如果我们做相反的事情，只包装`ChildComponent`：

```jsx
const ChildComponentMemo = React.memo(ChildComponent)

const SomeOutsideComponent = () => {
  const [state, setState] = useState(/* ... */)
  return (
    <MovingComponent>
      {/* ChildComponent不再重新渲染 */}
      <ChildComponentMemo />
    </MovingComponent>
  )
}
```

在这种情况下，`MovingComponent`仍然有`children`属性，但它被记忆化了，所以它的值会在重新渲染之间保留。`MovingComponent`本身没有被记忆化，所以它会重新渲染，但当 React 到达`children`部分时，它会看到`ChildComponentMemo`的定义没有变化，所以它会跳过这部分。重新渲染不会发生。

**谜题 4：当将子组件作为函数传递时，为什么记忆化这个函数不起作用？**

```jsx
const SomeOutsideComponent = () => {
  const [state, setState] = useState(/* ... */)
  const child = useCallback(() => <ChildComponent />, [])
  return (
    <MovingComponent>
      {/* 记忆化了的渲染函数。对重新渲染没有帮助 */}
      {child}
    </MovingComponent>
  )
}
```

让我们首先用`children`作为属性来重写它，以使流程更容易理解：

```jsx
const SomeOutsideComponent = () => {
  const [state, setState] = useState(/* ... */)
  const child = useCallback(() => <ChildComponent />, [])
  return <MovingComponent children={child} />
}
```

现在，我们这里有的是：`SomeOutsideComponent`触发重新渲染。`MovingComponent`是它的子组件，并且它没有被记忆化，所以它也会重新渲染。当它重新渲染时，它会在重新渲染期间调用子函数。函数是记忆化的，是的，但它的返回不是。所以在每次调用时，它都会调用`<ChildComponent />`，即会创建一个新的定义对象，这反过来将触发`ChildComponent`的重新渲染。

或者，我们可以在这里去掉函数记忆化，只将`ChildComponent`包装在`React.memo`中：`MovingComponent`会重新渲染，`children`函数将被触发，但它的结果将被记忆化，所以`ChildComponent`永远不会重新渲染。

实际上，这两种方法都有效。

这就是今天的所有内容，希望大家在写组件时能对子组件是否重新渲染做出正确的判断。
