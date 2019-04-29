# Basic

To get started, we will generate the simplest project there is. Run `wails init`, answer the questions but select the basic template:

<div class="videocontainer">
  <video width="726" height="432" controls>
    <source src="/media/init_basic.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video> 
</div>

In the video, we chose to generate the project in a directory called `basic`. If we `cd basic`, we can see 2 files: `main.go` and `project.json`:

Let's look at the `main.go` file:

```go
package main

import (
	wails "github.com/wailsapp/wails"
)

var html = `
<div style='text-align:center'>
<div class="wails-logo" style="width: 25rem;margin: auto;height: 25rem;"></div>
<h1> Basic Template </h1>
Welcome to your basic Wails app!
</div>
`

func main() {

	// Initialise the app
	app := wails.CreateApp(&wails.AppConfig{
		Width:  1024,
		Height: 768,
		Title:  "My Project",
		HTML:   html,
	})
	app.Run()
}
```

This creates the main application and sets the window size to 1024x768. The main window has some simple HTML which is rendered. To compile it, run `wails build`.

<div class="videocontainer">
  <video width="726" height="432" controls>
    <source src="/media/build_basic.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video> 
</div>

You should now have a couple of more files in your directory. The first is `go.sum`. This a Go system file related to modules and, for now, will be ignored. The second file is your application! Run the application with './basic' (or './basic.exe' on Windows). You should see your basic app open in a window:

<div class="imagecontainer">
  <img src="/media/basic_app.png" style="width:40rem">
</div>