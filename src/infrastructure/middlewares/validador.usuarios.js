import debug from "debug";
import Joi from "joi";

const mensaje = debug("app: validador_usuario");

// esquema de validación con Joi

// -------------------------------------------------------------------------------------

const validador_usuarios = Joi.object({
    username: Joi.string().min(3).max(30).required().trim(),
    email: Joi.string().email().required().trim(),
    password1: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/).required().trim(),
    password2: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/).required().trim(),
    role: Joi.string().valid("user", "admin").default("user").trim(),
    nombre_1: Joi.string().max(50).required().trim().uppercase(),
    nombre_2: Joi.string().max(50).allow(null, '').trim().uppercase(),
    apellido_1: Joi.string().max(50).required().trim().uppercase(),
    apellido_2: Joi.string().max(50).allow(null, '').trim().uppercase(),
    rut: Joi.string().required().trim(),
    descripcion: Joi.string().allow(null, '').trim(),
    telefono_1: Joi.string().pattern(/^\d+$/).required(),
    telefono_2: Joi.string().pattern(/^\d+$/).allow(null, ''),
    direccion: Joi.string().required().trim(),
    fecha_nacimiento: Joi.date().required(),
    imagen: Joi.string().allow('').optional()
}).with('password1', 'password2');


const validar_registro_usuario = (req, res, next) => {
    const { error } = validador_usuarios.validate(req.body);
    if (error) {
        mensaje(`ERROR VALIDADOR REGISTRO USUARIO: ${error.details[0].message}`)
        return res.status(400).render("login", {error: error.details[0].message});
    }
    next();
};

// -------------------------------------------------------------------------------------

const validador_update_perfil = Joi.object({
    nombre_1: Joi.string().max(50).required().trim().uppercase(),
    nombre_2: Joi.string().max(50).allow(null, '').trim().uppercase(),
    apellido_1: Joi.string().max(50).required().trim().uppercase(),
    apellido_2: Joi.string().max(50).allow(null, '').trim().uppercase(),
    rut: Joi.string().required().trim(),
    descripcion: Joi.string().allow(null, '').trim(),
    telefono_1: Joi.string().pattern(/^\d+$/).required(),
    telefono_2: Joi.string().pattern(/^\d+$/).allow(null, ''),
    direccion: Joi.string().required().trim(),
    fecha_nacimiento: Joi.date().required(),
    imagen: Joi.string().allow('').optional()
})

const validar_perfil_update = (req, res, next) => {
    const { _method, id, ...data } = req.body; // Excluye _method de la validación
    const { error } = validador_update_perfil.validate(data);
    if (error) {
        mensaje(`ERROR VALIDADOR PERFIL UPDATE: ${error.details[0].message}`);
        return res.status(400).render("perfil", { error: error.details[0].message });
    }
    next();
};

// -------------------------------------------------------------------------------------

const  validador_login = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password1: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,}$')).required()
});


const validar_inicio_login = (req, res, next) => {
    const { error } = validador_login.validate(req.body);
    if (error) {
        mensaje(`ERROR VALIDADOR LOGIN: ${error.details[0].message}`)
        return res.status(400).render("login", { error: error.details[0].message });
    }
    next();
};

// -------------------------------------------------------------------------------------

export default {
    validar_registro_usuario,
    validar_inicio_login,
    validar_perfil_update
};