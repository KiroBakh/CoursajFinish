const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "macbook",
  host: "127.0.0.1",
  database: "kurs",
  password: "11122001",
  port: 5432,
});

pool.connect((err, client, done) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); 
  }

  console.log('Connected to Postgres');
});

module.exports = pool;