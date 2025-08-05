const express = require('express');
const fs = require('fs');
const http = require('http');
const app = express();
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3000;
const PINGPONG_URL = 'http://pingpong-svc:1235/pings';


// const logPath = '/shared/log.txt'; //from non-persistent volume
// const countPath = '/data/count.txt'; // from persistent volume (shared between pingpong app and log output)

// app.get('/status', (req, res) => {
//   const logContent = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8') : 'No logs yet.';
//   const count = fs.existsSync(countPath) ? fs.readFileSync(countPath, 'utf8') : 'unknown';

//   res.send(`<pre>${logContent.trim()} \nPing / Pongs: ${count}</pre>`);
// });


app.get('/', (req, res) => {
  http.get(PINGPONG_URL, (pingRes) => {
    let data = '';
    pingRes.on('data', chunk => data += chunk);
    pingRes.on('end', () => {
      const timestamp = new Date().toISOString();
      const uuid = uuidv4();

      // Clean and extract number from pingpong response
      const count = data.match(/\d+/)?.[0] || '0';

      const log = `${timestamp}: ${uuid}. Ping / Pongs: ${count}`;
      console.log(log);
      res.send(log);
    });
  }).on('error', (err) => {
    console.error('Pingpong service error:', err.message);
    res.send('Could not fetch ping count.');
  });
});

app.listen(PORT, () => {
  console.log(`Reader running on port ${PORT}`);
});
