// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const itemsRouter = require('./items.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/items', itemsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
