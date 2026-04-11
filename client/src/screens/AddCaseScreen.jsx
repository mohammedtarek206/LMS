import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
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
      alert('Session expired, please logout and login again.');
      setLoading(false);
      return;
    }

    if (!patientId) {
      alert('Error: No patient selected for this report.');
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
      alert('Report saved successfully!');
      navigate('/cases');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate(-1)} className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <ArrowRight size={18} /> Back
      </button>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '20px' }}>Add New Report</h2>
        {patientId && <p style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>For the currently active patient</p>}
        
        <form onSubmit={submitHandler}>
          <div className="input-group">
            <label className="input-label">Specimen</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Description of the specimen received" 
              required 
              value={specimen}
              onChange={(e) => setSpecimen(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Gross Description</label>
            <textarea 
              className="input-field" 
              rows={4} 
              placeholder="Enter gross description..."
              required
              value={gross}
              onChange={(e) => setGross(e.target.value)}
            ></textarea>
          </div>

          <div className="input-group">
            <label className="input-label">Microscopic Description</label>
            <textarea 
              className="input-field" 
              rows={4} 
              placeholder="Enter microscopic description..."
              required
              value={microscopic}
              onChange={(e) => setMicroscopic(e.target.value)}
            ></textarea>
          </div>

          <div className="input-group">
            <label className="input-label">Diagnosis</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter diagnosis here..." 
              required 
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', width: '100%', justifyContent: 'center' }}>
            <Plus size={18} /> {loading ? 'Saving...' : 'Save & View Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCaseScreen;
