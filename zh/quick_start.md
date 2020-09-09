---
sidebar: on
sidebarDepth: 1
---

# 快速开始

## 概述

`Wails` 应用包含两个部分:

  + 用 `Go` 编写的后端
  + 使用标准HTML/JS/CSS编写的前端

使用 `wails build` 命令将它们编译并绑定在一起。这将首先将 `frontend` 项目构建成 `Javascript` 和 `CSS` 包。然后，它将构建主 `Go` 应用程序，该应用程序将两个前端资产文件作为应用程序的一部分。这将生成一个应用程序。

### 前端

`frontend` 是一个标准的前端项目(Vue, React等)，它被编译成 `Javascript` 和 `CSS` 包。它位于项目的 `frontend` 目录中。除了将整个项目配置为两个包: `app.js` 和 `app.css` 之外，这个项目没有什么特别之处。

### 后端

后端最初由单个 `main.go` 组成。文件:

``` go
package main

import (
  "github.com/leaanthony/mewn"
  "github.com/wailsapp/wails"
)

func basic() string {
  return "Hello World!"
}

func main() {

  js := mewn.String("./frontend/dist/app.js")
  css := mewn.String("./frontend/dist/app.css")

  app := wails.CreateApp(&wails.AppConfig{
    Width:  1024,
    Height: 768,
    Title:  "Quotes",
    JS:     js,
    CSS:    css,
    Colour: "#131313",
  })
  app.Bind(basic)
  app.Run()
}
```

以下是有关其工作原理的简要说明：

| 行    | 说明                                                    |
| -------- | -------------------------------------------------------------- |
| 1        | 标准包指令|
| 3-6      | 导入我们将用于处理资产的Wails框架和Mewn实用程序包|
| 8-10     | 返回字符串 ` Hello World！` 的标准Go函数。 |
| 12       | 主函数声明|
| 14       | 以字符串形式读取前端 `javascript` 捆绑包|
| 15       | 以字符串形式读取前端 `CSS` 捆绑包|
| 17-24    | 创建一个新的 `Wails` 应用程序，为应用程序窗口指定宽度，高度，标题和颜色。我们还指定了希望应用程序呈现的 `Javascript` 和 `CSS` -先前在第14和15行中阅读的 `JS/CSS` |
| 25       | 将我们的基本功能绑定到应用程序。然后我们可以使用以下代码从 `Javascript` 调用此方法： `window.backend.basic()` . |
| 26       | 运行程序|

如果您对前端或后端进行更改，则只需运行 `wails build` 即可重新生成您的应用程序。

## 先决条件

Wails使用 `cgo` 绑定到本机渲染引擎，因此需要大量依赖于平台的库以及 `Go` 的安装。基本要求是：

* Go 1.12 以上
* npm

运行 `go version && npm --version` 进行验证。

### MacOS

确保已安装 `xcode` 命令行工具。可以通过运行以下命令来完成：

 `xcode-select --install`

### Linux

#### Debian/Ubuntu

 `sudo apt install libgtk-3-dev libwebkit2gtk-4.0-dev`
_Debian: 8, 9, 10_

_Ubuntu: 16.04, 18.04, 19.04_

_也可以通过以下测试: Zorin 15, Parrot 4.7, Linuxmint 19, Elementary 5, Kali, Neon_

#### Arch Linux

 `sudo pacman -S webkit2gtk gtk3`
_也成功测试了: ArcoLinuxB, Manjaro_

#### Centos

 `sudo yum install webkitgtk3-devel gtk3-devel`
_CentOS 6, 7_

#### Fedora

 `sudo yum install webkit2gtk3-devel gtk3-devel`
_Fedora 29, 30_

#### VoidLinux & VoidLinux-musl

 `xbps-install gtk+3-devel webkit2gtk-devel`

#### Gentoo

 `sudo emerge gtk+:3 webkit-gtk`
::: tip
如果您已成功在不同版本的 `Linux` 上安装了这些依赖项，请考虑单击底部的“帮助我们改善此页面”链接并提交PR。
:::

### Windows

`Windows` 需要 `gcc` 和相关工具。推荐的下载是从[http://tdm-gcc.tdragon.net/download](http://tdm-gcc.tdragon.net/download)下载的。一旦安装完成，您就可以开始了。

## 安装

### 准备工作

确保启用Go mod:

 `export GO111MODULE=on`
并且 go/bin 存在你的环境变量:

 `echo $PATH | grep go/bin`

### 安装

安装就像运行以下命令一样简单： 

<pre style='color:white'>
go get github.com/wailsapp/wails/cmd/wails
</pre>

::: tip
一旦安装， `wails update` 命令可以用于后续更新。
:::

### 建立

要完成安装设置，请通过运行[setup 命令](./reference/#setup) `wails setup` 并填充句柄和电子邮件来完成 `Wails` 系统的设置。

## 生成一个项目

[在命令行](./reference/#init) 运行 `wails init` 生成要一个新的项目

选择默认选项。

## 构建

运行 `cd my-project` 进入项目目录并且使用  [build 命令](./reference/#build) `wails build` 构架你的项目.

如果一切顺利，则应该在本地目录中有一个已编译的程序. 如果在 `windows` 上运行它请运行 `./my-project` 或者双击 `myproject.exe`
<div class="imagecontainer">
<img src="/media/app.png" style="width:65%">
</div>

### 服务

#### `wails serve`

当使用 `wails` 开发应用程序时，[serve 命令](./reference/#serve) `wails serve` 是首选项 .

::: tip
这样可以在 _debug_ 模式下生成**更快**的轻量级构建，不包括 `npm` 构建脚本，节省了开发后端的时间，还允许使用 `npm run serve` 来进行前端的部分浏览器开发！
:::

#### `npm run serve`

运行 `cd my-project/frontend` 切换到前端项目目录，并使用 `npm run serve` 预览你的前端界面 .

## 下一步

如果你想立即开始只做应用, 我们建议你通过 _awesome_ [tutorials](./tutorials/)探索 Wails.
如果您希望在构建任何东西之前对框架有所了解，我们建议您仔细阅读一下[概念](./home.html#concepts).
最后，如果您是高阶用户，并且想直接使用它，请转到[API参考](./reference/#api) 和[Cli参考](./reference/#cli)部分。
::: tip
加入我们 [Slack](https://gophers.slack.com/messages/CJ4P9F7MZ) 的通道. 
[_Invite_](https://invite.slack.golangbridge.org) 
为了支持还是打个招呼！
:::
