(async () => {
    const express = require('express');
    const start_bot = require("./tool/browser");
    const bodyparser = require('body-parser');
    const routes = require('./router');
    const cfg = require('./config');
    const serveStatic = require('serve-static');
    var session = require('express-session');
    var FileStore = require('session-file-store')(session);
    const app = new express();

    app.disable('x-powered-by');
    app.use(session({
        store: new FileStore,
        secret: cfg.web.key,
        resave: true,
        saveUninitialized: true
    }));
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded());
    app.use(express.static("./assert"));
    
    app.use(function (req, res, next) {
        console.log("------------------------------------------");
        let src_ip = req.socket.remoteAddress.replace(/[^0-9.]/g,"");
        console.log({src_ip, headers: req.headers, url: req._parsedUrl._raw, time: Date()});
        next();
    })
    routes.forEach(route => {
        require(route)(app);
    });
    app.use(function (req, res, next) {
        res.status(404).json({error:"server not found"});
    })
    app.use(function (err, req, res, next) {
        console.log(err);
        res.status(500).json({error:"server error"});
    });
    try {
        app.listen(cfg.web.port,async () => {
            if(! await start_bot()) {
                process.exit(-1);
                console.error("unexpect error in app.js start_bot, bot is not't started");
            }
            console.log(`listening ${cfg.web.port}`);
        })
    }
    catch(err) {
        console.log(err);
    }
})()

