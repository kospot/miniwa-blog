---
layout: PostLayout
title: window-ai
date: 2024-07-12
tags: ['js原理']
summary: 之前介绍了如何在控制台使用window.ai的功能，多少体验上不太好。这次结合transformers.js来看看最新的打开方式。
---

> 之前介绍了如何在控制台使用 window.ai 的功能，多少体验上不太好。这次结合 transformers.js 来看看最新的打开方式。

transformers.js 是一个 JavaScript 库，直接在浏览器运行，不需要服务器。支持如下功能：

- 📝 自然语言处理：文本分类、命名实体识别、问题回答、语言建模、总结、翻译、多项选择和文本生成。
- 🖼️ 计算机视觉：图像分类、对象检测和分割。
- 🗣️ 音频：自动语音识别和音频分类。
- 🐙 多模态：零拍摄图像分类。

最近它也支持谷歌内置的模型，具体可以参考：https://github.com/xenova/transformers.js/tree/chrome-built-in-ai

在这里，我们直接来看看它是如何跟谷歌内置模型搭配使用的。先来体验一下案例。

# Demo 案例

结合 transformers.js 使用，速度还是很快的。

https://windowai.miniwa.site/

主要包含以下功能

- 检测是否支持 window.ai
- 点击加载模型后，可以实现模型对话聊天

![](https://files.mdnice.com/user/70043/f539e52f-1d4b-44cf-87f0-68bff1cba4c2.png)

![](https://files.mdnice.com/user/70043/71244e8a-88d2-4405-8333-99bd18cd8462.png)

开启浏览器支持 window.ai 可以参考这个文章：https://juejin.cn/post/7387306673207050292#comment

### 模型相关的实现

首先需要加载模型，transformers.js 提供了简单的 api 来实现模型加载

```
pipeline('text-generation', 'Xenova/gemini-nano');
```

作者使用的是一个单例的模式：

```
class TextGenerationPipeline {
    static model_id = 'Xenova/gemini-nano';
    static instance = null;

    static async getInstance() {
        this.instance ??= pipeline('text-generation', this.model_id);
        return this.instance;
    }
}
```

主要流程是加载和通信，考虑到 ai 交互可能是一个耗时的操作。作者使用了 worker 处理。以下是 worker 的主要代码：

```

import {
    pipeline,
    InterruptableStoppingCriteria,
    RawTextStreamer,
} from '@xenova/transformers';

async function generate(messages) {
    const generator = await TextGenerationPipeline.getInstance();

    const cb = (output) => {
        self.postMessage({
            status: 'update',
            output,
        });
    }

    const streamer = new RawTextStreamer(cb);
    self.postMessage({ status: 'start' });

    const output = await generator(messages, {
        streamer,
        stopping_criteria,

        // Greedy search
        top_k: 1,
        temperature: 0,
    })

    if (output[0].generated_text.length === 0) {
        // No response was generated
        self.postMessage({
            status: 'update',
            output: ' ', tps: null, numTokens: 0,
        });
    }

    // Send the output back to the main thread
    self.postMessage({
        status: 'complete',
        output: output[0].generated_text,
    });
}

async function load() {
    self.postMessage({
        status: 'loading',
        data: '正在加载模型...'
    });

    // 获取模型实例
    const generator = await TextGenerationPipeline.getInstance(x => {
        self.postMessage(x);
    });

    self.postMessage({
        status: 'loading',
        data: '正在加载模型...'
    });

    // 检测是否已经ready
    await generator('1+1=');
    self.postMessage({ status: 'ready' });
}
// 监听消息
self.addEventListener('message', async (e) => {
    const { type, data } = e.data;

    switch (type) {
        case 'load':
            load().catch((e) => {
                self.postMessage({
                    status: 'error',
                    data: e,
                });
            });
            break;

        case 'generate':
            stopping_criteria.reset();
            generate(data);
            break;

        case 'interrupt':
            stopping_criteria.interrupt();
            break;

        case 'reset':
            stopping_criteria.reset();
            break;
    }
});

```

可以看到这里主要是通过监听 message 消息跟外界交互。

- self，类似于主线程中的 window 对象，指向 woker 自身；
- 收到 load 指令时，启动模型加载，并内部测试
- 收到 generate 指令时，调用模型的 generator 方法获取模型结果，并通过 postMessage 传递出去
