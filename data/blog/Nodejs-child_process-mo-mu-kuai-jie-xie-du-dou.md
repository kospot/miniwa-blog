---
layout: PostLayout
title: Nodejs-child_process模块解读
date: 2024-09-10 16:30:39
tags: ['js原理']
summary: 在 Node.js 应用程序中，`child` 进程模块非常重要，有了它可以实现并行处理，这在资源密集型任务里十分重要。在本文中，我们将看一下 `child` 进程模块，解释其目的、使用方式以及如何使用。
---

![](https://files.mdnice.com/user/70043/a3fa4c54-f3d9-4f99-83b8-7cf9bcf52128.png)

在 Node.js 应用程序中，`child` 进程模块非常重要，有了它可以实现并行处理，这在资源密集型任务里十分重要。

在本文中，我们将看一下 `child` 进程模块，解释其目的、使用方式以及如何使用。

## 什么是子进程模块

子进程是核心模块，允许用户创建和控制子进程。这些进程可以执行系统命令、运行各种语言的脚本，甚至可以创建新的 Node.js 实例。

`child` 进程模块的主要目的是允许同时执行多个进程，而不会阻塞主事件循环。

对于需要处理 CPU 密集型操作或执行外部命令和脚本的应用来说，使用 `child` 进程可以确保应用的高性能和响应性。

## 子进程的使用方式

`child` 进程可以用于以下任务：

- **并行处理**：`Child` 处理通过允许应用程序将工作负载分布在多个 CPU 核心上，从而显著提高 CPU 密集型活动（如图像处理和数据分析）的性能。

- **运行 shell 脚本**：`Child` 进程可以用来执行 shell 脚本。您可以使用 `exec` 技术来运行 shell 命令并捕获它们的输出，还可以使用 `spawn` 方法，当直接运行脚本时提供更大的控制。

- **与其他服务通信**：在通信方面，`child` 进程起着至关重要的作用。它可以与外部服务（如数据库、API 或微服务）进行通信。它们可以用来调用外部 API，执行数据库查询，与其它微服务通信。

## 创建子进程

要创建一个 `child` 进程，Node.js 为我们提供了四种主要方法来创建一个 `child` 进程，分别是 `exec()`, `execFile()`, `spawn()`, `fork()`

### `exec()` 方法

`exec()` 方法在 shell 中运行一个命令并缓冲输出。它适用于运行 shell 命令并记录输出。但由于是缓冲，它有内存限制。

下面是一个使用 `exec()` 方法执行命令并获取和处理一些系统信息的例子。

```javascript
const { exec } = require('child_process')

exec('df -h', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`)
    return
  }

  const lines = stdout.trim().split('\n')
  const diskInfo = lines[1].split(/\s+/)

  const totalSpace = diskInfo[1]
  const usedSpace = diskInfo[2]
  const availableSpace = diskInfo[3]
  const usagePercent = diskInfo[4]

  console.log(`Total Space: ${totalSpace}`)
  console.log(`Used Space: ${usedSpace}`)
  console.log(`Available Space: ${availableSpace}`)
  console.log(`Usage: ${usagePercent}`)
})
```

这将执行 df -h 命令，解析其输出，并显示总的、已用的和可用的磁盘空间以及使用百分比。

运行代码时，您应该会看到类似这样的内容：

![img](https://media.dev.to/cdn-cgi/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fo4mih5z3tf4bt1fi67an.png)

### `execFile()` 方法

`execFile()` 方法在没有 shell 的情况下运行可执行文件。它比 `exec()` 更高效，因为它避免了 shell 的开销。

下面是一个如何使用 `execFile()` 方法的例子：

```javascript
const { execFile } = require('child_process')
execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    console.error(`execFile error: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`)
    return
  }
  console.log(`stdout: ${stdout}`)
})
```

这个例子展示了运行 Node.js 可执行文件来获取其版本。当命令不需要 shell 特性时，推荐使用 `execFile()`。

### `spawn()` 方法

与主要用于执行 shell 命令或可执行文件并捕获其输出的 `exec` 方法不同，`spawn()` 方法通过基于流的输出处理、直接与可执行文件交互、事件驱动的通信，提供了对 `child` 进程的更多控制。

`spawn()` 方法可用于需要直接交互的复杂场景。`spawn()` 启动一个新进程，给定一个命令，并提供流 i.e stdout, stderr 用于直接处理进程的输出和错误。

下面是一个如何使用 `spawn()` 方法的例子

```javascript
const { spawn } = require('child_process')

const ls = spawn('ls', ['-lh', '/usr'])

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`)
})

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`)
})

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`)
})
```

在这个例子中，`spawn()` 运行 `ls` 命令并附加事件侦听器来处理进程的输出和退出状态。

运行代码时，您应该会看到类似这样的内容：

![img](https://media.dev.to/cdn-cgi/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Feurmmo661z0o40pyx7f9.png)

### `fork()` 方法

`fork()` 方法可以说是为创建新的 Node.js 进程而设计的 `spawn()` 的变体。与可以启动任何类型进程的 `spawn()` 不同，`fork()` 方法针对创建本身是 Node.js 应用程序的 `child` 进程进行了优化。

它为 `child` 进程提供了一个额外的通信通道，允许在父进程和 `child` 进程之间进行简单的消息传输。

下面是一个如何使用 `fork()` 方法的例子。

父文件，即 `parent.js`：

```javascript
const { fork } = require('child_process')

const child = fork('child.js')

child.on('message', (message) => {
  console.log(`Message from child: ${message}`)
})

child.send('Hello, child process!')
```

`child` 进程文件，即 `child.js`：

```javascript
process.on('message', (message) => {
  console.log(`Message from parent: ${message}`)
  process.send('Hello from child process!')
})
```

在这里，`fork()` 创建了一个运行 `child.js` 脚本的新 Node.js 进程。它允许使用 send() 和 message 事件在父进程和子进程之间传递消息。

当您运行代码时，您应该会看到类似这样的内容：

![img](https://media.dev.to/cdn-cgi/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fqwse7atj0qnubkgx0ni2.png)

### `fork()` 与 `spawn()` 之间的区别

`fork` 和 `spawn` 之间的一些区别包括：

- **内置通信通道**：`fork()` 在父进程和 `child` 进程之间自动设置了一个 IPC（进程间通信）通道。相比之下，`spawn()` 默认不建立这个通道；如果需要，开发人员必须手动配置 IPC。

- **隔离和独立性**：每个由 `fork()` 生成的 `child` 进程都是一个单独的 Node.js 进程，拥有自己的 V8 实例。另一方面，`spawn()` 方法可以启动任何进程，包括 Node.js 应用程序，并不提供相同级别的隔离。

- **用例特异性**：`fork()` 技术专门用于需要生成工作进程的情况，这些工作进程是同一应用程序的一部分，但同时运行。相比之下，`spawn()` 更为通用，用于需要启动 Node.js 生态系统之外的任意命令或脚本时。

## 处理子进程输出

当创建一个 `child` 进程时，它会在两个主要流中产生输出：`stdout` 和 `stderr`。这些流保存了由 `child` 进程运行的命令或脚本的结果。要收集此输出，请为 `child` 进程对象添加事件侦听器，以在 `stdout` 和 `stderr` 上的 `data` 事件上。

Node.js 提供了几种特别有用的事件侦听器，用于处理 `child` 进程输出和错误。其中包括：

- `Data`：数据事件由代表子进程的 stdout 和 stderr 的流发出。

- `Error`：
  当 `child` 进程执行过程中发生错误时，会触发错误事件。这可能是由于命令本身的问题，或者是读取 `stdout` 或 `stderr` 时出现问题。

- `Close`：当 `child` 进程结束时，会发出关闭事件，表明它是否成功终止或被杀死。

让我们看一个示例，展示如何生成一个 `child` 进程，捕获其输出，并处理可能发生的任何错误。

我们将使用 `spawn()` 方法来启动一个简单的命令（`echo`）并侦听输出和错误。

```javascript
const { spawn } = require('child_process')

const child = spawn('echo', ['Hello, world'])

child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`)
})

child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`)
})

child.on('error', (error) => {
  console.error(`Error occurred: ${error.message}`)
})

child.on('close', (code) => {
  console.log(`Child process exited with code ${code}`)
})
```

在这个例子中，父进程生成一个 `child` 进程来执行 `echo` 命令，该命令简单地将 `Hello, world!` 打印到终端。

父进程通过附加到 `stdout` 和 `stderr` 的 `data` 事件侦听器来捕获此输出。此外，它还侦听 `error` 事件以捕获在执行 `child` 进程期间可能发生的任何错误。

最后，`close` 事件指示 `child` 进程已完成执行，以及退出代码，这可以用来确定进程是否成功完成。

## 进程间通信

在分布式系统和并发编程中，进程间通信对于组件协调至关重要。Node.js 通过其 `child` 进程模块改进了这种通信。这使您能够创建 `child` 进程并促进进程间通信（IPC）。

这种 IPC 机制，特点是父进程和 `child` 进程之间交换数据，对于构建模块化和可扩展的应用程序至关重要。

有几种方法可以促进；一个突出的方法是通过 `send()` 方法和 `message` 事件进行消息传递。这种方法利用了 `child` 进程对象上可用的 `send()` 函数，向 `child` 进程发送消息，而 `child` 进程使用 `message` 事件侦听这些消息。

让我们用一个实际的例子来说明。我们将创建一个简单的应用程序，其中父进程分叉一个 `child` 进程，并使用 `send()` 方法和 `message` 事件与之通信。

父文件，即 `parent.js`，将如下所示：

```javascript
const { fork } = require('child_process')

const child = fork('./child.js')

child.send({ greeting: 'Hello from parent!' })

child.on('message', (msg) => {
  console.log('Message from child:', msg)
})

console.log('Waiting for response...')
```

`child` 进程文件，即 `child.js`：

```javascript
process.on('message', (msg) => {
  console.log('Message received from parent:', msg)

  process.send({ response: 'Hello from child!' })
})
```

在这个例子中，父进程向 `child` 进程发送一条包含问候语的消息。`child` 进程侦听此消息，记录它，然后向父进程发送一条响应。父进程也侦听来自 `child` 进程的传入消息，并在收到时记录它们。

使用 `send()` 和 `message` 事件进行 IPC 的这种模式在需要协调父进程和 `child` 进程之间的操作时特别有用，例如共享数据、触发操作或在 Node.js 应用程序中实现请求-响应模式。

![img](https://media.dev.to/cdn-cgi/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fyd5ulrpvp2olmpjjpuqn.png)

## 管理子进程的最佳实践

以下是一些用于有效管理 `child` 进程的最佳实践：

- **监控系统资源**：最佳实践之一是定期监控系统的 CPU、内存和网络使用情况，以识别潜在的瓶颈或资源泄漏。使用诸如 top 和 ps 之类的工具可以为您提供资源消耗的实时洞察。

- **为长时间运行的进程设置超时**：使用 `spawn()` 中的 `timeout` 选项自动终止在指定持续时间后仍在运行的 `child` 进程。这对于避免长时间运行的活动占用资源非常有益。

- **实施优雅的关闭程序**：优雅关闭程序是指服务器已响应所有请求，并且没有剩余的数据处理工作。始终确保 `child` 进程可以优雅地关闭，释放资源并执行任何必要的清理工作。这可以通过侦听终止信号并相应地响应来实现。

- **应用 kill 方法**：使用适当的信号（例如，`SIGTERM` 用于优雅关闭，`SIGKILL` 作为最后手段）。验证进程是否已成功终止。在应用 kill 方法时处理潜在错误。

## 子进程与工作线程

虽然 `child` 进程对某些工作很有用，但 Node.js 还提供了另一种并行执行的方法。这种方法被称为工作线程，它与 `child` 进程完全不同。

`worker threads` 模块在 Node.js v10.50 中引入。与 `child` 进程相比，它提供了一种更有效的方式来处理多线程。下面是一个突出它们差异的表格

| 特性         | 工作线程                                         | 子进程                                      |
| ------------ | ------------------------------------------------ | ------------------------------------------- |
| **内存隔离** | 与父进程共享内存空间                             | 每个子进程都有自己的内存堆（完全隔离）      |
| **通信**     | 使用消息传递，开销较小（通过 SharedArrayBuffer） | 通过 IPC 通道通信，开销较大                 |
| **性能**     | 更轻量级，频繁数据交换的开销较低                 | 通信频繁时开销较高                          |
| **用例**     | 平行计算，需要频繁数据交换的任务                 | CPU 密集型任务，运行外部脚本，隔离任务      |
| **错误隔离** | 错误可能影响主线程                               | 子进程中的错误不影响父进程                  |
| **API 模块** | `worker_threads`                                 | `child_process`                             |
| **创建方法** | `new Worker()`                                   | `spawn()`, `fork()`, `exec()`, `execFile()` |
| **多线程**   | 真正的多线程，共享内存                           | 单独的进程，没有真正的多线程                |
| **开销**     | 由于共享内存而较低                               | 由于完全创建进程而较高                      |
| **资源管理** | 在同一进程内管理                                 | 为每个进程分配单独的资源                    |

### 何时使用子进程

当您需要完全隔离时，例如运行外部脚本或管理可能会使父进程崩溃的 CPU 密集型任务，可以使用 `child` 进程。

### 何时使用工作线程

另一方面，当任务从共享内存和频繁通信中受益时，可以使用 `worker` 线程，例如数据处理和并行计算。

## 结论

`child` 进程模块有助于执行并行任务，运行外部脚本和管理子进程。当您理解这些方法以及如何实现它们时，您将能够显著提高应用程序的性能和可扩展性。
