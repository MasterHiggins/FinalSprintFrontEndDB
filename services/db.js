const { Pool } = require("pg");
const mongoose = require("mongoose");
require("dotenv").config();

const useMongoDB = process.env.USE_MONGO_DB === "true";

let db = {};

if (useMongoDB) {
  console.log("Attempting to connect to MongoDB...");
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB connected...");
      db.mongoose = mongoose;
    })
    .catch((err) => console.log("MongoDB connection error:", err));
}

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
    db.pool = pool;
  })
  .catch((err) => {
    console.log("PostgreSQL connection error:", err);
    db.pool = null;
  });

module.exports = db;
