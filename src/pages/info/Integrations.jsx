import React from 'react';
import InfoLayout from '../../components/InfoLayout';

const Integrations = () => {
  return (
    <InfoLayout title="LMS Integrations">
      <p>ScribScore seamlessly plugs into your existing tech stack, ensuring that grades automatically sync to your gradebook without manual data entry.</p>
      
      <ul style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <li>
          <h3 style={{ color: 'white' }}>Canvas by Instructure</h3>
          <p>Two-way sync with Canvas Assignments. Push evaluated rubrics and final scores directly to the Canvas Gradebook.</p>
        </li>
        <li>
          <h3 style={{ color: 'white' }}>Blackboard Learn</h3>
          <p>Full integration with Blackboard's LTI 1.3 standard. Launch ScribScore directly from your course modules.</p>
        </li>
        <li>
          <h3 style={{ color: 'white' }}>Moodle</h3>
          <p>Export evaluation data automatically to Moodle via our official plugin.</p>
        </li>
        <li>
          <h3 style={{ color: 'white' }}>Google Classroom</h3>
          <p>Import student rosters and push grades with a single click using the Google Classroom API.</p>
        </li>
      </ul>
    </InfoLayout>
  );
};
export default Integrations;\n