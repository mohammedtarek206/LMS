import React, { useState } from 'react';
import { Save } from 'lucide-react';
import api from '../api';

const SettingsScreen = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [name, setName] = useState(userInfo.name || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', {
        name,
        oldPassword,
        newPassword
      });

      // Update local storage with new name/token
      localStorage.setItem('userInfo', JSON.stringify(data));
      alert('تم تحديث البيانات بنجاح!');
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'فشل تحديث البيانات';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>الإعدادات</h2>
      
      <div className="card" style={{ maxWidth: '600px' }}>
        <h3 style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>بيانات الحساب الشخصي</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">الاسم بالكامل</label>
            <input 
              type="text" 
              className="input-field" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">اسم المستخدم (للتسجيل)</label>
            <input 
              type="text" 
              className="input-field" 
              value={userInfo.username || ''} 
              disabled 
              style={{ background: 'var(--border-color)', cursor: 'not-allowed' }} 
            />
          </div>
          
          <h3 style={{ margin: '30px 0 20px', color: 'var(--text-secondary)' }}>تغيير كلمة المرور</h3>
          
          <div className="input-group">
            <label className="input-label">كلمة المرور القديمة</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">كلمة المرور الجديدة</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="أدخل كلمة المرور الجديدة" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
            <Save size={18} /> {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsScreen;
