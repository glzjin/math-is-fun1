const fs = require('fs');

const routes = [];

fs.readdirSync(`${require('path').join(__dirname,'./routers')}`)
  .forEach(filename=>{
    routes.push(require('path').join(__dirname,`./routers/${filename}`));
});

module.exports = routes;