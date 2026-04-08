import React, { useState, useRef, useEffect } from 'react';
import { Search, Moon, Sun, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Navbar = ({ toggleTheme, isDark }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const searchPatients = async () => {
      if (query.trim() === '') {
        setResults([]);
        return;
      }
      try {
        const encodedQuery = encodeURIComponent(query.trim());
        const { data } = await api.get(`/patients/search?keyword=${encodedQuery}`);
        setResults(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Search error:', error);
      }
    };

    const timeoutId = setTimeout(() => {
      searchPatients();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (patientId) => {
    setQuery('');
    setResults([]);
    setIsFocused(false);
    navigate(`/patients/${patientId}`);
  };

  return (
    <div className="navbar no-print" style={{ height: '70px', background: 'var(--panel-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ position: 'relative', width: '300px' }} ref={dropdownRef}>
        <input 
          type="text" 
          placeholder="ابحث بالرقم القومي أو الاسم..." 
          className="input-field"
          style={{ paddingLeft: '40px', width: '100%', borderRadius: '20px' }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        <Search size={18} style={{ position: 'absolute', right: '15px', top: '12px', color: 'var(--text-secondary)' }} />
        
        {isFocused && query && (
          <div className="card" style={{ 
            position: 'absolute', 
            top: '45px', 
            right: '0', 
            width: '100%', 
            zIndex: 100, 
            padding: '10px 0', 
            maxHeight: '300px', 
            overflowY: 'auto' 
          }}>
            {results.length > 0 ? (
              results.map(p => (
                <div 
                  key={p._id} 
                  onClick={() => handleSelect(p._id)}
                  style={{ 
                    padding: '10px 20px', 
                    cursor: 'pointer', 
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-color)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ fontWeight: 'bold' }}>{p.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{p.nationalId}</div>
                </div>
              ))
            ) : (
              <div style={{ padding: '10px 20px', color: 'var(--text-secondary)', textAlign: 'center' }}>لا توجد نتائج مطابقة</div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <Bell size={24} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {userInfo.role === 'Admin' ? 'أ' : 'د'}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{userInfo.name || 'مستخدم'}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{userInfo.role === 'Admin' ? 'المدير' : 'طبيب'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
