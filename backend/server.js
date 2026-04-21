const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Allow requests from Vite frontend dev server
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());

const studentsRouter = require('./routes/students');
const adminRouter = require('./routes/admin');
const mealOptionsRouter = require('./routes/mealOptions');
const bookingsRouter = require('./routes/bookings');
const paymentsRouter = require('./routes/payments');

// API Routes
app.use('/api/students', studentsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/mealOptions', mealOptionsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
