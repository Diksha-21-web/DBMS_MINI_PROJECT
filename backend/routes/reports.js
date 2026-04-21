const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/reports/student/:id - Attendance history for one student
router.get('/student/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    // Check if student exists
    const [students] = await db.query('SELECT name, roll_number FROM students WHERE id = ?', [studentId]);
    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const [attendance] = await db.query(
      `SELECT id, date, meal_type, status, marked_at 
       FROM attendance 
       WHERE student_id = ? 
       ORDER BY date DESC, meal_type DESC`,
      [studentId]
    );

    res.json({
      student: students[0],
      history: attendance
    });
  } catch (error) {
    console.error('Error fetching student report:', error);
    res.status(500).json({ error: 'Failed to fetch student report' });
  }
});

// GET /api/reports/summary - Daily summary (present/absent count per meal)
router.get('/summary', async (req, res) => {
  const { date } = req.query;
  
  if (!date) {
    return res.status(400).json({ error: 'date query parameter is required' });
  }

  try {
    // We want the total students to calculate missing attendances too
    const [totalStudentsResult] = await db.query('SELECT COUNT(*) as total FROM students');
    const totalStudents = totalStudentsResult[0].total;

    const [summaryRows] = await db.query(
      `SELECT meal_type, status, COUNT(*) as count 
       FROM attendance 
       WHERE date = ? 
       GROUP BY meal_type, status`,
      [date]
    );

    // Format the response into a nice structure
    const meals = ['Breakfast', 'Lunch', 'Dinner'];
    const summary = {
      total_students: totalStudents,
      meals: {}
    };

    meals.forEach(meal => {
      summary.meals[meal] = {
        Present: 0,
        Absent: 0,
        NotMarked: totalStudents
      };
    });

    summaryRows.forEach(row => {
      const { meal_type, status, count } = row;
      if (summary.meals[meal_type]) {
        summary.meals[meal_type][status] = count;
        // Update NotMarked count
        summary.meals[meal_type].NotMarked -= count;
      }
    });

    res.json(summary);
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    res.status(500).json({ error: 'Failed to fetch daily summary' });
  }
});

module.exports = router;
