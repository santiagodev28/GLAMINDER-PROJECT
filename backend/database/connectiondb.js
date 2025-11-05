// database/connectiondb.js
import mysql from 'mysql2';

// Configuración del pool de conexiones
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
  
// Promisificar el pool para usar async/await
const promisePool = pool.promise();

// Función para testear la conexión
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('Conexión a MySQL establecida correctamente');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error al conectar con MySQL:', error.message);
    return false;
  }
};

// Función para ejecutar queries de forma segura
const executeQuery = async (query, params = []) => {
  try {
    const [rows, fields] = await promisePool.execute(query, params);
    return { success: true, data: rows, fields };
  } catch (error) {
    console.error('Error ejecutando query:', error);
    return { success: false, error: error.message };
  }
};

// Función para transacciones
const executeTransaction = async (queries) => {
  const connection = await promisePool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { query, params } of queries) {
      const [rows] = await connection.execute(query, params || []);
      results.push(rows);
    }
    
    await connection.commit();
    connection.release();
    
    return { success: true, results };
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Error en transacción:', error);
    return { success: false, error: error.message };
  }
};

// EXPORTS NOMBRADOS - Para usar import { executeQuery }
export { promisePool as pool, testConnection, executeQuery, executeTransaction };

// EXPORT DEFAULT - Para usar import db from '...'
export default {
  pool: promisePool,
  testConnection,
  executeQuery,
  executeTransaction
};