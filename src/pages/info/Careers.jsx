import React from 'react';
import InfoLayout from '../../components/InfoLayout';

const Careers = () => {
  return (
    <InfoLayout title="Careers">
      <p>Help us build the future of education technology. We're a remote-first team tackling some of the hardest problems in computer vision and natural language processing.</p>
      
      <h3 style={{ color: 'white', marginTop: '3rem', marginBottom: '1.5rem' }}>Open Roles</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem' }}>Senior Machine Learning Engineer (Vision)</h4>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Remote (US/Canada)</span>
          </div>
          <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Apply</button>
        </div>
        
        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem' }}>Full Stack Engineer (React/Node)</h4>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Remote (Global)</span>
          </div>
          <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Apply</button>
        </div>
        
        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem' }}>Developer Advocate</h4>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Remote (Europe)</span>
          </div>
          <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Apply</button>
        </div>
      </div>
    </InfoLayout>
  );
};
export default Careers;\n