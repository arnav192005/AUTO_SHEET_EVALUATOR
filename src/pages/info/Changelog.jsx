import React from 'react';
import InfoLayout from '../../components/InfoLayout';

const Changelog = () => {
  return (
    <InfoLayout title="Changelog">
      <p>Stay up to date with the latest improvements to the ScribScore engine.</p>
      
      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ paddingLeft: '1.5rem', borderLeft: '2px solid var(--accent-primary)' }}>
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>v2.4.0 - Mathematical Step Evaluation</h3>
          <span style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 'bold' }}>October 2026</span>
          <p style={{ marginTop: '1rem' }}>Our semantic engine now natively understands mathematical derivations, assigning automated partial credit for standard algorithmic steps.</p>
        </div>
        
        <div style={{ paddingLeft: '1.5rem', borderLeft: '2px solid var(--border-glass)' }}>
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>v2.3.1 - Enhanced OCR Performance</h3>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', fontWeight: 'bold' }}>September 2026</span>
          <p style={{ marginTop: '1rem' }}>Decreased processing time by 40% for large batch uploads (100+ answer sheets) while maintaining 98.5% confidence thresholds.</p>
        </div>
        
        <div style={{ paddingLeft: '1.5rem', borderLeft: '2px solid var(--border-glass)' }}>
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>v2.2.0 - LTI 1.3 Launch</h3>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', fontWeight: 'bold' }}>August 2026</span>
          <p style={{ marginTop: '1rem' }}>Full rollout of our LTI 1.3 compliance, enabling seamless single-sign-on (SSO) and roster sync for Canvas and Blackboard.</p>
        </div>
      </div>
    </InfoLayout>
  );
};
export default Changelog;
