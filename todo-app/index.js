const express = require('express');
const fs = require('fs');
const path = require('path');
const followRedirects = require('follow-redirects').https;
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const imageDir = '/cache';
const imagePath = path.join(imageDir, 'image.jpg');
const metadataPath = path.join(imageDir, 'timestamp.txt');
const BACKEND_URL = 'http://todo-backend-svc:1230/api/todos';

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 

// Proxy POST /api/todos
app.get('/todos', async (req, res) => {
  try {
    const response = await fetch(BACKEND_URL);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Proxy GET error:', err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});


app.post('/todos', async (req, res) => {
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Proxy POST error:', err);
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

// Endpoint to serve image as base64
app.get('/image', (req, res) => {
  updateCacheIfNeeded(() => {
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      const imageBase64 = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
      res.json({ image: imageBase64 });
    } else {
      res.status(404).send('Image not found');
    }
  });
});

// (Download logic stays the same)
function downloadImage(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  followRedirects.get(url, (response) => {
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
  return age > 10 * 60 * 1000;
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

app.listen(PORT, () => {
  console.log(`Todo app frontend running on port ${PORT}`);
});
