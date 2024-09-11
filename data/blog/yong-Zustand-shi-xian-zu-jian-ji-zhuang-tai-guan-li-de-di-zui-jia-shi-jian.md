---
layout: PostLayout
title: 用Zustand实现组件级状态管理的最佳实践
date: 2024-08-24 08:23:45
tags: ['js原理']
summary: 在前文中，我们介绍了Zustand这个简单、易用、轻量的状态管理框架。通常情况下，状态管理通常都是全局的，可以在应用的任意地方访问。然而，这样的做法是否真的符合最佳实践呢？如果从马克思的角度来看，任何片面的观点都是不全面的。
---

![](https://files.mdnice.com/user/70043/d005672a-3591-4162-aa23-66c6bd1c7c28.png)

在前文中，我们介绍了 Zustand 这个简单、易用、轻量的状态管理框架。

通常情况下，状态管理通常都是全局的，可以在应用的任意地方访问。然而，这样的做法是否真的符合最佳实践呢？如果从马克思的角度来看，任何片面的观点都是不全面的。事实上，有些时候我们只想创建页面级别或者组件级别的状态，而不是把所有状态都挂在全局。

## 全局状态的弊端

### 无效渲染

全局状态管理的一个明显弊端是它可能导致无效的渲染。全局状态通常是在 React 组件生命周期之外创建的，这意味着我们无法利用组件的`props`值来设置初始状态。我们只能通过一个默认值来创建状态，然后再利用`useEffect`将`props`中的值同步到 store 中：

```javascript
const useBearStore = create((set) => ({
  // 提供一个初始值
  bears: 0,
  actions: {
    increasePopulation: (by) => set((state) => ({ bears: state.bears + by })),
    removeAllBears: () => set({ bears: 0 }),
  },
}))

const App = ({ initialBears }) => {
  // 写入一个真实的初始值
  React.useEffect(() => {
    useBearStore.set((prev) => ({ ...prev, bears: initialBears }))
  }, [initialBears])

  return (
    <main>
      <RestOfTheApp />
    </main>
  )
}
```

在上面的例子中，组件在`useEffect`触发之前会使用初始的`bears: 0`渲染一次，然后在正确的`initialBears`赋值后再次渲染。我们只是在同步`initialBears`值，而不是用它来初始化状态，但这依然会导致多次渲染。

### 难以管理

全局状态的另一个弊端是难以管理。在应用的任意部分，全局状态都可能被意外访问或修改，这使得在项目后续迭代中难以保证状态的安全隔离，甚至可能导致状态混乱。

假设你有一个应用，包含用户信息和购物车信息的全局状态。初始设计时，这两个状态是分离的，但在某次迭代中，开发者意外地修改了购物车状态中的用户信息，从而导致状态混乱。

```javascript
import create from 'zustand'

// 用户信息状态
const useUserStore = create((set) => ({
  user: { name: 'John Doe', loggedIn: true },
  updateUser: (newUser) => set({ user: newUser }),
}))

// 购物车信息状态
const useCartStore = create((set) => ({
  cart: [],
  addItem: (item) => set((state) => ({ cart: [...state.cart, item] })),
}))
```

在这个初始设计中，用户信息和购物车信息是分开的，全局状态管理看起来较为清晰。

但在项目的后续迭代中，假如开发者需要在购物车中添加一些用户相关的信息，错误地修改了`useCartStore`，直接访问和修改了用户信息：

```javascript
const useCartStore = create((set) => ({
  cart: [],
  user: { name: 'John Doe', loggedIn: true }, // 这里重复了用户状态
  addItem: (item) => set((state) => ({ cart: [...state.cart, item] })),
  updateUserInCart: (newUser) => set({ user: newUser }), // 修改了购物车中的用户状态
}))
```

这个设计有两个主要问题：

- **问题 1**: 用户状态现在同时存在于`useUserStore`和`useCartStore`中，导致了状态的重复和混乱。
- **问题 2**: 其他开发者可能在后续开发中未意识到状态已经被重复定义，并可能会意外地通过`useCartStore`修改`user`，导致状态的不一致和难以追踪的 bug。

虽然这个例子看起来容易发现问题，但在更复杂的真实场景中，类似问题可能会更加隐蔽。如果一个框架无法提供安全的实践方案，人为的错误在所难免，尤其是在大型项目中。因此，我们需要在架构设计时提供良好的规范，以减少错误的发生。

## 如何处理

因此，在一个应用中，状态应该被分为全局状态和局部状态。那么，Zustand 如何实现局部状态呢？

我们可以通过 React Context 来注入局部状态。这个概念类似于 React Query 中的`<QueryClientProvider>`，以及 Redux 中的单一状态仓库。因为状态仓库的实例是静态的、单例的，不会频繁改变，所以将它们放到 React Context 中非常容易，并且不会导致不必要的重新渲染。然后，我们仍然可以为状态仓库创建订阅者，这些订阅者将通过 Zustand 进行优化。以下是具体的实现：

```javascript
import { createStore, useStore } from 'zustand'

const BearStoreContext = React.createContext(null)

const BearStoreProvider = ({ children, initialBears }) => {
  const [store] = React.useState(() =>
    createStore((set) => ({
      bears: initialBears,
      actions: {
        increasePopulation: (by) => set((state) => ({ bears: state.bears + by })),
        removeAllBears: () => set({ bears: 0 }),
      },
    }))
  )

  return <BearStoreContext.Provider value={store}>{children}</BearStoreContext.Provider>
}
```

在这里，我们没有使用开箱即用的`create`函数来创建实例，因为它返回的是一个 React hook（`useStore`），而通过`createStore`可以返回一个独立的 store 对象，这是 Zustand 的新 API。

我们使用了`React.useState`来创建 store，虽然也可以使用`React.useRef`，但前者对 TypeScript 更加友好。使用`useState`的初始化方法只会调用一次，因此`props`的更新将不会传递到状态仓库中。

如果我们想要从状态仓库中取出一些值进行消费，可以使用这个上下文。为此，我们需要将 store 和 selector 传递给从 Zustand 中拿到的`useStore`钩子。以下是一个最佳实践的抽象：

```javascript
const useBearStore = (selector) => {
  const store = React.useContext(BearStoreContext)
  if (!store) {
    throw new Error('Missing BearStoreProvider')
  }
  return useStore(store, selector)
}
```

相较于创建一个全局状态而言，这种方式虽然多了一些代码，但它解决了三个关键问题：

1. **可以利用`props`初始化状态仓库**：因为我们是在 React 组件树内部创建的 store。
2. **自动化测试更为容易**：我们可以选择渲染一个包含`BearStoreProvider`的组件，或者为测试场景渲染一个独立的组件。这样，已创建的状态仓库能够完全隔离测试，无需在测试间重置状态仓库。
3. **组件复用性增强**：现在，一个组件可以渲染一个`BearStoreProvider`，为其子组件提供封装好的 Zustand 状态仓库。我们可以在一个页面中任意渲染这个组件，每个实例将拥有它独立的状态仓库，从而实现状态的隔离和复用。

即便 Zustand 文档中声称无需 Context Provider 也能访问状态仓库，但了解如何整合状态仓库的创建和 React Context 仍然是必要的，这样可以更好地处理一些需要封装和复用的场景。
