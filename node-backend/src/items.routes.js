// src/items.routes.js
const express = require('express');
const router = express.Router();
const pool = require('./db');
const { isNonEmptyString, isPrice } = require('./validation');

// List items
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM items ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('GET /items error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get one item
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });

  try {
    const [rows] = await pool.query('SELECT * FROM items WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /items/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create item
router.post('/', async (req, res) => {
  const { name, description, price } = req.body;
  if (!isNonEmptyString(name, 100)) return res.status(400).json({ error: 'Invalid name' });
  if (description && typeof description !== 'string') return res.status(400).json({ error: 'Invalid description' });
  const numPrice = Number(price);
  if (!isPrice(numPrice)) return res.status(400).json({ error: 'Invalid price' });

  try {
    const [result] = await pool.query(
      'INSERT INTO items (name, description, price) VALUES (?, ?, ?)',
      [name.trim(), description || null, numPrice]
    );
    const [rows] = await pool.query('SELECT * FROM items WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /items error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update item
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });

  const { name, description, price } = req.body;
  if (name && !isNonEmptyString(name, 100)) return res.status(400).json({ error: 'Invalid name' });
  if (description && typeof description !== 'string') return res.status(400).json({ error: 'Invalid description' });
  const numPrice = price !== undefined ? Number(price) : undefined;
  if (numPrice !== undefined && !isPrice(numPrice)) return res.status(400).json({ error: 'Invalid price' });

  try {
    const [existing] = await pool.query('SELECT * FROM items WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Not found' });

    const updated = {
      name: name !== undefined ? name.trim() : existing[0].name,
      description: description !== undefined ? description : existing[0].description,
      price: numPrice !== undefined ? numPrice : existing[0].price
    };

    await pool.query(
      'UPDATE items SET name = ?, description = ?, price = ? WHERE id = ?',
      [updated.name, updated.description, updated.price, id]
    );

    const [rows] = await pool.query('SELECT * FROM items WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error('PUT /items/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });

  try {
    const [result] = await pool.query('DELETE FROM items WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /items/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
