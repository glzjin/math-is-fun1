const fs = require('fs');
const path = require('path');

const cfg = {};

fs.readdirSync(require('path').join(__dirname,'./config'))
  .forEach(filename => {
    const key = path.basename(filename,path.extname(filename));
    const val = require(require('path').join(__dirname,`./config/${filename}`));
    cfg[key] = val;
  });

module.exports = cfg;