import React, { useState, useEffect } from 'react';
import { Utensils, Plus, Edit, Trash2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const MealOptions = () => {
  const [mealOptions, setMealOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState(null);
  
  const [formData, setFormData] = useState({
    Meal_Type: 'Breakfast',
    Price: '',
    Availability_Status: 'Available'
  });

  useEffect(() => {
    fetchMealOptions();
  }, []);

  const fetchMealOptions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/mealOptions');
      setMealOptions(response.data);
    } catch (error) {
      console.error('Error fetching meal options:', error);
      toast.error('Failed to load meal options');
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
      if (editingOption) {
        await api.put(`/mealOptions/${editingOption.MealOption_id}`, formData);
        toast.success('Meal option updated successfully');
      } else {
        await api.post('/mealOptions', formData);
        toast.success('Meal option added successfully');
      }
      setIsModalOpen(false);
      setEditingOption(null);
      resetForm();
      fetchMealOptions();
    } catch (error) {
      console.error('Error saving meal option:', error);
      toast.error('Failed to save meal option');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal option?')) {
      try {
        await api.delete(`/mealOptions/${id}`);
        toast.success('Meal option deleted successfully');
        fetchMealOptions();
      } catch (error) {
        console.error('Error deleting meal option:', error);
        toast.error('Failed to delete meal option');
      }
    }
  };

  const openEditModal = (option) => {
    setEditingOption(option);
    setFormData({
      Meal_Type: option.Meal_Type,
      Price: option.Price,
      Availability_Status: option.Availability_Status
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ Meal_Type: 'Breakfast', Price: '', Availability_Status: 'Available' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Meal Options</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage available meals and pricing</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setEditingOption(null); setIsModalOpen(true); }}>
          <Plus size={20} />
          Add Meal Option
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
                  <th>ID</th>
                  <th>Meal Type</th>
                  <th>Price (₹)</th>
                  <th>Availability</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mealOptions.length > 0 ? (
                  mealOptions.map(option => (
                    <tr key={option.MealOption_id}>
                      <td>#{option.MealOption_id}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                          <Utensils size={16} style={{ color: 'var(--accent-primary)' }} />
                          {option.Meal_Type}
                        </div>
                      </td>
                      <td>₹{parseFloat(option.Price).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${option.Availability_Status === 'Available' ? 'badge-present' : 'badge-absent'}`}>
                          {option.Availability_Status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => openEditModal(option)}>
                            <Edit size={16} />
                          </button>
                          <button className="btn" style={{ padding: '0.5rem', color: 'var(--danger)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }} onClick={() => handleDelete(option.MealOption_id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                      <Utensils size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem', opacity: 0.5 }} />
                      <p style={{ color: 'var(--text-secondary)' }}>No meal options found</p>
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
            <h2 style={{ marginBottom: '1.5rem' }}>{editingOption ? 'Edit Meal Option' : 'Add New Meal Option'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>Meal Type*</label>
                <select name="Meal_Type" value={formData.Meal_Type} onChange={handleInputChange} required>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
              <div>
                <label>Price (₹)*</label>
                <input type="number" step="0.01" min="0" name="Price" value={formData.Price} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Availability Status*</label>
                <select name="Availability_Status" value={formData.Availability_Status} onChange={handleInputChange} required>
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingOption ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealOptions;
