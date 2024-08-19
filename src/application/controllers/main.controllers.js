import Productos from "../../infrastructure/models/productos.js";

const pag_home = async(req,res)=>{
    const usuario = req.user;
    console.log(usuario)
    const todos_productos = await Productos.find().limit(12)
    const simple_productos = await Productos.find().sort({stock:1}).limit(5);

    return res.status(200).render("index",{usuario, todos_productos, simple_productos})
};


const pag_detalle = (req,res)=>{
    const usuario = req.usuario;
    return res.status(200).render("detalles",{usuario})
};

const pag_otro = (req,res)=>{
    const usuario = req.usuario;
    return res.status(200).render("streams",{usuario})
};

const pag_login = (req,res)=>{
    const usuario = req.usuario; // Obtener el usuario autenticado
    const error = req.query.error;
    console.log(error)
    return res.status(200).render("login", { error: error , usuario:usuario})
}

const pregunta_eliminar = async(req,res)=>{
    const {id} = req.params;
    console.log(id)

    const producto = await Productos.findOne({_id : id})

    return res.render("eliminar", {id, producto})
}

export default {
    pag_home,
    pag_detalle,
    pag_otro,
    pag_login,
    pregunta_eliminar

};