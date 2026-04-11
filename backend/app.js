const express = require('express');
const cors = require('cors');
const archiver = require('archiver');
const path = require('path');
const winston = require('winston');
const expressWinston = require('express-winston');
const promMid = require('express-prometheus-middleware');

const attractions = require('./data/attractions.json');
const wildlife = require('./data/wildlife.json');
const trails = require('./data/trails.json');

const app = express();
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://borneo-app.com' : 'http://localhost:5173',
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Prometheus middleware for metrics
app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5, 2, 5],
  requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
  responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
}));

// Basic query sanitization middleware
app.use((req, res, next) => {
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].replace(/[^\w\s-]/gi, '');
      }
    }
  }
  next();
});

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
  ignoreRoute: function () { return false; }
}));

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

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
}));

module.exports = app;
