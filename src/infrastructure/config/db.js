import mongoose from 'mongoose';
import { config } from 'dotenv';
import env from 'env-var';
import debug from 'debug';

const mensaje = debug("app: db") 

config();

const connectDB = async () => {
    try {
        const mongoURL = env.get('mongo_uri').required().asString();

        // Validación del formato de la URI
        if (!/^mongodb(?:\+srv)?:\/\/\S+$/.test(mongoURL)) {
            throw new Error('Formato de URL de MongoDB no válido');
        }
        

        // Conexión a la base de datos
        await mongoose.connect(mongoURL);
        mensaje('<-----| Conexión a la base de datos establecida con éxito |----->');

        // Eventos de conexión de Mongoose
        mongoose.connection.on('connected', () => {
            console.log(' Mongoose conectado a la base de datos ');
        });

        mongoose.connection.on('error', (err) => {
            console.log.error(` Error de conexión de Mongoose: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.log.warn(' Mongoose desconectado de la base de datos ');
        });

        // Manejar el cierre de la aplicación
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log(' Conexión de Mongoose cerrada por terminación de la aplicación ');
            process.exit(0);
        });

    } catch (error) {
        console.error(`Error de conexión a la base de datos: ${error.message}`);
        process.exit(1); // Salir del proceso con un error
    }
};

export default connectDB;
