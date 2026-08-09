import React from 'react';
import { Link } from 'react-router-dom';
import InfoLayout from '../../components/InfoLayout';
import { ShieldCheck, Lock, Key, Server, CheckCircle2, FileCheck, AlertTriangle } from 'lucide-react';

const Security = () => {
  const certifications = [
    {
      title: 'SOC-2 Type II Certified',
      badge: 'AICPA SOC-2',
      desc: 'Independently audited annually to verify strict security controls, processing integrity, and confidentiality.'
    },
    {
      title: 'FERPA Ready',
      badge: '34 CFR Part 99',
      desc: 'Fully aligned with Federal Student Privacy requirements, acting as an authorized School Official.'
    },
    {
      title: 'GDPR / CCPA Compliant',
      badge: 'EU 2016/679',
      desc: 'Supports institutional data subject rights, right to erasure, and strict data processing addendums.'
    },
    {
      title: 'ISO/IEC 27001 Aligned',
      badge: 'ISMS Standard',
      desc: 'Information Security Management System framework governing cloud infrastructure and software development.'
    }
  ];

  return (
    <InfoLayout title="Security & Institutional Compliance">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Header Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>SECURITY STATUS</span>
            <p style={{ margin: 0, color: '#27c93f', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} /> All Systems Operational & Audited
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/documentation" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>API Documentation →</Link>
            <Link to="/privacy" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy →</Link>
          </div>
        </div>

        {/* Certifications Grid */}
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '1.25rem', fontWeight: 700 }}>
            Compliance Certifications & Frameworks
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {certifications.map((cert, index) => (
              <div key={index} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px' }}>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  {cert.badge}
                </span>
                <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginTop: '0.8rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                  {cert.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                  {cert.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Security Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section 1 */}
          <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={20} style={{ color: 'var(--accent-primary)' }} /> Data Encryption Standards
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: '#FFFFFF', marginBottom: '0.4rem', fontSize: '1rem' }}>Encryption in Transit</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>Enforced TLS 1.3 protocol for all client-to-server and API endpoint communications with HSTS preloading.</p>
              </div>
              <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: '#FFFFFF', marginBottom: '0.4rem', fontSize: '1rem' }}>Encryption at Rest</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>AES-256 bit encryption applied to all stored database records, PDF uploads, and OCR transcriptions.</p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={20} style={{ color: 'var(--accent-primary)' }} /> Role-Based Access Control (RBAC)
            </h3>
            <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Granular permission levels ensure that administrators, head graders, and assistant instructors only access exam batches assigned to their specific courses:
            </p>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <li><strong>Multi-Factor Authentication (MFA):</strong> Required for all administrator and teacher portal logins.</li>
              <li><strong>Immutable Audit Trail:</strong> Every score edit, override, or export action is recorded with cryptographic timestamps and IP tracking.</li>
              <li><strong>Session Timeouts:</strong> Automatic termination of inactive browser sessions after 15 minutes of inactivity.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} style={{ color: 'var(--accent-primary)' }} /> Vulnerability Disclosure & Pen-Testing
            </h3>
            <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)', margin: 0 }}>
              ScribScore undergoes bi-annual third-party penetration testing by certified CREST/OSCP security researchers. To report security vulnerabilities or request our latest SOC 2 report:
            </p>
            <div style={{ marginTop: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--accent-primary)', background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '8px', display: 'inline-block' }}>
              Security Reports: security@scribscore.edu (PGP Key available)
            </div>
          </div>

        </div>

      </div>
    </InfoLayout>
  );
};

export default Security;
