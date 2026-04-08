import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, FileText, ArrowRight, Trash2, Edit, X, Save } from 'lucide-react';
import api from '../api';

const PatientProfileScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data state
  const [patient, setPatient] = useState(null);
  const [cases, setCases] = useState([]);
  const [caseSearchTerm, setCaseSearchTerm] = useState('');

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/patients/${id}`);
      setPatient(data);
      // Fetch cases for this patient
      const resCases = await api.get(`/cases/patient/${id}`);
      setCases(resCases.data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(c => 
    c.diagnosis?.toLowerCase().includes(caseSearchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (window.confirm('هل أنت متأكد من حذف هذا المريض نهائياً؟')) {
      try {
        await api.delete(`/patients/${id}`);
        alert('تم حذف المريض بنجاح.');
        navigate('/patients');
      } catch (error) {
        alert('حدث خطأ أثناء الحذف');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/patients/${id}`, patient);
      setPatient(data);
      setIsEditMode(false);
      alert('تم تحديث البيانات بنجاح.');
    } catch (error) {
      alert('فشل التحديث');
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>جاري تحميل ملف المريض...</div>;
  if (!patient) return <div style={{ padding: '20px', textAlign: 'center' }}>المريض غير موجود.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => navigate(-1)} className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowRight size={18} /> عودة للمرضى
        </button>
        
        <button onClick={handleDelete} className="btn" style={{ background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trash2 size={18} /> حذف المريض
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '20px' }}>
        {/* Patient Info Card */}
        <div className="card" style={{ alignSelf: 'start' }}>
          {!isEditMode ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                  <User size={40} />
                </div>
                <h3>{patient.name}</h3>
                <span style={{ color: 'var(--text-secondary)' }}>رقم قومي: {patient.nationalId}</span>
              </div>
              
              <div style={{ padding: '15px 0', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>السن</strong>
                <span>{patient.age} سنة</span>
              </div>
              <div style={{ padding: '15px 0', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>النوع</strong>
                <span>{patient.gender === 'Male' ? 'ذكر' : 'أنثى'}</span>
              </div>
              <div style={{ padding: '15px 0', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>تاريخ التسجيل</strong>
                <span>{new Date(patient.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ padding: '15px 0', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>الطبيب المعالج</strong>
                <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{patient.referringDoctor || 'لم يحدد'}</span>
              </div>
              
              <button 
                onClick={() => setIsEditMode(true)}
                className="btn" 
                style={{ width: '100%', background: 'var(--warning)', marginTop: '20px', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Edit size={16} /> تعديل البيانات
              </button>
            </>
          ) : (
            <form onSubmit={handleUpdate}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3>تعديل البيانات</h3>
                <button type="button" onClick={() => setIsEditMode(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div className="input-group">
                <label className="input-label">الاسم</label>
                <input type="text" className="input-field" value={patient.name} onChange={e => setPatient({...patient, name: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">الرقم القومي</label>
                <input type="text" className="input-field" value={patient.nationalId} onChange={e => setPatient({...patient, nationalId: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">السن</label>
                <input type="number" className="input-field" value={patient.age} onChange={e => setPatient({...patient, age: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">الطبيب المعالج / Referring Doctor</label>
                <input type="text" className="input-field" value={patient.referringDoctor || ''} onChange={e => setPatient({...patient, referringDoctor: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Save size={16} /> حفظ
              </button>
            </form>
          )}
        </div>

        {/* Medical History Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>التاريخ الطبي والتقارير</h3>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="بحث في التشخيصات..." 
                value={caseSearchTerm}
                onChange={e => setCaseSearchTerm(e.target.value)}
                style={{ marginBottom: 0, paddingRight: '35px' }}
              />
              <FileText size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            </div>
            <button onClick={() => navigate(`/cases/new/${patient._id}`)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
              إضافة تقرير
            </button>
          </div>


          <div className="card table-wrapper">
            {cases.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>لا توجد تقارير سابقة لهذا المريض.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>تاريخ التقرير</th>
                    <th>التشخيص</th>
                    <th>الطبيب المعالج</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.map(c => (
                    <tr key={c._id}>
                      <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 'bold' }}>{c.diagnosis}</td>
                      <td>{patient.referringDoctor || 'طبيب خارجي'}</td>
                      <td>
                        <button onClick={() => navigate(`/cases/${c._id}`)} className="btn" style={{ background: '#e0e7ff', color: '#4f46e5', fontSize: '12px' }}>فتح التقرير</button>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileScreen;
