import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "env-var"
import { config } from "dotenv";
import mongoose from "mongoose";
import debug from "debug";
import {User} from "../../infrastructure/models/usuarios.js"

const mensaje = debug("app:auth");
config()

const rigistrarse = (req,res)=>{
    mensaje("pagina de registro")
    
    const error = req.query.error; 
    return res.render("registrar_usuario", {error})
};

const registrar_nuevo_usuario = async(req, res)=>{
    try {
        if (!req.file) {
            const error = "No se subió ninguna imagen o la imagen es demasiado grande.";
            return res.status(200).redirect("/tienda_frijolitox/registro?error=" + encodeURIComponent(error));
        }

        let {username, email, password1, password2, role, nombre_1, nombre_2,apellido_1,apellido_2,rut, descripcion,telefono_1,telefono_2,direccion,fecha_nacimiento} = req.body;
        let imagen = req.file ? req.file.filename : "perfil_defaul.png";

        username = username.trim(); 
        email = email.trim();
        password1 = password1.trim();
        password2 = password2.trim();
        role = role ? role.trim(): "user";
        nombre_1 = nombre_1.trim().toUpperCase();
        nombre_2 = nombre_2 ? nombre_2.trim().toUpperCase() : " ";
        apellido_1 = apellido_1.trim().toUpperCase();
        apellido_2 = apellido_2 ? apellido_2.trim().toUpperCase() : " ";
        rut = rut.trim()
        descripcion = descripcion.trim()
        telefono_1 = parseInt(telefono_1)
        telefono_2 = telefono_2 ? parseInt(telefono_2) : " ";
        direccion = direccion.trim()
        fecha_nacimiento = fecha_nacimiento

        if (password1 == password2){

            const emailExists = await User.findOne({ email });
            const usuarioExists = await User.findOne({ username });

            if (emailExists) {
                mensaje("Registro: El email ya existe...")
                const error = "El correo ya está registrado."
                return res.status(200).redirect("/tienda_frijolitox/registro?error=" + encodeURIComponent(error));
            };

            if (usuarioExists){
                mensaje("Registro: El Nombre de Usuario ya existe...")
                
                const error = "El Nombre de Usuario ya está registrado."
                return res.status(200).redirect("/tienda_frijolitox/registro?error=" + encodeURIComponent(error));
            };
            
            // Validación de nombre de usuario
            if (!username || username.length < 3) {
                mensaje("Registro: El nombre de usuario invalido...")
                
                const error = "Nombre de usuario no válido."
                return res.status(200).redirect("/tienda_frijolitox/registro?error=" + encodeURIComponent(error));
            }

            if (['user', 'admin'].indexOf(role) === -1) {
                mensaje("Registro: EL ROL NO ES VALIDO")
                const error = "Rol NO valido."
                return res.status(200).redirect("/tienda_frijolitox/registro?error=" + encodeURIComponent(error));
            }

            // encripta la contraseña en un a nueva variable  password_encriptada
            const password_encriptada = await bcrypt.hash(password1,10);

            // nuevo usuario en formato json
            const nuevo_usuario = new User({
                username,
                email,
                password: password_encriptada,
                role,
                nombre_1,
                nombre_2,
                apellido_1,
                apellido_2,
                rut,
                descripcion,
                telefono_1,
                telefono_2,
                direccion,
                fecha_nacimiento,
                imagen
            });

            // Se guarda el usuario de manera asincrona en la base de datos
            const guardar_usuario = await nuevo_usuario.save();

            // Generar token únicos y desechables (duracion de 5 horas) para iniciar sesión como usuario válido
            const token = jwt.sign(
                { id: guardar_usuario.id, username: guardar_usuario.username, email: guardar_usuario.email },
                env.get("llave").required().asString(),
                { expiresIn: '5h' }
            );

            // Establecer la cookie con el token
            res.cookie("token", token, {
                httpOnly: true, // La cookie solo es accesible por el servidor
                secure: true,   // Solo se envía la cookie a través de HTTPS
                sameSite: 'Strict' // La cookie no se envía en solicitudes de origen cruzado
            });
            
            mensaje("Registro: Usuario registrado con exito...")
            return res.redirect("/tienda_frijolitox/home", 302);
        }
        else{
            mensaje("Registro: Las contraseñas no coinciden...")
            const error = "Las Contraseñas No Coinciden"
            return res.status(200).redirect("/tienda_frijolitox/login?error=" + encodeURIComponent(error));
        }
    }
    catch(error){
        console.error(`Error registro: ${error}`);
        res.status(500).json({messages:"un problema en la codificacion de Registro de usuarios"});
    }
};



const login = async(req,res) => {
    try{       
        let {email, password1} = req.body;
        
        // Validar que el email y la contraseña no estén vacíos
        if (!email) {
            mensaje("Login: No hay email...");
            const error = "El email y la contraseña son obligatorios" ;
            return res.status(200).redirect("/tienda_frijolitox/login?error=" + encodeURIComponent(error));
        };

        email = email.trim();
        password1 = password1.trim();

        const buscarUsuario = await User.findOne({ email });

        if (!buscarUsuario) {
            mensaje("Login: No se encontro usuario...")
            const error = "El Usuario no fue encontrado";
            return res.status(200).redirect("/tienda_frijolitox/login?error=" + encodeURIComponent(error));
        }

        const verificarContraseña = await bcrypt.compare(password1, buscarUsuario.password);

        if (!verificarContraseña) {
            mensaje("Login: la contraseña no existe...")
            const error = "El Usuario o la Contraseña son incorrectas"
            return res.status(200).redirect("/tienda_frijolitox/login?error=" + encodeURIComponent(error));
        }

        const token = jwt.sign({ id: buscarUsuario._id }, env.get("llave").required().asString(), { expiresIn: '5h' });

        // Establecer la cookie con el token
        res.cookie("token", token, {
            httpOnly: true, // La cookie solo es accesible por el servidor
            secure: true,   // Solo se envía la cookie a través de HTTPS
            sameSite: 'Strict' // La cookie no se envía en solicitudes de origen cruzado
        });

        const usuario = buscarUsuario;
        //mensaje(usuario)
        
        mensaje("Login: sesion iniciada con exito...")
        return res.redirect("/tienda_frijolitox/home", 302,{ usuario });
    }
    catch (error){
        console.error(`Error Login: ${error}`);
        res.status(500).json({messages:"un problema en la codificacion del Login!!!"});
    }

}


const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            expires: new Date(0),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        mensaje("Perfil: Sesion cerrada con exito")
        res.status(200),redirect("/tienda_frijolitox/home");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al cerrar sesión' });
    }
};


const pag_formulario_perfil = async(req,res)=>{
    const id = req.user.id;

    const user = await User.findOne({_id : id})
    
    mensaje(`FORMULARIO PERFIL: formulario para ${id}`)
    
    return res.render("update_perfil", {id, persona : user})
};


const perfil = async (req, res) => {
    try {
        const  id  = req.userId;

        if (!id) {
            mensaje("Perfil: No se encontro un ID")
            return res.status(400).render("error_404");
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            mensaje("Perfil: El ID no cumple con un formato valido")
            return res.status(400).render("error_404");
        }

        //console.log(id)
        const cuerpo = await User.findOne({ _id: id })
        //console.log(cuerpo)

        if (!cuerpo) {
            mensaje(`Perfil: No se encuntro un usuario con el ID: ${id}`)
            return res.status(400).render("error_404");
        }

        /*
        console.log(cuerpo.username)
        console.log(cuerpo.email)
        console.log(cuerpo.password)
        console.log(req.user)
        console.log(req.userId)
        */
        //console.log(req.userId)
        const persona = cuerpo
        //console.log(persona.imagen)
        mensaje("Perfil: entramos al perfil correctamente")
        return res.render("perfil",{ persona})
    }
    catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).render("error_500");
    }
}

const editar_perfil = async(req, res)=>{
    try {
        mensaje("-------------METHODO PUT--------------");
        const { method } = req; 
        //console.log("METODO: " + method)

        const  id  = req.userId;

        if(!id || !mongoose.Types.ObjectId.isValid(id)){
            mensaje("UPDATE PERFIL: no hay ID o el formato del ID no cumple con el formato")
            return res.status(400).render("error_404");
        };

        let {nombre_1, nombre_2,apellido_1,apellido_2,rut, descripcion,telefono_1,telefono_2,direccion,fecha_nacimiento} = req.body;
        let imagen = req.file ? req.file.filename : "perfil_defaul.png";


        //mensaje("Act.Productos: Información del archivo:", req.file);
        //mensaje("Act.Productos: Información del archivo:", req.filename);
        //mensaje("Act.Productos: Nombre de la imagen:", imagen);

        nombre_1 = nombre_1.trim().toUpperCase();
        nombre_2 = nombre_2.trim().toUpperCase();
        apellido_1 = apellido_1.trim().toUpperCase();
        apellido_2 = apellido_2.trim().toUpperCase();
        rut = rut.trim()
        descripcion = descripcion.trim()
        telefono_1 = parseInt(telefono_1)
        telefono_2 = parseInt(telefono_2)
        direccion = direccion.trim()
        fecha_nacimiento = fecha_nacimiento

        const actualizar_productos = await User.findByIdAndUpdate(id, {nombre_1, nombre_2, apellido_1, apellido_2, rut, descripcion, telefono_1, telefono_2, direccion, fecha_nacimiento, imagen}, {new:true} );

        if (!actualizar_productos){
            mensaje("Act.Producto: No se encontro un archivo para actualizar")
            return res.status(400).json({message: "no se encontro un archivo para actualizar"})
        }

        mensaje("Registro: Usuario registrado con exito...")
        return res.redirect("/tienda_frijolitox/perfil", 302,{persona:actualizar_productos});
    }
    catch(error){
        console.error(`Error registro: ${error}`);
        res.status(500).json({messages:"un problema en la codificacion de Registro de usuarios" + error});
    }
};

export default {
    rigistrarse,
    registrar_nuevo_usuario,
    login,
    logout,
    perfil,
    pag_formulario_perfil,
    editar_perfil
};
