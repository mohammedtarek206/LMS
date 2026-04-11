import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Printer, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import api from '../api';

const CaseDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseItem, setCaseItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const { data } = await api.get(`/cases/${id}`);
        setCaseItem(data);
      } catch (error) {
        console.error('Error fetching case:', error);
        alert('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [id]);

  const generatePDF = () => {
    if (!caseItem) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(13, 148, 136); // Teal color
    doc.text('Viga Lab', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Pathology Report', 105, 30, { align: 'center' });
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text('Patient Name:', 20, 50);
    doc.text('Report Date:', 120, 50);
    doc.text('Treating Doctor:', 20, 60);
    doc.text('Lab Doctor:', 120, 60);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`${caseItem.patient?.name || 'Unknown'}`, 50, 50);
    doc.text(`${new Date(caseItem.createdAt).toLocaleDateString()}`, 150, 50);
    doc.text(`${caseItem.patient?.referringDoctor || 'N/A'}`, 50, 60);
    doc.text(`Hany Khatab`, 150, 60);
    
    doc.line(20, 70, 190, 70);

    let y = 85;
    const sections = [
      { title: 'Specimen', content: caseItem.specimen },
      { title: 'Gross Description', content: caseItem.grossDescription },
      { title: 'Microscopic Description', content: caseItem.microscopicDescription },
      { title: 'Diagnosis', content: caseItem.diagnosis }
    ];

    sections.forEach(section => {
      doc.setFontSize(13);
      doc.setTextColor(13, 148, 136);
      doc.text(section.title, 20, y);
      y += 8;
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      const splitText = doc.splitTextToSize(section.content || '', 170);
      doc.text(splitText, 20, y);
      y += (splitText.length * 6) + 10;
    });

    doc.line(140, 250, 190, 250);
    doc.setFontSize(11);
    doc.text('Hany Khatab', 165, 257, { align: 'center' });
    doc.setFontSize(9);
    doc.text('Lab Doctor', 165, 262, { align: 'center' });
    doc.save(`Report_${caseItem.patient?.name || 'Case'}.pdf`);
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  if (!caseItem) return <div style={{ padding: '20px', textAlign: 'center' }}>Report not found</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => navigate(-1)} className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowRight size={18} /> Back to Reports
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={generatePDF} className="btn" style={{ background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>

      <div className="card print-area" style={{ maxWidth: '850px', margin: '0 auto', background: '#fff', padding: '40px', border: '1px solid #eee' }}>
        {/* Header Section */}
        <div style={{ borderBottom: '3px solid var(--primary-color)', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ color: 'var(--primary-color)', margin: 0, fontSize: '32px', letterSpacing: '1px' }}>VIGA LAB</h1>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Advanced Medical Analysis Center</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: 0, color: '#334155', fontSize: '20px' }}>Pathology Report</h2>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px' }}>Electronic Verification Enabled</p>
          </div>
        </div>

        {/* Patient Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div>
            <div style={{ marginBottom: '10px' }}><span style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Patient Name</span><br/><strong style={{ fontSize: '16px' }}>{caseItem.patient?.name}</strong></div>
            <div><span style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Treating Doctor</span><br/><strong style={{ fontSize: '16px' }}>{caseItem.patient?.referringDoctor || 'N/A'}</strong></div>
          </div>
          <div>
            <div style={{ marginBottom: '10px' }}><span style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Report Date</span><br/><strong style={{ fontSize: '16px' }}>{new Date(caseItem.createdAt).toLocaleDateString()}</strong></div>
            <div><span style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Lab Doctor</span><br/><strong style={{ fontSize: '16px' }}>Hany Khatab</strong></div>
          </div>
        </div>

        {/* Report Content */}
        <div style={{ color: '#1e293b' }}>
          {[
            { label: 'Specimen', value: caseItem.specimen },
            { label: 'Gross Description', value: caseItem.grossDescription },
            { label: 'Microscopic Description', value: caseItem.microscopicDescription },
            { label: 'Diagnosis', value: caseItem.diagnosis }
          ].map((section, idx) => (
            <div key={idx} style={{ marginBottom: '30px' }}>
              <h4 style={{ 
                background: '#f1f5f9', 
                padding: '8px 15px', 
                borderRadius: '4px', 
                borderLeft: '4px solid var(--primary-color)',
                color: 'var(--primary-color)',
                fontSize: '16px',
                marginBottom: '10px',
                textTransform: 'uppercase'
              }}>
                {section.label}
              </h4>
              <p style={{ padding: '0 15px', lineHeight: '1.7', fontSize: '15px', whiteSpace: 'pre-wrap' }}>
                {section.value}
              </p>
            </div>
          ))}
        </div>

        {/* Signature Area - Right Aligned */}
        <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'center', width: '250px' }}>
            <div style={{ borderTop: '2px solid #334155', paddingTop: '10px' }}>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px', color: '#1e293b' }}>Hany Khatab</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Lab Doctor</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CaseDetailsScreen;
