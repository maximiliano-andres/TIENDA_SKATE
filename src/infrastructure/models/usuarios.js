import mongoose from 'mongoose';
import Joi from 'joi';

const esquema_usuario = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 3, // Puedes agregar una validación adicional para la longitud mínima
        maxlength: 30 // Añadido para mayor control
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Expresión regular para validar el formato del correo electrónico
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (value) {
                // Expresión regular para validar la contraseña
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/.test(value);
            },
            message: props => `${props.value} no es una contraseña válida. La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un dígito y un carácter especial, y tener al menos 8 caracteres.`,
        },
    },
    role: {
        type: String,
        enum: ["user", "admin"], // Enum para roles de usuario
        default: "user", // Rol por defecto
    },
    nombre_1: {
        type: String,
        required: true,
        trim: true
    },
    nombre_2: {
        type: String,
        trim: true
    },
    apellido_1: {
        type: String,
        required: true,
        trim: true
    },
    apellido_2: {
        type: String,
        trim: true
    },
    rut: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    telefono_1: {
        type: String,
        required: true,
        trim: true
    },
    telefono_2: {
        type: String,
        trim: true
    },
    direccion: {
        type: String,
        trim: true
    },
    fecha_nacimiento: {
        type: Date,
        required: true
    },
    imagen: {
        type: String,
        required: false,
        trim: true
    }
}, {
    timestamps: true, // Agrega campos de fecha de creación y actualización
});

// Exportar los modelos
const User = mongoose.model('User', esquema_usuario);


export { User };
