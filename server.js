// server.js
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/apikey', (req, res) => {
  res.json({ apiKey: process.env.API_KEY });
});

app.listen(3000, () => {
  console.log('✅ Server is running on http://localhost:3000');
});
