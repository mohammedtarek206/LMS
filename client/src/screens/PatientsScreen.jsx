import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import api from '../api';

const PatientsScreen = () => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // New patient form state
  const [newPatient, setNewPatient] = useState({ name: '', nationalId: '', age: '', gender: 'Male', referringDoctor: '', phone: '', price: '' });

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (searchTerm.trim() === '') {
      fetchPatients();
    } else {
      const delaySearch = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(delaySearch);
    }
  }, [currentPage, searchTerm]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/patients?pageNumber=${currentPage}`);
      if (data && data.patients) {
        setPatients(data.patients);
        setPages(data.pages || 1);
      } else {
        setPatients(Array.isArray(data) ? data : []);
        setPages(1);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/patients/search?keyword=${searchTerm}`);
      setPatients(data);
      setPages(1); // Reset pages during search
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const itemsPerPage = 10;
  // We use pages from backend now
  const [pages, setPages] = useState(1);

  
  const displayedPatients = Array.isArray(patients) ? patients : [];

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      await api.post('/patients', newPatient);
      // Re-fetch to get correctly sorted/paginated data
      await fetchPatients();
      setShowAddForm(false);
      setNewPatient({ name: '', nationalId: '', age: '', gender: 'Male', referringDoctor: '', phone: '', price: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'فشل إضافة المريض');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المريض؟ سيتم مسح كافة سجلاته.')) {
      try {
        await api.delete(`/patients/${id}`);
        setPatients(patients.filter(p => p._id !== id));
      } catch (error) {
        alert('فشل عملية الحذف');
      }
    }
  };

  const startEdit = (patient) => {
    setEditingPatient({ ...patient });
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/patients/${editingPatient._id}`, editingPatient);
      setPatients(patients.map(p => p._id === data._id ? data : p));
      setShowEditForm(false);
      setEditingPatient(null);
    } catch (error) {
      alert('فشل التعديل');
    }
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>إدارة المرضى</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="بحث بالاسم أو الرقم القومي..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ marginBottom: 0, paddingRight: '15px' }}
            />
          </div>
          <button 
            className="btn" 
            onClick={fetchPatients}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--panel-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>
             تحديث
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowAddForm(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <Plus size={18} /> إضافة مريض
          </button>
        </div>
      </div>


      {showAddForm && (
        <div className="card" style={{ marginBottom: '20px', border: '2px solid var(--primary-color)' }}>
          <form onSubmit={handleAddPatient}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h3>بيانات المريض الجديد</h3>
              <button type="button" onClick={() => setShowAddForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}><X size={24} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="input-group">
                <label className="input-label">الاسم بالكامل</label>
                <input type="text" className="input-field" placeholder="اسم المريض" required value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">الرقم القومي</label>
                <input type="text" className="input-field" placeholder="14 رقم" required value={newPatient.nationalId} onChange={e => setNewPatient({...newPatient, nationalId: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">السن</label>
                <input type="number" className="input-field" placeholder="عمر المريض" required value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">النوع</label>
                <select className="input-field" value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value})}>
                  <option value="Male">ذكر</option>
                  <option value="Female">أنثى</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">الطبيب المعالج / Referring Doctor</label>
                <input type="text" className="input-field" placeholder="اسم دكتور المريض" required value={newPatient.referringDoctor} onChange={e => setNewPatient({...newPatient, referringDoctor: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">رقم التليفون</label>
                <input type="tel" className="input-field" placeholder="رقم هاتف المريض" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">سعر التحليل (جنيه)</label>
                <input type="number" className="input-field" placeholder="0" min="0" value={newPatient.price} onChange={e => setNewPatient({...newPatient, price: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>حفظ المريض</button>
          </form>
        </div>
      )}

      {showEditForm && editingPatient && (
        <div className="card" style={{ marginBottom: '20px', border: '2px solid var(--warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h3>تعديل بيانات المريض</h3>
            <button onClick={() => setShowEditForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}><X size={24} /></button>
          </div>
          <form onSubmit={handleUpdate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="input-group">
                <label className="input-label">الاسم</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={editingPatient.name} 
                  onChange={e => setEditingPatient({...editingPatient, name: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label className="input-label">الرقم القومي</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={editingPatient.nationalId} 
                  onChange={e => setEditingPatient({...editingPatient, nationalId: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label className="input-label">السن</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={editingPatient.age}
                  onChange={e => setEditingPatient({...editingPatient, age: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label className="input-label">النوع</label>
                <select 
                  className="input-field" 
                  value={editingPatient.gender}
                  onChange={e => setEditingPatient({...editingPatient, gender: e.target.value})}
                >
                  <option value="Male">ذكر</option>
                  <option value="Female">أنثى</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">الطبيب المعالج / Referring Doctor</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={editingPatient.referringDoctor || ''}
                  onChange={e => setEditingPatient({...editingPatient, referringDoctor: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label className="input-label">رقم التليفون</label>
                <input 
                  type="tel" 
                  className="input-field" 
                  placeholder="رقم هاتف المريض"
                  value={editingPatient.phone || ''}
                  onChange={e => setEditingPatient({...editingPatient, phone: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label className="input-label">سعر التحليل (جنيه)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="0"
                  min="0"
                  value={editingPatient.price || ''}
                  onChange={e => setEditingPatient({...editingPatient, price: e.target.value})}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ background: 'var(--warning)', marginTop: '10px', color: '#000' }}>حفظ التعديلات</button>
          </form>
        </div>
      )}

      <div className="card table-wrapper">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>جاري التحميل...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الرقم القومي</th>
                <th>السن</th>
                <th>النوع</th>
                <th>الطبيب المعالج</th>
                <th>رقم التليفون</th>
                <th>السعر</th>
                <th>تاريخ الإضافة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {displayedPatients.map((p) => (
                <tr key={p._id}>
                  <td style={{ fontWeight: 'bold' }}>{p.name}</td>
                  <td style={{ fontFamily: 'monospace' }}>{p.nationalId}</td>
                  <td>{p.age}</td>
                  <td>{p.gender === 'Male' ? 'ذكر' : 'أنثى'}</td>
                  <td style={{ color: 'var(--primary-color)', fontWeight: '500' }}>{p.referringDoctor || '---'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.phone || '---'}</td>
                  <td style={{ color: '#10b981', fontWeight: 'bold' }}>{p.price ? `${Number(p.price).toLocaleString()} ج` : '---'}</td>
                  <td>{new Date(p.createdAt || p.date).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => navigate(`/patients/${p._id}`)}
                        className="btn" 
                        title="عرض الملف"
                        style={{ background: '#e0e7ff', color: '#4f46e5', padding: '6px' }}>
                        ملف المريض
                      </button>
                      <button 
                        onClick={() => startEdit(p)}
                        title="تعديل"
                        className="btn" 
                        style={{ background: '#fef3c7', color: '#d97706', padding: '6px' }}>
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p._id)}
                        title="حذف"
                        className="btn" 
                        style={{ background: '#fee2e2', color: '#dc2626', padding: '6px' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
          <button 
            className="btn" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pages))}
            disabled={currentPage === pages}
            style={{ 
              background: 'var(--border-color)', 
              color: currentPage === pages ? '#999' : 'var(--text-primary)',
              cursor: currentPage === pages ? 'not-allowed' : 'pointer'
            }}>
            التالي
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientsScreen;
