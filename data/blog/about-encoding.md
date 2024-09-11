---
layout: PostLayout
title: 关于JS里的字符表情乱码
date: 2024-08-09
tags: ['js原理']
summary: 表情符号乱码的原因通常与 UTF-8 编码的处理不当有关。表情符号属于 Unicode 中的高码点字符，需要使用 4 个字节来表示。如果在处理这些高码点字符时出现问题，就会导致表情符号乱码。
---

![](https://files.mdnice.com/user/70043/55fb6032-65ac-48cb-a5c7-cccd1d5dca97.png)

### 背景

**1、业务背景**

公司在处理业务时，需要使用 socket 传输字符串内容，在 A 处输入，在 B 处显示。但反馈说输入表情符号经过传输后，ios 会变成问号，PC 会乱码。如下情况：

![](https://files.mdnice.com/user/70043/952ac181-2fe5-4407-a87c-1896bb11d470.png)

![](https://files.mdnice.com/user/70043/ded8ed64-03eb-4bbd-ab22-a754044a18d9.png)

**2、表情乱码**

表情符号乱码的原因通常与 UTF-8 编码的处理不当有关。表情符号属于 Unicode 中的高码点字符，需要使用 4 个字节来表示。如果在处理这些高码点字符时出现问题，就会导致表情符号乱码。

### 关于 Unicode 编码

Unicode 是一种字符编码标准，旨在为世界上所有的文字和符号提供唯一的编码。它的目标是支持全球所有书写系统，涵盖从古代文字到现代符号的广泛字符集。以下是关于 Unicode 编码的一些关键点：

#### 基本概念

1. **字符**：表示一个书写符号，例如字母、数字、标点符号等。
2. **码点**：每个字符在 Unicode 标准中的唯一编号，通常表示为 U+XXXX，其中 XXXX 是四位十六进制数。
3. **编码形式**：将码点转换为字节序列的方式。常见的 Unicode 编码形式包括 UTF-8、UTF-16 和 UTF-32。

#### Unicode 平面

Unicode 将字符划分为多个平面，每个平面包含 65,536 个码点（从 U+0000 到 U+FFFF）。主要平面包括：

1. **基本多文种平面（BMP）**：从 U+0000 到 U+FFFF，包含大多数常用的字符。
2. **补充多文种平面（SMP）**：从 U+10000 到 U+1FFFF，包含古代文字、音乐符号等。
3. **补充表意文字平面（SIP）**：从 U+20000 到 U+2FFFF，主要用于中日韩表意文字。
4. **补充专用区（SSP）**：从 U+E0000 到 U+EFFFF，用于私人使用的字符。

BMP 是 Unicode 的第一个平面，包含了从 U+0000 到 U+FFFF 的字符编码。它涵盖了大多数常用的字符，包括：

- 拉丁字母
- 希腊字母
- 西里尔字母
- 汉字（中日韩统一表意文字）
- 阿拉伯字母
- 以及其他常用的符号和标点符号

BMP 的设计初衷是为了满足大多数现代文字处理的需求，因此大部分常用的字符都被安排在这个平面内。

高码点字符是指 Unicode 编码中使用较高码点（code point）表示的字符。Unicode 码点的范围是从 U+0000 到 U+10FFFF。

表情符号（emoji）：如 😀 (U+1F600)
古代文字：如 𐎀 (U+10380，乌加里特字母)
特殊符号：如 𝄞 (U+1D11E，音乐符号）

#### 常见的 Unicode 编码形式

1. **UTF-8**：

   - 可变长度编码，使用 1 到 4 个字节表示一个字符。
   - 向后兼容 ASCII（即 U+0000 到 U+007F 的字符使用单字节编码）。
   - 广泛用于网络传输和文件存储。

2. **UTF-16**：

   - 可变长度编码，使用 2 或 4 个字节表示一个字符。
   - BMP 内的字符使用 2 字节编码，超出 BMP 的字符使用 4 字节编码（称为代理对）。

3. **UTF-32**：
   - 固定长度编码，使用 4 个字节表示一个字符。
   - 简单但占用更多存储空间，主要用于内存中字符处理。

### 原因分析

各个端都无法显示，且自身刷新后也无法显示，应该是在数据传输层面出现的问题。

Socket 传输我们使用的是二进制的形式发送的，通过 ArrayBuffer 把数据发送给服务端。而在生成 ArrayBuffer 的时候，使用的是一种自己转换的形式，代码如下：

```
/**
		 * <p>将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的字为字符串添加前缀。</p>
		 * <p>对应的读取方法为： getUTFBytes 。</p>
		 * @param value 要写入的字符串。
		 */
		public function writeUTFBytes(value:String):void {
			// utf8-decode
			value = value + "";
			for (var i:int = 0, sz:int = value.length; i < sz; i++) {
				var c:int = value.charCodeAt(i);

				if (c <= 0x7F) {
					writeByte(c);
				} else if (c <= 0x7FF) {
					//优化为直接写入多个字节，而不必重复调用writeByte，免去额外的调用和逻辑开销。
					_ensureWrite(this._pos_ + 2);
					this._u8d_.set([0xC0 | (c >> 6), 0x80 | (c & 0x3F)], _pos_);
					this._pos_ += 2;
				} else if (c <= 0xFFFF) {
					_ensureWrite(this._pos_ + 3);
					this._u8d_.set([0xE0 | (c >> 12), 0x80 | ((c >> 6) & 0x3F), 0x80 | (c & 0x3F)], _pos_);
					this._pos_ += 3;
				} else {
					_ensureWrite(this._pos_ + 4);
					this._u8d_.set([0xF0 | (c >> 18), 0x80 | ((c >> 12) & 0x3F), 0x80 | ((c >> 6) & 0x3F), 0x80 | (c & 0x3F)], _pos_);
					this._pos_ += 4;
				}
			}
		}
```

这个函数的具体步骤如下：

1. **将输入值转换为字符串**：

   ```javascript
   value = value + ''
   ```

   这一步确保输入值被视为字符串。

2. **遍历字符串中的每个字符**：

   ```javascript
   for (var i = 0, sz = value.length; i < sz; i++) {
       var c = value.charCodeAt(i);
       ...
   }
   ```

   这个循环遍历字符串中的每个字符，并使用 `charCodeAt` 获取字符的 Unicode 码点。

3. **根据字符的 Unicode 码点范围确定字节长度并进行编码**：
   根据 Unicode 码点 `c` 的值，字符将被编码为 1、2、3 或 4 个字节：

   - **1 字节字符 (U+0000 到 U+007F)**：

     ```javascript
     if (c <= 0x7f) {
       this.writeByte(c)
     }
     ```

     这个范围内的字符直接写为一个字节。

   - **2 字节字符 (U+0080 到 U+07FF)**：

     ```javascript
     else if (c <= 0x7FF) {
         this._ensureWrite(this._pos_ + 2);
         this._u8d_.set([0xC0 | (c >> 6), 0x80 | (c & 0x3F)], this._pos_);
         this._pos_ += 2;
     }
     ```

     这个范围内的字符被编码为两个字节。

   - **3 字节字符 (U+0800 到 U+FFFF)**：

     ```javascript
     else if (c <= 0xFFFF) {
         this._ensureWrite(this._pos_ + 3);
         this._u8d_.set([0xE0 | (c >> 12), 0x80 | ((c >> 6) & 0x3F), 0x80 | (c & 0x3F)], this._pos_);
         this._pos_ += 3;
     }
     ```

     这个范围内的字符被编码为三个字节。

   - **4 字节字符 (U+10000 到 U+10FFFF)**：
     ```javascript
     else {
         this._ensureWrite(this._pos_ + 4);
         this._u8d_.set([0xF0 | (c >> 18), 0x80 | ((c >> 12) & 0x3F), 0x80 | ((c >> 6) & 0x3F), 0x80 | (c & 0x3F)], this._pos_);
         this._pos_ += 4;
     }
     ```
     这个范围内的字符被编码为四个字节。

4. **确保缓冲区有足够的空间并写入字节**：
   - 函数 `this._ensureWrite(this._pos_ + n)` 确保缓冲区有足够的空间写入 `n` 个字节。
   - `this._u8d_.set([...], this._pos_)` 方法从当前位置 `this._pos_` 开始将字节写入缓冲区。
   - 写入后，当前位置 `this._pos_` 增加相应的字节数。

在 JavaScript 中，表情符号的 Unicode 码点超过了 BMP（基本多文种平面）的范围，因此需要特别处理这些字符。JavaScript 的 charCodeAt 方法只能返回字符的前两个字节，所以对于表情符号这样的高码点字符，需要使用 codePointAt 方法来获取完整的码点。所以罪魁祸首就是这个 charCodeAt 了。

```
let str = "😀";
console.log(str.charCodeAt(0)); // 55357 (高代理)
console.log(str.charCodeAt(1)); // 56832 (低代理)
console.log(str.codePointAt(0)); // 128512 (完整的 Unicode 码点)
```

### 解决方案

解决方案有两种，一种是改造成使用 codePointAt 去获取码点。另一种则是使用浏览器封装的 api 处理 TextDecoder 和 TextEncoder。

`TextDecoder` 和 `TextEncoder` 是 JavaScript 中用于处理文本编码和解码的两个接口。它们提供了将文本与二进制数据之间进行相互转换的功能，支持多种字符编码。

`TextDecoder` 用于将二进制数据（通常是 `Uint8Array` 或 `ArrayBuffer`）解码为字符串。它支持多种字符编码，如 UTF-8、UTF-16、ISO-8859-1 等。

```javascript
// 创建一个 TextDecoder 实例
const decoder = new TextDecoder('utf-8')

// 假设我们有一个 Uint8Array
const uint8Array = new Uint8Array([0xe4, 0xbd, 0xa0, 0xe5, 0xa5, 0xbd])

// 将 Uint8Array 解码为字符串
const decodedString = decoder.decode(uint8Array)

console.log(decodedString) // 输出: 你好
```

`TextEncoder` 用于将字符串编码为二进制数据（通常是 `Uint8Array`）。目前，`TextEncoder` 只支持 UTF-8 编码。

```javascript
// 创建一个 TextEncoder 实例
const encoder = new TextEncoder()

// 假设我们有一个字符串
const string = '你好'

// 将字符串编码为 Uint8Array
const encodedArray = encoder.encode(string)

console.log(encodedArray) // 输出: Uint8Array(6) [228, 189, 160, 229, 165, 189]
```

`TextDecoder` 和 `TextEncoder` 提供了一种简单且高效的方式来处理文本和二进制数据之间的转换，非常适合在需要处理不同字符编码的应用中使用。

### 总结

这篇文章主要了解了 Unicode 编码以及对字符表情的处理问题。在使用上我们还要注意以下两个问题：

1、js 里不要使用`chatCodeAt`处理表情符号，需使用`codePointAt`。
2、更推荐使用`TextDecoder` 和 `TextEncoder`处理编码问题。
