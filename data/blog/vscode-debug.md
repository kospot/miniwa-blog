---
layout: PostLayout
title: 基于VSCode的Nodejs调试
date: 2024-07-28
tags: ['js原理']
summary: 谷歌开发者工具被大家喜爱的原因是因为其调试方便，也支持实时在控制台输出，结合远程调试nodejs也确实可以做到这个。而launch.json让我们可以把谷歌开发者工具迁移到VScode上，直接在编码工具上调试。
---

谷歌开发者工具被大家喜爱的原因是因为其调试方便，也支持实时在控制台输出，结合远程调试 nodejs 也确实可以做到这个。而 launch.json 让我们可以把谷歌开发者工具迁移到 VScode 上，直接在编码工具上调试。

![](https://files.mdnice.com/user/70043/8656afbc-0e4c-4931-aa47-3c80666c768f.png)

launch.json 是 VS Code 用于配置调试环境的 JSON 文件。通过 launch.json，开发者可以定义各种调试配置，例如调试类型（如 Node.js、Chrome 等）、调试的启动参数、环境变量等。还可以结合 task.json 配置各种任务。

它通常位于项目的 .vscode 目录下，是 VS Code 自动生成和管理的文件之一。

REPL（Read-Eval-Print Loop），这个可以科普一下，直白点就是控制台。是一个交互式编程环境，允许用户输入代码，立即执行并显示结果。在前端开发和调试中，REPL 工具非常有用，尤其是在快速测试代码片段和调试复杂逻辑时。VS Code 提供了内置的 REPL 支持，结合 launch.json 可以大大提升开发体验。

REPL 的核心原理是通过一个循环，不断读取用户输入，执行代码，并输出结果。在 VS Code 中，调试控制台和集成终端实现了类似的功能，通过与调试器的交互，实现动态调试和即时反馈。

## 我的示例

以下是我的一些配置用例：

自定义的启动命令，需要做自定义的传参时。其中`--`是为了透传后面的参数到 npm。

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "command": "npm run review -- --xxxxx",
      "name": "debug review",
      "cwd": "${workspaceFolder}/packages/code-review-gpt",
      "request": "launch",
      "type": "node-terminal"
    }
  ]
}
```

使用 runtimeArgs 时：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Egg Debug",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "debug", "--", "--inspect-brk"],
      "console": "integratedTerminal",
      "restart": true,
      "autoAttachChildProcesses": true
    }
  ]
}
```

如果都不想配置，也可以安装这个插件：**JavaScript Debugger**

![](https://files.mdnice.com/user/70043/eef1e9f6-4404-49f0-8a83-8721318a60e2.png)

![](https://files.mdnice.com/user/70043/9ecaf73f-c30d-4ad0-b7c7-84d94eb3a787.png)

选择 debug npm script 就可以选择你要调试的启动脚本了。

## `launch.json` 配置项详解

`launch.json` 文件用于定义调试配置，每个配置项都可以帮助你控制调试器的行为。以下是一些常见的配置项及其详细说明：

### 顶级配置项

1. **version**

   - **描述**：指定 `launch.json` 文件的版本。
   - **类型**：`string`
   - **默认值**：`"0.2.0"`
   - **是否必须**：是
   - **示例**：
     ```json
     {
       "version": "0.2.0",
       "configurations": []
     }
     ```

2. **configurations**
   - **描述**：包含一个或多个调试配置的数组。
   - **类型**：`array`
   - **默认值**：无
   - **是否必须**：是
   - **示例**：
     ```json
     {
       "version": "0.2.0",
       "configurations": [
         {
           // 具体配置项
         }
       ]
     }
     ```

### 调试配置项

每个调试配置项位于 `configurations` 数组内，以下是常见的调试配置项：

**强制性的配置，必不可少的：**

1. **type**

   - **描述**：指定调试器的类型，例如 `node`、`node-terminal`、`chrome` 等。
   - **类型**：`string`
   - **默认值**：无
   - **是否必须**：是
   - **示例**：
     ```json
     {
       "type": "node"
     }
     ```

2. **request**

   - **描述**：指定调试请求的类型，可以是 `launch`（启动）或 `attach`（附加到已运行的进程）。
   - **类型**：`string`
   - **默认值**：无
   - **是否必须**：是
   - **示例**：
     ```json
     {
       "request": "launch"
     }
     ```

3. **name**
   - **描述**：配置的名称，便于识别和选择。
   - **类型**：`string`
   - **默认值**：无
   - **是否必须**：是
   - **示例**：
     ```json
     {
       "name": "启动程序"
     }
     ```

**其他配置项**

4. **program**

   - **描述**：要调试的程序入口文件路径。
   - **类型**：`string`
   - **默认值**：无
   - **是否必须**：通常是
   - **示例**：
     ```json
     {
       "program": "${workspaceFolder}/app.js"
     }
     ```

5. **cwd**

   - **描述**：当前工作目录。
   - **类型**：`string`
   - **默认值**：`${workspaceFolder}`
   - **是否必须**：否
   - **示例**：
     ```json
     {
       "cwd": "${workspaceFolder}"
     }
     ```

6. **env**

   - **描述**：环境变量配置。
   - **类型**：`object`
   - **默认值**：无
   - **是否必须**：否
   - **示例**：
     ```json
     {
       "env": {
         "NODE_ENV": "development"
       }
     }
     ```

7. **preLaunchTask**

   - **描述**：在启动调试会话前执行的任务。
   - **类型**：`string`
   - **默认值**：无
   - **是否必须**：否
   - **示例**：
     ```json
     {
       "preLaunchTask": "build"
     }
     ```

8. **postDebugTask**

   - **描述**：在调试会话结束后执行的任务。
   - **类型**：`string`
   - **默认值**：无
   - **是否必须**：否
   - **示例**：
     ```json
     {
       "postDebugTask": "cleanup"
     }
     ```

9. **outFiles**

   - **描述**：指定调试时输出文件的路径模式，支持 glob 模式，通常和 souceMap 搭配使用。主要作用是帮助调试器找到编译后的 JavaScript 文件，以便进行断点设置和调试。在调试 TypeScript 或其他需要编译的语言时，使用 outFiles 可以确保断点正确映射到原始源代码，而不是编译后的代码。
   - **类型**：`array`
   - **默认值**：无
   - **是否必须**：否
   - **示例**：
     ```json
     {
       "outFiles": ["${workspaceFolder}/dist/**/*.js"]
     }
     ```

10. **sourceMaps**

    - **描述**：是否启用源码映射，通常用于 TypeScript 或 Babel 编译后的代码调试。
    - **类型**：`boolean`
    - **默认值**：`false`
    - **是否必须**：否
    - **示例**：
      ```json
      {
        "sourceMaps": true
      }
      ```

11. **restart**

    - **描述**：是否在调试会话意外终止时自动重新启动。
    - **类型**：`boolean`
    - **默认值**：`false`
    - **是否必须**：否
    - **示例**：
      ```json
      {
        "restart": true
      }
      ```

12. **console**
    - **描述**：指定控制台类型，可以是 `internalConsole`（内部控制台）、`integratedTerminal`（集成终端）或 `externalTerminal`（外部终端）。
    - **类型**：`string`
    - **默认值**：`internalConsole`
    - **是否必须**：否
    - **示例**：
      ```json
      {
        "console": "integratedTerminal"
      }
      ```

### 针对不同调试器的特定配置项

不同的调试器（如 Node.js、Chrome）有特定的配置项，以下是一些常见的例子：

#### Node.js 调试器

1. **runtimeExecutable**

   - **描述**：指定 Node.js 的可执行文件路径，默认为环境变量 `PATH` 中的 `node`。
   - **类型**：`string`
   - **默认值**：无
   - **是否必须**：否
   - **示例**：
     ```json
     {
       "runtimeExecutable": "/usr/local/bin/node"
     }
     ```

2. **runtimeArgs**

   - **描述**：启动 Node.js 时的命令行参数。
   - **类型**：`array`
   - **默认值**：无
   - **是否必须**：否
   - **示例**：
     ```json
     {
       "runtimeArgs": ["--nolazy"]
     }
     ```

3. **skipFiles**
   - **描述**：在调试过程中跳过的文件或模块，支持 glob 模式。
   - **类型**：`array`
   - **默认值**：无
   - **是否必须**：否
   - **示例**：
     ```json
     {
       "skipFiles": ["<node_internals>/**"]
     }
     ```

#### Chrome 调试器

1. **url**

   - **描述**：指定要调试的网页 URL。
   - **类型**：`string`
   - **默认值**：无
   - **是否必须**：是（`request` 为 `launch` 时）
   - **示例**：
     ```json
     {
       "url": "http://localhost:3000"
     }
     ```

2. **webRoot**

   - **描述**：指定调试的网页根目录。
   - **类型**：`string`
   - **默认值**：`${workspaceFolder}`
   - **是否必须**：否
   - **示例**：
     ```json
     {
       "webRoot": "${workspaceFolder}/src"
     }
     ```

3. **userDataDir**
   - **描述**：指定 Chrome 的用户数据目录。
   - **类型**：`string`
   - **默认值**：无
   - **是否必须**：否
   - **示例**：
     ```json
     {
       "userDataDir": "${workspaceFolder}/.vscode/chrome"
     }
     ```
