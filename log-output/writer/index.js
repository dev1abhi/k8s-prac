const fs = require('fs');
const path = '/shared/log.txt';
const crypto = require('crypto');

const id = crypto.randomUUID();

setInterval(() => {
  const timestamp = new Date().toISOString();
  const line = `${timestamp}: ${id}\n`;
  fs.appendFileSync(path, line);
}, 5000);
