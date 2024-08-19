import debug from "debug";
import Carrito from "../../infrastructure/models/carrito_compras.js";
import Productos from "../../infrastructure/models/productos.js";

const mensaje = debug("app:CARRITO:")

const agregar_carrito = async (req, res) => {
    try {
        const id_usuario = req.userId;
        mensaje(id_usuario);

        const { id } = req.params;
        mensaje(id);

        if (!id_usuario || !id) {
            mensaje("NO hay ID de usuario o NO hay ID de producto");
            const error = "Debes iniciar sesión para agregar productos al carrito";
            return res.status(200).redirect("/tienda_frijolitox/login?error=" + encodeURIComponent(error));
        }
        

        const producto_encontrado = await Productos.findOne({ _id: id });
        mensaje(producto_encontrado);

        if (!producto_encontrado) {
            return res.status(400).json({ message: 'No se encontró producto' });
        }

        if (producto_encontrado.stock < 1) {
            return res.status(400).json({ message: 'Producto fuera de stock' });
        }

        const productos = {
            id_usuario,
            _id: producto_encontrado._id,
            nombre: producto_encontrado.marca + " " + producto_encontrado.modelo,
            precio: producto_encontrado.precio,
            cantidad: 1,
            imagen : producto_encontrado.imagen
        };

        let new_carrito = await Carrito.findOne({ id_usuario });

        if (!new_carrito) {
            new_carrito = new Carrito({ id_usuario, items: [] });
        }

        new_carrito.items.push(productos); // Agregar el producto al array de items
        await new_carrito.save(); // Guardar el carrito actualizado

        // Disminuir el stock del producto
        producto_encontrado.stock -= 1;
        await producto_encontrado.save();

        mensaje("AGREGAR CARRITO: se completó con éxito!! " + JSON.stringify(new_carrito));
        return res.status(200).redirect("/tienda_frijolitox/carrito")

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar al carrito' });
    }
};


const ver_carrito = async (req, res) => {
    try {
        const id_usuario = req.userId;
        mensaje(id_usuario);

        if(!id_usuario){
            mensaje("REDIRIGIENDO a LOGIN")
            const error = "Debes iniciar sesión para ver tú carrito";
            return res.status(200).redirect("/tienda_frijolitox/login?error=" + encodeURIComponent(error));
        }

        // Buscar el carrito del usuario específico
        const carrito = await Carrito.find({ "items.id_usuario": id_usuario });
        mensaje('Obteniendo items del carrito: '+ carrito.items);

        const productos_recomendados = await Productos.find().limit(6).sort({stock:-1});

        const todosLosItems = carrito.flatMap(carrito => carrito.items);

        return res.status(200).render("carrito_pag", { carrito: todosLosItems, productos_recomendados });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener el carrito' });
    }
};


const eliminar_producto_carrito = async(req,res)=>{
    try{
        const id_usuario = req.userId;
        const {id} = req.params;

        const eliminar_articulo = await Carrito.findOneAndDelete({ "items.id_usuario": id_usuario, "items._id":id })

        if (!eliminar_articulo){
            mensaje("NO SE PUDIO ELIMINAR")
            return res.status(400).json({ message: 'no se elimino el producto' });
        }

        mensaje("Producto eliminado: "+ id)
        return res.status(200).redirect("/tienda_frijolitox/carrito");
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al elimiar CODIGO' });
    
    }
}

export default {
    agregar_carrito,
    ver_carrito,
    eliminar_producto_carrito
};