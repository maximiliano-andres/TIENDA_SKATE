import {Router} from 'express';
import productosController from '../../../controllers/productos.controllers.js';
import v from "../../../../infrastructure/middlewares/validador.productos.js"
import t from "../../../../infrastructure/middlewares/validador.token.js"
import i from '../../../../infrastructure/middlewares/imagenes.js';


const router = Router();

// Ruta para crear un nuevo producto
router.get('/tienda_frijolitox/nuevo_producto', t.validadorTOKEN,productosController.pag_registrar_producto);
router.post('/tienda_frijolitox/nuevo_producto', t.validadorTOKEN,i.imagenes_produtos.single('imagen'), v.validador_productos,productosController.crear_producto);
// Actualizar Productos
router.get('/productos/update_producto/:id',t.validadorTOKEN, productosController.pag_act_producto);
router.post('/productos/update_producto/:id',t.validadorTOKEN,i.imagenes_produtos.single('imagen'), v.validador_productos, productosController.act_productos);
// eliminar producto
router.delete('/productos/eliminar_producto/:id', productosController.eliminar_producto);

// Ruta para obtener todos los productos
router.get('/tienda_frijolitox/productos', t.validadorTOKEN, productosController.mostrar_productos);

//filtro productos
router.get("/tienda_frijolitox/productos/:categoria", t.validadorTOKEN, productosController.ver_producto_filtrado)

//oproducto unico

router.get("/tienda_frijolitox/producto/:id", t.validadorTOKEN, productosController.ver_producto_especifico)
router.delete("/tienda_frijolitox/producto_eliminar/:id", t.validadorTOKEN, productosController.eliminar_producto)


//buscar producto header
router.get("/buscar_producto_tienda",t.validadorTOKEN, productosController.buscar)

export default router;
