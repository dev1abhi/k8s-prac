const express = require('express');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;
const logPath = '/shared/log.txt'; //from non-persistent volume
const countPath = '/data/count.txt'; // from persistent volume

app.get('/status', (req, res) => {
  const logContent = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8') : 'No logs yet.';
  const count = fs.existsSync(countPath) ? fs.readFileSync(countPath, 'utf8') : 'unknown';

  res.send(`<pre>${logContent.trim()} \nPing / Pongs: ${count}</pre>`);
});

app.listen(PORT, () => {
  console.log(`Reader running on port ${PORT}`);
});
