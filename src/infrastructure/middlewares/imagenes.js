import multer from 'multer';
import path from 'path';  // Agrega esta línea
import { fileURLToPath } from 'url';
import fs from 'fs';
import { User } from "../models/usuarios.js";


const __dirname = fileURLToPath(new URL(".",import.meta.url))


// Función para manejar el filtrado de archivos
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido'), false);
    }
};

// Función para eliminar archivos antiguos
const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error(`Error al eliminar el archivo: ${filePath}`, err);
        } else if (!err) {
            console.log(`Archivo eliminado: ${filePath}`);
        }
    });
};

// Configuración de Multer
const img_productos = multer.diskStorage({
    destination: (req, file, cb) => {
        // Configura la carpeta donde se guardarán los archivos
        cb(null, path.join(__dirname,'../../../public/assets/images/productos/'));
    },
    filename: (req, file, cb) => {
        // Configura el nombre del archivo
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        
    }
});

// Configuración de Multer para imágenes de perfil
const img_perfil = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../../public/assets/images/perfil/'));
    },
    filename: async (req, file, cb) => {
        const newFileName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        
        // Obtener la imagen anterior del usuario
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (user && user.imagen) {
            const filePath = path.join(__dirname, '../../../public/assets/images/perfil/', user.imagen);
            deleteFile(filePath);  // Eliminar la imagen anterior
        }

        // Guardar el nuevo archivo
        cb(null, newFileName);
    }
});


// Middleware para almacenar el nombre del archivo anterior
const anterior_FileName = (req, res, next) => {
    console.log('req.body:', req.body);  
    req.imagen = req.body.imagen || null; // Asegura que no sea undefined
    next();
};
// esto tiene que ser escrito de esta manera para que funcione
const imagenes_produtos = multer({ 
    storage: img_productos,
    limits: { fileSize: 1 * 1024 * 1024 }, // Limita el tamaño del archivo a 1 MB
    fileFilter: fileFilter 
});


const imagenes_perfil = multer({ 
    storage: img_perfil,
    limits: { fileSize: 1 * 1024 * 1024 }, // Limita el tamaño del archivo a 1 MB
    fileFilter: fileFilter
});

export default {
    imagenes_produtos,
    imagenes_perfil,
    anterior_FileName
};
