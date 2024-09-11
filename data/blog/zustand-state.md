---
layout: PostLayout
title: zustand状态管理介绍
date: 2024-07-13
tags: ['js原理']
summary: 在前端开发中，状态管理是一个非常重要的话题。我们有很多选择，比如 Redux、MobX、Context API 等等。今天我要向大家介绍一种轻量级但非常强大的状态管理库——Zustand。
---

![](https://files.mdnice.com/user/70043/d913d95d-3917-4553-a888-4dd7eca786ae.png)

### 前言

在前端开发中，状态管理是一个非常重要的话题。我们有很多选择，比如 Redux、MobX、Context API 等等。今天我要向大家介绍一种轻量级但非常强大的状态管理库——Zustand。

### 一、概念和优势

#### 1.1 什么是 Zustand？

![](https://files.mdnice.com/user/70043/a988f2aa-2de5-4476-8250-0049d98357cc.png)

很好看的一个官网。（https://zustand-demo.pmnd.rs/）

Zustand 是一个用于 React 应用程序的状态管理库。它由 Poimandres 团队开发，以其简洁和灵活著称。Zustand 的德语意思是“状态”，它致力于提供一个轻量、简单和强大的解决方案来管理你的应用状态。

#### 1.2 为什么选择 Zustand？

- **轻量且简洁**：与 Redux 等复杂的状态管理库相比，Zustand 的 API 简单直观，没有繁重的样板代码。
- **无依赖**：Zustand 没有依赖任何其他库，它只是一个纯粹的 JavaScript 库。
- **灵活性**：你可以随意使用任何模式来管理状态，Zustand 并不强制你遵循特定的模式。
- **优秀的性能**：Zustand 使用不可变数据结构和浅比较来优化性能，确保你的应用运行流畅。

### 二、如何使用 Zustand

#### 2.1 安装

首先，我们需要安装 Zustand：

```bash
npm install zustand
```

或者使用 Yarn：

```bash
yarn add zustand
```

#### 2.2 创建一个简单的 store

我们可以通过 `create` 函数来创建一个状态 store。假设我们要管理一个计数器状态：

```javascript
import create from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
}))

export default useStore
```

在组件中使用这个 store：

```javascript
import React from 'react'
import useStore from './store'

function Counter() {
  const { count, increase, decrease } = useStore()
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increase}>Increase</button>
      <button onClick={decrease}>Decrease</button>
    </div>
  )
}

export default Counter
```

#### 2.3 api 介绍

Zustand 提供了一套简洁而强大的 API 来管理应用的状态。下面详细介绍 Zustand 的主要 API 及其用法。

##### 1. `create`

`create` 是 Zustand 的核心函数，用于创建一个 store。

```javascript
import create from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
}))
```

`create` 函数接收一个初始化函数作为参数，该函数提供 `set` 和 `get` 方法用于更新和获取状态。

##### 2. `set`

`set` 方法用于更新状态。它接收一个部分状态对象或者一个状态更新函数。状态更新函数接收当前状态并返回新的部分状态对象。

```javascript
const useStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
}))
```

##### 3. `get`

`get` 方法用于获取当前状态。可以在状态更新函数内部使用 `get` 方法来读取当前状态。

```javascript
const useStore = create((set, get) => ({
  count: 0,
  increase: () => set(() => ({ count: get().count + 1 })),
  decrease: () => set(() => ({ count: get().count - 1 })),
}))
```

##### 4. `subscribe`

`subscribe` 方法允许你订阅状态的变化。当状态发生变化时，订阅的回调函数会被调用。

```javascript
const useStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
}))

const unsubscribe = useStore.subscribe(
  (state) => state.count,
  (count) => console.log('Count changed to', count)
)

// 取消订阅
unsubscribe()
```

##### 5. `destroy`

`destroy` 方法用于销毁 store，清除所有订阅。

```javascript
const useStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
}))

useStore.destroy()
```

##### 6. `setState`

`setState` 方法允许你直接设置状态，而不是通过定义的状态更新函数。通常情况下不推荐直接使用 `setState`，除非你知道自己在做什么。

```javascript
const useStore = create((set) => ({
  count: 0,
}))

useStore.setState({ count: 10 })
```

##### 7. `getState`

`getState` 方法允许你直接获取当前状态。与 `get` 方法类似，但 `getState` 是在 store 上调用的。

```javascript
const useStore = create((set) => ({
  count: 0,
}))

const currentState = useStore.getState()
console.log(currentState.count)
```

##### 8. `useStore` Hook

在 React 组件中，你可以通过 `useStore` Hook 来访问状态和状态更新函数。

```javascript
import React from 'react'
import useStore from './store'

function Counter() {
  const { count, increase, decrease } = useStore()
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increase}>Increase</button>
      <button onClick={decrease}>Decrease</button>
    </div>
  )
}

export default Counter
```

#### 2.4 应用须知

- **异步状态更新**：你可以在状态更新函数中使用异步操作。例如，获取数据后更新状态：

  ```javascript
  const useStore = create((set) => ({
    data: null,
    fetchData: async () => {
      const response = await fetch('https://api.example.com/data')
      const data = await response.json()
      set({ data })
    },
  }))
  ```

- **中间件**：Zustand 支持使用中间件来扩展其功能。例如，使用 `redux` 中间件：

  ```javascript
  import { createStore, applyMiddleware } from 'redux'
  import { createStore as createZustandStore } from 'zustand'
  import { redux } from 'zustand/middleware'

  const store = createZustandStore(redux(reducer, initialState, applyMiddleware(logger)))
  ```

- **状态持久化**：可以使用中间件将状态持久化到 `localStorage` 或 `sessionStorage`。例如，使用 `zustand/middleware` 提供的 `persist` 中间件：

  ```javascript
  import create from 'zustand'
  import { persist } from 'zustand/middleware'

  const useStore = create(
    persist(
      (set) => ({
        count: 0,
        increase: () => set((state) => ({ count: state.count + 1 })),
        decrease: () => set((state) => ({ count: state.count - 1 })),
      }),
      {
        name: 'count-storage', // 存储的键名
      }
    )
  )
  ```

- **开发工具支持**：Zustand 提供了与 Redux DevTools 兼容的中间件，可以方便地调试状态变化。

  ```javascript
  import create from 'zustand'
  import { devtools } from 'zustand/middleware'

  const useStore = create(
    devtools((set) => ({
      count: 0,
      increase: () => set((state) => ({ count: state.count + 1 })),
      decrease: () => set((state) => ({ count: state.count - 1 })),
    }))
  )
  ```

#### 2.5 实际应用中的注意事项

在实际开发中使用 Zustand 时，有一些注意事项和最佳实践可以帮助你更高效地管理状态，并避免常见的陷阱。下面列举了这些注意事项。

- 避免将所有状态放在一个大 store 中

将所有状态放在一个大 store 中会导致状态管理变得复杂，难以维护和调试。建议将状态拆分成多个小的 store，根据不同的功能模块来管理各自的状态。

```javascript
import create from 'zustand'

const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))

const useSettingsStore = create((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}))
```

- 为状态提供合理的默认值

在初始化状态时，确保为所有状态属性提供合理的默认值。这有助于避免因状态未初始化而引起的错误。

```javascript
const useStore = create((set) => ({
  user: null,
  theme: 'light',
  count: 0,
}))
```

- 避免不必要的状态变化

避免频繁或不必要的状态变化，以减少组件的重新渲染次数。可以通过浅比较优化状态更新。

```javascript
const useStore = create((set) => ({
  count: 0,
  increase: () =>
    set((state) => {
      if (state.count < 10) {
        return { count: state.count + 1 }
      }
    }),
}))
```

- 利用 TypeScript 提高代码可靠性

使用 TypeScript 可以提高代码的可靠性和可维护性。为 Zustand 的 store 和状态定义类型，有助于避免类型错误。

```typescript
import create from 'zustand'

interface State {
  count: number
  increase: () => void
  decrease: () => void
}

const useStore = create<State>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
}))
```

- 选择器优化状态读取

使用选择器可以优化状态读取，避免组件重新渲染。选择器可以精确地订阅状态的某一部分变化。

```javascript
const useStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
}))

const useCount = () => useStore((state) => state.count)

function Counter() {
  const count = useCount()
  const increase = useStore((state) => state.increase)
  const decrease = useStore((state) => state.decrease)

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increase}>Increase</button>
      <button onClick={decrease}>Decrease</button>
    </div>
  )
}
```

在实际开发中使用 Zustand 需要注意状态的拆分与模块化、状态初始化与默认值、异步操作与状态更新、性能优化、状态持久化、调试与开发工具的使用、以及结合 TypeScript 和选择器来提高代码的可靠性和可维护性。通过遵循这些注意事项和最佳实践，可以更高效地管理 React 应用中的状态。

### 三、Zustand 的核心原理

Zustand 的核心是通过 `create` 函数创建一个 store。`create` 函数接收一个初始化函数，该函数使用 `set` 和 `get` 方法来定义状态和操作。状态的更新是通过 `set` 函数完成的，而 `get` 函数允许在状态更新函数中获取当前状态。

#### 3.1 不可变数据结构

Zustand 使用不可变数据结构，这意味着状态更新不会直接修改现有状态，而是创建一个新的状态对象。这有助于避免副作用并确保状态变化的可预测性。

#### 3.2 浅比较优化

为了优化性能，Zustand 在状态更新时使用浅比较。这意味着只有当状态对象的顶级属性发生变化时，组件才会重新渲染。这减少了不必要的重新渲染，提高了应用的性能。

### 四、结合 Next.js 使用

在 Next.js 中使用 Zustand 需要考虑到服务器端渲染（SSR）和客户端渲染（CSR）之间的区别。

**客户端渲染**

在客户端渲染中使用 Zustand 非常简单，直接在组件中使用 Zustand 创建的 store 即可。

**服务器端渲染**

在服务器端渲染中，你需要确保每个请求都使用独立的 Zustand store。可以使用 `getServerSideProps` 或 `getStaticProps` 函数来初始化状态，并在客户端使用同一个状态。

```javascript
import create from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
}))

export const getServerSideProps = async () => {
  const store = useStore.getState()
  return {
    props: {
      initialState: store,
    },
  }
}

export default function Page({ initialState }) {
  const { count, increase, decrease } = useStore()
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increase}>Increase</button>
      <button onClick={decrease}>Decrease</button>
    </div>
  )
}
```

### 结论

Zustand 是一个强大且灵活的状态管理库，适用于各种规模的 React 应用程序。通过理解其核心原理和插件机制，可以更好地利用 Zustand 提高开发效率和代码质量。无论是单纯的客户端渲染，还是复杂的服务器端渲染应用，Zustand 都能提供一个简洁且高效的解决方案。
