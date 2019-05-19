const jwt = require('../helper/jwt');

function invoke(req, res, next) {
    const token = req.get('x-access-token');

    try {
        const payload = jwt.verify(token);
    
        req.dadosUsuario = payload;
    } catch (error) {
        console.error(error);
        return res.status(403).send({ msg: 'Invalid token' });
    }

    next();
}

module.exports = invoke;