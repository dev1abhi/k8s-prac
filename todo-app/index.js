const express = require('express');
const fs = require('fs');
const path = require('path');
const followRedirects = require('follow-redirects').https;
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();

// From ConfigMap
const PORT = process.env.PORT;
const BACKEND_URL = process.env.BACKEND_URL; 
const IMAGE_SOURCE_URL = process.env.IMAGE_SOURCE_URL;

const imageDir = process.env.CACHE_DIR || '/cache';
const imagePath = path.join(imageDir, 'image.jpg');
const metadataPath = path.join(imageDir, 'timestamp.txt');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Proxy GET /todos used in script.js
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

// Proxy POST /todos used in script.js
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

// Serve image 
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

// Download image 
function downloadImage(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  followRedirects.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(cb);
    });
  });
}

// Cache logic 
function isExpired() {
  if (!fs.existsSync(metadataPath)) return true;
  const timestamp = parseInt(fs.readFileSync(metadataPath, 'utf8'));
  const age = Date.now() - timestamp;
  return age > 10 * 60 * 1000;
}

function updateCacheIfNeeded(cb) {
  if (isExpired()) {
    console.log('⏱ Fetching a new image...');
    downloadImage(IMAGE_SOURCE_URL, imagePath, () => {
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
