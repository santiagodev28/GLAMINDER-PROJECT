# 🧰 Entorno de Desarrollo del Proyecto

Este documento describe el entorno de desarrollo utilizado en este proyecto, incluyendo herramientas y tecnologías instaladas tanto para el frontend como el backend.

---

## 📦 Tecnologías Utilizadas

| Herramienta     | Versión     | Descripción                                           |
|------------------|-------------|-------------------------------------------------------|
| Node.js          | v18.x.x     | Entorno de ejecución para JavaScript en el backend.  |
| npm              | v10.x.x     | Gestor de paquetes de Node.js.                       |
| Git              | 2.x.x       | Sistema de control de versiones.                     |
| Express.js       | 4.x.x       | Framework web para Node.js (backend).                |
| React            | 18.x.x      | Librería para construir interfaces de usuario.       |
| Vite             | 5.x.x       | Herramienta de desarrollo rápido para frontend.      |



---

# 🛠️ Backend del Proyecto – Glaminder

Este es el backend de **Glaminder**, una aplicación desarrollada con **Node.js**, **Express**, **MySQL**, y otras tecnologías modernas. Este servidor expone una API REST que interactúa con la base de datos y gestiona funcionalidades como autenticación, encriptación de contraseñas, manejo de sesiones y control de acceso con tokens JWT.

---

## 🚀 Tecnologías principales

- [Node.js](https://nodejs.org/)
- [Express 5](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [JWT (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [CORS](https://expressjs.com/en/resources/middleware/cors.html)
- [Nodemon (dev)](https://nodemon.io/)

---

## 📦 Instalación del proyecto

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18+ recomendado)
- [MySQL Server](https://www.mysql.com/)
- [Git](https://git-scm.com/)


### Instalar dependencias

```bash
npm install
```

---

## 🧪 Scripts disponibles

| Script        | Comando               | Descripción                                           |
|---------------|------------------------|-------------------------------------------------------|
| Desarrollo    | `npm run dev`          | Inicia el servidor con `nodemon` (hot reload).        |

---

## ⚙️ Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=glaminder_db
JWT_SECRET=una_clave_secreta_segura
```


---

## 🧱 Estructura básica del proyecto

```
/glaminder_1/
│
├── controllers/         # Lógica de controladores
├── models/              # Modelos de base de datos
├── routes/              # Definición de rutas y endpoints
├── middleware/          # Middleware (auth, errores, etc.)
├── config/              # Configuración de DB, etc.
├── server.js            # Archivo principal del servidor
├── .env                 # Variables de entorno (no subir)
├── package.json
└── README.md
```

---

## 🔐 Seguridad

- Las contraseñas se encriptan con `bcrypt` antes de guardarse en la base de datos.
- Se utilizan **JSON Web Tokens (JWT)** para la autenticación y autorización de usuarios.
- Se habilita CORS para permitir conexiones desde el frontend.

---

## 🔍 Notas adicionales

- Este backend está preparado para trabajar con una base de datos relacional MySQL.
- El servidor está modularizado en controladores, rutas y modelos.
- Se recomienda el uso de herramientas como **Postman** para probar la API.

---


# 💻 Frontend del Proyecto

Este es el frontend de una aplicación desarrollada con **React 19**, **Vite**, **Tailwind CSS** y **shadcn/ui**. Utiliza un conjunto moderno de herramientas y librerías para construir interfaces rápidas, accesibles y mantenibles.

---

## 🚀 Tecnologías principales

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.dev/)
- [React Router DOM](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [Lucide React](https://lucide.dev/)
- [Recharts](https://recharts.org/en-US)

---

## 📦 Instalación del proyecto

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18+ recomendado)
- [npm](https://www.npmjs.com/) (v9+ recomendado)

### Clonar el repositorio

```bash
git clone https://github.com/santiagodev28/glaminder
cd frontend
```

### Instalar dependencias

```bash
npm install
```

---

## 🛠️ Scripts disponibles

| Script        | Comando            | Descripción                                   |
|---------------|---------------------|-----------------------------------------------|
| Desarrollo    | `npm run dev`       | Inicia el servidor de desarrollo con Vite.    |
| Build         | `npm run build`     | Crea una versión optimizada para producción.  |
| Preview       | `npm run preview`   | Previsualiza el build de producción.          |
| Linting       | `npm run lint`      | Ejecuta ESLint en todo el proyecto.           |

---

## 🎨 Estilos y utilidades

- **Tailwind CSS** está integrado con PostCSS y `autoprefixer`.
- Se utiliza `tw-animate-css` para animaciones personalizadas.
- Utiliza `tailwind-merge` para combinar clases y evitar conflictos.
- `class-variance-authority` y `clsx` para gestión avanzada de clases.
- `shadcn-ui` para componentes accesibles y personalizables.

---

## 📁 Estructura sugerida del proyecto

```
/frontend/
│
├── public/              # Archivos estáticos
├── src/
│   ├── assets/          # Imágenes, fuentes, etc.
│   ├── components/      # Componentes reutilizables
│   ├── pages/           # Páginas principales
│   ├── routes/          # Configuración de rutas
│   ├── services/        # Lógica de comunicación (axios, APIs)
│   ├── utils/           # Funciones reutilizables
│   ├── App.jsx
│   └── main.jsx
│
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## 🧪 Linter

Este proyecto usa **ESLint 9** con plugins para React y React Hooks. Para ejecutar el análisis de código:

```bash
npm run lint
```

---

## 🔍 Notas adicionales

- Se recomienda trabajar con ramas `feature/` para cada funcionalidad.
- Usar `prettier` (opcional) para mantener el estilo de código consistente.
- Puedes personalizar `tailwind.config.js` para modificar el diseño según las necesidades del proyecto.

---

## 🧑‍💻 Equipo

**Santiago Hurtado**
**Ana Sanchez**
[Repositorio del proyecto](https://github.com/santiagodev28/glaminder)

--



