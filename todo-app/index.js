const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Todo app running\n');
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
