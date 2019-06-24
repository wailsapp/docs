---
sidebar: on
sidebarDepth: 2
---

# Reference

## API

### Binding

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

Wails comes with a runtime library that may be accessed from Javascript or Go. It has the following subsystems:

  * Events
  * Logging
  * Window
  * Dialog
  * Browser

**NOTE: At this time, the Javascript runtime does not include the Window and Dialog subsystems**

When binding a struct with the `WailsInit` method, the Go runtime object is presented by the Application.

For the frontend, the runtime is accessed through the `window.wails` object.

**NOTE: We are looking to unify the API between the runtimes. This is currently being tracked in [this ticket](https://github.com/wailsapp/wails/issues/123)**

### Events

The Events subsystem provides a means of listening and emitting events across the application as a whole. This means that you can listen for events emitted in both Javascript and Go, and events that you emit will be received by listeners in both Go and Javascript.

In the Go runtime, it is accessible via `runtime.Events` and provides 2 methods: `Emit` and `On`.

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

### Browser

The browser subsystem provides methods to interact with the system browser.

#### OpenURL

> OpenURL(url string)

Opens the given URL in the system browser.

```go
runtime.Browser.OpenURL("https://wails.app")
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

## Cli

Wails comes with a CLI tool that allows you to generate, build and bundle your projects. It deals with the complexity of juggling Go and Javascript environments.

It has a number of commands:

### Help

> wails --help

This will output the cli help message with all the available commands and flags.

### Setup

> wails setup

The setup command does a number of things - it asks you for your name and email so that it can fill in project templates with your details. It also checks to see if your environment has the dependencies it needs and if not, try to suggest ways on how to install those dependencies.

Setup is also the default command so it can be invoked by simply running `wails`.

<div class="videocontainer">
<video width="727" height="454" controls>
  <source src="/media/setup.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
</div>

### Init

> wails init

The init command builds out a new project based on a template of your choice. We curently support a basic Vue, Vuetify and React templates. The project will be built automatically after initialisation.

#### Basic Vue

This template consists of a frontend composed of Vue components, bundled together using Webpack. It makes a simple call to the backend.

#### Vuetify

This template consists of a frontend composed of Vuetify components, bundled together using Webpack. It makes a simple call to the backend.

#### React

This template consists of a frontend composed of React components, bundled together using Webpack. It makes a simple call to the backend.

<div class="videocontainer">
<video width="727" height="454" controls>
  <source src="/media/init.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
</div>

### Serve

> wails serve

When you run `wails serve`, it will compile up the backend and run it in headless mode. This allows you to develop the frontend using your standard tooling. When you run your app, it will connect to the backend at startup and make all your backend functions available to you.

We will cover this more in the tutorial.

<div class="videocontainer">
<video width="727" height="390" controls>
  <source src="/media/serve.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
</div>

### Build

> wails build

The build command is the Wails equivalent of `go build`, however it does a number of things:

- Installs frontend dependencies if needed
- Performs a build of the frontend
- Packs the frontend using Webpack
- It downloads any Go dependencies that are required
- It finally compiles and bundles everything into a single binary

<div class="videocontainer">
<video width="727" height="454" controls>
  <source src="/media/build.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
</div>

### Build Flags

Here is a list of all available flags:

| Flag | Description                                  |
| ---- | -------------------------------------------- |
| -f   | Force rebuild of frontend dependencies       |
| -d   | Build application in Debug mode              |
| -p   | Package application after a successful build |

The `-p` flag is currently supports OSX and Windows. On OSX, it bundles your binary into a .app file with the default icon. On Windows, it will generate the application resource files and compile it all into a '.exe'. When the `-p` flag is used, the packaging files are left available for editing. Any changes will be picked up by the next build (eg icon).

### Update

> wails update

This command does a check to see if the current version is the latest. If not, it will download and install the latest version. It is possible to also use it to install 'prerelease' versions by using the `-pre` flag. If a specific version is required, then it supports a `-version` flag.

Example: `wails update -pre` will update the latest prerelease version

### Issue

> wails issue

This command speeds up the process for submitting an issue to the Wails project. When you run the command, you will be asked to answer a couple of questions:

<div class="imagecontainer">
  <img src="/media/issue.png" style="width:75%">
</div>

Wails then determines some environmental details such as it's own version, opens a browser and fills in the default issue template.

<div class="imagecontainer">
  <img src="/media/issuebrowser.png" style="width:100%">
</div>

Please note: you can edit the template as you feel fit before submitting.

### Tooling

The Wails cli has developer tooling built in, but needs activating. To create a developer version, do the following:

```
cd cmd/wails
go install --tags=dev
```

This unlocks a `wails dev` command that has subcommands for development.

#### Creating new project templates

With a developer enabled cli, you can run `wails dev newtemplate` to create a new project template. You will be asked a number of questions regarding your template and as a result, a new directory will be created in `<project-root>/cmd/templates`.

Here is an example run:

```
Wails v0.14.4-pre - Generating new project template

? Please enter the name of your template (eg: React/Webpack Basic): Mithril Basic
? Please enter a short description for the template (eg: React with Webpack 4): Mithril with Webpack 3
? Please enter a long description: Mithril v2.0.0-rc.4 with Webpack 4
? Please enter the name of the directory the frontend code resides (eg: frontend): frontend
? Please enter the install command (eg: npm install): npm install
? Please enter the build command (eg: npm run build): npm run build
? Please enter the serve command (eg: npm run serve): npm run serve
? Please enter the name of the directory to copy the wails bridge runtime (eg: src): src
? Please enter a directory name for the template: mithril-basic
Created new template 'Mithril Basic' in directory '/Users/lea/Projects/wails/cmd/templates/mithril-basic'
```
This generates the following `template.json`:

```json
{
  "name": "Mithril Basic",
  "version": "1.0.0",
  "shortdescription": "Mithril with Webpack 3",
  "description": "Mithril v2.0.0-rc.4 with Webpack 4",
  "install": "npm install",
  "build": "npm run build",
  "author": "Duncan Disorderly <frostyjack@sesh.com>",
  "created": "2019-05-20 20:16:30.394489 +1000 AEST m=+159.490635188",
  "frontenddir": "frontend",
  "serve": "npm run serve",
  "bridge": "src",
  "wailsdir": ""
}
```

*Note: The `wailsdir` key is currently unused but will be used in place of bridge in the [near future](https://github.com/wailsapp/wails/issues/88)*

You now have a good basis for your template. Running `wails init` will now give you your template as an option to install. When the project is generated using the template, it will create directories, copy non-template files then copy template files. Template files end in .template and will be treated as standard Go templates in which embedded codes are substituted with values in the [Project Options](https://github.com/wailsapp/wails/blob/master/cmd/project.go#L139-L154).
