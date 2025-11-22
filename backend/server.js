import 'dotenv/config';
import app from "./app.js";
import { testConnection } from "./database/connectiondb.js";

const PORT = process.env.PORT

// Inicialización del servidor
const startServer = async () => {
  console.log("⏳ Probando conexión a la base de datos...");

  const ok = await testConnection();

  if (!ok) {
    console.error("❌No se pudo iniciar el backend porque MySQL no está disponible.");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Servidor backend iniciado en el puerto ${PORT}`);
  });
};

startServer();