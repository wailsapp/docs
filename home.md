# Wails

> A framework for building desktop applications using Go & Web Technologies.

## About

The traditional method of providing web interfaces to Go programs is via a built-in web server. Wails offers a different approach: it provides the ability to wrap both Go code and a web frontend into a single binary. The Wails cli makes this easy for you, by handling project creation, compilation and bundling. All you have to do is get creative!

## Features

- Use standard Go libraries/frameworks for the backend
- Use any frontend technology to build your UI
- Expose Go methods/functions to the frontend via a single bind command
- Uses native rendering engines - no embedded browser
- Shared events system
- Native file dialogs
- Powerful cli tool
- Multiplatform

## Prerequisites

Wails uses cgo to bind to the native rendering engines so a number of platform dependent libraries are needed as well as an installation of Go. The basic requirements are:

- Go 1.12 or above. Go 1.11 should work. Ensure Go modules are enabled: GO111MODULE=on.
- npm

### MacOS

Make sure you have the xcode command line tools installed. This can be done by running:

`xcode-select --install`

### Linux

#### Ubuntu 18.04

`sudo apt install pkg-config build-essential libgtk-3-dev libwebkit2gtk-4.0-dev`

#### Arch Linux

`sudo pacman -S webkit2gtk gtk3`

::: tip
If you have successfully installed these dependencies on a different flavour of Linux, please consider clicking the "Edit this page" link at the bottom and submit a PR.
:::

### Windows

Windows requires gcc and related tooling. The recommended download is from [http://tdm-gcc.tdragon.net/download](http://tdm-gcc.tdragon.net/download). Once this is installed, you are good to go.



## Installation

Installation is as simple as running the following command:

<pre style='color:white'>
go get github.com/wailsapp/wails/cmd/wails
</pre>
