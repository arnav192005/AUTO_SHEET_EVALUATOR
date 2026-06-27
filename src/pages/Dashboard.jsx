import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, AlertCircle, CheckCircle2, TrendingUp, X } from 'lucide-react';
import './Dashboard.css';

const StatCard = ({ title, value, icon: Icon, trend, colorClass, delay }) => (
  <div className={`stat-card glass-panel animate-fade-in ${delay} card-hover`}>
    <div className="stat-header">
      <div className={`stat-icon-wrapper ${colorClass}`}>
        <Icon size={24} />
      </div>
      <span className="stat-trend">{trend}</span>
    </div>
    <div className="stat-body">
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  </div>
);

const PieChartCard = ({ title, value, percentage, trend, delay, onClick }) => (
  <div 
    className={`stat-card glass-panel animate-fade-in ${delay} card-hover`} 
    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', cursor: 'pointer' }}
    onClick={onClick}
  >
    <div className="stat-body" style={{ flex: 1 }}>
      <div className="stat-header" style={{ marginBottom: '1rem' }}>
        <span className="stat-trend">{trend}</span>
      </div>
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
    <div 
      className="pie-chart" 
      style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        border: '1px solid var(--border-color)',
        background: `conic-gradient(var(--accent-primary) ${percentage}%, rgba(255, 255, 255, 0.1) 0)`,
        boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.5)',
        transition: 'transform var(--transition-fast)'
      }}
    />
  </div>
);

const Dashboard = () => {
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const navigate = useNavigate();

  const recentBatches = [
    { id: 'BCH-089', subject: 'Computer Science 101', date: 'Oct 24, 2023', total: 120, status: 'Completed', progress: 100 },
    { id: 'BCH-090', subject: 'Advanced Mathematics', date: 'Oct 25, 2023', total: 85, status: 'Needs Review', progress: 92 },
    { id: 'BCH-091', subject: 'Physics Midterm', date: 'Oct 26, 2023', total: 200, status: 'Processing', progress: 45 },
  ];

  return (
    <div className="dashboard-container animate-fade-in">
      <header className="page-header">
        <div>
          <h1>Welcome back, Professor</h1>
          <p className="subtitle">Here's what's happening with your evaluations today.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/upload')}>
          <FileText size={18} />
          New Evaluation Batch
        </button>
      </header>

      <section className="stats-grid">
        <StatCard title="Total Graded Sheets" value="1,248" icon={FileText} trend="+12% this week" colorClass="icon-blue" delay="delay-1" />
        <StatCard title="Auto-Approved" value="1,082" icon={CheckCircle2} trend="86.7% rate" colorClass="icon-green" delay="delay-2" />
        <StatCard title="Needs Review" value="166" icon={AlertCircle} trend="-5% this week" colorClass="icon-orange" delay="delay-3" />
        <PieChartCard title="Average Score" value="78.4%" percentage={78.4} trend="+2.1% avg" delay="delay-3" onClick={() => setChartModalOpen(true)} />
      </section>

      <section className="recent-activity glass-panel animate-fade-in delay-3">
        <div className="section-header">
          <h2>Recent Evaluation Batches</h2>
          <button className="btn-secondary" onClick={() => navigate('/review')}>View All</button>
        </div>
        
        <div className="table-responsive">
          <table className="activity-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Sheets</th>
                <th>Status</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {recentBatches.map((batch, idx) => (
                <tr key={batch.id} style={{ animationDelay: `${0.4 + idx * 0.1}s` }} className="animate-fade-in">
                  <td className="font-mono">{batch.id}</td>
                  <td className="font-semibold">{batch.subject}</td>
                  <td className="text-muted">{batch.date}</td>
                  <td>{batch.total}</td>
                  <td>
                    <span className={`badge badge-status-${batch.status.toLowerCase().replace(' ', '-')}`}>
                      {batch.status}
                    </span>
                  </td>
                  <td>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${batch.progress}%`
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {chartModalOpen && (
        <div className="modal-overlay animate-fade-in" onClick={() => setChartModalOpen(false)} style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="glass-panel" onClick={e => e.stopPropagation()} style={{
            padding: '2rem', maxWidth: '400px', width: '100%', backgroundColor: 'var(--bg-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)' }}>Score Breakdown</h2>
              <button onClick={() => setChartModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span>A (90-100)</span>
                <strong>25%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span>B (80-89)</span>
                <strong>40%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span>C (70-79)</span>
                <strong>20%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span>D (60-69)</span>
                <strong>10%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>F (&lt;60)</span>
                <strong>5%</strong>
              </div>
            </div>
            
            <button className="btn-primary" style={{ width: '100%', marginTop: '2rem' }} onClick={() => setChartModalOpen(false)}>
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
