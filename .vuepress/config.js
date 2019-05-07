
module.exports = {
  title: "Wails",
  description:
    "The lightweight framework for building web-like desktop apps using Go",
  markdown: {
    lineNumbers: true
  },
  ga: 'UA-139310949-1',
  themeConfig: {
    sidebar: {
      "/": ["home", "quick_start", "/reference/", "/tutorials/", "project_status"]
    },
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
    nav: [{ text: "Home", link: "/" }, { text: "Twitter", link: "https://twitter.com/wailsapp" }, { text: "Slack", link: "https://gophers.slack.com/messages/CJ4P9F7MZ/" }, { text: "Slack Invite", link: "https://invite.slack.golangbridge.org/" }]
  }
};
