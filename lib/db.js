import mysql from "mysql2/promise";

let pool;

if (!globalThis.dbPool) {
  globalThis.dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10, // Stay under your host's limit
    queueLimit: 0,
    // Optional: Set idle timeout at pool level
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000, // 10s
  });
}

pool = globalThis.dbPool;

export async function executeQuery({ query, values = [] }) {
  try {
    const [results] = await pool.execute(query, values);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Database query failed");
  }
}

export async function testConnection() {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch (error) {
    console.error("Database connection test failed:", error);
    return false;
  }
}

export async function initializeDatabase() {
  // try {
  //   // Create users table if it doesn't exist
  //   await executeQuery({
  //     query: `
  //       CREATE TABLE IF NOT EXISTS users (
  //         id VARCHAR(36) PRIMARY KEY,
  //         name VARCHAR(255) NOT NULL,
  //         email VARCHAR(255) UNIQUE NOT NULL,
  //         password VARCHAR(255) NOT NULL,
  //         role ENUM('user', 'admin') DEFAULT 'user',
  //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  //       )
  //     `,
  //   });

  //   // Create sessions table if it doesn't exist
  //   await executeQuery({
  //     query: `
  //       CREATE TABLE IF NOT EXISTS sessions (
  //         id VARCHAR(36) PRIMARY KEY,
  //         user_id VARCHAR(36) NOT NULL,
  //         token TEXT NOT NULL,
  //         expires_at TIMESTAMP NOT NULL,
  //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  //       )
  //     `,
  //   });

  //   console.log("Database initialized successfully");
  //   return true;
  // } catch (error) {
  //   console.error("Database initialization failed:", error);
  //   return false;
  // }
  return false;
}
