// Requires
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

// Inicializar variables
var app = express();

// Middleware
app.use(fileUpload());

// Modelos
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// Rutas
app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    var colecciones_validas = ['medicos', 'hospitales', 'usuarios'];

    if (colecciones_validas.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            msg: 'colección no válida',
            errors: {
                message: 'la colección debe ser de uno de los siguientes tipos: ' + colecciones_validas.join(' ,')
            }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            msg: 'ningún archivo seleccionado',
            errors: {
                message: 'Debe agregar una imagen'
            }
        });
    }

    var archivo = req.files.img;
    var extension = archivo.name.split('.')[archivo.name.split('.').length - 1];
    var extensiones_validas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensiones_validas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Extensión no válida',
            errors: {
                message: 'Las extensiones válidas son: ' + extensiones_validas.join(', ')
            }
        });
    }

    var nombre_archivo_custom = `${id}-${(new Date()).getTime()}.${extension}`;
    var path_destino = `./uploads/${tipo}/${nombre_archivo_custom}`;

    archivo.mv(path_destino, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'error moviendo el archivo',
                errors: {
                    message: err
                }
            });
        }

        subirPorTipo(tipo, id, nombre_archivo_custom, res);
    });
});

function subirPorTipo(tipo, id, nombre_archivo, res) {
    if (tipo == 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    success: false,
                    message: 'Usuario no existe',
                    errors: error
                });
            }

            var path_old = './uploads/usuarios/' + usuario.img;

            // si ya existía, lo elimina
            if (fs.existsSync(path_old)) {
                fs.unlink(path_old, (error) => {
                    if (error) {
                        return res.status(500).json({
                            success: false,
                            message: 'error al eliminar el archivo antiguo',
                            errors: error
                        });
                    }
                });
            }

            usuario.img = nombre_archivo;

            usuario.save((err, usuario_updated) => {
                usuario_updated.password = ':)';
                return res.status(200).json({
                    ok: true,
                    msg: 'Imagen de usuario actualizada',
                    usuario: usuario_updated
                });
            });
        });
    }

    if (tipo == 'medicos') {
        Medico.findById(id, (err, medico) => {
            if (!medico) {
                return res.status(400).json({
                    success: false,
                    message: 'Medico no existe',
                    errors: error
                });
            }

            var path_old = './uploads/medicos/' + medico.img;

            // si ya existía, lo elimina
            if (fs.existsSync(path_old)) {
                fs.unlink(path_old, (error) => {
                    if (error) {
                        return response.status(500).json({
                            success: false,
                            message: 'error al eliminar el archivo antiguo',
                            errors: error
                        });
                    }
                });
            }

            medico.img = nombre_archivo;

            medico.save((err, medico_updated) => {
                return res.status(200).json({
                    ok: true,
                    msg: 'Imagen de medico actualizada',
                    medico: medico_updated
                });
            });
        });
    }

    if (tipo == 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            if (!medico) {
                return res.status(400).json({
                    success: false,
                    message: 'Hospital no existe',
                    errors: error
                });
            }

            var path_old = './uploads/hospitales/' + hospital.img;

            // si ya existía, lo elimina
            if (fs.existsSync(path_old)) {
                fs.unlink(path_old, (error) => {
                    if (error) {
                        return response.status(500).json({
                            success: false,
                            message: 'error al eliminar el archivo antiguo',
                            errors: error
                        });
                    }
                });
            }

            hospital.img = nombre_archivo;

            hospital.save((err, hospital_updated) => {
                return res.status(200).json({
                    ok: true,
                    msg: 'Imagen de hospital actualizada',
                    hospital: hospital_updated
                });
            });
        });
    }
}

module.exports = app; // para que se pueda usar fuera de aquí