FROM node:19

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Copia solo package.json y package-lock.json primero para aprovechar la cache de Docker
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Luego copia el resto del código
COPY . .

# Exponer el puerto que la aplicación va a usar
EXPOSE 1010

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]
