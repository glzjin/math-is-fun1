let crypto = require("crypto");

module.exports = function(req, res) {
    let server_text = Math.random().toString().substr(-5);
    let server_hash = crypto.createHash('md5').update(server_text).digest("hex").substr(0,5);
    req.session.hash = server_hash;
    return res.send({"hash": server_hash});
}