
const express = require('express');
const app = express();

const PORT = 3000;
const timestamp = new Date().toISOString();
const randomString = Math.random().toString(36).substring(2, 10);

console.log(`[${timestamp}] Started with ID: ${randomString}`);

app.get('/status', (req, res) => {
  res.json({ timestamp, randomString });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
