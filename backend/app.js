const express = require('express');
const cors = require('cors');
const archiver = require('archiver');
const path = require('path');

const attractions = require('./data/attractions.json');
const wildlife = require('./data/wildlife.json');
const trails = require('./data/trails.json');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Borneo API is running' });
});

app.get('/attractions', (req, res) => {
  res.json({ data: attractions });
});

app.get('/wildlife', (req, res) => {
  res.json({ data: wildlife });
});

app.get('/trails', (req, res) => {
  res.json({ data: trails });
});

app.get('/offline-pack', (req, res) => {
  res.json({
    data: {
      generatedAt: new Date().toISOString(),
      includes: {
        attractions,
        wildlife,
        trails
      }
    }
  });
});

app.get('/offline-pack/download', (req, res) => {
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=borneo-offline-pack.zip');

  const archive = archiver('zip', {
    zlib: { level: 9 } // max compression
  });

  archive.on('error', (err) => {
    res.status(500).send({ error: err.message });
  });

  archive.pipe(res);

  // Add JSON data
  archive.directory(path.join(__dirname, 'data'), 'data');
  // Add Assets (images, tiles)
  archive.directory(path.join(__dirname, 'assets'), 'assets');

  archive.finalize();
});

module.exports = app;
