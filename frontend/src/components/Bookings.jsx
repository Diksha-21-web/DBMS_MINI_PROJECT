import React, { useState, useEffect } from 'react';
import { CalendarCheck, Plus, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [students, setStudents] = useState([]);
  const [mealOptions, setMealOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    Stud_id: '',
    MealOption_id: '',
    Booking_date: new Date().toISOString().split('T')[0],
    Booking_time: new Date().toTimeString().split(' ')[0].substring(0, 5) + ':00',
    Confirmation: 'Pending'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, studentsRes, mealOptionsRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/students'),
        api.get('/mealOptions')
      ]);
      setBookings(bookingsRes.data);
      setStudents(studentsRes.data);
      setMealOptions(mealOptionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', formData);
      toast.success('Booking created successfully');
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { Confirmation: status });
      toast.success(`Booking ${status}`);
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
      Stud_id: '',
      MealOption_id: '',
      Booking_date: new Date().toISOString().split('T')[0],
      Booking_time: new Date().toTimeString().split(' ')[0].substring(0, 5) + ':00',
      Confirmation: 'Pending'
    });
  };

  const getStudentName = (id) => {
    const student = students.find(s => s.Stud_id === id);
    return student ? `${student.F_name} ${student.L_name}` : 'Unknown';
  };

  const getMealDetails = (id) => {
    const meal = mealOptions.find(m => m.MealOption_id === id);
    return meal ? `${meal.Meal_Type} (₹${meal.Price})` : 'Unknown';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Confirmed': return <span className="badge badge-present">{status}</span>;
      case 'Cancelled': return <span className="badge badge-absent">{status}</span>;
      default: return <span className="badge" style={{ backgroundColor: '#fef08a', color: '#854d0e' }}>{status}</span>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Meal Bookings</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage student meal bookings</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus size={20} />
          New Booking
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Student</th>
                  <th>Meal Option</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map(booking => (
                    <tr key={booking.Booking_id}>
                      <td>#{booking.Booking_id}</td>
                      <td><div style={{ fontWeight: '500' }}>{getStudentName(booking.Stud_id)}</div></td>
                      <td>{getMealDetails(booking.MealOption_id)}</td>
                      <td>{new Date(booking.Booking_date).toLocaleDateString()}</td>
                      <td>{booking.Booking_time}</td>
                      <td>{getStatusBadge(booking.Confirmation)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {booking.Confirmation !== 'Confirmed' && (
                            <button className="btn btn-secondary" style={{ padding: '0.5rem', color: 'var(--success)', borderColor: 'var(--success)' }} onClick={() => updateStatus(booking.Booking_id, 'Confirmed')} title="Confirm">
                              <CheckCircle size={16} />
                            </button>
                          )}
                          {booking.Confirmation !== 'Cancelled' && (
                            <button className="btn btn-secondary" style={{ padding: '0.5rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => updateStatus(booking.Booking_id, 'Cancelled')} title="Cancel">
                              <XCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                      <CalendarCheck size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem', opacity: 0.5 }} />
                      <p style={{ color: 'var(--text-secondary)' }}>No bookings found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Booking</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>Student*</label>
                <select name="Stud_id" value={formData.Stud_id} onChange={handleInputChange} required>
                  <option value="">-- Select Student --</option>
                  {students.map(s => (
                    <option key={s.Stud_id} value={s.Stud_id}>{s.F_name} {s.L_name} (#{s.Stud_id})</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Meal Option*</label>
                <select name="MealOption_id" value={formData.MealOption_id} onChange={handleInputChange} required>
                  <option value="">-- Select Meal --</option>
                  {mealOptions.filter(m => m.Availability_Status === 'Available').map(m => (
                    <option key={m.MealOption_id} value={m.MealOption_id}>{m.Meal_Type} - ₹{m.Price}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>Date*</label>
                  <input type="date" name="Booking_date" value={formData.Booking_date} onChange={handleInputChange} required />
                </div>
                <div>
                  <label>Time*</label>
                  <input type="time" name="Booking_time" value={formData.Booking_time} onChange={handleInputChange} required />
                </div>
              </div>
              <div>
                <label>Initial Status*</label>
                <select name="Confirmation" value={formData.Confirmation} onChange={handleInputChange} required>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
