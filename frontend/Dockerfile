# ==============================
#   Etapa de build (Vite)
# ==============================
FROM node:18 AS build

# Recibir la variable para reemplazarla en el build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ==============================
#   Etapa de producción (Nginx)
# ==============================
FROM nginx:alpine

# Copiamos los archivos estáticos generados por Vite
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

