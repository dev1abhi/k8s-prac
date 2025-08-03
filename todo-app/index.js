
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Todo App</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 40px;
            text-align: center;
          }
          h1 {
            color: #333;
          }
        </style>
      </head>
      <body>
        <h1>Welcome to the Todo App</h1>
        <p>This is a simple homepage served by your Express server.</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
