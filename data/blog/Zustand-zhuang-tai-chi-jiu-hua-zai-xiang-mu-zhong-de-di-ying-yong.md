---
layout: PostLayout
title: Zustand：状态持久化在项目中的应用
date: 2024-08-25 05:53:52
tags: ['js原理']
summary: Zustand的持久化中间件允许你将状态存储在各种存储中，例如`localStorage`、`AsyncStorage`或`IndexedDB`等。这使得应用的状态可以跨页面持久化。也就是说用户刷新页面或者关闭浏览器后重新打开，应用的
---

![](https://files.mdnice.com/user/70043/893d7179-b3c3-4ab1-b0df-4d1520565abf.png)

Zustand 的持久化中间件允许你将状态存储在各种存储中，例如`localStorage`、`AsyncStorage`或`IndexedDB`等。这使得应用的状态可以跨页面持久化。也就是说用户刷新页面或者关闭浏览器后重新打开，应用的状态依然可以被保留。

## 使用方法

首先，你需要从`zustand`库中导入`create`和`persist`函数，以及`createJSONStorage`辅助函数。

```javascript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
```

然后，使用`persist`函数包装你的 Zustand store，并提供必要的配置。

下面是一个简单的示例，演示了如何创建一个持久化的 Zustand store：

```javascript
export const useBearStore = create(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: 'bear-storage', // 存储中的项目名称，必须是唯一的
      storage: createJSONStorage(() => sessionStorage), // 使用sessionStorage作为存储
    }
  )
)
```

### 持久化选项

以下是一些常用的持久化选项：

- `name`：存储中使用的唯一键名。
- `storage`：自定义存储引擎。
- `partialize`：选择存储部分状态字段。
- `onRehydrateStorage`：存储恢复时调用的监听函数。
- `version`：版本控制，用于处理存储的兼容性。
- `migrate`：处理版本迁移的函数。
- `merge`：自定义持久化值与当前状态的合并方式。
- `skipHydration`：跳过初始化时的自动恢复。

### 版本控制与迁移

如果你的状态结构发生变化，比如字段重命名或新增字段，你可以使用`version`和`migrate`选项来处理：

```javascript
export const useVersionedStore = create(
  persist(
    (set, get) => ({
      newField: 0,
    }),
    {
      name: 'versioned-storage',
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          persistedState.newField = persistedState.oldField
          delete persistedState.oldField
        }
        return persistedState
      },
    }
  )
)
```

### 手动触发恢复

在某些情况下，你可能需要手动触发状态的恢复，可以使用`rehydrate`方法：

```javascript
await useBoundStore.persist.rehydrate()
```

### 检查是否已恢复

使用`hasHydrated`方法可以检查状态是否已经恢复：

```javascript
const hasHydrated = useBoundStore.persist.hasHydrated()
```

## 案例实践

这里分享一个开源项目 ChatGPT-Next-Web 中的使用（https://github.com/Yidadaa/ChatGPT-Next-Web），这也是一个宝藏项目，可以快速搭建一个自己的GPT。项目中zustand用于全局的状态管理，主要用于存储GPT对话聊天信息。

### 工具方法，createPersistStore

里面所有的状态 store 都是通过该 Util 方法创建的。

```
export function createPersistStore<T extends object, M>(
  state: T,
  methods: (
    set: SetStoreState<T & MakeUpdater<T>>,
    get: () => T & MakeUpdater<T>,
  ) => M,
  persistOptions: SecondParam<typeof persist<T & M & MakeUpdater<T>>>,
) {
  return create(
    persist(
      combine(
        {
          ...state,
          lastUpdateTime: 0,
        },
        (set, get) => {
          return {
            ...methods(set, get as any),

            markUpdate() {
              set({ lastUpdateTime: Date.now() } as Partial<
                T & M & MakeUpdater<T>
              >);
            },
            update(updater) {
              const state = deepClone(get());
              updater(state);
              set({
                ...state,
                lastUpdateTime: Date.now(),
              });
            },
          } as M & MakeUpdater<T>;
        },
      ),
      persistOptions as any,
    ),
  );
}
```

这个函数，在创建 store 的时候，添加了一个记录更新时间的字段，并在数据更新的时候自动更新时间。同时也支持手动触发标记更新。

参数：

- state: 初始状态对象。
- methods: 一个函数，接收 set 和 get 方法，返回一些自定义的方法。这些方法会被合并到最终的 store 中。
- persistOptions: 持久化的选项，这些选项将被传递给 persist 中间件。

函数体：

- 使用 zustand 的 create 函数创建一个 store。
- 在 create 函数内部，首先使用 persist 和 combine 中间件。
- combine 中间件用于合并多个 store 或提供额外的方法。在这里，它合并了初始状态和由 methods 函数提供的方法。
- 在 combine 的回调函数内部，除了通过 methods 函数提供的方法外，还额外添加了两个方法：markUpdate 和 update。
  - markUpdate 方法：更新 lastUpdateTime 字段为当前时间。
  - update 方法：深拷贝当前状态，对拷贝后的状态应用更新函数，然后设置新的状态和 lastUpdateTime。
- 最后，将持久化选项 persistOptions 传递给 persist 中间件。

combine 是 zustand 提供的一个工具函数，用于组合状态和行为方法。它将状态和行为方法组合成一个新的对象，这样你就可以使用 set 和 get 方法来更新和访问状态。

具体来说，combine 接受两个参数：

- 1.初始状态（上面的代码中的 state 和 lastUpdateTime）
- 2.行为方法（一个函数，接收 set 和 get 参数，并返回一些方法，比如 markUpdate 和 update）

这个组合让你可以把状态和方法结合在一起，然后传递给 persist，最终创建出一个带有持久化功能的 store。

### 使用方式

有了工具函数，就可以用来创建具体的 store 了。以下是其中用户配置数据的 store，其他的也差不多，主要是 store 业务方法的完善。

```
export const useAppConfig = createPersistStore(
  { ...DEFAULT_CONFIG },
  (set, get) => ({
    reset() {
      set(() => ({ ...DEFAULT_CONFIG }));
    },

    mergeModels(newModels: LLMModel[]) {
      if (!newModels || newModels.length === 0) {
        return;
      }

      const oldModels = get().models;
      const modelMap: Record<string, LLMModel> = {};

      for (const model of oldModels) {
        // model.available = false;
        modelMap[`${model.name}@${model?.provider?.id}`] = model;
      }

      for (const model of newModels) {
        // model.available = Boolean(newModels.available);
        modelMap[`${model.name}@${model?.provider?.id}`] = model;
      }

      set(() => ({
        models: Object.values(modelMap),
      }));
    },

    allModels() {},
  }),
  {
    name: StoreKey.Config,
    version: 3.9,
    migrate(persistedState, version) {
      const state = persistedState as ChatConfig;

      if (version < 3.4) {
        state.modelConfig.sendMemory = true;
        state.modelConfig.historyMessageCount = 4;
        state.modelConfig.compressMessageLengthThreshold = 1000;
        state.modelConfig.frequency_penalty = 0;
        state.modelConfig.top_p = 1;
        state.modelConfig.template = DEFAULT_INPUT_TEMPLATE;
        state.dontShowMaskSplashScreen = false;
        state.hideBuiltinMasks = false;
      }

      if (version < 3.5) {
        state.customModels = "claude,claude-100k";
      }

      return state as any;
    },
  },
);
```

可以看到，这里主要是这几件事

- 把初始状态传进去
- 增加一些 store 的处理方法：mergeModels、reset
- 定义了迁移策略

在这个项目中，我们也遇到了一个问题，在支持图片之后，存储的聊天记录里，很轻易地就超过了 5M，因为 GPT 本质上是不支持文件的，只支持 base64，聊天记录里有 base64，导致几个来回之后就超过了 5M。然后写入失败导致应用无法正常工作。

![](https://files.mdnice.com/user/70043/3005406f-7666-49c8-8ad7-9ad8b8b6512b.png)

所以我们做了一个调整，写入前，先判断一下大小，过大则淘汰掉最老的那个记录。这种处理，在状态管理中实现就很轻松了，也不用用太大的心理顾虑。

## 结论

Zustand 的持久化功能为 React 应用的状态管理提供了强大的支持，使得状态可以跨页面甚至跨会话持久化。通过上述示例，你应该能够理解如何在你的应用中实现状态的持久化。记得根据你的具体需求选择合适的存储引擎和配置选项。

如果你有任何问题或想要了解更多关于 Zustand 的信息，请访问[Zustand 官方文档](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)。
