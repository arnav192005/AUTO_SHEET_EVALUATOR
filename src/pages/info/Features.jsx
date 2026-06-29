import React from 'react';
import InfoLayout from '../../components/InfoLayout';
import { Layers, ScanText, BarChart3, Bot } from 'lucide-react';

const Features = () => {
  return (
    <InfoLayout title="Features & Capabilities">
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--text-primary)' }}>
        ScribScore represents the next generation of academic evaluation. Our AI models are specifically designed to handle the complexities of human handwriting and open-ended answers.
      </p>
      
      <div style={{ display: 'grid', gap: '2rem', marginTop: '2rem' }}>
        <div>
          <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><ScanText className="text-primary"/> Multimodal OCR System</h3>
          <p>Unlike traditional OCR that struggles with cursive or mathematical notation, our vision models parse structured equations, diagrams, and messy handwriting with 98% accuracy.</p>
        </div>
        <div>
          <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><Bot className="text-primary"/> Semantic Grading</h3>
          <p>ScribScore doesn't just look for exact keyword matches. It understands the semantic meaning of an answer. If a student explains a concept correctly using different words, they get full credit.</p>
        </div>
        <div>
          <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><Layers className="text-primary"/> Step-by-Step Evaluation</h3>
          <p>For subjects like Mathematics and Physics, our system follows the logical progression of the student's work, assigning partial credit for correct steps even if the final conclusion is flawed.</p>
        </div>
        <div>
          <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><BarChart3 className="text-primary"/> Granular Analytics</h3>
          <p>Automatically generate class-wide performance matrices. Identify which specific concepts the class struggled with, enabling targeted review sessions.</p>
        </div>
      </div>
    </InfoLayout>
  );
};
export default Features;
