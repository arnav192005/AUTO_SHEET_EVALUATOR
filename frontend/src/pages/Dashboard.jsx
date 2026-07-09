import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, AlertCircle, CheckCircle2, TrendingUp, X, Users, BookOpen, ThumbsDown } from 'lucide-react';
import { AppApi } from '../api/client';
import ThemeToggle from '../components/ThemeToggle';
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
        boxShadow: '0 8px 16px var(--border-glass)',
        transition: 'transform var(--transition-normal)'
      }}
    />
  </div>
);

const Dashboard = () => {
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);
  const [stats, setStats] = useState({
    totalGraded: 0,
    autoApproved: 0,
    needsReview: 0,
    averageScore: 0
  });

  const [reevalRequests, setReevalRequests] = useState([
    { id: 'R-001', student: 'Arjun M.', subject: 'Computer Science 101', testId: 'T-001', reason: 'Q4 marked wrong but answer matches key', status: 'Pending', date: 'Oct 28, 2023' },
    { id: 'R-002', student: 'Sonia K.', subject: 'Advanced Mathematics', testId: 'T-002', reason: 'Calculation step marks not given', status: 'Pending', date: 'Oct 29, 2023' }
  ]);

  const [insights, setInsights] = useState({
    topPerformers: ['Arnav (98%)', 'Riya (95%)', 'Kabir (92%)'],
    weakTopics: ['Calculus - Integration (Q4)', 'Data Structures - Graphs (Q2)']
  });

  useEffect(() => {
    // Attempt to fetch from real API (fallback to mock if it fails/returns null)
    AppApi.getRecentBatches().then(data => {
      if (data && data.length > 0) {
        setBatches(data);
      }
    });
    
    AppApi.getDashboardStats().then(data => {
      if (data) {
        setStats(data);
      }
    });

    // Just to verify backend connection with schema previews
    AppApi.getPreviewExam().then(exam => console.log('Backend connected, preview exam:', exam));
  }, []);

  return (
    <div className="dashboard-container animate-fade-in">
      <header className="page-header">
        <div>
          <h1>Welcome back, Arnav</h1>
          <p className="subtitle">Here's what's happening with your evaluations today.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <ThemeToggle />
          <button className="btn-primary" onClick={() => navigate('/upload')}>
            <FileText size={18} />
            New Evaluation Batch
          </button>
        </div>
      </header>

      <section className="stats-grid">
        <StatCard title="Total Graded Sheets" value={stats.totalGraded.toLocaleString()} icon={FileText} trend="+12% this week" colorClass="icon-blue" delay="delay-1" />
        <StatCard title="Auto-Approved" value={stats.autoApproved.toLocaleString()} icon={CheckCircle2} trend="86.7% rate" colorClass="icon-green" delay="delay-2" />
        <StatCard title="Needs Review" value={stats.needsReview.toLocaleString()} icon={AlertCircle} trend="-5% this week" colorClass="icon-orange" delay="delay-3" />
        <PieChartCard title="Average Score" value={`${stats.averageScore}%`} percentage={stats.averageScore} trend="+2.1% avg" delay="delay-3" onClick={() => setChartModalOpen(true)} />
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
              {batches.map((batch, idx) => (
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        {/* Re-evaluation Requests Section */}
        <section className="glass-panel animate-fade-in delay-4">
          <div className="section-header">
            <h2>Re-evaluation Requests</h2>
            <span className="badge badge-status-processing">{reevalRequests.length} Pending</span>
          </div>
          
          <div className="table-responsive">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reevalRequests.map((req) => (
                  <tr key={req.id}>
                    <td className="font-semibold">{req.student}</td>
                    <td>{req.subject}</td>
                    <td className="text-muted" style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={req.reason}>
                      {req.reason}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '4px 8px', borderColor: 'var(--success-color)', color: 'var(--success-color)' }} 
                          onClick={() => alert(`Reviewing ${req.id}`)}
                          title="Approve"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '4px 8px', borderColor: 'var(--error-color)', color: 'var(--error-color)' }} 
                          onClick={() => alert(`Dismissing ${req.id}`)}
                          title="Dismiss"
                        >
                          <ThumbsDown size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Class Insights Section */}
        <section className="glass-panel animate-fade-in delay-5" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="section-header" style={{ marginBottom: 0 }}>
            <h2>Class Insights</h2>
          </div>
          
          <div className="stat-card" style={{ background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--success-color)' }}>
              <Users size={20} />
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Top Performers</h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-primary)' }}>
              {insights.topPerformers.map((performer, idx) => (
                <li key={idx} style={{ marginBottom: '5px' }}>{performer}</li>
              ))}
            </ul>
          </div>

          <div className="stat-card" style={{ background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--warning-color)' }}>
              <AlertCircle size={20} />
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Weak Topics (Needs Attention)</h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-primary)' }}>
              {insights.weakTopics.map((topic, idx) => (
                <li key={idx} style={{ marginBottom: '5px' }}>{topic}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>

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
