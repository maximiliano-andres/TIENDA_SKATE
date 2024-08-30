import debug from "debug";
import Productos from "../../infrastructure/models/productos.js";
import mongoose from "mongoose";
import {User} from "../../infrastructure/models/usuarios.js"
import {fileURLToPath} from "url";
import path from "path";

const __dirname = fileURLToPath(new URL(".",import.meta.url))

const mensaje = debug("app: Productos: ")

const pag_registrar_producto = (req,res)=>{
    mensaje("pagina de registro")
    
    const error = req.query.error; 
    return res.render("registra_productos", {error})
};

const crear_producto = async(req,res) => {
    try{
        let {marca, modelo, descripcion, precio, categoria, stock} = req.body;
        let imagen = req.file ? req.file.filename : "default.png"
        
        marca = marca.trim().toUpperCase();
        modelo = modelo.trim().toUpperCase();
        categoria = categoria.trim().toUpperCase();
        //imagen = imagen ? imagen.trim() : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=1060";
    
        const lista_productos =  ["SKATEBOARDS", "SURFSKATES", "PENNY", "SKATES", "SCOOTERS", "PROTECCIONES", "ROPA",]

        //verifico que reciba los datos
        mensaje({marca, modelo, descripcion, precio, categoria, stock})
        mensaje(imagen)


        const producto_repetido = await Productos.findOne({ marca, modelo, categoria })

        if (producto_repetido) {
            mensaje("Crear Producto: El producto ya se encuentra registrado")
            return res.status(400).json({ massage: "El producto ya se encuentra registrado" })
        }

        const producto_nuevo = await Productos.create({ marca, modelo, descripcion, precio, categoria, stock, imagen });

        mensaje("Crear Producto: Producto creado correctamente")
        return res.redirect("/tienda_frijolitox/productos", 302);

    }
    catch(error){
        mensaje(`ERROR Crear Productos: ${error}`);
        res.status(500).json({message: "Hubo un error en la codificacion"});
    }
}

const mostrar_productos = async(req,res)=>{
    try{
        const todos_productos = await Productos.find(). limit(12);

        const lista_productos =  ["SKATEBOARDS", "SURFSKATES", "PENNY", "SKATES", "SCOOTERS", "PROTECCIONES", "ROPA",]
        
        mensaje("Mostrar Productos: Productos encontrados")

         // Obtener los productos más recientes con limite de 3
        const productos_recientes = await Productos.find().sort({ fechaCreacion: -1 }).limit(3);

        const productos_premium = await Productos.find().sort({precio:-1, stock: 1}).limit(4)
        
        return res.status(200).render("productos",{todos_productos, lista_productos, productos_recientes, productos_premium})
    }
    catch (error){
        mensaje(`ERROR Mostrar Productos : ${error}`);
        return res.status(500).json({message: "Hubo un error en la codificacion"});
    }
};

const ver_producto_filtrado = async(req,res)=>{
    try{
        const usuario = req.userId;
        const { categoria } = req.params; 
        console.log(categoria)
        const filtro_productos = await Productos.find({categoria} );

        const mas_populares = await Productos.find().sort({stock: -1, precio:-1}).limit(5)

        
        return res.render("filtro_productos",{filtro_productos, categoria, mas_populares, usuario})

    }
    catch(error){
        mensaje(`ERROR Mostrar Productos : ${error}`);
        return res.status(500).json({message: "Hubo un error en la codificacion"});
    }
}


const ver_producto_especifico = async(req,res)=>{
    try{
        const {id} = req.params
        const vista_producto = await Productos.findOne({_id : id})
        const recomendacion = await Productos.find({categoria: vista_producto.categoria}).sort({stock:-1}).limit(6);
        let rol_user = "user";

        if(req.userId){
            const id_usuario = req.userId;
            const datos_user = await User.findOne({_id : id_usuario})      
            rol_user = datos_user.role
            console.log(rol_user)
        }
        
        //console.log(vista_producto)
        return res.status(200).render("detalles", {producto : vista_producto, usuario: rol_user, recomendacion} )
    }
    catch (error){
        mensaje("PRODUCTO_ESPECIFICO:" + error)
        res.status(500).json({message: "un error de codigo"})
    }
}

const pag_act_producto = async(req,res)=>{
    const {id} = req.params;
    const producto = await Productos.findOne({_id:id})
    return res.render("update_producto", {producto})
}

const act_productos = async(req,res) => {
    try{
        const {id } = req.params;

        if (!id){
            mensaje("Act.Prodcutos: No se encontro un ID valido")
            return res.status(400).json({message: "no se encontro un ID valido"})
        }

        if(!mongoose.Types.ObjectId.isValid(id)){
            mensaje("Act.Prodcutos: El ID no tiene un formato valido")
            return res.status(400).json({message: "el ID no tiene un formato valido"})
        }

        let {marca, modelo, descripcion, precio, categoria, stock,} = req.body;
        let imagen = req.file ? req.file.filename : "default.png"

        mensaje("Act.Productos: Información del archivo:", req.file);
        mensaje("Act.Productos: Información del archivo:", req.filename);
        mensaje("Act.Productos: Nombre de la imagen:", imagen);

        marca = marca.trim().toUpperCase();
        modelo = modelo.trim().toUpperCase();
        descripcion = descripcion.trim();
        precio = parseFloat(precio);
        categoria = categoria.trim().toUpperCase();
        stock = parseInt(stock);
        
        const lista_productos =  ["SKATEBOARDS", "SURFSKATES", "PENNY", "SKATES", "SCOOTERS", "PROTECCIONES", "ROPA",]
        
        if (!lista_productos.includes(categoria)) {
            mensaje("Crear Producto: La categoria no se encontra en la lista establecida")
            return res.status(400).json({ massage: `La categoria ${categoria} NO se encuentra en los datos establecidos!!!` })
        }


        const actualizar_productos = await Productos.findByIdAndUpdate(id, {marca, modelo, descripcion, precio, categoria, stock,imagen}, {new:true} );

        if (!actualizar_productos){
            mensaje("Act.Producto: No se encontro un archivo para actualizar")
            return res.status(400).json({message: "no se encontro un archivo para actualizar"})
        }

        mensaje(`Act.Producto: Se actualizo el producto ${marca}, modelo ${modelo} con existo`)
        return res.redirect(`/tienda_frijolitox/producto/${id}`)

    }
    catch(error){
        res.status(500).json({message: "un error de codigo" + error})
    }
};

const eliminar_producto = async(req,res) => {
    try{
        const { id } = req.params;
        
        if(!id){
            mensaje("Eliminar Producto: No se encontro un ID")
            return res.status(400).json({message: "No se encontro un ID"})
        };

        if(!mongoose.Types.ObjectId.isValid(id)){
            mensaje(`Eliminar Producto: El ID: ${id} no es valido`);
            return res.status(400).json({message: "El ID no es valido"});
        };

        const borrar = await Productos.findByIdAndDelete({ _id : id });

        if(!borrar){
            mensaje(`Eliminar Producto: No se pudo eliminar el objeto con ID: ${id}`);
            return res.status(400).json({message: "No se pudo eliminar el producto"});
        }

        mensaje(`Eliminar Producto: Se elimino el producto con el ID: ${id} con exito`)
        return res.status(200).redirect("/tienda_frijolitox/productos")
    }
    catch(error){
        mensaje('Error al borrar el producto:', error);
        return res.status(500).json({ message: "error en la codificacion" })
    }
}


const buscar = async (req, res) => {
    try {
        const buscar_producto = req.query.buscar_algo;
        if (!buscar_producto) {
            return res.status(400).json({ error: 'No se proporcionó el término de búsqueda.' });
        }

        // Consulta usando el operador $or
        const resultado = await Productos.find({
            $or: [
                { modelo: new RegExp(buscar_producto, 'i') },
                { marca: new RegExp(buscar_producto, 'i') }
            ]
        });

        const categoria = "DEFAULT_BANNER.jpg"

        const recomendacion = await Productos.find().sort({stock:-1, precio:-1}).limit(5);
        // Devuelve los resultados
        return res.status(200).render("busqueda", {resultado, categoria, recomendacion})
    } catch (error) {
        console.error('ERROR BUSCAR: ', error);  
        return res.status(500).json({ message: 'Error en la codificación' });
    }
};


export default {
    pag_registrar_producto,
    crear_producto,
    mostrar_productos,
    act_productos,
    eliminar_producto,
    ver_producto_filtrado,
    ver_producto_especifico,
    eliminar_producto,
    pag_act_producto,
    buscar
}

