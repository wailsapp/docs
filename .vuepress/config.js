
// const glob = require('glob');

// let tutorialfiles = glob.sync('docs/**/*.md').map(f => '/' + f); 

module.exports = {
  title: "Wails",
  description:
    "The lightweight framework for building web-like desktop apps using Go",
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    sidebar: {
      // "/tutorials/": tutorialfiles, 
      // [
      // ["/home", "← Back"]
      // {
      //   title: "Basics",
      //   collapsable: true,
      //   children: ["01 - Basic", "02 - Basic Custom", "03 - Custom HTML"]
      // },
      // {
      //   title: "Binding",
      //   collapsable: true,
      //   children: ["04 - Binding Functions", "05 - Binding Structs"]
      // },
      // {
      //   title: "Events",
      //   collapsable: true,
      //   children: [
      //     "06 - Events 1",
      //     "07 - Events 2",
      //     "08 - Events 3",
      //     "09 - Events 4"
      //   ]
      // },
      // {
      //   title: "Errors, Logging, Assets",
      //   collapsable: true,
      //   children: [
      //     "10 - Error Handling",
      //     "11 - Logging",
      //     "12 - Custom Logging",
      //     "13 - Assets"
      //   ]
      // },
      // {
      //   title: "Dialogs",
      //   collapsable: true,
      //   children: [
      //     "14 - Dialog - Select File",
      //     "15 - Dialog - Select Directory",
      //     "16 - Dialog - Save File"
      //   ]
      // },
      // {
      //   title: "Window",
      //   collapsable: true,
      //   children: ["17 - Window - Colour", "18 - Window - Control"]
      // }
      // ],
      "/": ["home", "quick_start", "/reference/", "/tutorials/", "project_status"]
      // "/": ["home", "quick_start", "cli", "guide", "tutorials"]
    },
    //       {
    //   title: 'Tutorials',
    //     collapsable: true,
    //       children: [
    //         '/tutorials/'
    //       ]
    // },
    //     ],
    repo: "wailsapp/wails",
    // repoLabel: 'Contribute!',
    // if your docs are in a different repo from your main project:
    docsRepo: "wailsapp/docs",
    // if your docs are not at the root of the repo:
    // docsDir: 'docs',
    // if your docs are in a specific branch (defaults to 'master'):
    docsBranch: "master",
    // defaults to false, set to true to enable
    editLinks: true,
    // custom text for edit link. Defaults to "Edit this page"
    // editLinkText: 'Help us improve this page!',
    nav: [{ text: "Home", link: "/" }, { text: "Twitter", link: "https://twitter.com/wailsapp" }, { text: "Slack", link: "https://wails.slack.com" }]
  }
};
