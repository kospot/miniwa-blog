---
layout: PostLayout
title: react组件通信
date: 2021-05-04
tags: ['设计原理']
summary: 今天来讲一讲React组件间的通信，看看都有哪些方式。
---

今天来讲一讲 React 组件间的通信，看看都有哪些方式。

### 1. Props：最基础的通信方式

在 React 中，props（属性）是父组件向子组件传递数据的主要方式。通过 props，我们可以将数据从父组件传递到子组件，这种方式简单直接。

#### 示例

```jsx
// ParentComponent.jsx
import React from 'react';
import ChildComponent from './ChildComponent';

const ParentComponent = () => {
  const message = "Hello from Parent";

  return (
    <div>
      <ChildComponent message={message} />
    </div>
  );
}

export default ParentComponent;

// ChildComponent.jsx
import React from 'react';

const ChildComponent = ({ message }) => {
  return (
    <div>
      <p>{message}</p>
    </div>
  );
}

export default ChildComponent;
```

#### 分析

在这个示例中，`ParentComponent` 通过 props 向 `ChildComponent` 传递了一个字符串 `message`。`ChildComponent` 接收到 props 后，将其显示在一个 `<p>` 标签中。

##### 注意事项

- Props 是只读的，子组件不能修改从父组件接收到的 props。
- 传递的 props 可以是任何类型的 JavaScript 数据，包括基本类型、对象、函数等。

### 2. State Lifting：提升状态

当多个组件需要共享相同的状态时，可以将状态提升到它们的最近共同父组件。然后，父组件可以将状态作为 props 传递给子组件。

#### 示例

```jsx
// ParentComponent.jsx
import React, { useState } from 'react';
import ChildComponentA from './ChildComponentA';
import ChildComponentB from './ChildComponentB';

const ParentComponent = () => {
  const [sharedState, setSharedState] = useState("Initial State");

  const handleChange = (newState) => {
    setSharedState(newState);
  }

  return (
    <div>
      <ChildComponentA sharedState={sharedState} onChange={handleChange} />
      <ChildComponentB sharedState={sharedState} />
    </div>
  );
}

export default ParentComponent;

// ChildComponentA.jsx
import React from 'react';

const ChildComponentA = ({ sharedState, onChange }) => {
  return (
    <div>
      <input
        type="text"
        value={sharedState}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default ChildComponentA;

// ChildComponentB.jsx
import React from 'react';

const ChildComponentB = ({ sharedState }) => {
  return (
    <div>
      <p>{sharedState}</p>
    </div>
  );
}

export default ChildComponentB;
```

#### 分析

在这个示例中，`ParentComponent` 管理着共享状态 `sharedState`，并提供了一个 `handleChange` 函数来更新状态。`ChildComponentA` 可以更新状态，而 `ChildComponentB` 只负责显示状态。

##### 注意事项

- 提升状态会导致父组件变得复杂，因为它需要管理更多的状态。
- 确保提升状态只在必要时进行，否则会导致组件结构过于复杂。

### 3. Context：避免层层传递

当需要在多层级组件间传递数据时，使用 Context 可以避免通过每一层组件传递 props。Context 提供了一种在组件树中共享数据的方法，而无需显式地通过每一个组件。

#### 示例

```jsx
// MyContext.js
import React from 'react';

const MyContext = React.createContext();

export default MyContext;

// ParentComponent.jsx
import React, { useState } from 'react';
import MyContext from './MyContext';
import ChildComponent from './ChildComponent';

const ParentComponent = () => {
  const [sharedState, setSharedState] = useState("Initial State");

  return (
    <MyContext.Provider value={{ sharedState, setSharedState }}>
      <ChildComponent />
    </MyContext.Provider>
  );
}

export default ParentComponent;

// ChildComponent.jsx
import React, { useContext } from 'react';
import MyContext from './MyContext';

const ChildComponent = () => {
  const { sharedState, setSharedState } = useContext(MyContext);

  return (
    <div>
      <input
        type="text"
        value={sharedState}
        onChange={(e) => setSharedState(e.target.value)}
      />
      <p>{sharedState}</p>
    </div>
  );
}

export default ChildComponent;
```

#### 分析

在这个示例中，`MyContext` 被创建并在 `ParentComponent` 中通过 `MyContext.Provider` 提供给子组件。`ChildComponent` 使用 `useContext` 钩子来访问共享的 `sharedState` 和 `setSharedState`。

##### 注意事项

- 使用 Context 时要谨慎，因为它可能导致组件重新渲染频率增加。
- Context 适用于全局性的状态，如主题、用户信息等。

### 4. Refs：访问子组件或 DOM 元素

Refs 提供了一种访问子组件或 DOM 元素的方法。它们可以用于获取 DOM 元素的直接引用或与子组件交互。

#### 示例

```jsx
// ParentComponent.jsx
import React, { useRef } from 'react';
import ChildComponent from './ChildComponent';

const ParentComponent = () => {
  const childRef = useRef();

  const handleClick = () => {
    childRef.current.focusInput();
  }

  return (
    <div>
      <ChildComponent ref={childRef} />
      <button onClick={handleClick}>Focus Input</button>
    </div>
  );
}

export default ParentComponent;

// ChildComponent.jsx
import React, { useRef, forwardRef, useImperativeHandle } from 'react';

const ChildComponent = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focusInput() {
      inputRef.current.focus();
    }
  }));

  return (
    <div>
      <input ref={inputRef} type="text" />
    </div>
  );
});

export default ChildComponent;
```

#### 分析

在这个示例中，`ParentComponent` 使用 `useRef` 创建了一个 ref，并将其传递给 `ChildComponent`。`ChildComponent` 使用 `useImperativeHandle` 钩子暴露了一个 `focusInput` 方法，允许父组件调用。

##### 注意事项

- Refs 应该谨慎使用，因为它们破坏了 React 的单向数据流。
- 使用 refs 通常用于需要直接访问 DOM 元素或与第三方库集成的情况。

### 5. Hooks：React 16.8+ 的强大工具

React 16.8 引入了 Hooks，为函数组件带来了类组件的许多功能。Hooks 提供了一种更简洁、灵活的方式来管理组件间的通信和状态。

#### 示例：使用 `useReducer` 和 `useContext`

````jsx
// MyContext.js
import React, { createContext, useReducer } from 'react';

const MyContext = createContext();

const initialState = { count: 0 };

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
};

export const MyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MyContext.Provider value={{ state, dispatch }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContext;

// ParentComponent.jsx
import React from 'react';
import { MyProvider } from './MyContext';
import ChildComponentA from './ChildComponentA';
import ChildComponentB from './ChildComponentB';

const ParentComponent = () => {
  return (
    <MyProvider>
      <ChildComponentA />
      <ChildComponentB />
    </MyProvider>
  );
}

export default ParentComponent;

// ChildComponentA.jsx
import React, { useContext } from 'react';
import MyContext from './MyContext';

const ChildComponentA = () => {
  const { state, dispatch } = useContext(MyContext);

  return (
    <div>
      <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
      <p>Count: {state.count}</p>
    </div>
  );
}

export default ChildComponentA;

// ChildComponentB.jsx
import React, { useContext } from 'react';
import MyContext from './MyContext';

const ChildComponentB = ()

```jsx
import React, { useContext } from 'react';
import MyContext from './MyContext';

const ChildComponentB = () => {
  const { state, dispatch } = useContext(MyContext);

  return (
    <div>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
      <p>Count: {state.count}</p>
    </div>
  );
}

export default ChildComponentB;
````

#### 分析

在这个示例中，我们使用 `useReducer` 和 `useContext` 创建了一个简单的全局状态管理系统。`MyProvider` 组件使用 `useReducer` 创建状态和调度函数，并通过 `MyContext.Provider` 提供给子组件。`ChildComponentA` 和 `ChildComponentB` 通过 `useContext` 访问和更新共享状态。

##### 注意事项

- 使用 `useReducer` 可以帮助管理更复杂的状态逻辑。
- 确保在使用 `useContext` 时，Context 的值不会频繁改变，否则会导致大量重新渲染。

### 6. Event Emitter：基于事件的通信

Event Emitter 是一种基于事件的通信方式，适用于需要在不相关的组件间进行通信的场景。我们可以使用 Node.js 内置的 `EventEmitter` 或第三方库如 `mitt` 来实现这一功能。

#### 示例：使用 `mitt`

```jsx
// eventEmitter.js
import mitt from 'mitt';

const emitter = mitt();

export default emitter;

// ParentComponent.jsx
import React from 'react';
import emitter from './eventEmitter';
import ChildComponentA from './ChildComponentA';
import ChildComponentB from './ChildComponentB';

const ParentComponent = () => {
  return (
    <div>
      <ChildComponentA />
      <ChildComponentB />
    </div>
  );
}

export default ParentComponent;

// ChildComponentA.jsx
import React from 'react';
import emitter from './eventEmitter';

const ChildComponentA = () => {
  const handleClick = () => {
    emitter.emit('customEvent', 'Hello from ChildComponentA');
  }

  return (
    <div>
      <button onClick={handleClick}>Send Message</button>
    </div>
  );
}

export default ChildComponentA;

// ChildComponentB.jsx
import React, { useEffect, useState } from 'react';
import emitter from './eventEmitter';

const ChildComponentB = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handler = (msg) => {
      setMessage(msg);
    };

    emitter.on('customEvent', handler);

    return () => {
      emitter.off('customEvent', handler);
    };
  }, []);

  return (
    <div>
      <p>{message}</p>
    </div>
  );
}

export default ChildComponentB;
```

#### 分析

在这个示例中，我们使用 `mitt` 创建了一个简单的事件发射器。`ChildComponentA` 通过 `emitter.emit` 发送事件，`ChildComponentB` 通过 `emitter.on` 监听事件并更新状态。

##### 注意事项

- 确保在组件卸载时移除事件监听器，以避免内存泄漏。
- 基于事件的通信适用于松耦合的组件间通信，但应谨慎使用以避免难以调试的问题。

### 7. Redux：状态管理的利器

Redux 是一个流行的状态管理库，适用于大型应用的全局状态管理。它提供了一个可预测的状态容器，并通过 actions 和 reducers 管理状态变化。

#### 示例

```jsx
// store.js
import { createStore } from 'redux';

const initialState = { count: 0 };

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;

// ParentComponent.jsx
import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import ChildComponentA from './ChildComponentA';
import ChildComponentB from './ChildComponentB';

const ParentComponent = () => {
  return (
    <Provider store={store}>
      <ChildComponentA />
      <ChildComponentB />
    </Provider>
  );
}

export default ParentComponent;

// ChildComponentA.jsx
import React from 'react';
import { useDispatch } from 'react-redux';

const ChildComponentA = () => {
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch({ type: 'INCREMENT' });
  }

  return (
    <div>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
}

export default ChildComponentA;

// ChildComponentB.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const ChildComponentB = () => {
  const count = useSelector(state => state.count);

  return (
    <div>
      <p>Count: {count}</p>
    </div>
  );
}

export default ChildComponentB;
```

#### 分析

在这个示例中，我们使用 Redux 创建了一个全局状态管理系统。`ParentComponent` 使用 `Provider` 将 Redux store 提供给子组件。`ChildComponentA` 使用 `useDispatch` 发送 actions 更新状态，`ChildComponentB` 使用 `useSelector` 访问状态。

##### 注意事项

- Redux 适用于大型应用，但对于小型应用可能显得过于复杂。
- 使用 Redux 时应遵循其最佳实践，如避免直接修改状态、使用中间件等。

### 总结与注意事项

React 提供了多种组件间通信的方式，每种方式都有其适用的场景和优缺点。在选择通信方式时，应根据具体需求和应用规模进行权衡。

#### 总结

1. **Props**：适用于父子组件间简单的单向数据传递。
2. **State Lifting**：适用于兄弟组件间需要共享状态的场景。
3. **Context**：适用于需要在多层级组件间传递数据的场景。
4. **Refs**：适用于需要直接访问 DOM 元素或子组件的方法。
5. **Hooks**：提供了一种灵活、简洁的方式来管理组件状态和通信。
6. **Event Emitter**：适用于松耦合的组件间通信。
7. **Redux**：适用于大型应用的全局状态管理。

#### 注意事项

- 在选择通信方式时，应尽量保持组件的简单性和可维护性。
- 避免不必要的状态提升和 Context 使用，以减少不必要的复杂度。
- 确保在使用事件发射器时正确处理事件监听器的移除，以避免内存泄漏。
- 使用 Redux 等状态管理库时，应遵循最佳实践，以确保状态管理的可预测性和可靠性。

希望本文能帮助你更好地理解和应用 React 的组件间通信方式。如果你有任何问题或需要进一步的讨论，欢迎留言！
