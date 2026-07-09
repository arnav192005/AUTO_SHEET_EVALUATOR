import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Award, Clock, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-glass)',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{label}</p>
        <p style={{ margin: 0, color: 'var(--accent-primary)' }}>
          Score: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const StudentDashboard = () => {
  const navigate = useNavigate();

  // Mock data for the chart
  const progressData = [
    { name: 'Test 1', score: 65 },
    { name: 'Test 2', score: 72 },
    { name: 'Midterm', score: 85 },
    { name: 'Test 4', score: 82 },
    { name: 'Test 5', score: 92 },
    { name: 'Final', score: 88 }
  ];

  const recentTests = [
    { id: 'T-004', subject: 'Data Structures', date: 'Nov 02, 2023', score: '88/100', status: 'Graded' },
    { id: 'T-003', subject: 'Physics Midterm', date: 'Oct 26, 2023', score: 'Pending', status: 'Processing' },
    { id: 'T-002', subject: 'Advanced Mathematics', date: 'Oct 25, 2023', score: '85/100', status: 'Graded' },
  ];

  return (
    <div className="dashboard-container animate-fade-in">
      <header className="page-header">
        <div>
          <h1>Welcome back, Student</h1>
          <p className="subtitle">Here's your recent performance and pending evaluations.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <ThemeToggle />
          <button className="btn-primary" onClick={() => navigate('/results')}>
            <FileText size={18} />
            View All Results
          </button>
        </div>
      </header>

      <section className="stats-grid">
        <StatCard title="Tests Taken" value="24" icon={FileText} trend="+2 this month" colorClass="icon-blue" delay="delay-1" />
        <StatCard title="Average Score" value="88%" icon={Award} trend="+3.2% vs last term" colorClass="icon-green" delay="delay-2" />
        <StatCard title="Pending Results" value="1" icon={Clock} trend="Physics Midterm" colorClass="icon-orange" delay="delay-3" />
        
        {/* Top Subject Highlight */}
        <div className={`stat-card glass-panel animate-fade-in delay-3 card-hover`} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div className="stat-body" style={{ flex: 1 }}>
            <div className="stat-header" style={{ marginBottom: '0.5rem' }}>
              <span className="stat-trend" style={{ color: 'var(--accent-primary)' }}>Top Subject</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Computer Science</h3>
            <p>94% Average</p>
          </div>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '4px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
            A+
          </div>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginTop: '20px' }}>
        
        {/* Progress Chart */}
        <section className="glass-panel animate-fade-in delay-2" style={{ padding: '20px' }}>
          <div className="section-header" style={{ marginBottom: '20px' }}>
            <h2>Performance Growth</h2>
          </div>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--text-secondary)" 
                  tick={{ fill: 'var(--text-secondary)' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="var(--text-secondary)" 
                  tick={{ fill: 'var(--text-secondary)' }} 
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="var(--accent-primary)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--accent-primary)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#fff', stroke: 'var(--accent-primary)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="recent-activity glass-panel animate-fade-in delay-3" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div className="section-header" style={{ marginBottom: '15px' }}>
            <h2>Recent Tests</h2>
            <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => navigate('/results')}>
              See All <ArrowRight size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
            {recentTests.map((test) => (
              <div key={test.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid var(--border-glass)' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{test.subject}</h4>
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>{test.date} • {test.id}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                  <span style={{ fontWeight: 'bold' }}>{test.score}</span>
                  <span className={`badge badge-status-${test.status.toLowerCase().replace(' ', '-')}`} style={{ padding: '2px 6px', fontSize: '0.7rem' }}>
                    {test.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default StudentDashboard;
