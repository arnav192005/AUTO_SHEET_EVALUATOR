import React from 'react';
import InfoLayout from '../../components/InfoLayout';

const Blog = () => {
  return (
    <InfoLayout title="ScribScore Blog">
      <p>Insights on AI in education, engineering challenges, and product updates.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
        <div style={{ cursor: 'pointer' }}>
          <div style={{ height: '200px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '1rem', border: '1px solid var(--border-glass)' }}></div>
          <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.5rem' }}>How we achieved 98% accuracy on cursive OCR</h4>
          <p style={{ fontSize: '0.9rem' }}>A deep dive into our multimodal architecture and training dataset synthesis.</p>
        </div>
        
        <div style={{ cursor: 'pointer' }}>
          <div style={{ height: '200px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '1rem', border: '1px solid var(--border-glass)' }}></div>
          <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.5rem' }}>The ethical implications of AI grading</h4>
          <p style={{ fontSize: '0.9rem' }}>How we ensure fairness, remove bias, and keep humans in the loop.</p>
        </div>
      </div>
    </InfoLayout>
  );
};
export default Blog;\n