import os

pages = {
    "Features": """
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
""",
    "Integrations": """
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
export default Integrations;
""",
    "Documentation": """
import React from 'react';
import InfoLayout from '../../components/InfoLayout';

const Documentation = () => {
  return (
    <InfoLayout title="Documentation & API">
      <p>Welcome to the ScribScore developer documentation. Here you'll find everything you need to integrate our grading system into your own institutional software.</p>
      
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
export default Documentation;
""",
    "Changelog": """
import React from 'react';
import InfoLayout from '../../components/InfoLayout';

const Changelog = () => {
  return (
    <InfoLayout title="Changelog">
      <p>Stay up to date with the latest improvements to the ScribScore platform.</p>
      
      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ paddingLeft: '1.5rem', borderLeft: '2px solid var(--accent-primary)' }}>
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>v2.4.0 - Mathematical Step Evaluation</h3>
          <span style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 'bold' }}>October 2026</span>
          <p style={{ marginTop: '1rem' }}>Our semantic system now natively understands mathematical derivations, assigning automated partial credit for standard algorithmic steps.</p>
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
""",
    "About": """
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
export default About;
""",
    "Careers": """
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
export default Careers;
""",
    "Blog": """
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
export default Blog;
""",
    "Contact": """
import React from 'react';
import InfoLayout from '../../components/InfoLayout';

const Contact = () => {
  return (
    <InfoLayout title="Contact Us">
      <p>Have questions about Enterprise pricing, custom integrations, or partnerships? We'd love to hear from you.</p>
      
      <form style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={(e) => e.preventDefault()}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <input type="text" placeholder="First Name" className="flip-input" style={{ width: '100%' }} />
          <input type="text" placeholder="Last Name" className="flip-input" style={{ width: '100%' }} />
        </div>
        <input type="email" placeholder="Work Email" className="flip-input" />
        <select className="flip-input" style={{ appearance: 'none' }}>
          <option value="" disabled selected>How can we help?</option>
          <option value="sales">Sales & Enterprise Pricing</option>
          <option value="support">Technical Support</option>
          <option value="partnership">Partnerships</option>
        </select>
        <textarea placeholder="Your message..." className="flip-input" style={{ minHeight: '150px', paddingTop: '15px', resize: 'vertical' }}></textarea>
        <button type="submit" className="btn-primary" style={{ padding: '1rem' }}>Send Message</button>
      </form>
    </InfoLayout>
  );
};
export default Contact;
""",
    "Privacy": """
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
export default Privacy;
""",
    "Terms": """
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
        <p style={{ marginBottom: '1.5rem' }}>You may not reverse-engineer the ScribScore evaluation system, attempt to extract the underlying models, or use the service for processing non-educational materials without prior written consent.</p>
      </div>
    </InfoLayout>
  );
};
export default Terms;
""",
    "Security": """
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
"""
}

base_path = 'src/pages/info'
for name, content in pages.items():
    file_path = os.path.join(base_path, f'{name}.jsx')
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')
    print(f'Created {file_path}')
