import React from 'react';
import { Link } from 'react-router-dom';
import InfoLayout from '../../components/InfoLayout';
import { FileText, ShieldAlert, CheckCircle2, Clock, Scale } from 'lucide-react';

const Terms = () => {
  return (
    <InfoLayout title="Terms of Service & Master Subscription Agreement">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Header Metadata */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>LAST REVISED</span>
            <p style={{ margin: 0, color: '#FFFFFF', fontWeight: 600 }}>October 1, 2026 (Version 3.1)</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/privacy" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy →</Link>
          </div>
        </div>

        {/* Overview Box */}
        <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Scale size={24} style={{ color: 'var(--accent-primary)' }} /> Contractual Agreement Overview
          </h2>
          <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)', margin: 0 }}>
            These Terms of Service govern all use of the ScribScore academic evaluation platform, REST APIs, and client portals. By creating an account or submitting answer sheets for evaluation, your institution agrees to adhere to these terms.
          </p>
        </div>

        {/* Core Articles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Article 1 */}
          <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700 }}>
              1. Educator Oversight & Final Score Authority
            </h3>
            <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              ScribScore is strictly an <strong>AI-assisted evaluation tool</strong> designed to assist human educators. 
            </p>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <li>The institution agrees that final grade assignments, student transcripts, and academic decisions remain the sole responsibility of authorized teachers and course administrators.</li>
              <li>AI-generated scores are advisory recommendations and must be subject to teacher review and verification.</li>
              <li>ScribScore disclaims liability for unverified, automated grade postings conducted outside official review workflows.</li>
            </ul>
          </div>

          {/* Article 2 */}
          <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700 }}>
              2. Service Level Agreement (SLA) & Uptime Guarantee
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Clock size={20} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
                <h4 style={{ color: '#FFFFFF', marginBottom: '0.4rem', fontSize: '1rem' }}>99.9% Uptime SLA</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>Guaranteed monthly uptime for API evaluation queues and teacher review sessions.</p>
              </div>
              <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <ShieldAlert size={20} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
                <h4 style={{ color: '#FFFFFF', marginBottom: '0.4rem', fontSize: '1rem' }}>Support Response Times</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>Critical exam grading issues addressed within 1 hour for Enterprise institutional tier customers.</p>
              </div>
            </div>
          </div>

          {/* Article 3 */}
          <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700 }}>
              3. Acceptable Use & System Restrictions
            </h3>
            <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Institutions and users agree not to engage in any of the following restricted activities:
            </p>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <li>Attempting to reverse-engineer, decompile, or extract weights from ScribScore OCR or rubric evaluation models.</li>
              <li>Submitting non-educational materials, malicious payloads, or unencrypted PII beyond authorized exam answer sheets.</li>
              <li>Sharing API keys or account credentials across non-authorized department staff or third parties.</li>
            </ul>
          </div>

          {/* Article 4 */}
          <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700 }}>
              4. Intellectual Property Rights
            </h3>
            <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)', margin: 0 }}>
              The institution retains 100% ownership of all answer sheets, student submissions, answer key rubrics, and generated class analytics. ScribScore retains all proprietary rights, trademarks, and patent interests in the platform architecture, multi-stage OCR pipelines, and software interfaces.
            </p>
          </div>

        </div>

      </div>
    </InfoLayout>
  );
};

export default Terms;
