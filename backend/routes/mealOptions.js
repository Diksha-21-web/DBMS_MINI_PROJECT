const express = require('express');
const router = express.Router();
const db = require('../db');

// Create meal option
router.post('/', async (req, res) => {
  try {
    const { Meal_Type, Price, Availability_Status } = req.body;
    const status = Availability_Status || 'Available';
    const [result] = await db.query(
      `INSERT INTO meal_option (Meal_Type, Price, Availability_Status) VALUES (?, ?, ?)`,
      [Meal_Type, Price, status]
    );
    res.status(201).json({ message: 'Meal option created successfully', MealOption_id: result.insertId });
  } catch (error) {
    console.error('Error creating meal option:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Read all meal options
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM meal_option`);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching meal options:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Read single meal option
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM meal_option WHERE MealOption_id = ?`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Meal option not found' });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching meal option:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update meal option
router.put('/:id', async (req, res) => {
  try {
    const { Meal_Type, Price, Availability_Status } = req.body;
    const [result] = await db.query(
      `UPDATE meal_option SET Meal_Type=?, Price=?, Availability_Status=? WHERE MealOption_id = ?`,
      [Meal_Type, Price, Availability_Status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Meal option not found' });
    res.status(200).json({ message: 'Meal option updated successfully' });
  } catch (error) {
    console.error('Error updating meal option:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete meal option
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(`DELETE FROM meal_option WHERE MealOption_id = ?`, [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Meal option not found' });
    res.status(200).json({ message: 'Meal option deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal option:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
