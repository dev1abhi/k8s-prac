const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
//getting from configMap
const PORT = process.env.PORT;
const DATA_FILE = process.env.DATA_FILE; 

app.use(cors());
app.use(express.json());

let todos = [];

// Load todos from file if exists
if (fs.existsSync(DATA_FILE)) {
  todos = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

// Save todos to file
function saveTodos() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

// GET /todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// POST /todos
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const newTodo = {
    id: uuidv4(),
    text,
    done: false,
    createdAt: new Date().toISOString()
  };

  todos.push(newTodo);
  saveTodos();
  res.status(201).json(newTodo);
});

// health check
app.get('/api/health', (req, res) => {
  res.send('OK');
});

app.listen(PORT, () => {
  console.log(`Todo backend running on port ${PORT}`);
});
