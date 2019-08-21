let crypto = require("crypto");
const bot = require("../controller/bot");

function check_hash(server_hash, client_text) {
    let ret = false;
    client_text = client_text.toString();
    let client_hash = crypto.createHash('md5').update(client_text).digest("hex").substr(0,5);
    try {
        if( client_hash === server_hash && server_hash.length === 5 ) {
            ret = true;
        }
    }
    catch(e) {
        console.log(e);
    }
    return ret;
}

module.exports = async function(req, res) {
    let ret;
    if( ! req.query.text ) {
        ret = JSON.stringify({error: "bad request"});
    }
    else {
        let pass = check_hash(req.session.hash, req.query.text);
        if (pass) {
            ret = await bot(req);
        }
        else {
            ret = {error: "hash error"};
        }
        req.session.hash = "";
    }
    return res.send({ret});
}