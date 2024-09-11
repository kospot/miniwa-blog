---
layout: PostLayout
title: 管理工具：nvm、volta 和 asdf
date: 2024-07-22
tags: ['js原理']
summary: 在前端开发中，管理 Node.js 版本是一个常见需求。nvm、Volta 和 asdf 是三个流行的工具，它们都能帮助你方便地切换和管理不同的 Node.js 版本。那么，它们各自的使用方法、原理和注意事项有什么不同呢？本文将对比这三个工具，并给出一些建议。
---

# nvm、volta 和 asdf

在前端开发中，管理 Node.js 版本是一个常见需求。nvm、Volta 和 asdf 是三个流行的工具，它们都能帮助你方便地切换和管理不同的 Node.js 版本。那么，它们各自的使用方法、原理和注意事项有什么不同呢？本文将对比这三个工具，并给出一些建议。

# 使用方法

## nvm

**安装 nvm**

1. 打开终端，运行以下命令：
   ```sh
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
   ```
2. 安装完毕后，重新启动终端或运行以下命令加载 nvm：
   ```sh
   source ~/.nvm/nvm.sh
   ```

**使用 nvm**

1. 查看可用的 Node.js 版本：
   ```sh
   nvm ls-remote
   ```
2. 安装指定版本：
   ```sh
   nvm install 14.17.0
   ```
3. 切换 Node.js 版本：
   ```sh
   nvm use 14.17.0
   ```
4. 设置默认版本：
   ```sh
   nvm alias default 14.17.0
   ```

## nvm-windows

nvm-windows 是 nvm 的一个 Windows 版本，但它是一个独立的项目，专门为 Windows 平台设计。由于 Windows 系统与 Unix 系统在一些底层机制上的差异，nvm-windows 并不能直接复用 nvm 的代码，因此它是从头开始开发的。nvm-windows 使用了不同的实现方式，但提供了与 nvm 类似的功能。

**安装 nvm-windows**

1. 下载 [nvm-windows 安装程序](https://github.com/coreybutler/nvm-windows/releases)。
2. 运行安装程序并按照提示完成安装。

**使用 nvm-windows**

1. 查看可用的 Node.js 版本：
   ```sh
   nvm list available
   ```
2. 安装指定版本：
   ```sh
   nvm install 14.17.0
   ```
3. 切换 Node.js 版本：
   ```sh
   nvm use 14.17.0
   ```

## Volta

**安装 Volta**

1. 打开终端，运行以下命令：
   ```sh
   curl https://get.volta.sh | bash
   ```
2. 按照提示完成安装，确保 `~/.volta` 被添加到系统路径中。

window 版本可以直接下载 exe 安装

**使用 Volta**

1. 安装 Node.js：
   ```sh
   volta install node@14.17.0
   ```
2. 切换 Node.js 版本：
   ```sh
   volta pin node@14.17.0
   ```
3. 安装 npm 包并锁定版本：
   ```sh
   volta install yarn
   ```

## asdf

**安装 asdf**

1. 打开终端，运行以下命令：
   ```sh
   git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.8.1
   ```
2. 将以下内容添加到你的 `~/.bashrc` 或 `~/.zshrc` 文件中：
   ```sh
   . $HOME/.asdf/asdf.sh
   . $HOME/.asdf/completions/asdf.bash
   ```
3. 重新加载终端配置文件：
   ```sh
   source ~/.bashrc
   ```

在 Windows 上使用 asdf 依赖 WSL，全称为 Windows Subsystem for Linux，是微软为 Windows 10 和 Windows 11 引入的一项功能，允许用户在 Windows 上运行原生的 Linux 二进制可执行文件。通过 WSL，开发者可以在 Windows 环境中直接使用 Linux 命令行工具、脚本和应用程序，而无需使用虚拟机或双系统。

**使用 asdf**

1. 安装 asdf-nodejs 插件：
   ```sh
   asdf plugin-add nodejs https://github.com/asdf-vm/asdf-nodejs.git
   ```
2. 查看可用的 Node.js 版本：
   ```sh
   asdf list-all nodejs
   ```
3. 安装指定版本：
   ```sh
   asdf install nodejs 14.17.0
   ```
4. 设置全局版本：
   ```sh
   asdf global nodejs 14.17.0
   ```
5. 切换本地版本：
   ```sh
   asdf local nodejs 14.17.0
   ```

# 原理

## nvm 的原理

nvm 通过 shell 脚本实现，安装完成后会在用户的 shell 环境中注入一些命令。当你切换 Node.js 版本时，nvm 会修改 `PATH` 环境变量，使其指向正确的 Node.js 安装目录。它本质上是对 Node.js 二进制文件的一种管理方式，通过动态切换 `PATH` 实现版本切换。

## Volta 的原理

Volta 则是通过一个全局的 shim 层来管理 Node.js 版本。它会拦截所有对 Node.js、npm 以及你通过 Volta 安装的其他工具的调用，然后根据当前项目或全局配置中指定的版本来运行正确的二进制文件。这样，Volta 可以确保你的项目始终使用你指定的版本，而不需要手动切换 `PATH`。

## asdf 的原理

asdf 是一个通用的版本管理工具，它通过插件的方式支持多种编程语言和工具。安装和管理不同版本的 Node.js 是通过 asdf-nodejs 插件实现的。它与 nvm 类似，通过修改 `PATH` 环境变量来切换版本。此外，asdf 还支持 `.tool-versions` 文件，可以为每个项目指定不同的工具和版本。

# 注意事项

## nvm 的注意事项

1. nvm 需要每个 shell 实例都加载一遍，因此在一些 CI 环境或脚本中使用时需要特别注意。
2. 使用 nvm-windows 时，注意它与 Unix 版本的 nvm 并不完全一致，有些命令和行为可能有所不同。
3. 切换版本时可能会遇到需要重新编译 native 模块的问题。

## Volta 的注意事项

1. Volta 的 shim 机制可能会导致一些性能上的开销，尽管这种开销在大多数情况下可以忽略不计。
2. Volta 更关注项目的一致性，如果你有多个项目可能需要不同的 Node.js 版本，Volta 能更好地帮助你管理这种需求。
3. 目前 Volta 的社区和生态还没有 nvm 成熟，但它正在快速发展。

## asdf 的注意事项

1. asdf 需要手动添加插件来支持不同的语言和工具，这可能需要额外的配置和维护。
2. asdf 的 `.tool-versions` 文件虽然方便，但在多人协作的项目中需要确保所有开发者都正确配置了 asdf。
3. 由于 asdf 是一个通用工具，它的性能可能不如专门为 Node.js 设计的工具。

# 建议

1. **单个项目环境**：如果你主要是在一个项目中工作，并且不需要频繁切换 Node.js 版本，Volta 会是一个不错的选择。它的自动版本管理和简化的命令让使用变得更加方便。

2. **多项目环境**：如果你需要频繁切换不同项目，每个项目可能使用不同的 Node.js 版本，那么 nvm 的灵活性会更适合你。

3. **跨平台支持**：如果你需要在 Windows 上管理 Node.js 版本，虽然有 nvm-windows，但它和原版 nvm 并不完全一致，此时 Volta 或 asdf 可能会是更一致的选择。

4. **多语言管理**：如果你不仅需要管理 Node.js，还需要管理其他编程语言或工具的版本，asdf 是一个非常强大的选择，它可以通过插件支持多种语言和工具。

# 结论

nvm、Volta 和 asdf 各有优劣，选择哪一个工具取决于你的具体需求和工作习惯。nvm 是一个成熟、灵活的工具，适合需要频繁切换版本的开发者；Volta 是一个现代化、易用的工具，适合希望简化版本管理的开发者；asdf 是一个通用的版本管理工具，适合需要管理多种语言和工具的开发者。不论你选择哪一个工具，都能极大地提升你的开发效率。
