import Joi from "joi";
import debug from "debug";

const mensaje = debug("app: Validador Productos: ");

// Esquema de validación para los productos nuevos
const requisitos_productos = Joi.object({
    marca: Joi.string().min(1).max(100).required(),
    modelo: Joi.string().min(1).max(100).required(),
    descripcion: Joi.string().max(500).required(),
    precio: Joi.number().min(0).required(),
    categoria: Joi.string().trim().uppercase().valid("SKATEBOARDS", "SURFSKATES", "PENNY", "SKATES", "SCOOTERS", "PROTECCIONES", "ROPA").required(),
    stock: Joi.number().min(0).required(),
    imagen: Joi.string().allow('').optional()
});

// Middleware de validación de productos nuevos
const validador_productos = (req, res, next) => {
    const { error } = requisitos_productos.validate(req.body);
    if (error) {
        mensaje(`(ERROR) VALIDADOR PRODUCTOS: ${error.details[0].message}`);
        return res.status(400).json({ message: "Error de validación", error: error.details[0].message });
    }
    next();
};




export default {
    validador_productos
};
