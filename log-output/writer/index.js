const fs = require('fs');
const path = '/shared/log.txt';
const crypto = require('crypto');

const id = crypto.randomUUID();

//saving in shared/log.txt
setInterval(() => {
  const timestamp = new Date().toISOString();
  const line = `${timestamp}: ${id}\n`;
  fs.appendFileSync(path, line);
}, 5000);
