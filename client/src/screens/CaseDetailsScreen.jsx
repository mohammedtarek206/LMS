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
        alert('فشل في تحميل بيانات التقرير');
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
    doc.text('Figa Lab', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Pathology Report', 105, 30, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Patient: ${caseItem.patient?.name || 'Unknown'}`, 20, 50);
    doc.text(`Referring Doctor: ${caseItem.patient?.referringDoctor || 'N/A'}`, 20, 57);
    doc.text(`Lab Doctor: Hany Khatab`, 20, 64);
    doc.text(`Date: ${new Date(caseItem.createdAt).toLocaleDateString()}`, 20, 71);
    
    doc.setFontSize(12);

    doc.setLineWidth(0.5);
    doc.line(20, 80, 190, 80);
    doc.setFontSize(14);
    doc.text('Diagnosis:', 20, 95);
    doc.setFontSize(12);
    doc.text(caseItem.diagnosis, 20, 105);
    doc.text('Gross Description:', 20, 125);
    doc.text(caseItem.grossDescription, 20, 135);
    doc.text('Microscopic Description:', 20, 155);
    doc.text(caseItem.microscopicDescription, 20, 165);
    doc.text('_________________________', 140, 250);
    doc.setFontSize(10);
    doc.text('Hany Khatab', 140, 260);
    doc.text('Lab Doctor', 140, 267);
    doc.save(`Report_${caseItem.patient?.name || 'Case'}.pdf`);
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>جاري التحميل...</div>;
  if (!caseItem) return <div style={{ padding: '20px', textAlign: 'center' }}>التقرير غير موجود</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => navigate(-1)} className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowRight size={18} /> عودة للتقارير
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => window.print()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={18} /> طباعة
          </button>
          <button onClick={generatePDF} className="btn" style={{ background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} /> تحميل PDF
          </button>
        </div>
      </div>

      <div className="card print-area" style={{ maxWidth: '800px', margin: '0 auto', background: '#fff' }}>
        <div style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px' }}>
          <div className="print-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '200px' }}></div> {/* Spacer for balance */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <h1 style={{ color: '#000', margin: 0, fontSize: '28px' }}>فيحا لاب</h1>
              <h2 style={{ color: '#000', margin: '5px 0', fontSize: '20px' }}>Figa Lab</h2>
              <span style={{ color: '#666', fontSize: '14px' }}>تقرير باثولوجي (Pathology Report)</span>
            </div>
            <div style={{ width: '200px' }}></div>
          </div>
        </div>


        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px', color: '#000', textAlign: 'right' }}>
          <div><strong>تاريخ التقرير:</strong> {new Date(caseItem.createdAt).toLocaleDateString()}</div>
          <div style={{ textAlign: 'right' }}><strong>اسم المريض:</strong> {caseItem.patient?.name}</div>
          <div><strong>العينة (Specimen):</strong> {caseItem.specimen}</div>
          <div style={{ textAlign: 'right' }}><strong>الطبيب المعالج:</strong> {caseItem.patient?.referringDoctor}</div>
          <div><strong>دكتـور المعمل:</strong> Hany Khatab</div>
        </div>

        <div style={{ color: '#000', textAlign: 'right' }}>
          <h4 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginTop: '20px' }}>التشخيص (Diagnosis)</h4>
          <p style={{ margin: '15px 0' }}>{caseItem.diagnosis}</p>

          <h4 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginTop: '30px' }}>الوصف الظاهري (Gross Description)</h4>
          <p style={{ margin: '15px 0' }}>{caseItem.grossDescription}</p>

          <h4 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginTop: '30px' }}>الوصف الميكروسكوبي (Microscopic)</h4>
          <p style={{ margin: '15px 0' }}>{caseItem.microscopicDescription}</p>
        </div>
        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end', textAlign: 'center', color: '#000' }}>
          <div style={{ width: '250px' }}>
            <div style={{ borderBottom: '1px solid #000', marginBottom: '10px' }}></div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Hany Khatab</div>
            <div style={{ fontSize: '12px', marginTop: '5px' }}>دكتور المعمل (Lab Doctor)</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CaseDetailsScreen;
