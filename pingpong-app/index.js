const express = require('express');
// const fs = require('fs');
// const path = require('path');
const app = express();

// const filePath = '/shared/count.txt';
let counter = 0;

// Initialize counter from file (if exists)
// if (fs.existsSync(filePath)) {
//   const value = parseInt(fs.readFileSync(filePath, 'utf8'));
//   if (!isNaN(value)) {
//     counter = value;
//   }
// }

app.get('/pingpong', (req, res) => {
  counter++;
  // fs.writeFileSync(filePath, counter.toString());
  res.send(`ping-pong count ${counter}`);
});

app.get('/pings', (req, res) => {
  res.send(`pong count: ${counter}`);
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Ping-pong server started on port ${PORT}`);
});
