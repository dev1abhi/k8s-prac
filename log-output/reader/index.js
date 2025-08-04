const express = require('express');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;
const path = '/shared/log.txt';

app.get('/status', (req, res) => {
  if (fs.existsSync(path)) {
    const content = fs.readFileSync(path, 'utf8');
    res.send(`<pre>${content}</pre>`);
  } else {
    res.send('Log file not found');
  }
});

app.listen(PORT, () => {
  console.log(`Reader running on port ${PORT}`);
});
