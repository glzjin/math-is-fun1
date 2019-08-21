const crypto = require('crypto');

module.exports = function () {
    return crypto.randomBytes(8).toString("hex").slice(0,4);
}