import app from "./app.js";
import { testConnection } from "../backend/database/connectiondb.js";

const PORT = process.env.PORT || 3000;

// Inicialización del servidor
app.listen(PORT, async () => {
  await testConnection();
  console.log(`Conexión a la base de datos exitosa en el puerto ${PORT}`);
});
