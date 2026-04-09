import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const isAdmin = userInfo.role === 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <div className="sidebar no-print" style={{ width: '250px', background: 'var(--panel-bg)', height: '100vh', padding: '20px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '40px', textAlign: 'center', fontWeight: 'bold', fontSize: '20px', color: 'var(--primary-color)' }}>
        Figa Lab / فيحا لاب
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <NavLink to="/dashboard" style={({isActive}) => ({ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', background: isActive ? 'var(--primary-color)' : 'transparent', color: isActive ? '#fff' : 'var(--text-secondary)' })}>
          <LayoutDashboard size={20} /> لوحة التحكم
        </NavLink>
        
        <NavLink to="/patients" style={({isActive}) => ({ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', background: isActive ? 'var(--primary-color)' : 'transparent', color: isActive ? '#fff' : 'var(--text-secondary)' })}>
          <Users size={20} /> المرضى
        </NavLink>
        
        <NavLink to="/cases" style={({isActive}) => ({ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', background: isActive ? 'var(--primary-color)' : 'transparent', color: isActive ? '#fff' : 'var(--text-secondary)' })}>
          <FileText size={20} /> التقارير والحالات
        </NavLink>
        
        {isAdmin && (
          <NavLink to="/settings" style={({isActive}) => ({ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', background: isActive ? 'var(--primary-color)' : 'transparent', color: isActive ? '#fff' : 'var(--text-secondary)' })}>
            <Settings size={20} /> الإعدادات
          </NavLink>
        )}
      </nav>

      <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto', border: '1px solid var(--danger)', width: '100%', cursor: 'pointer' }}>
        <LogOut size={20} /> تسجيل خروج
      </button>
    </div>
  );
};

export default Sidebar;
