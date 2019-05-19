const bcrypt = require('bcrypt');
const saltRounds = 10;

const hash = async function(password) {
    return await bcrypt.hash(password, saltRounds);
};

const compare = async function(password, hash) {
    return await bcrypt.compare(password, hash);
}

module.exports = {
    hash,
    compare
};
  