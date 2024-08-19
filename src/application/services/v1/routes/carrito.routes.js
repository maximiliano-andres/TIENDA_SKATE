import carrito from "../../../controllers/carrito.controllers.js"
import t from "../../../../infrastructure/middlewares/validador.token.js"
import { Router } from "express";


const router = Router();

router.get("/tienda_frijolitox/carrito",t.validadorTOKEN, carrito.ver_carrito);
router.get("/tienda_frijolitox/agregar_carrito/:id",t.validadorTOKEN, carrito.agregar_carrito);

router.delete("/tienda_frijolitox/eliminar_carrito/:id", t.validadorTOKEN, carrito.eliminar_producto_carrito)

export default router;