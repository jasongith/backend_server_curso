// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var middleware_auth = require('../middlewares/auth');

// Inicializar variables
var app = express();

// Modelos
var Medico = require('../models/medico');

// get medicos
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({}, 'nombre email img role')
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(desde)
        .limit(5)
        .exec((err, medicos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'error cargando medicos',
                errors: err
            });
        } else {
            Medico.count({}, (err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo
                });
            });
        }
    });
});

// set medico
app.post('/', middleware_auth.verificaToken, (req, res) => {
    var body = req.body; //esto solo funciona teniendo el body parser (si no, tendremos un undefined o algo así)

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario,
        hospital: body.hospital
    });

    medico.save((err, medico_guardado) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                msg: 'error creando medico',
                errors: err
            });
        } else {
            return res.status(201).json({
                ok: true,
                medico: medico_guardado,
                medico_token: req.medico
            });
        }
    });
});

// put medico
app.put('/:id', middleware_auth.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                msg: 'error buscando medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: true,
                msg: 'medico no encontrado',
                errors: {
                    message: 'no existe un medico con ese id'
                }
            });
        }

        medico.nombre = body.nombre;
        medico.email = body.email;
        medico.role = body.role;

        medico.save((err, medico_guardado) => {
            if (err) {
                return res.status(500).json({
                    ok: true,
                    msg: 'error actualizando medico',
                    errors: err
                });
            }

            medico.password = ':)';

            return res.status(200).json({
                ok: true,
                medico: medico_guardado
            });
        });
    });

});

// delete medico
app.delete('/:id', middleware_auth.verificaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medico_borrado) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                msg: 'error borrando medico',
                errors: err
            });
        }

        if (!medico_borrado) {
            return res.status(400).json({
                ok: true,
                msg: 'medico no encontrado',
                errors: {
                    message: 'no existe un medico con ese id'
                }
            });
        }

        return res.status(200).json({
            ok: true,
            medico: medico_borrado
        });
    });
});


module.exports = app; // para que se pueda usar fuera de aquí