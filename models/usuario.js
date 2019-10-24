var mongoose = require('mongoose');
var unique_validator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var roles_validos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var usuario_schema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerido']
    },
    password: {
        type: String,
        required: [true, 'El password es requerido']
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: roles_validos
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuario_schema.plugin(unique_validator, {
    message: '{PATH} debe ser único'
})

module.exports = mongoose.model('Usuario', usuario_schema);
