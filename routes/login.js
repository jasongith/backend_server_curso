// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
// Requires Google SignIn
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

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

// GOOGLE

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    var token = req.body.token;

    var google_user = await verify(token).catch(err => {
        return res.status(403).json({
            ok: false,
            msg: 'Token inválido'
        });
    });

    Usuario.findOne({email: google_user.email}, (err, usuario_db) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (usuario_db) {
            if (!usuario_db.google) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe de usar su autenticación normal'
                });
            } else {
                var token = jwt.sign({
                    usuario: usuario_db
                }, SEED, {
                    expiresIn: 14400
                }); // 4 horas

                res.status(200).json({
                    ok: true,
                    token: token,
                    usuario: usuario_db,
                    id: usuario_db.id
                });
            }
        } else {
            var usuario = new Usuario();
            usuario.nombre = google_user.nombre;
            usuario.email = google_user.email;
            usuario.img = google_user.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuario_db) => {
                var token = jwt.sign({
                    usuario: usuario_db
                }, SEED, {
                    expiresIn: 14400
                }); // 4 horas

                res.status(200).json({
                    ok: true,
                    token: token,
                    usuario: usuario_db,
                    id: usuario_db.id
                });
            });
        }
    });

    // res.status(200).json({
    //     ok: true,
    //     msg: 'OK!',
    //     google_user
    // });
});


module.exports = app;
