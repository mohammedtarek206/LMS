import React, { useState, useEffect } from 'react';
import { Users, FileText, Activity, DollarSign, TrendingUp } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import api from '../api';

const DashboardScreen = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [stats, setStats] = useState({ patients: 0, cases: 0, todayCases: 0, totalRevenue: 0, thisMonthRevenue: 0 });
  const [chartData, setChartData] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const patientsRes = await api.get('/patients?limit=all');
        const casesRes = await api.get('/cases?limit=all');

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

        // Revenue from patients (price at registration)
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        const totalRevenue = patientsData.reduce((sum, p) => sum + (p.price || 0), 0);
        const thisMonthRevenue = patientsData
          .filter(p => {
            const d = new Date(p.createdAt);
            return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
          })
          .reduce((sum, p) => sum + (p.price || 0), 0);

        setStats({
          patients: patientsData.length,
          cases: casesData.length,
          todayCases: casesData.filter(c => c && c.createdAt && new Date(c.createdAt).toDateString() === new Date().toDateString()).length,
          totalRevenue,
          thisMonthRevenue,
        });

        // Weekly cases chart
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dynamicData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayName = dayNames[date.getDay()];
          const count = casesData.filter(c => c && c.createdAt && new Date(c.createdAt).toDateString() === date.toDateString()).length;
          dynamicData.push({ name: dayName, value: count });
        }
        setChartData(Object.assign(dynamicData, { patientsList: patientsData }));

        // Monthly revenue chart (last 6 months)
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          const m = d.getMonth();
          const y = d.getFullYear();
          const revenue = patientsData
            .filter(p => {
              const pd = new Date(p.createdAt);
              return pd.getMonth() === m && pd.getFullYear() === y;
            })
            .reduce((sum, p) => sum + (p.price || 0), 0);
          monthlyData.push({ name: monthNames[m], revenue });
        }
        setMonthlyRevenueData(monthlyData);

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
        <h2 style={{ marginBottom: '5px' }}>Welcome, {userInfo.name} 👋</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          {userInfo.role === 'Admin'
            ? 'You have full authority to manage the lab and monitor comprehensive statistics.'
            : 'You can review patient cases and add new medical reports.'}
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Total Patients</span>
            <Users size={20} color="var(--primary-color)" />
          </div>
          <h2 style={{ fontSize: '28px' }}>{loading ? '...' : stats.patients}</h2>
          <span style={{ color: 'var(--success)', fontSize: '14px' }}>Registered Patients</span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Reports Completed</span>
            <FileText size={20} color="#8b5cf6" />
          </div>
          <h2 style={{ fontSize: '28px' }}>{loading ? '...' : stats.cases}</h2>
          <span style={{ color: 'var(--success)', fontSize: '14px' }}>Completed Reports</span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Today's Cases</span>
            <Activity size={20} color="#f59e0b" />
          </div>
          <h2 style={{ fontSize: '28px' }}>{loading ? '...' : stats.todayCases}</h2>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Today's Case</span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', border: '2px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Revenue This Month</span>
            <TrendingUp size={20} color="#10b981" />
          </div>
          <h2 style={{ fontSize: '24px', color: '#10b981' }}>
            {loading ? '...' : `${stats.thisMonthRevenue.toLocaleString()} EGP`}
          </h2>
          <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
            Grand Total: {loading ? '...' : `${stats.totalRevenue.toLocaleString()} EGP`}
          </span>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Weekly Cases Chart */}
        <div className="card" style={{ height: '320px' }}>
          <h3 style={{ marginBottom: '15px' }}>Cases (Weekly)</h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} />
              <YAxis stroke="var(--text-secondary)" fontSize={11} />
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
              <Line type="monotone" dataKey="value" name="Cases" stroke="var(--primary-color)" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="card" style={{ height: '320px' }}>
          <h3 style={{ marginBottom: '15px' }}>Monthly Revenue (EGP)</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={monthlyRevenueData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} />
              <YAxis stroke="var(--text-secondary)" fontSize={11} />
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                formatter={(value) => [`${value.toLocaleString()} EGP`, 'Revenue']}
              />
              <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <h3 style={{ marginBottom: '15px' }}>Recent Patients</h3>
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading...</p>
        ) : (
          <table style={{ width: '100%', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Patient</th>
                <th style={{ padding: '10px' }}>Treating Doctor</th>
                <th style={{ padding: '10px' }}>Phone</th>
                <th style={{ padding: '10px' }}>Price</th>
                <th style={{ padding: '10px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {(chartData.patientsList || []).slice(0, 5).map(p => (
                <tr key={p._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{p.name}</td>
                  <td style={{ padding: '10px', color: 'var(--primary-color)' }}>{p.referringDoctor || '---'}</td>
                  <td style={{ padding: '10px' }}>{p.phone || '---'}</td>
                  <td style={{ padding: '10px', color: '#10b981', fontWeight: 'bold' }}>
                    {p.price ? `${Number(p.price).toLocaleString()} EGP` : '---'}
                  </td>
                  <td style={{ padding: '10px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardScreen;
