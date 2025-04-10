const express = require('express');
const modelsRouter = require('./routes/models');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Use the models router for the /api/models endpoint
app.use('/api/models', modelsRouter);

module.exports = app;