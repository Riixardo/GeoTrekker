const express = require('express');
const app = express();
const dbRoutes = require('./routes/dbRoutes');

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use('/', dbRoutes); // mounted at /

module.exports = app;