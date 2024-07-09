const express = require('express');
const fs = require('fs');
const path = require('path');
const exifr = require('exifr');

const app = express();
const port = 3001;

const imageRoot = path.join('D:', 'NIKON_ZF');

app.get('/api/folders', (req, res) => {
  fs.readdir(imageRoot, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read folders' });
    }
    const folders = files.filter(file => fs.statSync(path.join(imageRoot, file)).isDirectory());
    console.log(folders);
    res.json(folders);
  });
});

app.get('/api/images/:folder', (req, res) => {
  const folder = req.params.folder;
  const folderPath = path.join(imageRoot, folder);
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read images' });
    }
    const images = files.filter(file => /\.jpg$/i.test(file)).sort();
    res.json(images);
  });
});

app.get('/api/metadata/:folder/:image', async (req, res) => {
  const { folder, image } = req.params;
  const imagePath = path.join(imageRoot, folder, image);
  try {
    const metadata = await exifr.parse(imagePath);
    res.json(metadata);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read metadata' });
  }
});

app.get('/api/image/:folder/:image', (req, res) => {
  const { folder, image } = req.params;
  const imagePath = path.join(imageRoot, folder, image);
  res.sendFile(imagePath);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
