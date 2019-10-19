// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
//var SEED = require('../config/config').SEED;
var middleware_auth = require('../middlewares/auth');

// Inicializar variables
var app = express();

// Modelos
var Usuario = require('../models/usuario');

// get usuarios
app.get('/', (req, res, next) => {
    Usuario.find({}, 'nombre email img role').exec((err, usuarios) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                msg: 'error cargando usuarios',
                errors: err
            });
        } else {
            return res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        }
    });
});

// set usuario
app.post('/', middleware_auth.verificaToken, (req, res) => {
    var body = req.body; //esto solo funciona teniendo el body parser (si no, tendremos un undefined o algo así)

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuario_guardado) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                msg: 'error creando usuario',
                errors: err
            });
        } else {
            return res.status(201).json({
                ok: true,
                usuario: usuario_guardado,
                usuario_token: req.usuario
            });
        }
    });
});

// put usuario
app.put('/:id', middleware_auth.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                msg: 'error buscando usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: true,
                msg: 'usuario no encontrado',
                errors: {
                    message: 'no existe un usuario con ese id'
                }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuario_guardado) => {
            if (err) {
                return res.status(500).json({
                    ok: true,
                    msg: 'error actualizando usuario',
                    errors: err
                });
            }

            usuario.password = ':)';

            return res.status(200).json({
                ok: true,
                usuario: usuario_guardado
            });
        });
    });

});

// delete usuario
app.delete('/:id', middleware_auth.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuario_borrado) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                msg: 'error borrando usuario',
                errors: err
            });
        }

        if (!usuario_borrado) {
            return res.status(400).json({
                ok: true,
                msg: 'usuario no encontrado',
                errors: {
                    message: 'no existe un usuario con ese id'
                }
            });
        }

        return res.status(200).json({
            ok: true,
            usuario: usuario_borrado
        });
    });
});


module.exports = app; // para que se pueda usar fuera de aquí