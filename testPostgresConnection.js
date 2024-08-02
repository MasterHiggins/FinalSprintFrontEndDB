const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

pool
  .connect()
  .then(() => {
    console.log("PostgreSQL connected...");
    return pool.query("SELECT NOW()");
  })
  .then((res) => {
    console.log("Query result:", res.rows);
    pool.end();
  })
  .catch((err) => {
    console.log("PostgreSQL connection error:", err);
    pool.end();
  });
