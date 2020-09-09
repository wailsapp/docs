
module.exports = {
  title: "Wails",
  description: "The lightweight framework for building web-like desktop apps using Go",
  markdown: {
    lineNumbers: true
  },
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        'ga': 'UA-139310949-1'
      }
    ]
  ],
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Wails',
      description: `The lightweight framework for building web-like desktop apps using Go`
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'Wails',
      description: '使用Go构建类似于Web的桌面应用程序的轻量级框架'
    }
  },
  themeConfig: {
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
    locales: {
      '/': {
        label: 'English',
        nav: [
          { text: "Wails", link: "/home.html#wails" },
          { text: "Quick Start", link: "/quick_start" },
          { text: "Tutorials", link: "/tutorials/" },
          { text: "Project Status", link: "/project_status" },
          { text: "Twitter", link: "https://twitter.com/wailsapp" },
          { text: "Slack", link: "https://gophers.slack.com/messages/CJ4P9F7MZ/" },
          { text: "Slack Invite", link: "https://invite.slack.golangbridge.org/" }
        ],
        sidebar: {
          "/": ["home", "quick_start", "/reference/", "/tutorials/", "/development/", "/releases/", "project_status"]
        },
      },
      '/zh/': {
        label: '简体中文',
        nav: [
          { text: "Wails", link: "/zh/home.html#wails" },
          { text: "快速开始", link: "/zh/quick_start" },
          { text: "教程", link: "/zh/tutorials/" },
          { text: "项目状态", link: "/zh/project_status" },
          { text: "Twitter", link: "https://twitter.com/wailsapp" },
          { text: "Slack", link: "https://gophers.slack.com/messages/CJ4P9F7MZ/" },
          { text: "Slack 邀请", link: "https://invite.slack.golangbridge.org/" }
        ],
        sidebar: {
          "/zh/": ["/zh/home", "/zh/quick_start", "/zh/reference/", "/zh/tutorials/", "/zh/development/", "/zh/releases/", "/zh/project_status"]
        },
      }
    }
  }
};
