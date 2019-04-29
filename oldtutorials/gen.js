var fs = require('fs');
let files = ['01 - Basic', '02 - Basic Custom', '03 - Custom HTML', '04 - Binding Functions', '05 - Binding Structs', '06 - Events 1', '07 - Events 2', '08 - Events 3', '09 - Events 4', '10 - Error Handling', '11 - Logging', '12 - Custom Logging', '13 - Assets', '14 - Dialog - Select File', '15 - Dialog - Select Directory', '16 - Dialog - Save File', '17 - Window - Colour', '18 - Window - Control']
let template = `

In this tutorial, we will be covering:
 
  - First item
  - Second Item

`;

let main = `# Tutorials

These tutorials will be a comprehensive walkthrough of the Wails framework, covering all the major features and concepts.

`

let sidebar = `<!-- docs/_sidebar.md -->

* [Back](/?id=wails)
* [Tutorials](tutorials/README.md)
`

for (let file of files) {
  var title = file.substring(5, file.length)
  var filename = file.replace(/ /g, "%20") + ".md"
  var link = `[${title}](tutorials/${filename})`
  main += ` **${title}**\n\n`
  sidebar += `* ${link}\n`
  fs.writeFileSync(`${file}.md`, `# ${file}${template}`)
}
fs.writeFileSync('README.md', main)
fs.writeFileSync('_sidebar.md', sidebar)
