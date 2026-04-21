import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Trash2, Edit } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
  const [formData, setFormData] = useState({
    F_name: '',
    M_name: '',
    L_name: '',
    DOB: '',
    Gender: 'Male',
    Contact_no: '',
    Mail_id: '',
    Password: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
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
      if (editingStudent) {
        await api.put(`/students/${editingStudent.Stud_id}`, formData);
        toast.success('Student updated successfully');
      } else {
        await api.post('/students', formData);
        toast.success('Student added successfully');
      }
      setIsModalOpen(false);
      setEditingStudent(null);
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error('Failed to save student');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/students/${id}`);
        toast.success('Student deleted successfully');
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        toast.error('Failed to delete student');
      }
    }
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      F_name: student.F_name,
      M_name: student.M_name || '',
      L_name: student.L_name,
      DOB: new Date(student.DOB).toISOString().split('T')[0],
      Gender: student.Gender,
      Contact_no: student.Contact_no,
      Mail_id: student.Mail_id,
      Password: student.Password || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      F_name: '', M_name: '', L_name: '', DOB: '', Gender: 'Male', Contact_no: '', Mail_id: '', Password: ''
    });
  };

  const filteredStudents = students.filter(student => 
    `${student.F_name} ${student.L_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.Mail_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Students</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage student records</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setEditingStudent(null); setIsModalOpen(true); }}>
          <Plus size={20} />
          Add Student
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '3rem', width: '100%' }}
            />
          </div>
        </div>
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
                  <th>Name</th>
                  <th>DOB</th>
                  <th>Gender</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(student => (
                    <tr key={student.Stud_id}>
                      <td>#{student.Stud_id}</td>
                      <td>
                        <div style={{ fontWeight: '500' }}>{`${student.F_name} ${student.M_name ? student.M_name + ' ' : ''}${student.L_name}`}</div>
                      </td>
                      <td>{new Date(student.DOB).toLocaleDateString()}</td>
                      <td>{student.Gender}</td>
                      <td>{student.Contact_no}</td>
                      <td>{student.Mail_id}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => openEditModal(student)}>
                            <Edit size={16} />
                          </button>
                          <button className="btn" style={{ padding: '0.5rem', color: 'var(--danger)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }} onClick={() => handleDelete(student.Stud_id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                      <Users size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem', opacity: 0.5 }} />
                      <p style={{ color: 'var(--text-secondary)' }}>No students found</p>
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
          <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>First Name*</label>
                  <input type="text" name="F_name" value={formData.F_name} onChange={handleInputChange} required />
                </div>
                <div>
                  <label>Middle Name</label>
                  <input type="text" name="M_name" value={formData.M_name} onChange={handleInputChange} />
                </div>
                <div>
                  <label>Last Name*</label>
                  <input type="text" name="L_name" value={formData.L_name} onChange={handleInputChange} required />
                </div>
                <div>
                  <label>Date of Birth*</label>
                  <input type="date" name="DOB" value={formData.DOB} onChange={handleInputChange} required />
                </div>
                <div>
                  <label>Gender*</label>
                  <select name="Gender" value={formData.Gender} onChange={handleInputChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label>Contact Number*</label>
                  <input type="text" name="Contact_no" value={formData.Contact_no} onChange={handleInputChange} required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Email ID*</label>
                  <input type="email" name="Mail_id" value={formData.Mail_id} onChange={handleInputChange} required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Password*</label>
                  <input type="password" name="Password" value={formData.Password} onChange={handleInputChange} required={!editingStudent} placeholder={editingStudent ? "Leave blank to keep same" : ""} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingStudent ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
