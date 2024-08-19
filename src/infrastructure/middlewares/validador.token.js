import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import env from "env-var";
import debug from 'debug';

const mensaje = debug("app: ValidadorTOKEN: ")

config();

// TOKEN QUE VERIFICA QUE EL USUARIO TENGA UN TOKEN VALIDO
const validadorTOKEN = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        //mensaje(token)

        if (!token) {
            res.locals.user = null;
            mensaje("NO HAY UN TOKEN VALIDO")
            return next();
        }

        const secretKey = env.get("llave").required().asString();
        //console.log(secretKey)

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.locals.user = null;
                res.cookie("token", "", {
                    expires: new Date(0),
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                });
                return res.redirect('/tienda_frijolitox/login');
                
            }

            req.userId = decoded.id;
            req.user = decoded;
            res.locals.user = decoded;
            
            next();
        });
    } catch (error) {
        mensaje.error(`Error en el middleware de autorización: ${error}`);
        return res.redirect('/login?error=Sesion%20cerrada%20por%20seguridad');
    }
};






export default {
    validadorTOKEN
}