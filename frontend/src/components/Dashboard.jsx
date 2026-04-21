import React, { useState, useEffect } from 'react';
import { Users, Utensils, IndianRupee, CalendarCheck } from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalBookingsToday: 0,
    totalRevenue: 0,
    pendingPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const [studentsRes, bookingsRes, paymentsRes] = await Promise.all([
        api.get('/students'),
        api.get('/bookings'),
        api.get('/payments')
      ]);

      const students = studentsRes.data;
      const bookings = bookingsRes.data;
      const payments = paymentsRes.data;

      const todaysBookings = bookings.filter(b => b.Booking_date.startsWith(today));
      const totalRev = payments.filter(p => p.Status === 'Paid').reduce((sum, p) => sum + parseFloat(p.Amount), 0);
      const pendingRev = payments.filter(p => p.Status === 'Pending').reduce((sum, p) => sum + parseFloat(p.Amount), 0);

      setStats({
        totalStudents: students.length,
        totalBookingsToday: todaysBookings.length,
        totalRevenue: totalRev,
        pendingPayments: pendingRev
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Could not connect to the backend. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ borderColor: 'var(--danger)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
        <h2 style={{ color: 'var(--danger)' }}>Connection Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        System Overview ({new Date().toLocaleDateString()})
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
            <Users size={32} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Students</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.totalStudents}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
            <CalendarCheck size={32} style={{ color: '#10b981' }} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Today's Bookings</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.totalBookingsToday}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px' }}>
            <IndianRupee size={32} style={{ color: '#8b5cf6' }} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Revenue</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>₹{stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
            <Utensils size={32} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Pending Payments</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>₹{stats.pendingPayments.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Quick Actions</h2>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/bookings" style={{ textDecoration: 'none' }} className="btn btn-primary">
            <CalendarCheck size={18} /> Manage Bookings
          </a>
          <a href="/payments" style={{ textDecoration: 'none' }} className="btn btn-secondary">
            <IndianRupee size={18} /> Record Payment
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
