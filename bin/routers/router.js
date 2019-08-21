const express = require('express');
const router = new express.Router();
const gethash = require("../controller/gethash");
const challenge = require("../controller/challenge");
const send_message = require("../controller/send_message");
const set_message = require("../controller/set_message");

router
.get("/setmessage", async (req, res) => {
    return set_message(req, res);
})
.get("/sendmessage",async (req, res) => {
    return send_message(req, res);
})
.get("/challenge", async (req, res) => {
    return challenge(req, res);
})
.get("/config", async (req, res) => {
    let callback = req.query.callback || "";
    let json = {};
    for (var i = 0, l = callback.length; i < l; i++) {
        json[callback[i]] = (json[callback[i]] + 1) || 1;
    }
    if(json["."] > 1 || json["<"] || json[">"] || json["\'"] || json["\""]) {
        return res.send(`
        Your request contains dangerous characters that have been blocked by security policy.<br>
        JSONP injection is not within the expected range.
        `);
    }
    let config = {
        SAFE_FOR_JQUERY: true,
        ALLOWED_TAGS: ['style', 'img', 'video'],
        ALLOWED_ATTR: ['style','src','href'],
        FORBID_TAGS: ['base', 'svg', 'link', 'iframe', 'frame', 'embed'],
    }
    return res.send(`${callback}(${JSON.stringify(config)})`);
})
.use(function (err, req, res, next) {
    console.log(err);
    res.status(500).json({error:"server error"});
});
module.exports = (app) => {
    app.use('/',router);
};