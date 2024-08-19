import express, { application } from "express";
import { config } from "dotenv";
import env from "env-var";
import debug from "debug";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import {fileURLToPath} from "url";
import path from "path";
import methodOverride from 'method-override';

import auth_routes from "./application/services/v1/routes/auth.routes.js";
import prod_routes from "./application/services/v1/routes/productos.routes.js";
import pag_principal from "./application/services/v1/routes/main.routes.js"
import carrito_routes from "./application/services/v1/routes/carrito.routes.js"
import mj_error from "./infrastructure/middlewares/manejo_errores.js";

import db from "./infrastructure/config/db.js"

// mensaje debug general
const DEBUG = debug('app:index');

const __dirname = fileURLToPath(new URL(".",import.meta.url))
//console.log("link = " + __dirname)

//conexion
config()
const app = express()
const puerto = env.get("conexion").required().asIntPositive()

// base de datos
db()


//middleware
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride((req, res) => {
    DEBUG('Original Method:', req.method);
    const method = req.body._method;
    DEBUG('Overriden Method:', method);
    return method;
}));

app.set("views", path.join(__dirname, "views"));
//console.log("link views: " + path.join(__dirname, "views")) 
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,"../public")));
//console.log(path.join(__dirname,"../public"))
app.use(express.json());

// --------------rutas--------------------
// pagina principal
app.get("/tienda_frijolitox/home", pag_principal);
app.get("/tienda_frijolitox/detalle", pag_principal);
app.get("/tienda_frijolitox/otros", pag_principal);


//registro
app.get("/tienda_frijolitox/registro",auth_routes);
app.post("/tienda_frijolitox/registro",auth_routes);

//login
app.get("/tienda_frijolitox/login", pag_principal);
app.post("/tienda_frijolitox/login", auth_routes);

//Logout
app.get("/tienda_frijolitox/cerrar_sesion",auth_routes);


// Perfil

app.get("/tienda_frijolitox/perfil/", auth_routes);

// editar perfil
app.get("/tienda_frijolitox/editar_perfil/:id", auth_routes)
app.post("/tienda_frijolitox/editar_perfil/:id", auth_routes)

//app.get("/tienda_frijolitox/perfil/:id", auth_routes);

// Prductos
app.get("/tienda_frijolitox/productos", prod_routes)

app.get("/tienda_frijolitox/productos/:categoria", prod_routes)

app.get("/tienda_frijolitox/producto/:id", prod_routes)

app.delete("/tienda_frijolitox/producto_eliminar/:id", prod_routes)


app.get("/tienda_frijolitox/eliminar/:id", pag_principal)


//Carrito
app.get("/tienda_frijolitox/carrito", carrito_routes)
app.get("/tienda_frijolitox/agregar_carrito/:id", carrito_routes)

app.delete("/tienda_frijolitox/eliminar_carrito/:id", carrito_routes)



app.get('/tienda_frijolitox/nuevo_producto', prod_routes)
app.post('/tienda_frijolitox/nuevo_producto', prod_routes)
app.get("/productos/update_producto/:id", prod_routes)
app.post("/productos/update_producto/:id", prod_routes)
app.delete("/productos/eliminar_producto/:id",prod_routes)


app.get("/buscar_producto_tienda", prod_routes)


//manejo de errores
app.use(mj_error.error_404)
app.use(mj_error.error_500)

app.listen(puerto, () => {DEBUG(`Aplicación funcionando en el puerto: ${puerto}`)})
