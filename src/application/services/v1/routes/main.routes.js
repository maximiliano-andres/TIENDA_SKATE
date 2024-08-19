import { Router } from "express"
import principal from "../../../controllers/main.controllers.js"
import t from "../../../../infrastructure/middlewares/validador.token.js"

const routes = Router();

routes.get("/tienda_frijolitox/home", t.validadorTOKEN, principal.pag_home);
routes.get("/tienda_frijolitox/detalle", t.validadorTOKEN, principal.pag_detalle);
routes.get("/tienda_frijolitox/otros", t.validadorTOKEN, principal.pag_otro);

routes.get("/tienda_frijolitox/login",t.validadorTOKEN, principal.pag_login);

routes.get("/tienda_frijolitox/eliminar/:id", t.validadorTOKEN, principal.pregunta_eliminar)


export default routes;