// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json())

// Importar rutas
var app_routes = require('./routes/app');
var usuario_routes = require('./routes/usuario');
var login_routes = require('./routes/login');

// Conexión a base datos
mongoose.connection.openUri('mongodb://localhost:27017/hospital_db', (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'CONECTADA'); // \x1b[32m%s\x1b[0m => verde
    }
});

// Rutas
app.use('/login', login_routes); // middleware
app.use('/usuario', usuario_routes); // middleware
app.use('/', app_routes); // middleware

// Escuchar peticiones
app.listen(3000, () => {
    // 3000 = puerto de ejemplo
    console.log('express server en el puerto 3000: \x1b[32m%s\x1b[0m', 'ESCUCHANDO'); // \x1b[32m%s\x1b[0m => verde
});