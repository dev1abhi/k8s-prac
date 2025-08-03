
const express = require('express');
const app = express();

let counter = 0;

app.get('/pingpong', (req, res) => {
  res.send(`ping-pong count ${counter++}`);
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});