const sql = require("mssql");

const config = {
  user: "YOUR_SQL_USERNAME",
  password: "YOUR_SQL_PASSWORD",
  server: "localhost", // or your SQL Server instance/server name
  database: "YOUR_DATABASE_NAME",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to SQL Server");
    return pool;
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise,
};