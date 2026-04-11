import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import api from '../api';

const CasesScreen = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const { data } = await api.get(`/cases?pageNumber=${currentPage}`);
        if (data && data.cases) {
          setCases(data.cases);
          setPages(data.pages || 1);
        } else {
          setCases(Array.isArray(data) ? data : []);
          setPages(1);
        }
      } catch (error) {
        console.error('Error fetching cases:', error);
        setCases([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, [currentPage]);

  const generatePDF = (caseItem) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('Viga Lab', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Pathology Report', 105, 30, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Patient: ${caseItem.patient?.name || 'Unknown'}`, 20, 50);
    doc.text(`Doctor: ${caseItem.doctor?.name || 'Staff'}`, 20, 57);
    doc.text(`Date: ${new Date(caseItem.createdAt).toLocaleDateString()}`, 20, 64);

    doc.setFontSize(10);
    doc.text('PROD. DR. HANY KHATAB', 190, 50, { align: 'right' });
    doc.text('DR. MAYA EL SERAFI', 190, 57, { align: 'right' });
    doc.setFontSize(12);

    doc.setLineWidth(0.5);
    doc.line(20, 75, 190, 75);
    doc.setFontSize(14);
    doc.text('Diagnosis:', 20, 90);
    doc.setFontSize(12);
    doc.text(caseItem.diagnosis, 20, 100);

    doc.text('_________________________', 140, 250);
    doc.setFontSize(10);
    doc.text('PROD. DR. HANY KHATAB', 140, 260);
    doc.text('DR. MAYA EL SERAFI', 140, 267);

    doc.save(`Report_${caseItem.patient?.name || 'Case'}.pdf`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Reports & Cases</h2>
        <button className="btn btn-primary" onClick={() => navigate('/cases/new')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> New Report
        </button>
      </div>

      <div className="card table-wrapper">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading cases...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Diagnosis</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No cases registered currently.</td></tr>
              ) : (
                cases.map((c) => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 'bold' }}>{c.patient?.name || 'Deleted Patient'}</td>
                    <td>{c.diagnosis}</td>
                    <td>{c.doctor?.name || 'System Doctor'}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => navigate(`/cases/${c._id}`)} className="btn" style={{ background: '#e0e7ff', color: '#4f46e5', fontSize: '12px' }}>View Details</button>
                      <button onClick={() => generatePDF(c)} className="btn" style={{ background: '#dcfce7', color: '#16a34a', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Download size={14} /> PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CasesScreen;
