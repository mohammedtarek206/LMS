import React, { useState, useEffect } from 'react';
import { Users, FileText, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';

const DashboardScreen = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [stats, setStats] = useState({ patients: 0, cases: 0, todayCases: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const patientsRes = await api.get('/patients');
        const casesRes = await api.get('/cases');
        
        let patientsData = [];
        if (patientsRes.data && Array.isArray(patientsRes.data.patients)) {
          patientsData = patientsRes.data.patients;
        } else if (Array.isArray(patientsRes.data)) {
          patientsData = patientsRes.data;
        }

        let casesData = [];
        if (casesRes.data && Array.isArray(casesRes.data.cases)) {
          casesData = casesRes.data.cases;
        } else if (Array.isArray(casesRes.data)) {
          casesData = casesRes.data;
        }

        setStats({
          patients: patientsData.length,
          cases: casesData.length,
          todayCases: casesData.filter(c => c && c.createdAt && new Date(c.createdAt).toDateString() === new Date().toDateString()).length
        });

        // Calculate chart data (Last 7 days)
        const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        const dynamicData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayName = dayNames[date.getDay()];
          const count = casesData.filter(c => c && c.createdAt && new Date(c.createdAt).toDateString() === date.toDateString()).length;
          dynamicData.push({ name: dayName, value: count });
        }
        setChartData(Object.assign(dynamicData, { patientsList: patientsData }));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);


  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '5px' }}>أهلاً بك، {userInfo.name} 👋</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          {userInfo.role === 'Admin' 
            ? 'لديك كامل الصلاحيات لإدارة المعمل ومتابعة الإحصائيات الشاملة.' 
            : 'يمكنك مراجعة حالات المرضى وإضافة تقارير طبية جديدة.'}
        </p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>إجمالي المرضى</span>
            <Users size={20} color="var(--primary-color)" />
          </div>
          <h2 style={{ fontSize: '28px' }}>{loading ? '...' : stats.patients}</h2>
          <span style={{ color: 'var(--success)', fontSize: '14px' }}>+12% عن الشهر الماضي</span>
        </div>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>التقارير المنجزة</span>
            <FileText size={20} color="#8b5cf6" />
          </div>
          <h2 style={{ fontSize: '28px' }}>{loading ? '...' : stats.cases}</h2>
          <span style={{ color: 'var(--success)', fontSize: '14px' }}>+5% عن الشهر الماضي</span>
        </div>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>حالات اليوم</span>
            <Activity size={20} color="#f59e0b" />
          </div>
          <h2 style={{ fontSize: '28px' }}>{loading ? '...' : stats.todayCases}</h2>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>حالة قيد الانتظار: 2</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        <div className="card" style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '20px' }}>إحصائيات الحالات (أسبوعياً)</h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
              <Line type="monotone" dataKey="value" stroke="var(--primary-color)" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ height: '400px', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '20px' }}>أحدث المرضى المسجلين</h3>
          {loading ? (
            <p style={{ textAlign: 'center' }}>جاري التحميل...</p>
          ) : (
            <table style={{ width: '100%', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-primary)', textAlign: 'right' }}>
                  <th style={{ padding: '10px' }}>المريض</th>
                  <th style={{ padding: '10px' }}>الطبيب المعالج</th>
                </tr>
              </thead>
              <tbody>
                {(chartData.patientsList || []).slice(0, 5).map(p => (
                  <tr key={p._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: 'bold' }}>{p.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{p.nationalId}</div>
                    </td>
                    <td style={{ padding: '10px' }}>{p.referringDoctor || '---'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
