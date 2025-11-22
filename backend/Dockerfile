FROM node:18

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo los package.json para aprovechar caché
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos todo el backend
COPY . .

# El backend corre en el puerto 3000
EXPOSE 3000

# Comando de arranque
CMD ["npm", "start"]
