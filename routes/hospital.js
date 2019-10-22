// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var middleware_auth = require('../middlewares/auth');

// Inicializar variables
var app = express();

// Modelos
var Hospital = require('../models/hospital');

// get hospitales
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({}, 'nombre email img role')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(5)
        .exec((err, hospitales) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                msg: 'error cargando hospitales',
                errors: err
            });
        } else {
            Hospital.count({}, (err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: conteo
                });
            });
        }
    });
});

// set hospital
app.post('/', middleware_auth.verificaToken, (req, res) => {
    var body = req.body; //esto solo funciona teniendo el body parser (si no, tendremos un undefined o algo así)

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario
    });

    hospital.save((err, hospital_guardado) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                msg: 'error creando hospital',
                errors: err
            });
        } else {
            return res.status(201).json({
                ok: true,
                hospital: hospital_guardado,
                hospital_token: req.hospital
            });
        }
    });
});

// put hospital
app.put('/:id', middleware_auth.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                msg: 'error buscando hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: true,
                msg: 'hospital no encontrado',
                errors: {
                    message: 'no existe un hospital con ese id'
                }
            });
        }

        hospital.nombre = body.nombre;
        hospital.email = body.email;
        hospital.role = body.role;

        hospital.save((err, hospital_guardado) => {
            if (err) {
                return res.status(500).json({
                    ok: true,
                    msg: 'error actualizando hospital',
                    errors: err
                });
            }

            hospital.password = ':)';

            return res.status(200).json({
                ok: true,
                hospital: hospital_guardado
            });
        });
    });

});

// delete hospital
app.delete('/:id', middleware_auth.verificaToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospital_borrado) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                msg: 'error borrando hospital',
                errors: err
            });
        }

        if (!hospital_borrado) {
            return res.status(400).json({
                ok: true,
                msg: 'hospital no encontrado',
                errors: {
                    message: 'no existe un hospital con ese id'
                }
            });
        }

        return res.status(200).json({
            ok: true,
            hospital: hospital_borrado
        });
    });
});


module.exports = app; // para que se pueda usar fuera de aquí