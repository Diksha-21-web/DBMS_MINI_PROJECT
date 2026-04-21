const express = require('express');
const router = express.Router();
const db = require('../db');

// Record a payment
// POST /api/payments
router.post('/', async (req, res) => {
  try {
    const { Stud_id, Booking_id, Amount, Pay_date, Pay_method, Status } = req.body;
    const payStatus = Status || 'Pending';
    const [result] = await db.query(
      `INSERT INTO payment (Stud_id, Booking_id, Amount, Pay_date, Pay_method, Status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [Stud_id, Booking_id, Amount, Pay_date, Pay_method, payStatus]
    );
    res.status(201).json({ message: 'Payment recorded successfully', Payment_id: result.insertId });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all payments for a student
// GET /api/payments?stud_id=
router.get('/', async (req, res) => {
  try {
    const { stud_id } = req.query;
    let query = `SELECT * FROM payment`;
    let params = [];
    
    if (stud_id) {
      query += ` WHERE Stud_id = ?`;
      params.push(stud_id);
    }
    
    const [rows] = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single payment detail
// GET /api/payments/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM payment WHERE Payment_id = ?`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Payment not found' });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
