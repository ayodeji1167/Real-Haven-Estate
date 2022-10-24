const fs = require('fs');
const path = require('path');

const mjmlFolder = path.join(__dirname, '../views/mjml');

const files = await fs.readdir(mjmlFolder);

let hbs;
let fileContent;

files.array.forEach((file) => {
  fileContent = fs.readFileSync(path.join(__dirname, '../views/mjml', file));
  hbs = path.join(__dirname, `../views/hbs${file.replace('.mjml', '.hbs')}`);
  fs.writeFileSync(hbs, fileContent.html);
});
