const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,
});

app.use(cors());
app.use(express.json());

// request logging
app.use(morgan('combined'));

// Ensure table exists
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id UUID PRIMARY KEY,
      text TEXT NOT NULL,
      done BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
})();

// GET /todos
app.get('/api/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /todos
app.post('/api/todos', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    console.warn("Rejected todo: empty text");
    return res.status(400).json({ error: 'Text is required' });
  }

  if (text.length > 140) {
    console.warn(`Rejected todo: exceeds 140 chars (${text.length})`);
    return res.status(400).json({ error: 'Todo text exceeds 140 characters' });
  }

  const id = uuidv4();
  try {
    const result = await pool.query(
      'INSERT INTO todos (id, text, done) VALUES ($1, $2, $3) RETURNING *',
      [id, text, false]
    );
    console.info(`Todo created: ${text}`);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Database error", err);
    res.status(500).json({ error: 'Database error' });
  }
});

// health check
app.get('/api/health', (req, res) => {
  res.send('OK');
});

app.listen(PORT, () => {
  console.log(`Todo backend running on port ${PORT}`);
});
