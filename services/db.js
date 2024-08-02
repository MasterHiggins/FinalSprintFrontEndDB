const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
})
const { Pool } = require('pg');
const mongoose = require('mongoose');

const useMongoDB = process.env.USE_MONGO_DB === 'true';

let db;

if (useMongoDB) {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
  db = mongoose;
} else {
  db = new Pool({
    connectionString: process.env.PG_URI,
  });
}

module.exports = db;
module.exports = pool;
