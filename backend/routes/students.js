const express = require('express');
const router = express.Router();
const db = require('../db');

// Create student
router.post('/', async (req, res) => {
  try {
    const { F_name, M_name, L_name, DOB, Gender, Contact_no, Mail_id, Password } = req.body;
    const [result] = await db.query(
      `INSERT INTO student (F_name, M_name, L_name, DOB, Gender, Contact_no, Mail_id, Password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [F_name, M_name || null, L_name, DOB, Gender, Contact_no, Mail_id, Password]
    );
    res.status(201).json({ message: 'Student created successfully', Stud_id: result.insertId });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Read all students
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM student`);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Read single student
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM student WHERE Stud_id = ?`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const { F_name, M_name, L_name, DOB, Gender, Contact_no, Mail_id, Password } = req.body;
    const [result] = await db.query(
      `UPDATE student SET F_name=?, M_name=?, L_name=?, DOB=?, Gender=?, Contact_no=?, Mail_id=?, Password=?
       WHERE Stud_id = ?`,
      [F_name, M_name || null, L_name, DOB, Gender, Contact_no, Mail_id, Password, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(`DELETE FROM student WHERE Stud_id = ?`, [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
