const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'yourpassword',
      multipleStatements: true // Required to run multiple queries in one file
    });

    console.log('Connected to MySQL server.');

    const sqlPath = path.join(__dirname, 'add_40_students.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing add_40_students.sql...');
    await connection.query(sqlScript);

    console.log('Database initialized successfully!');
    await connection.end();
  } catch (error) {
    console.error('Error running SQL script:', error);
  }
}

run();
