const express = require('express');
const cors = require('cors');

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

module.exports = app;
