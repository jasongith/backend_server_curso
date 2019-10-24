// Requires
var express = require('express');

// Inicializar variables
var app = express();

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        msg: 'Petición realizada con éxito'
    });
});

module.exports = app; // para que se pueda usar fuera de aquí
