const mysql = require('mysql2/promise');

async function run() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'admin'
    });
    await connection.query('CREATE DATABASE IF NOT EXISTS dynamic_dashboard');
    console.log('Database created or already exists');
    process.exit(0);
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  }
}

run();
