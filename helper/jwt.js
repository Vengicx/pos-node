const jwt = require('jsonwebtoken');
const key = 'xeSHLIL3qooSB2V0cZxjy8cyL0H4I7tnbI1Z2putno7BIu3jX5ljVX21z3Gib03r';

const verify = function(token) {
    return jwt.verify(token, key);
}

const sign = function(data) {
    return jwt.sign(data, key);
}

module.exports = {
    verify,
    sign
}