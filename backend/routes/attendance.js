const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/attendance/mark - Mark attendance
router.post('/mark', async (req, res) => {
  const records = req.body; // Expecting an array of records or a single record
  const recordsToProcess = Array.isArray(records) ? records : [records];

  if (recordsToProcess.length === 0) {
    return res.status(400).json({ error: 'No attendance records provided' });
  }

  // Validate all records first
  for (const record of recordsToProcess) {
    const { student_id, date, meal_type, status } = record;
    if (!student_id || !date || !meal_type || !status) {
      return res.status(400).json({ error: 'student_id, date, meal_type, and status are required for all records' });
    }
    if (!['Breakfast', 'Lunch', 'Dinner'].includes(meal_type)) {
      return res.status(400).json({ error: `Invalid meal_type: ${meal_type}` });
    }
    if (!['Present', 'Absent'].includes(status)) {
      return res.status(400).json({ error: `Invalid status: ${status}` });
    }
  }

  try {
    // Start a transaction (optional, but good for bulk inserts)
    // For simplicity with mysql2 promise pool without explicit connection checkouts, 
    // we'll just execute them one by one or use a bulk insert if supported.
    // Given the UPSERT requirement (ON DUPLICATE KEY UPDATE), we can do multiple queries.
    
    for (const record of recordsToProcess) {
      const { student_id, date, meal_type, status } = record;
      
      await db.query(
        `INSERT INTO attendance (student_id, date, meal_type, status) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE status = VALUES(status), marked_at = CURRENT_TIMESTAMP`,
        [student_id, date, meal_type, status]
      );
    }

    res.json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// GET /api/attendance - Get attendance for a specific date and meal_type
router.get('/', async (req, res) => {
  const { date, meal_type } = req.query;

  if (!date || !meal_type) {
    return res.status(400).json({ error: 'date and meal_type query parameters are required' });
  }

  try {
    const [rows] = await db.query(
      `SELECT a.*, s.name, s.roll_number 
       FROM attendance a
       JOIN students s ON a.student_id = s.id
       WHERE a.date = ? AND a.meal_type = ?`,
      [date, meal_type]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

module.exports = router;
