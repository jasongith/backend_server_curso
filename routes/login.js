// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// Inicializar variables
var app = express();

// Modelos
var Usuario = require('../models/usuario');



app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuario_db) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                msg: 'error buscando usuario',
                errors: err
            });
        }

        if (!usuario_db) {
            return res.status(400).json({
                ok: true,
                msg: 'datos incorrectos.',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuario_db.password)) {
            return res.status(400).json({
                ok: true,
                msg: 'datos incorrectos',
                errors: err
            });
        }
        
        usuario_db.password = ':)';

        // crear token
        var token = jwt.sign({ usuario: usuario_db }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            ok: true,
            token: token,
            usuario: usuario_db,
            id: usuario_db.id
        });
    });
});




module.exports = app;
