import usuario from "../../../controllers/auth.controllers.js";
import v from "../../../../infrastructure/middlewares/validador.usuarios.js"
import t from "../../../../infrastructure/middlewares/validador.token.js"
import i from "../../../../infrastructure/middlewares/imagenes.js"
import { Router } from "express";

const router = Router()

// registro
router.get("/tienda_frijolitox/registro", t.validadorTOKEN, usuario.rigistrarse);
router.post("/tienda_frijolitox/registro",t.validadorTOKEN,i.anterior_FileName, i.imagenes_perfil.single('imagen'),v.validar_registro_usuario, usuario.registrar_nuevo_usuario);
//editar registro
router.get("/tienda_frijolitox/editar_perfil/:id", t.validadorTOKEN, usuario.pag_formulario_perfil) //terminar esto 
// Login
router.post("/tienda_frijolitox/login", v.validar_inicio_login, usuario.login);

//logout
router.get("/tienda_frijolitox/cerrar_sesion", usuario.logout);
// Perfil
router.get("/tienda_frijolitox/perfil/", t.validadorTOKEN, usuario.perfil);

// editar perfil
router.post("/tienda_frijolitox/editar_perfil/:id", t.validadorTOKEN,i.anterior_FileName, i.imagenes_perfil.single('imagen'), v.validar_perfil_update, usuario.editar_perfil)

//router.get("/tienda_frijolitox/perfil/:id", t.validadorTOKEN, usuario.perfil)


export default router;