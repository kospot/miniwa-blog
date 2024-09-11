---
layout: PostLayout
title: zustand源码解读
date: 2024-07-14
tags: ['js原理']
summary: Zustand 是一个轻量级的状态管理库，由 pmndrs 团队开发，旨在简化 React 应用中的状态管理。它的主要优势包括简单的 API、支持中间件、以及良好的性能。
---

### 1. 简介

Zustand 是一个轻量级的状态管理库，由 pmndrs 团队开发，旨在简化 React 应用中的状态管理。它的主要优势包括简单的 API、支持中间件、以及良好的性能。

### 2. 项目结构

在 Zustand 的源码仓库中，我们可以看到以下主要的文件和目录：

- `src/`: 源代码目录
- `dist/`: 编译后的代码
- `examples/`: 示例代码
- `tests/`: 单元测试代码
- `package.json`: 项目配置文件

有趣的是，其用 rollup 打包，整合了 esbuild，测试方面则是接入了最新的 vitest。不确定作者后期会不会迁移到 vite 上打包。

```
module.exports = function (args) {
  let c = Object.keys(args).find((key) => key.startsWith('config-'))
  if (c) {
    c = c.slice('config-'.length).replace(/_/g, '/')
  } else {
    c = 'index'
  }
  return [
    ...(c === 'index' ? [createDeclarationConfig(`src/${c}.ts`, 'dist')] : []),
    createCommonJSConfig(`src/${c}.ts`, `dist/${c}`, {
      addModuleExport: {
        index: {
          default: 'react',
          create: 'create',
          useStore: 'useStore',
          createStore: 'vanilla.createStore',
        },
        vanilla: { default: 'vanilla', createStore: 'createStore' },
        shallow: { default: 'shallow$1', shallow: 'shallow' },
      }[c],
    }),
    createESMConfig(`src/${c}.ts`, `dist/esm/${c}.js`),
    createESMConfig(`src/${c}.ts`, `dist/esm/${c}.mjs`),
    createUMDConfig(`src/${c}.ts`, `dist/umd/${c}`, 'development'),
    createUMDConfig(`src/${c}.ts`, `dist/umd/${c}`, 'production'),
    createSystemConfig(`src/${c}.ts`, `dist/system/${c}`, 'development'),
    createSystemConfig(`src/${c}.ts`, `dist/system/${c}`, 'production'),
  ]
}
```

#### 主要文件

- `src/index.js`: 入口文件，导出主要功能
- `src/vanilla.js`: 提供基础的状态管理功能
- `src/react.js`: 提供与 React 相关的功能

### 3. 核心代码解析

#### `createStore` 函数

`createStore` 是 Zustand 的核心函数，用于创建一个新的状态存储。其实现如下：

```typescript
const createStoreImpl: CreateStoreImpl = (createState) => {
  type TState = ReturnType<typeof createState>
  type Listener = (state: TState, prevState: TState) => void
  let state: TState
  const listeners: Set<Listener> = new Set()

  // 更新状态
  const setState: StoreApi<TState>['setState'] = (partial, replace) => {
    const nextState =
      typeof partial === 'function' ? (partial as (state: TState) => TState)(state) : partial
    // 检测状态是否相同，浅比较
    if (!Object.is(nextState, state)) {
      const previousState = state
      state =
        replace ?? (typeof nextState !== 'object' || nextState === null)
          ? (nextState as TState)
          : Object.assign({}, state, nextState)
      // 通知订阅者
      listeners.forEach((listener) => listener(state, previousState))
    }
  }
  // 返回当前state
  const getState: StoreApi<TState>['getState'] = () => state
  // 通过闭包暴露初始的状态值
  const getInitialState: StoreApi<TState>['getInitialState'] = () => initialState

  // 提供订阅方法并返回销毁的api
  const subscribe: StoreApi<TState>['subscribe'] = (listener) => {
    listeners.add(listener)
    // Unsubscribe
    return () => listeners.delete(listener)
  }

  // 移除事件监听
  const destroy: StoreApi<TState>['destroy'] = () => {
    listeners.clear()
  }

  const api = { setState, getState, getInitialState, subscribe, destroy }
  // 获取初始状态
  const initialState = (state = createState(setState, getState, api))
  return api as any
}

// 支持按名字导出
export const createStore = ((createState) =>
  createState ? createStoreImpl(createState) : createStoreImpl) as CreateStore

// 对外暴露的方法
export default ((createState) => {
  if (import.meta.env?.MODE !== 'production') {
    console.warn(
      "[DEPRECATED] Default export is deprecated. Instead use import { createStore } from 'zustand/vanilla'."
    )
  }
  return createStore(createState)
}) as CreateStore
```

这段代码定义了一个状态管理库的核心逻辑，主要功能是创建一个可订阅的状态存储。下面是对这段代码核心逻辑的解释：

1. **类型定义**：

   - `CreateStoreImpl`: 一个泛型函数类型，用于创建状态存储。
   - `TState`: 状态的类型，由 `createState` 函数返回。

2. **状态存储创建**：

   - `createStoreImpl`: 一个高阶函数，接收一个 `createState` 函数作为参数，该函数初始化状态并返回状态类型 `TState`。

3. **状态管理 API**：

   - `setState`: 用于更新状态的函数。它接受一个 `partial` 参数，可以是一个部分状态对象或者一个函数，用于派生新状态。如果提供了 `replace` 参数且为真值，则完全替换当前状态。
   - `getState`: 返回当前状态。
   - `getInitialState`: 返回初始状态，通常在状态创建时由 `createState` 函数设置。
   - `subscribe`: 允许监听状态变化的函数。它接受一个监听器函数作为参数，并返回一个取消订阅的函数。
   - `destroy`: 清除所有订阅者。此方法已被标记为弃用，并提示用户使用 `subscribe` 返回的取消订阅函数。

4. **状态更新逻辑**：

   - 当调用 `setState` 时，如果 `partial` 是一个函数，它将使用当前状态作为参数并返回新的状态。如果不是函数，`partial` 直接作为新状态。
   - 如果 `replace` 参数为真，则直接使用 `nextState` 作为新状态；否则，新状态是通过合并当前状态和 `nextState` 得到的。

5. **订阅和取消订阅**：

   - 使用 `subscribe` 函数添加监听器，当状态更新时，所有监听器将被调用。
   - 返回的取消订阅函数用于从监听器集合中移除特定的监听器。

6. **导出**：
   - `createStore`: 根据是否提供 `createState` 函数，调用 `createStoreImpl` 并返回创建的状态存储 API。
   - 默认导出：已弃用，提示用户使用新的导入方式。

#### `useStore` Hook

`useStore` 是用于在 React 组件中访问 Zustand 状态的 Hook。其实现如下：

```javascript
import { useDebugValue } from 'react'
import useSyncExternalStoreExports from 'use-sync-external-store/shim/with-selector'
export function useStore<TState, StateSlice>(
  api: WithReact<StoreApi<TState>>,
  selector: (state: TState) => StateSlice = api.getState as any,
  equalityFn?: (a: StateSlice, b: StateSlice) => boolean
) {
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getState,
    selector,
    equalityFn
  )
  useDebugValue(slice)
  return slice
}
```

看着有点莫名其妙，里面调用了 useSyncExternalStoreWithSelector 和 useDebugValue。下面来介绍一下这两个

**useSyncExternalStoreWithSelector**

`use-sync-external-store` 是 React 18 引入的一个新的 hook，用于订阅外部存储（例如全局状态、浏览器存储、数据库等），并在其值发生变化时重新渲染组件。它提供了一种高效且一致的方式来处理外部状态的变化，使得开发者可以轻松地将外部状态与 React 组件同步。

在 React 应用中，组件状态通常由 React 的 `useState` 和 `useReducer` 等 hook 管理。然而，有时候我们需要在组件之外维护全局状态，或者订阅一些外部存储的数据源，比如全局的状态管理库、浏览器的 `localStorage` 或者服务器推送的数据。

传统上，我们可以使用 `useEffect` 和自定义 hook 来订阅这些外部状态，但这可能导致一些性能问题和一致性问题。`use-sync-external-store` 的引入旨在解决这些问题，提供一种标准化的方式来订阅外部存储，并确保在状态变化时以最高效的方式重新渲染组件。

`use-sync-external-store` 提供了一个简单的 API 来订阅外部存储。它接受三个参数：

1. **订阅函数**：用于订阅外部存储，并在存储变化时触发更新。
2. **快照函数**：用于获取外部存储的当前值。
3. **选择器函数**（可选）：用于选择订阅数据的一部分。

`use-sync-external-store` 适用于各种需要订阅外部状态的场景，例如：

- **全局状态管理**：可以用于订阅 Redux、MobX 等全局状态管理库的状态。
- **浏览器存储**：可以用于订阅 `localStorage`、`sessionStorage` 或者 `IndexedDB` 的变化。
- **服务器推送数据**：可以用于订阅 WebSocket、SSE（服务器发送事件）等服务器推送的数据。

`useDebugValue` 是 React 提供的一个 Hook，用于在 React 开发者工具中显示自定义 Hook 的调试信息。这个 Hook 主要用于提升调试体验，使开发者能够更方便地理解和追踪自定义 Hook 的状态和行为。
`useDebugValue` 只在开发模式下有效，在生产模式下不会有任何效果。因此，它不会对应用的性能产生负面影响。

#### 中间件的实现

Zustand 支持通过中间件扩展其功能。中间件的本质上只是一个函数，其内部实现了 5 个中间件。

```
export * from './middleware/redux.ts'
export * from './middleware/devtools.ts'
export * from './middleware/subscribeWithSelector.ts'
export * from './middleware/combine.ts'
export * from './middleware/persist.ts'
```

通过组合式的 api 调用来串联中间件，其中间件需要返回一个初始的状态。

```javascript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useFishStore = create(
  persist(
    (set, get) => ({
      fishes: 0,
      addAFish: () => set({ fishes: get().fishes + 1 }),
    }),
    {
      name: 'food-storage', // unique name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)
```

### 4. 数据流分析

#### 状态管理逻辑

Zustand 的状态管理逻辑主要通过 `setState` 和 `getState` 实现。`setState` 用于更新状态，而 `getState` 用于获取当前状态。

```javascript
const setState = (partial, replace) => {
  const nextState = typeof partial === 'function' ? partial(state) : partial
  if (replace) {
    state = nextState
  } else {
    state = { ...state, ...nextState }
  }
  // 通知所有监听者状态变化
}
```

#### 状态更新机制

Zustand 的状态更新机制基于发布-订阅模式。当状态变化时，所有的订阅者都会被通知。

```javascript
const subscribe = (listener) => {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}
```

Zustand 通过避免不必要的渲染来优化性能。只有当选择的状态确实发生变化时，订阅者才会被通知。

```javascript
const useStore = (selector, equalityFn) => {
  // 缓存选择器和比较函数
  // 仅在选择的状态变化时重新渲染
}
```

Zustand 通过合理的资源释放和垃圾回收来管理内存。当订阅者不再需要时，可以取消订阅以释放内存。

### 5. 总结

Zustand 是一个强大而灵活的状态管理库，适用于各种规模的 React 应用。其简洁的 API、优秀的性能和扩展性使其成为许多开发者的首选。
。
