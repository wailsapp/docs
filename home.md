---
sidebar: on
sidebarDepth: 2
---

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

## Overview

Wails is a framework to help write desktop apps using Go and Web Technologies. For the frontend, it uses the [Webview][1] library. This in turn uses the native rendering engine for the platform (currently Webkit for Linux & Mac, MSHTML for Windows). The frontend is coded using HTML/Javascript/CSS and the backend is pure Go. It is possible to expose Go code to the frontend, as functions that return promises, through a binding mechanism. The project compiles down to a single executable, bundling all assets into it. On Windows and MacOS, it is possible to bundle the binary into the platform-specific package for distribution.

To get started, let's run through the setup procedure.

## Concepts

Wails has been designed to be make the gap between web technologies and Go as minimal as possible. The frontend is a [Webview][1] component, and you may develop your frontend code using any common Javascript framework you like, and seemlessly interact with your Go code from it. This is done through a shared IPC mechanism.

![Overview](/media/Overview.svg)

### IPC Overview

The IPC mechanism operates across 2 runtimes - one in Javascript and the other in Go. They both provide a simple interface, removing the burdon from the developer from needing to deal with the IPC mechanism directly.

![Runtimes](/media/IPC.svg)



The runtimes share common components which the developer can interact with: Binding and Events.

![IPCDetail](/media/IPCDetail.svg)

### Binding

A Wails application provides a single method that allows you to expose (bind) your Go code to the frontend. Using this method, you may bind an arbitrary function or a struct with exposed methods. At startup, Wails will analyse bound functions/methods and automatically provide the equivalent functions in Javascript. This allows you to call your bound Go code directly from Javascript.



![Binding](/media/Binding.svg)

The Javascript wrapper functions deal with all of the complexity of calling the Go code. You simply call the function in Javascript and receive a promise back.
The function to bind your Go code deals with all the complexity of binding. If the call to your Go code completes successfully, the result will be passed to the resolve function. If an error is returned, this will be passed to the reject function.

### Events

Wails provides a unified Events system similar to Javascript's native events system. This means that any event that is sent from either Go or Javascript can be picked up by either side. Data may be passed along with any event. This allows you to do neat things like have background processes running in Go and notifying the frontend of any updates.

![Events](/media/Events.svg)

---
[1]: https://github.com/zserge/webview

## Setup

To get started, run `wails setup`. This prompts you for your name and email and checks if the dependencies are installed. The name and email is only used for filling in project template files and *nothing else*.
The dependencies are different depending on if you are using Windows, Linux or OSX. If there are missing dependencies, it tries to provide help on how to install the dependency.

Once you are all setup, it's time to initialise a new project.

## Projects

Each Wails application is built within a 'Project'.

### Initialising a Project

You initialise a new project by running the `wails init` command. This asks you a number of questions:

  - The name of the project (used for filling in templates)
  - The name of the binary to compile to
  - The name of the directory to create the project in

Currently, there are 3 frontend tempaltes: Vue/Webpack, Vuetify and React.

### Anatomy of a project

In this section, we'll look at what makes up a project. We will focus on the Vue/Webpack template.

#### Vue/Webpack Template

The Vue/Webpack template is a project template that generates a Vuejs project. It has the following layout:

<pre style='color:white'>
.
├── frontend/
├── go.mod
├── main.go
└── project.json
</pre>

   * Frontend is where all the frontend code and assets reside.
   * go.mod is the default Go module file
   * main.go is the main application
   * project.json holds metadata about the project

The frontend directory is basically a standard Vue project and has the following layout:

<pre style='color:white'>
.
├── README.md
├── babel.config.js
├── package-lock.json
├── package.json
├── src/
└── vue.config.js
</pre>

   * babel.config.js - The babel configuration file
   * package[-lock].json - The standard npm project files
   * src - The frontend application source directory
   * vue.config.js - The Vue specific configuration

The src directory has a default Vue application and is laid out as follows:
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

   * App.vue - The main Vue application component
   * assets - A directory to store standard web front end assets
   * components - A directory for your Vue components
   * main.js - The main application that sets everything up
   * wailsbridge.js - Creates a bridge between your frontend and backend code

The project is split into 2 sections - the backend consisting of Go files in the root directory, and the frontend that resides in a 'frontend' directory. The frontend project is a (mostly) standard Vue project with some custom webpack settings in vue.config.js

As the Vue/Webpack template contains a full frontend project within it, the project metadata contains details on how to install and build it. Here is an example project.json file for a Vue/Webpack project:

```json
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

As you can see, there is an additional section describing the frontend project. The keys have the following meaning:

| Key      | Meaning                                                     |
| -------- | ----------------------------------------------------------- |
| dir      | The directory that the frontend project resides in          |
| install  | The command to execute to install the frontend dependencies |
| build    | The command to execute to build the frontend project. In this example, this will simply run the build script defined in the frontend's package.json file |
| bridge   | The directory where the Wails bridge script resides |
| serve    | The command to serve your application in 'bridge' mode (more on this later) |

Under normal circumstances, you will not need to edit these values. They are provided to allow flexibility to template designers.

### Serving a Project

Wails offers the ability to use your standard frontend tooling, but still have the ability to call Go code. This is done by 'serving' your backend in a bridged mode. When your frontend starts, it connects to the backend and does all the binding behind the scenes.

You can serve your backend by issuing the `wails serve` command in the project directory.

You may now issue an `npm run serve` in the frontend directory and develop your application using a browser and the Vue devtools plugin.

### Building a Project

Once you are in a position to build your project into a single application, run `wails build` within the project directory. By default, projects are built in 'production mode'. If you need to run your app in debug mode, build using the '-d' flag. Running in debug mode means:

 - Debug messages are printed to the terminal
 - You can right click to inspect your application in the webview (MacOS & Linux)
 - The binary has a number of flags to help develop the application. Pass the `--help` flag to view the options.

## Execution Workflow

The execution workflow of a Wails app is:

  * The application window is created
  * The Wails Javascript runtime is injected into the frontend
  * All functions that were bound in Go are setup in the frontend
  * All WailsInit methods are called with the Go Runtime
  * The application CSS is injected into the frontend
  * Finally, the application Javascript is injected into the frontend
