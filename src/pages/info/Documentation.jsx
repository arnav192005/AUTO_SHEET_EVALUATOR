import React from 'react';
import InfoLayout from '../../components/InfoLayout';

const Documentation = () => {
  return (
    <InfoLayout title="Documentation & API">
      <p>Welcome to the ScribScore developer documentation. Here you'll find everything you need to integrate our grading engine into your own institutional software.</p>
      
      <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px', marginTop: '2rem' }}>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>REST API v2.0</h3>
        <p>Our REST API allows programmatic access to the evaluation queue, rubric definitions, and OCR results.</p>
        <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', color: '#a0aec0', marginTop: '1rem' }}>
          <code>
            GET /api/v2/evaluations/batch_id<br/>
            Authorization: Bearer sk_test_12345
          </code>
        </pre>
      </div>
      
      <p style={{ marginTop: '2rem' }}>For full API references, SDK downloads, and webhook configurations, please access your developer dashboard after creating an account.</p>
    </InfoLayout>
  );
};
export default Documentation;\n