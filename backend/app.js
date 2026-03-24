const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Borneo Rainforest API' });
});

app.use('/', routes);

app.use((error, req, res, next) => {
  res.status(500).json({
    error: 'Internal server error',
    details: error.message,
  });
});

module.exports = app;
