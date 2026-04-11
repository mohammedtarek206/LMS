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

  const filteredCases = cases.filter(c => {
    if (!caseSearchTerm.trim()) return true;
    const term = caseSearchTerm.toLowerCase();
    return (
      c.diagnosis?.toLowerCase().includes(term) ||
      c.specimen?.toLowerCase().includes(term) ||
      c.grossDescription?.toLowerCase().includes(term) ||
      c.microscopicDescription?.toLowerCase().includes(term)
    );
  });

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this patient?')) {
      try {
        await api.delete(`/patients/${id}`);
        alert('Patient deleted successfully.');
        navigate('/patients');
      } catch (error) {
        alert('Error occurred during deletion');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/patients/${id}`, patient);
      setPatient(data);
      setIsEditMode(false);
      alert('Information updated successfully.');
    } catch (error) {
      alert('Update failed');
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading patient profile...</div>;
  if (!patient) return <div style={{ padding: '20px', textAlign: 'center' }}>Patient not found.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => navigate(-1)} className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowRight size={18} /> Back to Patients
        </button>
        
        <button onClick={handleDelete} className="btn" style={{ background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trash2 size={18} /> Delete Patient
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
                <span style={{ color: 'var(--text-secondary)' }}>National ID: {patient.nationalId}</span>
              </div>
              
              <div style={{ padding: '15px 0', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>Age</strong>
                <span>{patient.age} years</span>
              </div>
              <div style={{ padding: '15px 0', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>Gender</strong>
                <span>{patient.gender === 'Male' ? 'Male' : 'Female'}</span>
              </div>
              <div style={{ padding: '15px 0', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>Registration Date</strong>
                <span>{new Date(patient.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ padding: '15px 0', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>Treating Doctor</strong>
                <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{patient.referringDoctor || 'Not specified'}</span>
              </div>
              <div style={{ padding: '15px 0', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>Phone Number</strong>
                <span style={{ direction: 'ltr', textAlign: 'left' }}>{patient.phone || <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Not registered</span>}</span>
              </div>
              <div style={{ padding: '15px 0', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>Price</strong>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>
                  {patient.price ? `${Number(patient.price).toLocaleString()} EGP` : <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Not specified</span>}
                </span>
              </div>
              
              <button 
                onClick={() => setIsEditMode(true)}
                className="btn" 
                style={{ width: '100%', background: 'var(--warning)', marginTop: '20px', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Edit size={16} /> Edit Information
              </button>
            </>
          ) : (
            <form onSubmit={handleUpdate}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3>Edit Information</h3>
                <button type="button" onClick={() => setIsEditMode(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div className="input-group">
                <label className="input-label">Name</label>
                <input type="text" className="input-field" value={patient.name} onChange={e => setPatient({...patient, name: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">National ID</label>
                <input type="text" className="input-field" value={patient.nationalId} onChange={e => setPatient({...patient, nationalId: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Age</label>
                <input type="number" className="input-field" value={patient.age} onChange={e => setPatient({...patient, age: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Treating Doctor</label>
                <input type="text" className="input-field" value={patient.referringDoctor || ''} onChange={e => setPatient({...patient, referringDoctor: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input type="tel" className="input-field" placeholder="Phone Number" value={patient.phone || ''} onChange={e => setPatient({...patient, phone: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Price (EGP)</label>
                <input type="number" className="input-field" placeholder="0" min="0" value={patient.price || ''} onChange={e => setPatient({...patient, price: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Save size={16} /> Save
              </button>
            </form>
          )}
        </div>

        {/* Medical History Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Medical History & Reports</h3>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search diagnoses..." 
                value={caseSearchTerm}
                onChange={e => setCaseSearchTerm(e.target.value)}
                style={{ marginBottom: 0, paddingRight: '35px' }}
              />
              <FileText size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            </div>
            <button onClick={() => navigate(`/cases/new/${patient._id}`)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
              Add Report
            </button>
          </div>


          <div className="card table-wrapper">
            {cases.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No previous reports for this patient.</p>
            ) : filteredCases.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>
                No results found for “{caseSearchTerm}”
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Report Date</th>
                    <th>Diagnosis</th>
                    <th>Treating Doctor</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.map(c => (
                    <tr key={c._id}>
                      <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 'bold' }}>{c.diagnosis}</td>
                      <td>{patient.referringDoctor || 'External Doctor'}</td>
                      <td>
                        <button onClick={() => navigate(`/cases/${c._id}`)} className="btn" style={{ background: '#e0e7ff', color: '#4f46e5', fontSize: '12px' }}>Open Report</button>
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
