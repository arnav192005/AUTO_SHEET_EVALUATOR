import { Download, FileDown, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import './Dashboard.css';

const Export = () => {
  const [examId, setExamId] = useState('1');
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/exams/${examId}/export`);
      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exam_${examId}_results.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export error:", err);
      setError("Failed to export grades. Ensure the backend is running and the exam ID is correct.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="dashboard-container animate-fade-in">
      <header className="page-header">
        <div>
          <h1>Export Grades</h1>
          <p className="subtitle">Download evaluation results for your records or LMS.</p>
        </div>
      </header>

      <section className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
        <FileDown size={64} className="text-accent" style={{ margin: '0 auto 1.5rem auto' }} />
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem' }}>Data Export System</h2>
        
        <div style={{ maxWidth: '400px', margin: '0 auto 2rem auto', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Exam ID to Export:</label>
          <input 
            type="number" 
            value={examId} 
            onChange={(e) => setExamId(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)', 
              background: 'var(--bg-primary)', 
              color: 'var(--text-primary)',
              marginBottom: '1rem'
            }}
          />
          {error && (
            <div style={{ color: 'var(--error-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '1rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}
        </div>

        <button 
          className="btn-primary" 
          onClick={handleExport} 
          disabled={isExporting}
          style={{ width: '200px', margin: '0 auto' }}
        >
          {isExporting ? 'Exporting...' : <><Download size={18} /> Download CSV</>}
        </button>
      </section>
    </div>
  );
};

export default Export;
