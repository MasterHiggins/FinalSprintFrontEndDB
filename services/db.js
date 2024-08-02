const { Pool } = require("pg");
const mongoose = require("mongoose");
require("dotenv").config(); // Ensure dotenv is required to load environment variables

let db = {};

console.log("Attempting to connect to PostgreSQL...");
console.log("PGUSER:", process.env.PGUSER);
console.log("PGHOST:", process.env.PGHOST);
console.log("PGDATABASE:", process.env.PGDATABASE);
console.log("PGPASSWORD:", process.env.PGPASSWORD);
console.log("PGPORT:", process.env.PGPORT);

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
    db.pool = pool; // Assign the pool to the db object
  })
  .catch((err) => {
    console.log("PostgreSQL connection error:", err);
    db.pool = null; // Set db.pool to null if the connection fails
  });

module.exports = db;
