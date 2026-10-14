const { Pool, types } = require("pg");

types.setTypeParser(1082, (value) => value);  
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "civicconnect",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
});

module.exports = pool;
