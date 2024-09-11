---
layout: PostLayout
title: 如何避免使用useCallback
date: 2024-08-14
tags: ['js原理']
summary: Swizec Teller 认为简化和优化 React 代码的一种方法是移除所有的 `useCallback` 和 `useMemo`，因为 90% 的情况下并不需要它们。
---




Swizec Teller 认为简化和优化 React 代码的一种方法是移除所有的 `useCallback` 和 `useMemo`，因为 90% 的情况下并不需要它们。

> Honestly at this point useCallback is a code smell
— Swizec Teller (@Swizec) 

Swizec Teller是一名自由工程师兼连续创业家，有超过20年以上的程序开发经验，自称「戴帽子的宅男」(A Geek with a Hat)

下面我们来看看为什么。


---


#### `useCallback` 的作用

`useCallback` 和 `useMemo` 是 React 提供的钩子，用于创建 JavaScript 对象的稳定引用，帮助 React 的渲染引擎理解对象没有变化。例如：

```jsx
function FidgetSpinner() {
  const [spinning, setSpinning] = useState(false);

  const newFuncEveryTime = () => {
    setSpinning(!spinning);
  };

  const stableFunc = useCallback(() => {
    setSpinning(!spinning);
  }, [spinning]);

  return (
    <>
      <p>Is it spinning? {spinning}</p>
      <Spinner spinning={spinning} onClick={...} />
    </>
  );
}
```

假设 `<Spinner>` 渲染一个指示旋转状态的小部件。`onClick` 属性接收一个函数来更新 `spinning` 状态。

#### 引用稳定性和重新渲染

React 使用 props 值决定是否重新渲染组件。对于函数和其他对象来说，它们的“值”是它们的内存地址，即引用。如果引用改变，即使对象内容相同，React 也会认为它不同，并重新渲染组件。

```jsx
const newFuncEveryTime = () => {
  setSpinning(!spinning);
};
```

每次调用组件时都会重新定义这个函数，导致 `<Spinner>` 重新渲染。


`useCallback` 帮助创建一个带有稳定内存地址的函数：

```jsx
const stableFunc = useCallback(() => {
  setSpinning(!spinning);
}, [spinning]);
```

这创建了一个记忆化函数，仅在依赖数组改变时重新实例化。

#### `useCallback` 的潜在问题

如果使用错误的依赖数组，会导致闭包问题：

```jsx
const stableFunc = useCallback(() => {
  setSpinning(!spinning);
}, []);
```

这样，`spinning` 的值会被永久写入到函数中，导致函数行为不如预期。

#### 为什么工程师使用 `useCallback`

在很多情况下，开发者使用 `useCallback` 是不必要的，甚至可能带来问题。有点心像“晚上涂防晒霜”。

开发者可能会使用 `useCallback` 的原因：
- **性能担忧**：开发者可能担心组件的性能，希望通过 `useCallback` 来避免不必要的重新渲染。这实际上可能会引入内存开销，因为 JavaScript 需要维护所有这些记忆化函数的栈。
- **无限循环问题**：当使用不稳定的回调或对象作为 `useEffect` 的依赖时，每次渲染都会重新定义回调，触发效果，导致重新渲染，形成无限循环。

我还看到了第三个使用 useCallback 的情况。

```
function Component() {
  const SubComponent = useCallback(() => {
    return <div>This is a component damn it!</div>
  }, [])

  return (
    <>
      <p>Lorem Ipsum</p>
      {SubComponent()}
    </>
  )
}
```

在这个例子中，useCallback 被用来创建一个组件，但建议不要这样做，而应该定义一个组件并让 React 来处理渲染。

不要过度使用 `useCallback`，而是应该定义组件并让 React 自己处理渲染逻辑。



### 避免 `useCallback` 的方法

最佳方法是将函数移出组件作用域，使用纯函数依赖传入的参数，而不是作用域内的值。

#### 示例 1

更好的版本如下：

```jsx
function FidgetSpinner() {
  const [spinning, setSpinning] = useState(false);

  return (
    <>
      <p>Is it spinning? {spinning}</p>
      <Spinner spinning={spinning} setSpinning={setSpinning} />
    </>
  );
}
```

`setSpinning` 是一个稳定的函数，可以传递给 `<Spinner>` 并使用它的替代形式来切换状态：

```jsx
setSpinning((spinning) => !spinning);
```

您可以使用获取当前值作为参数的函数调用React setters。

#### 示例 2

另一个常见的例子是将使用局部作用域的函数转换成独立的、可测试的函数。比如当你使用 react-hook-form 构建表单时

```
function ComplicatedStuff() {
  const formMethods = useForm()

  const fieldValue = formMethods.watch("field")

  async function onSubmit() {
      await fetch('...', {
          method: 'POST',
          body: JSON.stringify({
              fieldValue
          })
      })
  }

  return (
    <>
      <p>Live current value of field: {fieldValue}</p>
      <FormRenderComponent onSubmit={onSubmit} />
    </>
  )
}
```

formMethods.watch监视您的输入字段并返回其当前值。

在这里，为了避免每次按键都有不必要的完全重新渲染，你会想使用useCallback记住`onSubmit`函数,并将所有字段添加到其依赖数组中。


其实大可不必，试试这个：


```jsx
async function onSubmit(values) {
  await fetch('...', {
    method: 'POST',
    body: JSON.stringify({
      fieldValue: values.fieldValue,
    }),
  });
}
function ComplicatedStuff() {
...
}
```

React-hook-form将所有当前值传递到onSubmit函数中，通过形参传递到函数里。

### 何时需要使用 `useCallback` 和 `useMemo`

如果你正在编写一个库或核心功能，需要出现在多个组件中，才需要记忆化所有东西。对于少数几个共享回调的小组件，不必担心重新渲染。

![](https://files.mdnice.com/user/70043/c8ac73e9-72c5-45e4-bffd-80cdb0f17ba3.png)

### 何时需要使用 `useCallback` 和 `useMemo`

在大多数情况下，小组件之间共享少量回调时，不需要使用 `useCallback` 和 `useMemo`。这些钩子主要用于优化性能，以避免不必要的重新渲染和计算。

1. **库或核心功能**：如果你正在编写一个库或核心功能，需要在多个组件中频繁使用和共享，记忆化这些函数和计算可能是有必要的。
2. **性能瓶颈**：当你确定性能问题源于不必要的重新渲染或计算时，可以使用 `useCallback` 和 `useMemo` 来优化。
3. **复杂依赖**：如果组件依赖复杂的对象或函数，记忆化可以避免不必要的依赖变化触发重新渲染。


假设你有一个复杂的计算函数，用于生成大型数据集，每次渲染时都需要重新计算：

```jsx
const expensiveCalculation = useMemo(() => {
  // 复杂计算
  return result;
}, [dependencies]);
```

在这种情况下，`useMemo` 可以显著提高性能，因为只有当依赖项改变时，计算才会重新执行。


尽管 `useCallback` 和 `useMemo` 可以优化性能，但滥用它们可能会导致代码复杂化和内存开销增加。要明智地使用这些钩子，确保它们确实能带来性能提升。


---
