import React from 'react';
import InfoLayout from '../../components/InfoLayout';

const Security = () => {
  return (
    <InfoLayout title="Security & Compliance">
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--text-primary)' }}>
        Enterprise-grade security is built into the foundation of ScribScore. We understand the sensitivity of academic records.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>SOC-2 Type II Compliant</h3>
          <p>We are independently audited annually to ensure our security controls, processing integrity, and confidentiality meet the strict criteria of the AICPA.</p>
        </div>
        
        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>FERPA Ready</h3>
          <p>Our platform architecture and data handling procedures are fully compliant with the Family Educational Rights and Privacy Act (FERPA).</p>
        </div>
        
        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>End-to-End Encryption</h3>
          <p>All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Encryption keys are managed securely via AWS KMS.</p>
        </div>
        
        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Role-Based Access</h3>
          <p>Strict RBAC ensures that only authorized educators can view specific class data, with full audit logging of all data access and modifications.</p>
        </div>
      </div>
    </InfoLayout>
  );
};
export default Security;
