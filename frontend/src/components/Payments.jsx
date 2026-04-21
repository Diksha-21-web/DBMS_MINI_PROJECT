import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, IndianRupee } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [students, setStudents] = useState([]);
  const [mealOptions, setMealOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    Stud_id: '',
    Booking_id: '',
    Amount: '',
    Pay_date: new Date().toISOString().split('T')[0],
    Pay_method: 'Online',
    Status: 'Paid'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, bookingsRes, studentsRes, mealOptionsRes] = await Promise.all([
        api.get('/payments'),
        api.get('/bookings'),
        api.get('/students'),
        api.get('/mealOptions')
      ]);
      setPayments(paymentsRes.data);
      setBookings(bookingsRes.data);
      setStudents(studentsRes.data);
      setMealOptions(mealOptionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load payments data');
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
      await api.post('/payments', formData);
      toast.success('Payment recorded successfully');
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment');
    }
  };

  const resetForm = () => {
    setFormData({
      Stud_id: '',
      Booking_id: '',
      Amount: '',
      Pay_date: new Date().toISOString().split('T')[0],
      Pay_method: 'Online',
      Status: 'Paid'
    });
  };

  const getStudentName = (id) => {
    const student = students.find(s => s.Stud_id === id);
    return student ? `${student.F_name} ${student.L_name}` : 'Unknown';
  };

  const getBookingDetails = (id) => {
    const booking = bookings.find(b => b.Booking_id === id);
    return booking ? `Booking #${id} on ${new Date(booking.Booking_date).toLocaleDateString()}` : 'Unknown Booking';
  };

  const getMealDetails = (id) => {
    const meal = mealOptions.find(m => m.MealOption_id === id);
    return meal ? `${meal.Meal_Type} (₹${meal.Price})` : 'Unknown';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Paid': return <span className="badge badge-present">{status}</span>;
      case 'Failed': return <span className="badge badge-absent">{status}</span>;
      default: return <span className="badge" style={{ backgroundColor: '#fef08a', color: '#854d0e' }}>{status}</span>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Payments</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage student payments for meals</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus size={20} />
          Record Payment
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
                  <th>Payment ID</th>
                  <th>Student</th>
                  <th>Booking Reference</th>
                  <th>Amount (₹)</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
                  payments.map(payment => (
                    <tr key={payment.Payment_id}>
                      <td>#{payment.Payment_id}</td>
                      <td><div style={{ fontWeight: '500' }}>{getStudentName(payment.Stud_id)}</div></td>
                      <td>{getBookingDetails(payment.Booking_id)}</td>
                      <td style={{ fontWeight: '600' }}>₹{parseFloat(payment.Amount).toFixed(2)}</td>
                      <td>{new Date(payment.Pay_date).toLocaleDateString()}</td>
                      <td>{payment.Pay_method}</td>
                      <td>{getStatusBadge(payment.Status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                      <IndianRupee size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem', opacity: 0.5 }} />
                      <p style={{ color: 'var(--text-secondary)' }}>No payments found</p>
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
            <h2 style={{ marginBottom: '1.5rem' }}>Record New Payment</h2>
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
                <label>Booking Reference*</label>
                <select name="Booking_id" value={formData.Booking_id} onChange={handleInputChange} required>
                  <option value="">-- Select Booking --</option>
                  {bookings.filter(b => !formData.Stud_id || b.Stud_id.toString() === formData.Stud_id.toString()).length > 0 ? (
                    bookings.filter(b => !formData.Stud_id || b.Stud_id.toString() === formData.Stud_id.toString()).map(b => (
                      <option key={b.Booking_id} value={b.Booking_id}>
                        Booking #{b.Booking_id} on {new Date(b.Booking_date).toLocaleDateString()} ({getMealDetails(b.MealOption_id)})
                      </option>
                    ))
                  ) : (
                    formData.Stud_id && <option value="" disabled>No bookings found for this student</option>
                  )}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>Amount (₹)*</label>
                  <input type="number" step="0.01" min="0" name="Amount" value={formData.Amount} onChange={handleInputChange} required />
                </div>
                <div>
                  <label>Payment Date*</label>
                  <input type="date" name="Pay_date" value={formData.Pay_date} onChange={handleInputChange} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>Payment Method*</label>
                  <select name="Pay_method" value={formData.Pay_method} onChange={handleInputChange} required>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
                <div>
                  <label>Status*</label>
                  <select name="Status" value={formData.Status} onChange={handleInputChange} required>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
