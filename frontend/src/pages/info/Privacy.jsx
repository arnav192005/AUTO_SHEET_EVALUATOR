import React from 'react';
import { Link } from 'react-router-dom';
import InfoLayout from '../../components/InfoLayout';
import { ShieldCheck, Lock, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

const Privacy = () => {
  return (
    <InfoLayout title="Privacy Policy & Student Data Protection">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Effective Date Chip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>EFFECTIVE DATE</span>
            <p style={{ margin: 0, color: '#FFFFFF', fontWeight: 600 }}>October 1, 2026 (Version 2.4)</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/terms" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>Terms of Service →</Link>
          </div>
        </div>

        {/* Commitment Banner */}
        <div style={{ padding: '2rem', borderRadius: '14px', background: 'rgba(39, 201, 63, 0.05)', border: '1px solid rgba(39, 201, 63, 0.25)' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={24} color="#27c93f" /> Zero AI Training on Student Data Guarantee
          </h2>
          <p style={{ lineHeight: '1.7', color: 'var(--text-primary)', margin: 0 }}>
            ScribScore operates under a strict data isolation policy. <strong>We NEVER use customer exam papers, student handwriting scans, or teacher rubrics to train public AI models.</strong> All processed data remains isolated within your institution’s encrypted tenant boundary.
          </p>
        </div>

        {/* Policy Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section 1 */}
          <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700 }}>
              1. Institutional Role & FERPA Compliance
            </h3>
            <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Under the Family Educational Rights and Privacy Act (FERPA), ScribScore operates as a designated <strong>"School Official"</strong> with legitimate educational interests. The educational institution remains the sole Data Controller of all student PII (Personally Identifiable Information).
            </p>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <li>Student identity data is encrypted at rest using AES-256 keys managed via KMS.</li>
              <li>Grades and evaluation feedback are disclosed solely to authorized institution personnel.</li>
              <li>Parents and eligible students maintain complete rights to inspect processed records via institutional administrators.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700 }}>
              2. Data We Process & Purpose
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: '#FFFFFF', marginBottom: '0.4rem', fontSize: '1rem' }}>Uploaded Answer Sheets</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>Scanned PDF/JPEG papers containing handwritten answers used exclusively for OCR transcription and rubric evaluation.</p>
              </div>
              <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: '#FFFFFF', marginBottom: '0.4rem', fontSize: '1rem' }}>Teacher Rubrics</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>Master answer keys and mark allocation rules supplied by educators to guide automated evaluation logic.</p>
              </div>
              <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: '#FFFFFF', marginBottom: '0.4rem', fontSize: '1rem' }}>Audit Logs & Feedback</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>Teacher override logs, timestamp records, and confidence flags for system verification and compliance auditing.</p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700 }}>
              3. Data Retention & Cryptographic Deletion
            </h3>
            <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              We retain answer sheet uploads and score analytics strictly according to the retention schedule established by your institution’s contract:
            </p>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <li><strong>Temporary Processing Cache:</strong> Raw OCR image caches are purged within 24 hours of successful evaluation.</li>
              <li><strong>Account Termination:</strong> Upon contract end, all stored marksheets and files undergo 100% cryptographic erasure within 30 calendar days.</li>
              <li><strong>Export Flexibility:</strong> Administrators can request a complete data dump (JSON/CSV) at any time prior to account closure.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700 }}>
              4. Contact Our Data Protection Officer (DPO)
            </h3>
            <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              If you have inquiries regarding student data privacy, FERPA disclosures, or GDPR Subject Access Requests (SAR):
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--accent-primary)', background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '8px', display: 'inline-block' }}>
              Email: privacy@scribscore.edu | Phone: +1 (800) 555-SCRIB
            </div>
          </div>

        </div>

      </div>
    </InfoLayout>
  );
};

export default Privacy;
