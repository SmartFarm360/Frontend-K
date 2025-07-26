const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

const pool = new Pool({
  user: process.env.PG_USER || "postgres",
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DATABASE || "SmartDatabase",
  password: process.env.PG_PASSWORD || "KrishiPSQL@23",
  port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : 5432
});

pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err.message);
    process.exit(1);
  });

module.exports = pool;
