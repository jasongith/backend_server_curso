// Requires
var express = require('express');
const path = require('path');
const fs = require('fs');

// Inicializar variables
var app = express();

// Rutas
app.get('/:tipo/:img', (req, res, next) => {
    var tipo = req.params.tipo;
    var img = req.params.img;

    var path_img = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(path_img)) {
        res.sendFile(path_img);
    } else {
        var path_noimg = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(path_noimg);
    }
});

module.exports = app; // para que se pueda usar fuera de aquí
