---
layout: PostLayout
title: 详解 dotenv 的使用与实现
date: 2024-08-27 13:31:43
tags: ['js原理']
summary: 
每当涉及到保护API密钥或我们不想因为开源项目而向公众展示的东西时，我们总是倾向于.env文件，而它的解析依赖到dotenv包，一个每周都有31k+开发人员下载的软件包。其设计的理念是Twelve-Factor App的第三点。配置与代码分离。

![](https://files.mdnice.com/user/70043/75c1b5e4-214b-4267-ba66-04cc29db024
---

每当涉及到保护 API 密钥或我们不想因为开源项目而向公众展示的东西时，我们总是倾向于.env 文件，而它的解析依赖到 dotenv 包，一个每周都有 31k+开发人员下载的软件包。其设计的理念是 Twelve-Factor App 的第三点。配置与代码分离。

![](https://files.mdnice.com/user/70043/75c1b5e4-214b-4267-ba66-04cc29db0243.png)

关于 Twelve-Factor App 大家可以前往这里查看：https://12factor.net/

# 为什么文件名只有.env？

文件名只能以.env 开头，是一个误解。使用任何名字，它仍然可以在 node.js 上正常工作。

那为什么要用点开头？

当涉及到环境文件时，在文件名前面使用一个点（.）被认为是好的，因为在任何文件名前面添加一个点都会使其成为一个隐藏的文件或文件夹。

这就是为什么您的操作系统中有多个文件夹，这些文件夹是隐藏的，只能通过 CLI 访问，例如.ssh、.github、.vscode 等。

# 使用介绍

首先，在你的 Node.js 项目中安装 `dotenv`：

```bash
npm install dotenv
```

在项目的根目录中创建一个名为 `.env` 的文件。这个文件中每一行定义一个环境变量，格式为 `KEY=VALUE`。例如：

```env
# .env 文件
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=s1mpl3
SECRET_KEY=mysecretkey
```

**注意：`.env` 文件通常不会提交到版本控制系统（如 Git），因此你可以在 `.gitignore` 文件中添加一行 `/.env` 来忽略它。**

在你的应用程序入口文件中（通常是 `app.js` 或 `index.js`），加载并配置 `dotenv`。这通常是你在应用程序中最早执行的操作之一：

```javascript
require('dotenv').config()

// 现在你可以通过 process.env 访问环境变量
console.log(process.env.PORT) // 输出: 3000
console.log(process.env.DB_HOST) // 输出: localhost
```

在一些情况下，你可能需要为不同的环境（如开发、测试、生产）使用不同的 `.env` 文件。你可以通过 `dotenv` 的配置选项来指定加载的文件：

```javascript
require('dotenv').config({ path: './config/.env.dev' })
```

如果想让配置支持使用变量替换，你可以使用 `dotenv-expand` 来实现：

```env
# .env 文件
HOST=localhost
PORT=3000
FULL_URL=http://${HOST}:${PORT}
```

```javascript
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')

const myEnv = dotenv.config()
dotenvExpand.expand(myEnv)

console.log(process.env.FULL_URL) // 输出: http://localhost:3000
```

# 源码实现

dotenv 的源码很简单，只有 1 个主要文件：https://github.com/motdotla/dotenv/blob/master/lib/main.js

## 键值解析

核心原理是将 `.env` 文件解析为键值对，并加载到 `process.env` 中。在实现上主要是通过使用正则表达式，并处理了字符串、引号、换行符等特殊情况。

这个正则，表示看着头疼。。。

```javascript
const LINE =
  /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm
```

## 加解密

在 16.1.x 版本之后，还增加了解密的功能。可以用于一些安全要求较高的项目中。有了这个可以放心地把.env 文件提交到生产了。

```javascript
function decrypt(encrypted, keyStr) {
  const key = Buffer.from(keyStr.slice(-64), 'hex')
  let ciphertext = Buffer.from(encrypted, 'base64')

  const nonce = ciphertext.subarray(0, 12)
  const authTag = ciphertext.subarray(-16)
  ciphertext = ciphertext.subarray(12, -16)

  try {
    const aesgcm = crypto.createDecipheriv('aes-256-gcm', key, nonce)
    aesgcm.setAuthTag(authTag)
    return `${aesgcm.update(ciphertext)}${aesgcm.final()}`
  } catch (error) {
    // 处理解密错误
    throw error
  }
}
```

该函数使用 AES-256-GCM 算法进行解密操作。AES-256 表示它使用 256 位的密钥进行加密，GCM 是一种加密模式，除了加密数据，还可以验证数据的完整性。

- 加密: 先用 256 位的密钥加密信息，然后生成一个“标签”，这个标签是用来验证数据有没有被改动的。
- 解密: 先检查标签，如果标签正确，才会用密钥解密数据。如果标签不对，就说明数据可能被篡改了，解密就会失败。

你会不会有疑问，这里是解密，那加密呢？dotenv 自身不提供加密的功能，加密依赖于一个工具，dotenvx。https://dotenvx.com/docs/。

> dotenvx 是 dotenv 的扩展或增强版，通常基于 dotenv 的功能进行构建，使用时也会依赖于 dotenv 的基础设施。dotenvx 提供了更加专业和复杂的功能，适用于更高要求的应用场景。

![](https://files.mdnice.com/user/70043/2b248fc7-9faa-458a-8a08-f228d83ae2d6.png)

![](https://files.mdnice.com/user/70043/23a24cdf-bd0b-4958-82e2-ffb5e2d6895e.png)

另外也可以通过`dotenvx ext genexample`命令生成一个 env 的配置例子文件。

## 灵活的配置入口

`dotenv` 支持灵活设置配置文件地址，这主要依赖于`configDotenv` 函数。同时，还内置了调试功能，通过 `_debug` 函数输出详细的调试信息，帮助开发者快速定位问题。

```javascript
function configDotenv(options) {
  const dotenvPath = path.resolve(process.cwd(), '.env')
  let encoding = 'utf8'
  const debug = Boolean(options && options.debug)

  if (options && options.encoding) {
    encoding = options.encoding
  }

  // 加载并解析 .env 文件
  let optionPaths = [dotenvPath]
  if (options && options.path) {
    // 自定义路径处理逻辑
  }

  // 解析并填充环境变量
  let lastError
  const parsedAll = {}
  for (const path of optionPaths) {
    try {
      const parsed = DotenvModule.parse(fs.readFileSync(path, { encoding }))
      DotenvModule.populate(parsedAll, parsed, options)
    } catch (e) {
      if (debug) {
        _debug(`Failed to load ${path} ${e.message}`)
      }
      lastError = e
    }
  }

  // 填充到 process.env
  DotenvModule.populate(processEnv, parsedAll, options)

  return { parsed: parsedAll, error: lastError }
}
```

### 总结

关于 dotenvx，这里说多一点，真是一个好工具。除了上面介绍的用来加密，也可以用来生成配置用例

```
dotenvx ext genexample
```

也可以用来设置环境文件，不用在项目里自己调用 dotenv 也可以

```
dotenvx run -f .env.production -- node index.js
```

最后，提一下注意事项：

- **非加密的 env 配置文件，不要提交到代码仓库。**除非你确信其中不包含任何敏感信息。
- 分环境管理：为不同环境创建 .env 文件，例如 .env.development, .env.production
- 确保 .env 文件的权限设置是适当的，以防止未经授权的访问。
