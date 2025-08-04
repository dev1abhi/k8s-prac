const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const followRedirects = require('follow-redirects').https;

const app = express();
const PORT = process.env.PORT || 3000;

const imageDir = '/cache';
const imagePath = path.join(imageDir, 'image.jpg');
const metadataPath = path.join(imageDir, 'timestamp.txt');

function downloadImage(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  followRedirects.get(url, (response) => {
    //console.log(response);
    response.pipe(file);
    file.on('finish', () => {
      file.close(cb);
    });
  });
}

function isExpired() {
  if (!fs.existsSync(metadataPath)) return true;

  const timestamp = parseInt(fs.readFileSync(metadataPath, 'utf8'));
  const age = Date.now() - timestamp;
  return age > 10 * 60 * 1000; // 10 minutes
}

function updateCacheIfNeeded(cb) {
  if (isExpired()) {
    console.log('⏱ Fetching a new image...');
    downloadImage('https://picsum.photos/600', imagePath, () => {
      fs.writeFileSync(metadataPath, Date.now().toString());
      cb();
    });
  } else {
    cb();
  }
}

app.get('/', (req, res) => {
  updateCacheIfNeeded(() => {
    let imageBase64 = '';
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      imageBase64 = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    }

    const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Todo App</title>
    <style>
      body { font-family: sans-serif; text-align: center; margin: 0; padding: 40px; background-color: #f4f4f4; }
      img { max-width: 100%; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      h1, h3 { color: #333; }
      input, button {
        padding: 10px;
        margin-top: 20px;
        font-size: 16px;
        width: 300px;
        border-radius: 5px;
        border: 1px solid #ccc;
      }
      button {
        width: auto;
        cursor: pointer;
        background-color: #007bff;
        color: white;
        border: none;
        margin-left: 10px;
      }
      ul {
        list-style-type: none;
        padding: 0;
        max-width: 400px;
        margin: 20px auto;
        text-align: left;
      }
      li {
        background-color: white;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        box-shadow: 0 0 5px rgba(0,0,0,0.1);
      }
    </style>
  </head>
  <body>
    <h1>The Project App</h1>
    <img src="${imageBase64}" alt="Random Image" />
    <h3>DevOps with Kubernetes 2025</h3>

    <div>
      <input id="todoInput" maxlength="140" placeholder="Enter a todo (max 140 chars)" />
      <button onclick="addTodo()">Add Todo</button>
    </div>

    <ul id="todoList">
      <li>Build Docker image</li>
      <li>Deploy to Kubernetes</li>
      <li>Write better YAML</li>
    </ul>

    <script>
      function addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();
        if (!text) return;
        const li = document.createElement('li');
        li.textContent = text;
        document.getElementById('todoList').appendChild(li);
        input.value = '';
      }
    </script>
  </body>
</html>
`;

    res.send(html);
  });
});

app.listen(PORT, () => {
  console.log(`Todo app running on port ${PORT}`);
});
