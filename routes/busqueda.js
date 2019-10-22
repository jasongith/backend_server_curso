// Requires
var express = require('express');

// Inicializar variables
var app = express();

// Modelos
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// Rutas
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i'); // i significa insensible a mayús. minús.
    var promesa;

    switch (tabla) {
        case 'medicos':
            promesa = buscarMedicos;
            break;
        case 'hospitales':
            promesa = buscarHospitales;
            break;
        case 'usuarios':
            promesa = buscarUsuarios;
            break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'Solo se permite buscar por médicos, hospitales y usuarios'
            });
    }

    promesa(busqueda, regex)
        .then(resp => {
            res.status(200).json({
                ok: true,
                [tabla]: resp
            });
        });
});

app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i'); // i significa insensible a mayús. minús.

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2],
            });
        });
});

function buscarHospitales(busqueda, regex) {
    return new Promise((res, rej) => {
        Hospital.find({
                nombre: regex
            })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    rej('Error al cargar hospitales', err);
                } else {
                    res(hospitales);
                }
            });
    });
}

function buscarMedicos(busqueda, regex) {
    return new Promise((res, rej) => {
        Medico.find({
                nombre: regex
            })
            .populate('usuario', 'nombre email')
            .exec((err, medicos) => {
                if (err) {
                    rej('Error al cargar medicos', err);
                } else {
                    res(medicos);
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {
    // buscar en varias columnas, con el "or"
    return new Promise((res, rej) => {
        Usuario.find({}, 'nombre email role')
            .or([{
                nombre: regex
            }, {
                email: regex
            }])
            .exec((err, usuarios) => {
                if (err) {
                    rej('Error al cargar usuarios', err);
                } else {
                    res(usuarios);
                }
            });
    });
}

module.exports = app; // para que se pueda usar fuera de aquí