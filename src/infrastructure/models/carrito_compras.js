import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    id_usuario: { type: String, required: true },
    _id: { type: String, required: true },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    imagen: { type: String, required: false, trim: true}
});

const carritoSchema = new mongoose.Schema({
    items: [itemSchema],
});

const Carrito = mongoose.model('Carrito', carritoSchema);

export default Carrito;
