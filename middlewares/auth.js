// Requirtes
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


// verificar token: de aquí para abajo, todas las peticiones se validararán con el token. Si es válido, el next los "deja pasar", y si no, error
exports.verificaToken = function (req, res, next) { 
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: true,
                msg: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });
}
    