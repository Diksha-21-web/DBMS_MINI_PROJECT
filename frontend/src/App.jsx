import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import Bookings from './components/Bookings';
import Payments from './components/Payments';
import MealOptions from './components/MealOptions';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/meal-options" element={<MealOptions />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/payments" element={<Payments />} />
          </Routes>
        </main>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#334155',
            color: '#fff',
            border: '1px solid #475569',
          },
        }}
      />
    </Router>
  );
}

export default App;
