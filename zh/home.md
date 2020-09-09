---
sidebar: on
sidebarDepth: 1
---

# Wails

> 使用Go＆Web Technologies构建桌面应用程序的框架。

## 关于

向Go程序提供Web界面的传统方法是通过内置的Web服务器。 Wails提供了一种不同的方法：它提供了将Go代码和Web前端包装到单个二进制文件中的能力。通过处理项目创建，编译和捆绑，Wails cli可以使您轻松实现这一目标。您要做的就是发挥创意！

## 功能

* Use standard Go libraries/frameworks for the backend
* Use any frontend technology to build your UI
* Expose Go methods/functions to the frontend via a single bind command
* Uses native rendering engines - no embedded browser
* Shared events system
* Native file dialogs
* Powerful cli tool
* Multiplatform

## 总览

Wails是一个框架，可帮助使用Go and Web Technologies编写桌面应用程序。对于前端，它使用[Webview] [1]库。反过来，它使用平台的本机渲染引擎（当前用于Linux和Mac的Webkit，用于Windows的MSHTML）。前端使用HTML /Javascript /CSS进行编码，后端是纯Go。通过绑定机制，可以将Go代码作为返回Promise的功能公开给前端。该项目编译为单个可执行文件，将所有资产捆绑到其中。在Windows和MacOS上，可以将二进制文件捆绑到特定于平台的程序包中进行分发。

首先，让我们完成设置过程。

## 概念

Wails旨在使Web技术和Go之间的差距尽可能小。前端是[Webview] [1]组件，您可以使用喜欢的任何常见Javascript框架开发前端代码，并与其中的Go代码进行无缝交互。这是通过共享IPC机制完成的。

<p align="center" style="text-align: center">
   <img src="/media/Overview.svg" width="33%"><br/>
</p>

### IPC概念

IPC机制可在2个运行时中运行-一个运行在Javascript中，另一个运行在Go中。它们都提供了一个简单的界面，从而减轻了开发人员无需直接处理IPC机制的负担。

<p align="center" style="text-align: center">
   <img src="/media/IPC.svg" width="33%"><br/>
</p>

运行时共享开发人员可以与之交互的公共组件：绑定和事件。

<p align="center" style="text-align: center">
   <img src="/media/IPCDetail.svg" width="33%"><br/>
</p>

### 绑定

Wails应用程序提供了一种方法，可让您将Go代码公开（绑定）到前端。使用此方法，可以将任意函数或结构与公开的方法绑定。在启动时，Wails将分析绑定的函数/方法并自动以Javascript提供等效的函数。这使您可以直接从Javascript调用绑定的Go代码。

<p align="center" style="text-align: center">
   <img src="/media/Binding.svg" width="40%"><br/>
</p>

JavaScript包装函数处理了调用Go代码的所有复杂性。您只需用Javascript调用该函数并收到一个Promise。
绑定Go代码的功能处理了绑定的所有复杂性。如果对Go代码的调用成功完成，则结果将传递到resolve函数。如果返回错误，则将其传递给拒绝函数。 

### 事件

威尔提供了一个统一的事件系统，类似于Javascript的本地事件系统。这意味着从Go或Javascript发送的任何事件都可以由任何一方接收。数据可以与任何事件一起传递。这使您可以做一些整洁的事情，例如在Go中运行后台进程并通知任何更新的前端。

<p align="center" style="text-align: center">
   <img src="/media/Events.svg" width="40%"><br/>
</p>

---
[1]: https://github.com/zserge/webview

## 步骤

首先，运行 `wails setup` 。这会提示您输入名称和电子邮件，并检查是否已安装依赖项。名称和电子邮件仅用于填写项目模板文件，“仅此而已” *。
依赖关系会有所不同，具体取决于您使用的是Windows，Linux还是OSX。如果缺少依赖项，它将尝试提供有关如何安装依赖项的帮助。 

设置完成后，就该初始化一个新项目了。 

## 项目

每个Wails应用程序都构建在一个“项目”中。

### 初始化一个项目

您可以通过运行“wails init”命令来初始化一个新项目。这会问您一些问题：

   + 项目名称（用于填写模板）
   + 要编译为的二进制文件的名称
   + 在其中创建项目的目录名称

当前，有3种前端模板：Vue/Webpack，Vuetify和React。

### 项目解析

在本节中，我们将研究组成项目的内容。 我们将专注于Vue/Webpack模板。

#### Vue/Webpack 模板

Vue/Webpack模板是一个生成Vuejs项目的项目模板。 它具有以下布局：

<pre style='color:white'>
.
├── frontend/
├── go.mod
├── main.go
└── project.json
</pre>

   * Frontend 前端代码资源
   * go.mod Go依赖配置文件
   * main.go 主要应用程序入口
   * project.json 项目元数据

前端目录基本上是一个标准的Vue项目，其布局如下：

<pre style='color:white'>
.
├── README.md
├── babel.config.js
├── package-lock.json
├── package.json
├── src/
└── vue.config.js
</pre>

   * babel.config.js - babel配置文件
   * package[-lock].json - npm配置文件
   * src - 前端源代码目录
   * vue.config.js - Vue 配置

src目录具有默认的Vue应用程序，其布局如下：
<pre style='color:white'>
.
├── App.vue
├── assets/
│   ├── css/
│   │   └── main.css
│   ├── fonts/
│   │   ├── LICENSE.txt
│   │   └── roboto/
│   │       ├── roboto-v18-latin-regular.eot
│   │       ├── roboto-v18-latin-regular.svg
│   │       ├── roboto-v18-latin-regular.ttf
│   │       ├── roboto-v18-latin-regular.woff
│   │       └── roboto-v18-latin-regular.woff2
│   └── images/
│       └── logo.png
├── components/
│   └── HelloWorld.vue
├── main.js
└── wailsbridge.js
</pre>

   * App.vue - Vue 项目根组件
   * assets - 前端资源目录
   * components - 前端组件目录
   * main.js - 前端项目的入口
   * wailsbridge.js - 前端和Go程序运行的桥梁

该项目分为两部分-后端由根目录中的Go文件组成，而前端则位于“frontend”目录中。前端项目是一个（大多数）标准Vue项目，在vue.config.js中具有一些自定义Webpack设置

由于Vue/Webpack模板中包含完整的前端项目，因此项目元数据包含有关如何安装和构建它的详细信息。这是Vue/Webpack项目的示例project.json文件： 

``` json
{
 "name": "My Project",
 "description": "Enter your project description",
 "author": {
  "name": "John Doe",
  "email": "jd@jd.com"
 },
 "version": "0.1.0",
 "binaryname": "my-project",
 "frontend": {
  "dir": "frontend",
  "install": "npm install",
  "build": "npm run build",
  "bridge": "src",
  "serve": "npm run serve"
 }
}
```

如您所见，还有一个附加部分描述了前端项目。这些键具有以下含义：

| Key      | Meaning                                                     |
| -------- | ----------------------------------------------------------- |
| dir      | 前端项目所在目录        |
| install  | 执行以安装前端依赖 |
| build    | 执行以生成前端项目的命令。 在此示例中，这将仅运行前端的package.json文件中定义的构建脚本。 |
| bridge   | Wails桥接脚本所在的目录 |
| serve    | 以“桥接”模式提供服务的命令（稍后会详细介绍）|

通常情况下，您无需编辑这些值。 提供它们是为了使模板设计人员具有灵活性。

### 以服务形式启动项目

Wails可以使用您的标准前端工具，但仍然可以调用Go代码。 这是通过以桥接模式“服务”您的后端来完成的。 当您的前端启动时，它将连接到后端，并在后台进行所有绑定。

您可以通过在项目目录中运行`wails serve`命令来为后端服务。

您现在可以在前端目录中运行`npm run serve'，并使用浏览器和Vue devtools插件开发应用程序。

### 构建项目

一旦可以将项目构建到单个应用程序中，请在项目目录中运行“ wails build”。 默认情况下，项目以“生产模式”构建。 如果您需要在调试模式下运行应用，请使用'-d'标志进行构建。 以调试模式运行意味着：

  - 调试消息被打印到终端
  - 您可以右键单击以在Web视图中检查您的应用程序（MacOS和Linux）
  - 二进制文件具有许多标志，以帮助开发应用程序。 传递--help标志以查看选项。

## 执行流程

Wails应用程序的执行工作流程为：

  + The application window is created
  + The Wails Javascript runtime is injected into the frontend
  + All functions that were bound in Go are setup in the frontend
  + All WailsInit methods are called with the Go Runtime
  + The application CSS is injected into the frontend
  + Finally, the application Javascript is injected into the frontend
  + On shutdown ( Ctrl-C, Kill Window or runtime. Window. Close() ), all WailsShutdown methods are called
  + The applications exits cleanly

  + 创建应用程序窗口
  + Wails Javascript运行时已注入前端
  + Go中绑定的所有功能都在前端设置
  + 所有WailsInit方法都通过Go Runtime调用
  + 将应用程序CSS注入前端
  + 最后，将应用程序Javascript注入到前端
  + 在关闭时（Ctrl-C，Kill Window或`runtime.Window.Close()`），将调用所有WailsShutdown方法
  + 应用程序干净退出
