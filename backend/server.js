import app from "./app.js";
import {testConnection} from "../backend/database/connectiondb.js"

const PORT = process.env.PORT || 3000;

// Inicialización del servidor
app.listen(PORT, async () => {
    await testConnection();
    console.log(`Conexión a la base de datos exitosa en el puerto ${PORT}` );
});

import userRoutes from "./routes/usersRoute.js";
import authRoutes from "./routes/authRoute.js";
import rolRoutes from "./routes/rolRoute.js";
import businessRoutes from "./routes/businessRoute.js";
import serviceRoutes from "./routes/servicesRoute.js";
import ownerRoutes from "./routes/ownersRoutes.js"
import employeeRoutes from "./routes/employeesRoute.js";
import reportRoutes from "./routes/reportsRoute.js";
import storesRoutes from "./routes/storesRoute.js";
import scheduleRoutes from "./routes/schedulesRoutes.js";
import requestRoutes from "./routes/requestRoute.js";




// Rutas
app.use("/api/usuarios", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", rolRoutes);
app.use("/api/negocios", businessRoutes);
app.use("/api/servicios", serviceRoutes);
app.use("/api/empleados", employeeRoutes);
app.use("/api/propietarios", ownerRoutes);
app.use("/api/reportes", reportRoutes);
app.use("/api/tiendas", storesRoutes);
app.use("/api/citas", scheduleRoutes);
app.use("/api/solicitudes", requestRoutes)

