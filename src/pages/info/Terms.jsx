import React from 'react';
import InfoLayout from '../../components/InfoLayout';

const Terms = () => {
  return (
    <InfoLayout title="Terms of Service">
      <p>Last updated: October 2026</p>
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>1. Acceptance of Terms</h3>
        <p style={{ marginBottom: '1.5rem' }}>By accessing and using the ScribScore platform, you agree to be bound by these Terms of Service. If you are using the service on behalf of an institution, you represent that you have the authority to bind that institution to these terms.</p>
        
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>2. Service Level Agreement (SLA)</h3>
        <p style={{ marginBottom: '1.5rem' }}>ScribScore guarantees a 99.9% uptime for Enterprise customers. Scheduled maintenance windows will be communicated at least 48 hours in advance.</p>
        
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>3. Acceptable Use</h3>
        <p style={{ marginBottom: '1.5rem' }}>You may not reverse-engineer the ScribScore evaluation engine, attempt to extract the underlying models, or use the service for processing non-educational materials without prior written consent.</p>
      </div>
    </InfoLayout>
  );
};
export default Terms;
