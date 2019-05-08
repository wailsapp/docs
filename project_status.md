# Project Status

This project is currently in BETA. 

Mac builds currently working.
Linux builds currently working.
Windows builds currently NOT working. Fix in progress.

This means that in general it works, and there are a few things that are keeping it from becoming a v1 release. Any help with these issues would be greatly appreciated:

  - The project has been mostly developed on Mac, with a lesser amount of testing done on Window and Linux. Feedback from users of these platforms will be invaluable.
  - The docs have taken a long time to write. They need reviewing by fresh eyes. Whilst I've tried to keep the docs cross-platform, there may be areas that are lacking (screenshots!). 
  - Wails uses an older version of Webview, which uses a deprecated API for windowing on Mac. Attempts to use the newer releases have [not been successful](https://github.com/zserge/webview/issues/236). Any help on this would be appreciated.

In building this project, I have followed the principle of:

 * Make it work 
 * Make it right
 * Make it fast

It is currently at stage 1. The project has been through a fair number of rewrites and refactors and as such, there will be areas that need attention. I'm hoping with the help of the community we can get to at least stage 2.

## Roadmap

The focus at the moment is very much on ironing out bugs and getting to v1.0. After that, there's a few avenues I'd like to explore:

  * Support other UI Frameworks

    Currently, Wails only supports Vue projects, however there is no real reason it couldn't support other frameworks. It would be good (and relatively easy) to create Project Templates to support React, Preact, Angular, etc.

  * Create more examples

    Even though Wails is only Beta, it's still possible to create some really cool things. As part of the journey, I created an MP3 player to see what was involved, using Go to decode artwork and sending that with the music to the frontend to play. I really look forward to seeing what can be built with this and hope to provide some sort of showcase, along with tutorials.

  * Expanding the rendering targets

    Wails has been designed to handle different targets for rendering your app. Currently it supports Webview and Browser (via a bridge). It would be good to look at other targets, EG: [Ultralight](https://ultralig.ht/).

  * Support for Desktop Elements

    There is currently no support for Menus, Tray, Notifications or any other native desktop elements. Initially, I thought that might be best served by the rendering target but perhaps it would be possible to support at the application layer. 

  * Cross-Compilation

    The holy grail! I believe this might be possible via a docker container containing all the tooling. It's definitely something I think should be explored.

  * Wails Project UI

    Vue has an awesome UI for managing projects. It would be great to build something like this for managing Wails projects.

  * VSCode Extension

    It would be great to be able to have auto-complete of your bound methods whilst writing your frontend code. This would be a good solution as well as offering the usual helpers such as project creation, building, etc.
    