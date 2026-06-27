import React from 'react';
import InfoLayout from '../../components/InfoLayout';

const About = () => {
  return (
    <InfoLayout title="About Us">
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--text-primary)' }}>
        Our mission is to give educators their time back.
      </p>
      <p>
        Grading open-ended assessments is one of the most critical, yet time-consuming tasks in education. Teachers spend an average of 15 hours a week grading, time that could be spent preparing better lessons or engaging with students one-on-one.
      </p>
      <p style={{ marginTop: '1rem' }}>
        ScribScore was founded by a team of machine learning researchers and former educators who saw the potential for AI to handle the mechanical aspects of evaluation. We believe AI shouldn't replace teachers; it should augment them. By automating the objective scoring and partial-credit assignments, we allow teachers to focus on the subjective, high-level feedback that truly impacts student growth.
      </p>
      <p style={{ marginTop: '1rem' }}>
        Today, ScribScore processes millions of answer sheets globally, serving institutions ranging from local high schools to top-tier universities.
      </p>
    </InfoLayout>
  );
};
export default About;\n