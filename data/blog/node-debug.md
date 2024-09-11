---
layout: PostLayout
title: 探索 Node.js 调试技巧与 VS Code 的调试方法
date: 2024-07-18
tags: ['js原理']
summary: 今天，我们将深入探讨 Node.js 的调试方法，并重点介绍如何使用 Visual Studio Code（VS Code）来调试 Node.js 应用。
---

![](https://files.mdnice.com/user/70043/02a084ad-b9ec-4746-b163-05f816e60f79.png)

**不会调试 Node.js 的开发不是一位合格的开发人员。**

今天，我们将深入探讨 Node.js 的调试方法，并重点介绍如何使用 Visual Studio Code（VS Code）来调试 Node.js 应用。

## Node.js 调试原理

在我们深入探讨具体的调试工具和方法之前，先了解一些基础原理是非常有帮助的。Node.js 基于 V8 引擎运行，而 V8 引擎本身提供了内置的调试支持。V8 的调试协议允许开发者在应用程序运行时设置断点、检查变量值、执行代码片段等。

V8 的调试协议是基于 Chrome DevTools Protocol（CDP）的，许多调试工具和 IDE（包括 VS Code）都依赖于这个协议与 Node.js 进行交互。CDP 提供了一系列用于控制和监控 JavaScript 运行时的 API，使得调试工具能够提供丰富的调试功能。

### Chrome DevTools Protocol（CDP）

Chrome DevTools Protocol 是由 Google Chrome 团队开发的一套用于与浏览器进行通信的协议。CDP 允许开发者控制和检查浏览器的状态，包括 DOM、CSS、网络、内存、性能和 JavaScript 调试等。

CDP 由一组域（Domains）组成，每个域负责特定的一类功能。主要的域包括：

- **Page**：管理页面的生命周期和内容。
- **DOM**：操作文档对象模型。
- **CSS**：控制样式表。
- **Network**：监控和控制网络请求。
- **Debugger**：管理 JavaScript 断点和执行状态。
- **Runtime**：管理 JavaScript 执行环境。
- **Console**：控制控制台输出。

每个域包含多个命令和事件。命令用于触发特定的操作，而事件则是在特定情况下由浏览器或 Node.js 主动发出的通知。

CDP 基于 WebSocket 协议进行通信，客户端（例如调试工具）与服务器端（例如 Chrome 浏览器或 Node.js 应用）通过 WebSocket 连接交换消息。消息分为请求和响应，客户端发送请求，服务器端返回响应。此外，服务器端还会主动发送事件消息，以通知客户端发生的变化。

我们可以通过以下步骤使用 CDP 调试 Node.js 应用：

1. 启动 Node.js 应用，并开启调试模式：

   ```bash
   node --inspect app.js
   ```

2. Node.js 将输出类似以下的信息，表明调试服务器已经启动：

   ```
   Debugger listening on ws://127.0.0.1:9229/12345678-1234-5678-1234-567812345678
   For help, see: https://nodejs.org/en/docs/inspector
   ```

3. 使用 Chrome 浏览器或其他支持 CDP 的工具连接到调试服务器：

   ```javascript
   const WebSocket = require('ws')
   const ws = new WebSocket('ws://127.0.0.1:9229/12345678-1234-5678-1234-567812345678')

   ws.on('open', () => {
     console.log('Connected to Node.js debugger')
     ws.send(
       JSON.stringify({
         id: 1,
         method: 'Runtime.enable',
       })
     )
   })

   ws.on('message', (data) => {
     console.log('Received message:', data)
   })
   ```

在上面的示例中，我们使用了 `ws` 模块（一个 WebSocket 客户端库）连接到 Node.js 调试服务器，并发送了一条启用 `Runtime` 域的命令。接下来，你可以发送更多的命令来控制和监控 Node.js 应用。

以下是一些常用的 CDP 命令和事件：

`Debugger.enable`

启用调试器，开始接收调试相关的事件和命令。

```json
{
  "id": 1,
  "method": "Debugger.enable"
}
```

`Debugger.setBreakpointByUrl`

在指定的 URL 和行号设置断点。

```json
{
  "id": 2,
  "method": "Debugger.setBreakpointByUrl",
  "params": {
    "url": "file:///path/to/file.js",
    "lineNumber": 10
  }
}
```

`Debugger.paused`

当脚本执行暂停时（例如，遇到断点），调试器会发送 `Debugger.paused` 事件。

```json
{
  "method": "Debugger.paused",
  "params": {
    "callFrames": [...],
    "reason": "breakpoint",
    "data": {...}
  }
}
```

`Runtime.evaluate`

在全局上下文中执行 JavaScript 表达式，并返回结果。

```json
{
  "id": 3,
  "method": "Runtime.evaluate",
  "params": {
    "expression": "2 + 2"
  }
}
```

另一个 JS 世界大名鼎鼎的无头浏览器，Puppeteer，它内部也是使用 CDP 与浏览器进行通信，达到控制浏览器自身的效果。

```javascript
const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto('https://example.com')
  // 其他操作...
  await browser.close()
})()
```

### 内置调试器

Node.js 可以通过以下命令启动：

```bash
node inspect app.js
```

或者在运行代码时加上 `--inspect` 标志：

```bash
node --inspect app.js
```

又或者在运行代码时加上 `--inspect-brk` 标志，其会在定一行进入断点状态：

```bash
node --inspect-brk app.js
```

启动好调试服务器，就可以通过 Chrome 浏览器来调试程序了，输入`chrome://inspect`会看到如下界面。

![](https://files.mdnice.com/user/70043/bd3c4a24-54b4-40f3-b65e-6b620a66eafb.png)

点击 inspect 就会自动打开一个调试开发者工具。

![](https://files.mdnice.com/user/70043/31a08734-99a4-476d-9927-8659aa731aad.png)

注意：如果 Node.js 调试服务器运行在非默认端口或者远程设备上，你需要手动添加调试目标：

![](https://files.mdnice.com/user/70043/6a3cc379-1053-4022-94e9-339c83b4cb4c.png)

1. 点击页面中的 “Configure…” 按钮。
2. 在弹出的对话框中，添加调试服务器的地址，例如 `localhost:9229` 或 `192.168.1.100:9229`。
3. 点击 “Done” 确认。

`chrome://inspect` 是 Chrome 浏览器提供的一个特殊页面，允许开发者管理和调试 Node.js 应用及远程设备上的 Chrome 实例。其主要功能如下：

1. **发现和管理本地和远程目标**：`chrome://inspect` 页面可以自动发现本地和远程的 Node.js 调试目标以及设备上的 Chrome 实例。
2. **连接到 Node.js 调试服务器**：通过该页面，开发者可以快速连接到 Node.js 应用的调试服务器，使用 Chrome DevTools 进行调试。
3. **配置自定义目标**：开发者可以手动添加自定义的调试目标，例如远程的 Node.js 服务器或其他设备上的 Chrome 实例。

除了调试 Node.js 应用，`chrome://inspect` 还可以用于管理和调试其他目标设备上的 Chrome 实例。例如，你可以用它来调试 Android 设备上的 Chrome 浏览器：

1. 在 Android 设备上启用开发者选项和 USB 调试。
2. 使用 USB 数据线连接 Android 设备和你的电脑。
3. 在 Chrome 浏览器地址栏中输入 `chrome://inspect`，并按下回车键。
4. 在 “Devices” 部分，你应该能够看到连接的 Android 设备和打开的 Chrome 页面。
5. 点击页面右侧的 “inspect” 按钮，Chrome DevTools 将会打开并连接到 Android 设备上的 Chrome 实例。

## 使用 VS Code 调试 Node.js

谷歌浏览器调试太麻烦？想想也是，后端通常都是直接在编辑器里断点调试的。在 vscode 上也是支持这种功能的。

VS Code 的调试功能基于 V8 调试协议，可以与 Node.js 内置的调试器进行通信。当你在 VS Code 中启动调试会话时，编辑器会通过调试协议与 Node.js 进程进行交互，从而实现断点、单步执行、变量检查等功能。

### 配置 VS Code 进行 Node.js 调试

要在 VS Code 中调试 Node.js 应用，需要进行一些基本的配置。以下是配置步骤：

#### 第一步：安装 Node.js 扩展（非必需）

打开 VS Code，进入扩展视图，搜索并安装 "Node.js Extension Pack"。实际上 VS Code 默认是支持 Node.js 调试的。Node.js Extension Pack 不是必需的，但它包含了多个实用的扩展，可以帮助你快速设置开发环境。

#### 第二步：创建调试配置文件

在项目根目录下创建一个 `.vscode` 文件夹，并在其中创建 `launch.json` 文件。这个文件用于配置调试任务。

1. 打开 VS Code。
2. 按 `Ctrl+Shift+D` 打开调试视图。
3. 点击调试视图顶部的齿轮图标，选择 "Node.js" 创建默认的 `launch.json` 文件。

默认的 `launch.json` 文件可能如下所示：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/app.js"
    }
  ]
}
```

#### 第三步：配置调试选项

根据项目的具体需求，调整 `launch.json` 中的配置项：

- `type`：调试类型，Node.js 应用通常为 `node`。
- `request`：请求类型，`launch` 表示启动新进程，`attach` 表示附加到已有进程。
- `name`：调试配置的名称。
- `skipFiles`：指定跳过的文件（如 Node.js 内部模块）。
- `program`：要调试的程序入口文件。

以下是一些常见的配置示例：

##### 启动 Node.js 程序

```json
{
  "type": "node",
  "request": "launch",
  "name": "Launch Program",
  "program": "${workspaceFolder}/app.js",
  "skipFiles": ["<node_internals>/**"]
}
```

##### 附加到已运行的 Node.js 进程

```json
{
  "type": "node",
  "request": "attach",
  "name": "Attach to Process",
  "processId": "${command:PickProcess}",
  "skipFiles": ["<node_internals>/**"]
}
```

##### 使用 Nodemon 进行自动重启调试

```json
{
  "type": "node",
  "request": "launch",
  "name": "Nodemon",
  "runtimeExecutable": "nodemon",
  "program": "${workspaceFolder}/app.js",
  "restart": true,
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

完成配置后，可以开始调试 Node.js 应用。以下是一些常见的调试操作：

**设置断点**

在代码编辑器中，点击行号左侧的灰色区域即可设置断点。断点设置后，灰色圆点会变成红色。

**启动调试**

按 `F5` 或点击调试视图中的绿色播放按钮启动调试。VS Code 会启动 Node.js 应用，并在遇到断点时暂停执行。

**查看变量**

在调试暂停时，可以在 "变量" 视图中查看当前作用域内的变量值。此外，鼠标悬停在变量上方时，也会显示变量的当前值。

**单步执行**

使用调试工具栏中的单步执行按钮，可以逐行执行代码：

- 单步跳过（F10）：执行当前行，跳过函数调用。
- 单步进入（F11）：执行当前行，进入函数内部。
- 单步退出（Shift+F11）：执行完当前函数，返回调用处。

**调试控制台**

调试过程中，可以使用调试控制台输入和执行 JavaScript 代码，查看或修改变量值。

### VS Code Node.js 调试最佳实践

#### 使用环境变量配置

在 `launch.json` 中使用 `env` 配置项设置环境变量：

```json
{
  "type": "node",
  "request": "launch",
  "name": "Launch Program",
  "program": "${workspaceFolder}/app.js",
  "env": {
    "NODE_ENV": "development",
    "API_KEY": "your-api-key"
  }
}
```

#### 使用任务自动化调试流程

结合 VS Code 的任务系统，可以自动化启动和调试流程。例如，先启动数据库服务，再启动应用调试：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start MongoDB",
      "type": "shell",
      "command": "mongod",
      "isBackground": true
    },
    {
      "label": "Launch Program",
      "type": "shell",
      "command": "node app.js",
      "isBackground": true,
      "dependsOn": "Start MongoDB"
    }
  ]
}
```

## 总结

调试是 Node.js 开发过程中至关重要的一环。通过理解调试原理，掌握使用 VS Code 调试的技巧，并遵循最佳实践，你可以大大提高调试效率，快速定位和解决问题。

希望这篇文章能帮助你更好地理解和应用 Node.js 的调试方法。如果你有任何问题或建议，欢迎在评论区留言，我们一起讨论交流！
