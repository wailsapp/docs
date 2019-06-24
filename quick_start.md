---
sidebar: on
sidebarDepth: 2
---

# Quick Start

## High Level Overview

Wails applications consist of 2 parts:

  * A backend written in Go
  * A frontend written using standard HTML/JS/CSS

These are compiled and bundled together using the `wails build` command. This will firstly build the frontend project into Javascript and CSS bundles. It will then build the main Go application, which bundles the 2 frontend asset files as part of the application. This produces a single application.

### Frontend

The frontend is a standard Vue/React project that gets compiled down to Javascript and CSS bundles. It lives in the `frontend` directory of the project. There is nothing particularly special about the project other than it is configured to bundle the whole project down to 2 bundles: app.js and app.css.

### Backend

The backend initially comprises of a single main.go file:

```go
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
Here is a quick explanation of how this works:

| Lines    | Explanation                                                    |
| -------- | -------------------------------------------------------------- |
| 1        | The standard package directive.                                |
| 3-6      | Imports the Wails framework and the Mewn utility package that we will use for handling assets.                                                            |
| 8-10     | A standard Go function that returns the string "Hello World!". |
| 12       | The main function declaration.                                 |
| 14       | Reads in the frontend javascript bundle as a string.           |
| 15       | Reads in the frontend css bundle as a string.                  |
| 17-24    | Creates a new Wails application, specifying width, height, title and a colour for the application window. We also specify the Javascript and CSS we wish the application to render - the JS/CSS we previously read in on lines 14 & 15.              |
| 25       | Binds our basic function to the application.                   |
| 26       | Runs the application.                                          |

If you make changes to the frontend or backend, you simply have to run `wails build` to regenerate your application.


## Prerequisites

Wails uses cgo to bind to the native rendering engines so a number of platform dependent libraries are needed as well as an installation of Go. The basic requirements are:

- Go 1.12 or above
- npm

### MacOS

Make sure you have the xcode command line tools installed. This can be done by running:

`xcode-select --install`

### Linux

#### Ubuntu 18.04/19.04, Pop!OS 19.04

`sudo apt install pkg-config build-essential libgtk-3-dev libwebkit2gtk-4.0-dev`

#### Arch / Manjaro Linux

`sudo pacman -S webkit2gtk gtk3`

#### Red Hat Based Distros

`sudo yum install webkit2gtk-devel gtk3-devel`

::: tip
If you have successfully installed these dependencies on a different flavour of Linux, please consider clicking the "Edit this page" link at the bottom and submit a PR.
:::

### Windows

Windows requires gcc and related tooling. The recommended download is from [http://tdm-gcc.tdragon.net/download](http://tdm-gcc.tdragon.net/download). Once this is installed, you are good to go.



## Installation

::: tip
Ensure Go modules are enabled: GO111MODULE=on and go/bin is in your PATH variable.
:::

Installation is as simple as running the following command:

<pre style='color:white'>
go get github.com/wailsapp/wails/cmd/wails
</pre>

Once installed, the `wails update` command may be used for subsequent updates.


To get up and running quickly, do the following:

1. Setup your Wails system by running the [setup command](./reference/cli.md#setup) `wails setup`.
2. Generate a new project using the [init command](./reference/cli.md#init) `wails init`. Select the default options.
3. Change into the project directory (cd my-project) and compile your application using the [build command](./reference/cli.md#build) `wails build`.
4. If all went well, you should have a compiled program in your local directory. Run it with `./my-project` or double click `myproject.exe` if on windows.

<div class="imagecontainer">
<img src="/media/app.png" style="width:75%">
</div>

## Next Steps

If you would like to start into making an app right away, we suggest you take a look at the [tutorials](./tutorials/).

If you would prefer to get to know the framework a little better before building anything, we suggest having a look through the [reference](./reference/) section.
