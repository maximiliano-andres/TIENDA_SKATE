import mongoose from "mongoose";

const productosSchema = new mongoose.Schema({
    marca: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100, // Ejemplo de validación de longitud máxima
        unique: false // Ejemplo de campo único
    },
    modelo: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100, // Ejemplo de validación de longitud máxima
        unique: true // Ejemplo de campo único
    },
    descripcion: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500 // Ejemplo de validación de longitud máxima
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    categoria: {
        type: String,
        required: true,
        trim: true,
        enum: ["SKATEBOARDS", "SURFSKATES", "PENNY", "SKATES", "SCOOTERS", "PROTECCIONES", "ROPA"]
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    imagen: {
        type: String,
        required: false,
        trim: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    fechaActualizacion: {
        type: Date,
        default: Date.now
    }
});

productosSchema.pre('findOneAndUpdate', function (next) {
    this._update.fechaActualizacion = Date.now();
    next();
});

productosSchema.index({ categoria: 1 }); // Ejemplo de índice en campo 'categoria'

export default mongoose.model("Productos", productosSchema);
