// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();

// conexión a base datos
mongoose.connection.openUri('mongodb://localhost:27017/hospital_db', (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'CONECTADA'); // \x1b[32m%s\x1b[0m => verde
    }
});

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        msg: 'Petición realizada con éxito'
    });
});

// Escuchar peticiones
app.listen(3000, () => {
    // 3000 = puerto de ejemplo
    console.log('express server en el puerto 3000: \x1b[32m%s\x1b[0m', 'ESCUCHANDO'); // \x1b[32m%s\x1b[0m => verde
});