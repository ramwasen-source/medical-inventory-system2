const sql = require('mssql');

const config = {
  user: 'sa',
  password: process.env.DB_PASSWORD,
  server: 'Localhost',
  port: 1433,
  database: 'Inventory',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log('Connected to SQL Server');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

module.exports = {
  sql,
  connectDB
};