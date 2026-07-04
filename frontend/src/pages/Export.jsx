import { Download, FileDown } from 'lucide-react';
import './Dashboard.css'; // Reusing dashboard styles for layout

const Export = () => {
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
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
          This feature is currently in development. Soon you'll be able to export grades directly to CSV, Excel, or sync with Canvas/Moodle.
        </p>
        <button className="btn-primary" onClick={() => alert('Download mock initiated!')}>
          <Download size={18} /> Download Sample CSV
        </button>
      </section>
    </div>
  );
};

export default Export;
