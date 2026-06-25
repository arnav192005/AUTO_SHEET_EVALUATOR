import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, FileText, BarChart3, ScanText, ArrowRight, Zap, ShieldCheck, Settings, Upload, CheckCircle2, Bot, BookOpen, Layers, Plus, Minus } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [roleTab, setRoleTab] = useState('admin');
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  React.useEffect(() => {
    const roles = ['student', 'teacher', 'admin'];
    const interval = setInterval(() => {
      setRoleTab((prevRole) => {
        const currentIndex = roles.indexOf(prevRole);
        return roles[(currentIndex + 1) % roles.length];
      });
    }, 4000); // Change role every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const faqs = [
    { q: "Does it support regional boards like CBSE or ICSE?", a: "Yes, AutoEval's rubric engine can be fully customized to align with specific board marking schemes and guidelines." },
    { q: "How accurate is the handwriting OCR?", a: "Our Multimodal OCR Parse model achieves over 98% accuracy on standard cursive and print handwriting." },
    { q: "Can it grade step-by-step math derivations?", a: "Absolutely. The semantic evaluation engine awards partial credit for correct mathematical steps even if the final answer is wrong." },
    { q: "Is the student data secure?", a: "AutoEval is built with privacy by design. We are SOC-2 compliant and FERPA ready." }
  ];

  return (
    <div className="landing-container animate-fade-in">
      
      {/* 1. Navbar */}
      <nav className="landing-nav">
        <Link to="/" className="landing-logo">
          <Brain size={28} />
          AutoEval
        </Link>
        <div className="nav-links">
          <Link to="/login" className="btn-secondary">Login</Link>
          <Link to="/login" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="hero-section section-padding section-border-bottom">
        <div className="announcement-chip animate-fade-in delay-1">
          New: Fast & Accurate AI Evaluation
        </div>
        <h1 
          className="hero-title interactive-title animate-fade-in delay-1" 
          onMouseEnter={() => setIsTitleHovered(true)}
          onMouseLeave={() => setIsTitleHovered(false)}
          style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', letterSpacing: '-0.05em', position: 'relative', display: 'inline-block' }}
        >
          {/* Invisible placeholder to maintain layout size */}
          <span style={{ visibility: 'hidden', pointerEvents: 'none' }}>
            GRADE SMART.
          </span>
          <span style={{ 
            position: 'absolute', top: 0, left: 0, width: '100%', textAlign: 'center',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', 
            opacity: isTitleHovered ? 0 : 1, 
            transform: isTitleHovered ? 'translateY(-20px)' : 'translateY(0)' 
          }}>
            AUTOEVAL.
          </span>
          <span style={{ 
            position: 'absolute', top: 0, left: 0, width: '100%', textAlign: 'center',
            color: 'var(--accent-primary)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', 
            opacity: isTitleHovered ? 1 : 0, 
            transform: isTitleHovered ? 'translateY(0)' : 'translateY(20px)'
          }}>
            GRADE SMART.
          </span>
        </h1>
        <p className="hero-subtitle animate-fade-in delay-2" style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
          The AI academic evaluation platform. Grade papers instantly, apply custom rubrics, and generate rich insights without breaking a sweat.
        </p>
        <div className="hero-ctas animate-fade-in delay-3">
          <Link to="/login" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            Try AutoEval Now
          </Link>
          <Link to="/login" className="btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            View Documentation
          </Link>
        </div>
        
        {/* Mockup Dashboard */}
        <div className="mockup-container animate-fade-in delay-3">
          <div className="mockup-header">
            <div className="mockup-dot"></div>
            <div className="mockup-dot"></div>
            <div className="mockup-dot"></div>
          </div>
          <div style={{ padding: '2rem', flex: 1, backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)' }}>Recent Submissions</h3>
              <div className="badge badge-success">Processing Active</div>
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ padding: '1rem', border: '2px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', background: 'var(--bg-color)' }}>
                <div><strong>Midterm Physics 101</strong> <br/><span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Batch #{i}049</span></div>
                <div style={{ textAlign: 'right' }}><strong>Graded</strong> <br/><span style={{ color: 'var(--accent-primary)'}}>View Report</span></div>
              </div>
            ))}
          </div>
        </div>
      </header>


      {/* 4. Features 3-Column Grid */}
      <section className="features-section section-padding section-border-bottom">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="section-title">Everything you need, <br/>all in one place</h2>
        </div>
        
        <div className="features-grid-3">
          <div className="feature-card">
            <div className="feature-icon-wrapper"><BookOpen size={28} /></div>
            <h3 className="feature-title">Rubric Ingestion</h3>
            <p className="feature-desc">Upload your marking schemes and let our engine automatically parse and understand the grading logic.</p>
            <Link to="/login" className="feature-link">Learn More <ArrowRight size={16} /></Link>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper"><Settings size={28} /></div>
            <h3 className="feature-title">AI Customization</h3>
            <p className="feature-desc">Tweak the strictness, adjust partial credit thresholds, and train the AI on past graded examples.</p>
            <Link to="/login" className="feature-link">Learn More <ArrowRight size={16} /></Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper"><FileText size={28} /></div>
            <h3 className="feature-title">Evaluation Logs</h3>
            <p className="feature-desc">Generate transparent, traceable logs for every single point awarded or deducted for full auditability.</p>
            <Link to="/login" className="feature-link">Learn More <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* 5. How It Works Workflow */}
      <section className="pipeline-section section-padding section-border-bottom">
        <div className="pipeline-grid">
          <div>
            <h2 className="section-title" style={{ textAlign: 'left' }}>How AutoEval <br/>actually works</h2>
            <p className="section-subtitle">
              A transparent, 4-step workflow that transforms raw, messy answer sheets into finalized, analytical grade reports.
            </p>
            <Link to="/login" className="btn-primary">Try the Workflow</Link>
          </div>
          
          <div className="pipeline-steps">
            <div className="pipeline-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Upload Answer Sheets</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Securely upload scanned PDF booklets or images of student exams.</p>
              </div>
            </div>
            <div className="pipeline-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Define Custom Rubrics</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Input marking schemes, partial credit rules, and expected answers.</p>
              </div>
            </div>
            <div className="pipeline-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>AI Semantic Evaluation</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Our engine reads handwritten text (OCR) and compares it semantically against your rubric.</p>
              </div>
            </div>
            <div className="pipeline-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Review & Export</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Teachers review flagged grades, approve scores, and export directly to their LMS.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Role Dashboard */}
      <section className="role-dashboard-section section-padding section-border-bottom">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title">Built for every role in your school</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            From students tracking progress to teachers managing submissions, to administrators overseeing school performance.
          </p>
        </div>

        <div className="role-dashboard-wrapper">
          <div className="role-sidebar">
            <div className={`role-tab ${roleTab === 'student' ? 'active' : ''}`} onClick={() => setRoleTab('student')}>S</div>
            <div className={`role-tab ${roleTab === 'teacher' ? 'active' : ''}`} onClick={() => setRoleTab('teacher')}>T</div>
            <div className={`role-tab ${roleTab === 'admin' ? 'active' : ''}`} onClick={() => setRoleTab('admin')}>A</div>
          </div>
          
          <div className="role-content-area animate-fade-in" key={roleTab}>
            <div className="role-content-header">
              <h3>{roleTab === 'admin' ? 'School Administration Hub' : roleTab === 'teacher' ? 'Teacher Dashboard' : 'Student Progress'}</h3>
              <p>{roleTab === 'admin' ? 'Overview of all departments and active submissions.' : roleTab === 'teacher' ? 'Manage your classes and review flagged evaluations.' : 'Track your performance across all subjects.'}</p>
            </div>

            <div className="role-metrics-grid">
              <div className="metric-card-neo">
                <h4>{roleTab === 'admin' ? 'Total Students' : roleTab === 'teacher' ? 'Active Students' : 'Assignments Due'}</h4>
                <div className="metric-value">{roleTab === 'admin' ? '2,847' : roleTab === 'teacher' ? '145' : '3'}</div>
              </div>
              <div className="metric-card-neo">
                <h4>Avg Grade</h4>
                <div className="metric-value" style={{ color: 'var(--accent-primary)' }}>{roleTab === 'admin' ? '87.3%' : roleTab === 'teacher' ? '82.1%' : '91.4%'}</div>
              </div>
              <div className="metric-card-neo">
                <h4>Submissions</h4>
                <div className="metric-value">{roleTab === 'admin' ? '12,456' : roleTab === 'teacher' ? '892' : '42'}</div>
              </div>
              <div className="metric-card-neo">
                <h4>Pass Rate</h4>
                <div className="metric-value">{roleTab === 'admin' ? '94.2%' : roleTab === 'teacher' ? '89.5%' : 'N/A'}</div>
              </div>
            </div>

            <div className="role-list-section">
              <div className="role-list-header">
                {roleTab === 'student' ? 'Recent Grades' : 'Department Performance'}
              </div>
              
              <div className="role-list-item">
                <div className="role-list-item-title">
                  <span>{roleTab === 'student' ? 'AP Calculus Midterm' : 'Mathematics'}</span>
                  <span>{roleTab === 'student' ? '94%' : '88% AVG'}</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: roleTab === 'student' ? '94%' : '88%' }}></div>
                </div>
              </div>
              
              <div className="role-list-item">
                <div className="role-list-item-title">
                  <span>{roleTab === 'student' ? 'Physics Lab 3' : 'Science'}</span>
                  <span>{roleTab === 'student' ? '89%' : '85% AVG'}</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: roleTab === 'student' ? '89%' : '85%' }}></div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* 7. Standards 2x2 Grid */}
      <section className="features-section section-padding section-border-bottom">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="section-title">Elevating Standards</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>Built for scale, precision, and compliance.</p>
        </div>

        <div className="standards-grid">
          <div className="standard-card">
            <h3><ScanText size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }}/> Handwriting OCR</h3>
            <p style={{ color: 'var(--text-secondary)' }}>State-of-the-art optical character recognition for messy handwriting.</p>
          </div>
          <div className="standard-card">
            <h3><BarChart3 size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }}/> Real-Time Analytics</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Instantly identify knowledge gaps across the entire classroom.</p>
          </div>
          <div className="standard-card">
            <h3><Layers size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }}/> Curated Criteria</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Standardize evaluations across multiple graders perfectly.</p>
          </div>
          <div className="standard-card">
            <h3><ShieldCheck size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }}/> Verification Audit</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Human-in-the-loop flows to review flagged low-confidence grades.</p>
          </div>
        </div>
      </section>

      {/* 9. FAQs */}
      <section className="faq-section section-padding section-border-bottom">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title">Got questions? <br/>We have answers.</h2>
        </div>
        
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div 
                className="faq-question"
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
              >
                {faq.q}
                {openFaq === index ? <Minus size={20} /> : <Plus size={20} />}
              </div>
              {openFaq === index && (
                <div className="faq-answer animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. Bottom CTA */}
      <section className="bottom-cta section-padding section-border-bottom">
        <h2 className="bottom-cta-title">Ready to grade with AI?</h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Start saving hours on grading and streamline your evaluation process today.
        </p>
        <Link to="/login" className="btn-white">
          Try AutoEval Now <ArrowRight size={20} />
        </Link>
        
        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', fontFamily: 'var(--font-mono)' }}>
          <span><ShieldCheck size={16} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }}/> FERPA Ready</span>
          <span><ShieldCheck size={16} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }}/> SOC-2 Compliant</span>
          <span><Layers size={16} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }}/> Tailored for LMS</span>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="landing-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <Link to="/" className="footer-logo">
              <Brain size={24} />
              AutoEval
            </Link>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '250px' }}>
              An open platform to modernize academic assessment and simplify grading.
            </p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <ul className="footer-links">
              <li><Link to="/">Features</Link></li>
              <li><Link to="/">Integrations</Link></li>
              <li><Link to="/">Documentation</Link></li>
              <li><Link to="/">Changelog</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link to="/">About Us</Link></li>
              <li><Link to="/">Careers</Link></li>
              <li><Link to="/">Blog</Link></li>
              <li><Link to="/">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
              <li><Link to="/">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AutoEval Educational Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
