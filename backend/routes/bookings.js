const express = require('express');
const router = express.Router();
const db = require('../db');

// Create new booking
// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const { Stud_id, MealOption_id, Booking_date, Booking_time, Confirmation } = req.body;
    const confStatus = Confirmation || 'Pending';
    const [result] = await db.query(
      `INSERT INTO meal_booking (Stud_id, MealOption_id, Booking_date, Booking_time, Confirmation)
       VALUES (?, ?, ?, ?, ?)`,
      [Stud_id, MealOption_id, Booking_date, Booking_time, confStatus]
    );
    res.status(201).json({ message: 'Booking created successfully', Booking_id: result.insertId });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get bookings by date or student
// GET /api/bookings?date=&stud_id=
router.get('/', async (req, res) => {
  try {
    const { date, stud_id } = req.query;
    let query = `SELECT * FROM meal_booking WHERE 1=1`;
    let params = [];
    
    if (date) {
      query += ` AND Booking_date = ?`;
      params.push(date);
    }
    if (stud_id) {
      query += ` AND Stud_id = ?`;
      params.push(stud_id);
    }
    
    const [rows] = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update confirmation status
// PUT /api/bookings/:id
router.put('/:id', async (req, res) => {
  try {
    const { Confirmation } = req.body;
    const [result] = await db.query(
      `UPDATE meal_booking SET Confirmation = ? WHERE Booking_id = ?`,
      [Confirmation, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Booking not found' });
    res.status(200).json({ message: 'Booking confirmation updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
