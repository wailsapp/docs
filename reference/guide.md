# Guide

The aim of this guide is to go through the components that make up the Wails framework. We will be going through it with code examples to help you get up to speed.

## Overview

Wails is a framework to help write desktop apps using Go and Web Technologies. For the frontend, it uses the [Webview][1] library. This in turn uses the native rendering engine for the platform (currently Webkit for Linux & Mac, MSHTML for Windows). The frontend is coded using HTML/Javascript/CSS and the backend is pure Go. It is possible to expose Go code to the frontend, as functions that return promises, through a binding mechanism. The project compiles down to a single executable, bundling all assets into it. On Windows and MacOS, it is possible to bundle the binary into the platform-specific package for distribution.

To get started, let's run through the setup procedure.

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

## Binding

Having just a web frontend means nothing unless you can interact with the system. Wails enables this through 'binding' - making Go code callable from the frontend. There are 2 types of code you can bind to the frontend: Functions and Struct Methods. When they are bound, they may be used in the frontend.

### Functions

Binding a function is as easy as this:

```go{18}
package main

import (
  "github.com/wailsapp/wails"
  "fmt"
)

func Greet(name string) string {
  return fmt.Printf("Hello %s!", name)
}

func main() {

  app := wails.CreateApp(&wails.AppConfig{
    Width:  1024,
    Height: 768,
  })
  app.Bind(Greet)
  app.Run()
}
```

When this is run, a Javascript function called 'Greet' is made available under the global 'backend' object. The function may be invoked by calling `backend.Greet`, EG: `backend.Greet("World")`. The dynamically generated functions return a standard promise. For this simple example, you could therefore print the result as so: `backend.Greet("World").then(console.log)`. 


### Structs

It is possible to bind structs to the frontend in a similar way but we must be clear on what this means: Binding a struct simply means exposing the public methods of the struct to the frontend. Wails does not attempt, or even believe, that binding data to the frontend is a good thing. Wails views the frontend as primarily a view layer with state and business logic normally handled by Go. As such, the structs that you bind to the front end should be viewed as a "wrapper" or an "interface".

Binding a struct is as easy as:

robot.go:
```go
package main

import "fmt"

type Robot struct {
	Name string
}

func NewRobot() *Robot {
	result := &Robot{
		Name: "Robbie",
	}
	return result
}

func (t *Robot) Hello(name string) string {
	return fmt.Sprintf("Hello %s! My name is %s", name, t.Name)
}

func (t *Robot) Rename(name string) string {
	t.Name = name
	return fmt.Sprintf("My name is now '%s'", t.Name)
}

func (t *Robot) privateMethod(name string) string {
	t.Name = name
	return fmt.Sprintf("My name is now '%s'", t.Name)
}

```
main.go:
```go
package main

import "github.com/wailsapp/wails"

func main() {
	app := wails.CreateApp(&wails.AppConfig{
		Width:  1024,
		Height: 768,
		Title:  "Binding Structs",
	})

	app.Bind(NewRobot())
	app.Run()
}
```

When the Robot struct is bound, it is made available at `backend.Robot` in the frontend. As the robot struct has a public method called `Hello`, then this is available to call at `backend.Robot.Hello`. The same is true for the `Rename` method. The robot struct also has another method called `privateMethod`, but as that is not public, it is not bound.

Here is a demonstration of how this works by running the app in debug mode and using the inspector:

<div class="imagecontainer">
  <img src="/media/robot.png" style="width:50%">
</div>

#### Struct Initialisation

If your struct has a special initialisation method, Wails will call it at startup. The signature for this method is:
```go
  WailsInit(runtime *wails.Runtime) error
```
This allows you to do some initialisation before the main application is launched. 

```go
  type MyStruct struct {
    runtime *wails.Runtime
  }

  func (s *MyStruct) WailsInit(runtime *wails.Runtime) error {
    // Save runtime
    s.runtime = runtime

    // Do some other initialisation

    return nil
  }

```

If an error is returned, then the application will log the error and shutdown.

The Runtime Object that is passed to it is the primary means for interacting with the application at runtime. It consists of a number of subsystems which provide access to different parts of the system. This is detailed in the [Wails Runtime](#wails-runtime) section.

### Binding Rules

Any Go function (or method) may be bound, so long as it follows the following rules:

 - The function must return 0 - 2 results.
 - If there are 2 return parameters, the last one must be an error type.
 - If you return a struct, or struct pointer, the fields you wish to access in the frontend must have Go's standard json struct tags defined.

If only one value is returned then it will either be available in the resolve or reject part of the promise depending on if it was an error type or not.

Example 1:

```go
  func (m *MyStruct) MyBoundMethod(name string) string {
    return fmt.Sprintf("Hello %s!", name)
  } 
```
In Javascript, the call to `MyStruct.MyBoundMethod` will return a promise that will resolve with a string.

Example 2:

```go
  ...
  func (m *MyStruct) AddUser(name string) error {
    if m.userExists(name) {
      return fmt.Errorf("user '%s' already exists");
    }
    m.saveUser(name)
    return nil
  } 
  ...
```
In Javascript, the call to `MyStruct.MyBoundMethod` with a new user name will return a promise that will resolve with no value. A call to `MyStruct.MyBoundMethod` with an existing user name will return a promise that will reject with the error set to "user '$name' already exists".

It's good practice to return 2 values, a result and an error, as this maps directly to Javascript promises. If you are not returning anything, then perhaps events may be a better fit.

### Important Detail!

A very important detail to consider is that all calls to bound Go code are run in their own goroutine. Any bound functions should be authored with this in mind. The reason for this is to ensure that bound code does not block the main event loop in the application, which leads to a frozen UI.

## Wails Runtime

When binding a struct with the `WailsInit` method, a runtime object is presented by the Application. This has a number of subsystems which we will now look at in detail.

### Events

The Events subsystem provides a means of listening and emitting events across the application as a whole. This means that you can listen for events emitted in both Javascript and Go, and events that you emit will be received by listeners in both Go and Javascript. 

It is accessible via `runtime.Events` and provides 2 methods: `Emit` and `On`.

#### Emit

> Emit(eventName string, optionalData ...interface{})

The `Emit` method is used to emit named events across the application.

The first parameter is the name of the event to emit. The second parameter is an optional list of interface{} types, meaning you can pass arbitrary data along with the event.

Example 1:

```go
func (m *MyStruct) WailsInit(runtime *wails.Runtime) error {
  runtime.Events.Emit("initialised")
}
```

Example 2:

```go
func (m *MyStruct) WailsInit(runtime *wails.Runtime) error {
  t := time.Now()
  message := fmt.Sprintf("I was initialised at %s", t.String())
  runtime.Events.Emit("initialised", message)
}
```

#### On

> On(eventName string, callback func(optionalData ...interface{}))

The `On` method is used to listen for events emitted across the application.  

The first parameter is the name of the event to listen for. The second parameter is a function to call when the event is emitted. This function has an optional parameter which will contain any data that was sent with the event. To listen to the 2 events emitted in the [emit](####emit) examples:

Example with no data:

```go
func (m *MyStruct) WailsInit(runtime *wails.Runtime) error {
  runtime.Events.On("initialised", func(...interface{}) {
    fmt.Println("I received the 'initialised' event!")
  })
  return nil
}
```

Example with data:

```go
func (m *MyStruct) WailsInit(runtime *wails.Runtime) error {
  runtime.Events.On("hello", func(data ...interface{}) {
    // You should probably do better error checking
    fmt.Printf("I received the 'initialised' event with the message '%s'!\n", data[0])
  })
  return nil
}
```

### Log

The Log subsystem allows you to log messages at various log levels to the application log.

#### New

> New(prefix string)

Creates a new custom Logger with the given prefix.


```go
type MyStruct struct {
	log *wails.CustomLogger
}

func (m *MyStruct) WailsInit(runtime *wails.Runtime) error {
	m.log = runtime.Log.New("MyStruct")
	return nil
}
```

Once created, you may use any of the logger's methods:

##### Standard logging

Each of these methods take a string (like fmt.Println):

  - Debug
  - Info
  - Warn
  - Error
  - Fatal

```go
  m.Log.Info("This is fine")
```

##### Formatted logging

Each of these methods take a string and optional data (like fmt.Printf):

  - Debugf
  - Infof
  - Warnf
  - Errorf
  - Fatalf

```go
  feeling := "okay"
  m.Log.Info("I'm %s with the events that are currently unfolding", feeling)
```

##### Field logging

Each of these methods take a string and a set of fields:

  - DebugFields
  - InfoFields
  - WarnFields
  - ErrorFields
  - FatalFields


```go
  m.Log.InfoFields("That's okay", wails.Fields{
    "things are going to be": "okay",
  })
```

### Dialog

The Dialog subsystem allows you to activate the Webview's native dialogs. It is accessible via `runtime.Dialog` and has the following methods:

**NOTE: Opening a Dialog will halt Javascript execution, just like a browser**

#### SelectFile

> SelectFile()

Prompts the user to select a file for opening. Returns the path to the file.

```go
  selectedFile := runtime.Dialog.SelectFile()
```

#### SelectDirectory

> SelectDirectory()

Prompts the user to select a directory. Returns the path to the directory.

```go
  selectedDirectory := runtime.Dialog.SelectDirectory()
```

#### SelectSaveFile

> SelectSaveFile()

Prompts the user to select a file for saving. Returns the path to the file.

```go
  selectedFile := runtime.Dialog.SelectSaveFile()
```

### Window

The Window subsystem provides methods to interact with the application's main window.

#### SetColour

> SetColour(colour string) error

Sets the background colour of the window to the colour given to it (string). The colour may be specified in the following formats:
  
  - RGB     "rgb(0, 0, 0)"
  - RGBA    "rgba(0, 0, 0, 0.8)"
  - HEX     "#fff" 

```go
  runtime.Window.SetColour("#eee") 
```

#### Fullscreen

> Fullscreen()

Attempts to make the application window fullscreen. Will fail if the application was started with the option "Resize: false".

```go
  runtime.Window.Fullscreen() 
```

#### UnFullscreen

> UnFullscreen()

Attempts to revert the window back to its size prior to a Fullscreen call. Will fail if the application was started with the option "Resize: false"

```go
  UnFullscreen() 
```

#### SetTitle

> SetTitle(title string) 

Sets the title in the application title bar.

```go
 runtime.Window.SetTitle("We'll need a bigger boat")
```

#### Close

Closes the main window and thus terminates the application. Use with care!

```go
  runtime.Window.Close() 
```

### A Common Pattern

A common pattern for the Runtime is to simply save it as part of the struct and use it when needed:

```go
type MyStruct struct {
	Runtime  *wails.Runtime
}

func (m *MyStruct) WailsInit(r *wails.Runtime) error {
	m.Runtime = r
}
```

---

[1]: https://github.com/zserge/webview