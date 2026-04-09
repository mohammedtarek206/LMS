import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import api from '../api';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'فشل تسجيل الدخول! تأكد من البيانات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
      <div className="card" style={{ width: '400px', textAlign: 'center', padding: '40px 30px' }}>
        <Stethoscope size={50} color="var(--primary-color)" style={{ marginBottom: '10px' }} />
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '5px' }}>Figa Lab</h1>
        <h2 style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '30px' }}>فيحا لاب للتحاليل الطبية</h2>
        <p style={{ marginBottom: '20px', fontWeight: '600' }}>تسجيل الدخول للنظام</p>
        
        <form onSubmit={submitHandler}>
          <div className="input-group" style={{ textAlign: 'right' }}>
            <label className="input-label">اسم المستخدم</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="أدخل اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group" style={{ textAlign: 'right', marginBottom: '30px' }}>
            <label className="input-label">كلمة المرور</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '16px' }}>
            دخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
