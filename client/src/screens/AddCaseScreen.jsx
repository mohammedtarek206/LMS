import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowRight } from 'lucide-react';
import api from '../api';

const AddCaseScreen = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const [diagnosis, setDiagnosis] = useState('');
  const [specimen, setSpecimen] = useState('');
  const [gross, setGross] = useState('');
  const [microscopic, setMicroscopic] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!userInfo || !userInfo._id) {
      alert('جلسة العمل انتهت، يرجى تسجيل الخروج والدخول مرة أخرى.');
      setLoading(false);
      return;
    }

    if (!patientId) {
      alert('خطأ: لم يتم تحديد مريض لهذا التقرير.');
      setLoading(false);
      return;
    }

    try {
      const caseData = {
        patient: patientId,
        doctor: userInfo._id,
        diagnosis,
        specimen,
        grossDescription: gross,
        microscopicDescription: microscopic,
      };

      await api.post('/cases', caseData);
      alert('تم حفظ التقرير بنجاح!');
      navigate('/cases');
    } catch (error) {
      alert(error.response?.data?.message || 'فشل حفظ التقرير');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate(-1)} className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <ArrowRight size={18} /> عودة
      </button>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '20px' }}>إضافة تقرير جديد</h2>
        {patientId && <p style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>للمريض المفعّل حالياً</p>}
        
        <form onSubmit={submitHandler}>
          <div className="input-group">
            <label className="input-label">التشخيص (Diagnosis)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="اكتب التشخيص هنا..." 
              required 
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">العينة (Specimen)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="وصف العينة المستلمة" 
              required 
              value={specimen}
              onChange={(e) => setSpecimen(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">الوصف الظاهري (Gross Description)</label>
            <textarea 
              className="input-field" 
              rows={4} 
              placeholder="اكتب الوصف الظاهري..."
              required
              value={gross}
              onChange={(e) => setGross(e.target.value)}
            ></textarea>
          </div>

          <div className="input-group">
            <label className="input-label">الوصف الميكروسكوبي (Microscopic Description)</label>
            <textarea 
              className="input-field" 
              rows={4} 
              placeholder="اكتب الوصف الميكروسكوبي..."
              required
              value={microscopic}
              onChange={(e) => setMicroscopic(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', width: '100%', justifyContent: 'center' }}>
            <Save size={18} /> {loading ? 'جاري الحفظ...' : 'حفظ وعرض التقرير'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCaseScreen;
