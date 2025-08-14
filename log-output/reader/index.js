const express = require('express');
const fs = require('fs');
const http = require('http');
const app = express();
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3000;
const PINGPONG_URL = 'http://pingpong-svc:1235/pings';
const MESSAGE = process.env.MESSAGE || 'No message set';
const INFO_FILE_PATH = '/etc/config/information.txt'; 


// const logPath = '/shared/log.txt'; //from non-persistent volume (between log reader and log writer)
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

      // Extract number from pingpong response
      const count = data.match(/\d+/)?.[0] || '0';

      // Read file content from ConfigMap
      let fileContent = '';
      try {
        fileContent = fs.readFileSync(INFO_FILE_PATH, 'utf-8').trim();
      } catch (err) {
        console.error('Error reading file from ConfigMap:', err.message);
        fileContent = '(file not found)';
      }

      const log = `${fileContent}\n${MESSAGE}\n${timestamp}: ${uuid}.\nPing / Pongs: ${count}`;
      //console.log(log.split("\n"));
      res.send(`<pre>${log}</pre>`);
    });
  }).on('error', (err) => {
    console.error('Pingpong service error:', err.message);
    res.send('Could not fetch ping count.');
  });
});

app.listen(PORT, () => {
  console.log(`Reader running on port ${PORT}`);
});
