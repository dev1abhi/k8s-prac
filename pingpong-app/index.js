const express = require('express');
const { Pool } = require('pg');

const app = express();

// Create a Postgres connection pool
const pool = new Pool({
  host: process.env.POSTGRES_HOST ,
  user: process.env.POSTGRES_USER ,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB ,
  port: process.env.POSTGRES_PORT ,
});

// Ensure table exists
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS counters (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE,
      value INT DEFAULT 0
    )
  `);

  // Ensure we have a "pingpong" counter row
  await pool.query(`
    INSERT INTO counters (name, value)
    VALUES ('pingpong', 0)
    ON CONFLICT (name) DO NOTHING
  `);
}

initDb().catch((err) => {
  console.error('Error initializing database:', err);
  process.exit(1);
});

// Route: Increment counter
app.get('/pingpong', async (req, res) => {
  try {
    await pool.query(`
      UPDATE counters SET value = value + 1 WHERE name = 'pingpong'
    `);
    const result = await pool.query(`SELECT value FROM counters WHERE name = 'pingpong'`);
    res.send(`ping-pong count ${result.rows[0].value}`);
  } catch (err) {
    console.error('Error updating counter:', err);
    res.status(500).send('Database error');
  }
});



const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Ping-pong server started on port ${PORT}`);
});
