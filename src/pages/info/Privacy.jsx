import React from 'react';
import InfoLayout from '../../components/InfoLayout';

const Privacy = () => {
  return (
    <InfoLayout title="Privacy Policy">
      <p>Last updated: October 2026</p>
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>1. Data Collection</h3>
        <p style={{ marginBottom: '1.5rem' }}>ScribScore processes educational records, including student answers, grades, and analytics. We only collect data that is strictly necessary for providing our evaluation services. We act as a Data Processor on behalf of the educational institutions (the Data Controllers).</p>
        
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>2. Data Usage & AI Training</h3>
        <p style={{ marginBottom: '1.5rem' }}><strong>We do not use customer data to train our foundational models.</strong> Any data processed through the ScribScore platform is siloed and used exclusively for the evaluation of that specific institution's exams. We will never sell student data or utilize it for targeted advertising.</p>
        
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>3. Retention Policies</h3>
        <p style={{ marginBottom: '1.5rem' }}>Answer sheets and generated reports are retained for the duration specified by the institution's contract. Upon termination, all records are cryptographically wiped from our servers within 30 days.</p>
      </div>
    </InfoLayout>
  );
};
export default Privacy;\n