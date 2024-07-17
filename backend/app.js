const express = require('express');
const app = express();
const port = process.env.PORT || 8000; // Set your preferred port number

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter); // Mount the index router at the root path

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});