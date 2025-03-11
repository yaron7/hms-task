import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'userdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Initializes the database and ensures the required tables exist.
 */
const setupDatabase = async () => {
  let connection;
  try {
    connection = await pool.getConnection();

    // Check if database exists
    const [databases] = await connection.query(`SHOW DATABASES LIKE 'userdb'`);
    if (databases.length === 0) {
      await connection.query(`CREATE DATABASE userdb`);
      console.log('✅ Database "userdb" created.');
    } else {
      console.log('ℹ️ Database "userdb" already exists.');
    }

    // Switch to the database
    await connection.query(`USE userdb`);

    // Check if table exists
    const [tables] = await connection.query(`SHOW TABLES LIKE 'users'`);
    if (tables.length === 0) {
      await connection.query(`
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          firstname VARCHAR(255) NOT NULL,
          lastname VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
        )
      `);
      console.log('✅ Table "users" created.');
    } else {
      console.log('ℹ️ Table "users" already exists.');
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    if (connection) connection.release();
  }
};

// Export Pool and Setup Function
export { pool, setupDatabase };
