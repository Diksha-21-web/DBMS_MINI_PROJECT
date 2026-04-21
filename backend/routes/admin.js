const express = require('express');
const router = express.Router();
const db = require('../db');

// Create admin
router.post('/', async (req, res) => {
  try {
    const { F_name, M_name, L_name, Mail_id, Password, Contact_no } = req.body;
    const [result] = await db.query(
      `INSERT INTO admin (F_name, M_name, L_name, Mail_id, Password, Contact_no)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [F_name, M_name || null, L_name, Mail_id, Password, Contact_no]
    );
    res.status(201).json({ message: 'Admin created successfully', Admin_id: result.insertId });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Read all admins
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM admin`);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Read single admin
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM admin WHERE Admin_id = ?`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Admin not found' });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update admin
router.put('/:id', async (req, res) => {
  try {
    const { F_name, M_name, L_name, Mail_id, Password, Contact_no } = req.body;
    const [result] = await db.query(
      `UPDATE admin SET F_name=?, M_name=?, L_name=?, Mail_id=?, Password=?, Contact_no=?
       WHERE Admin_id = ?`,
      [F_name, M_name || null, L_name, Mail_id, Password, Contact_no, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Admin not found' });
    res.status(200).json({ message: 'Admin updated successfully' });
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete admin
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(`DELETE FROM admin WHERE Admin_id = ?`, [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Admin not found' });
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
