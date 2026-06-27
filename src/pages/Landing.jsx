import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, FileText, BarChart3, ScanText, ArrowRight, Zap, ShieldCheck, Settings, Upload, CheckCircle2, Bot, BookOpen, Layers, Plus, Minus } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);

    const workflowInterval = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev + 1) % 4);
    }, 3500); // Change workflow step every 3.5 seconds

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(workflowInterval);
    };
  }, []);

  const faqs = [
    { q: "Does it support regional boards like CBSE or ICSE?", a: "Yes, ScribScore's rubric engine can be fully customized to align with specific board marking schemes and guidelines." },
    { q: "How accurate is the handwriting OCR?", a: "Our Multimodal OCR Parse model achieves over 98% accuracy on standard cursive and print handwriting." },
    { q: "Can it grade step-by-step math derivations?", a: "Absolutely. The semantic evaluation engine awards partial credit for correct mathematical steps even if the final answer is wrong." },
    { q: "Is the student data secure?", a: "ScribScore is built with privacy by design. We are SOC-2 compliant and FERPA ready." }
  ];

  return (
    <div className="landing-container animate-fade-in">
      <div className="cursor-glow"></div>
      
      {/* 1. Navbar */}
      <nav className="landing-nav">
        <Link to="/" className="landing-logo">
          <Brain size={28} />
          ScribScore
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
          className="hero-title animate-fade-in delay-1" 
          style={{ 
            fontSize: 'clamp(4rem, 12vw, 10rem)', 
            letterSpacing: '-0.05em', 
            lineHeight: '0.95',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign: 'left'
          }}
        >
          <span style={{ color: 'var(--text-primary)' }}>SCRIB</span>
          <span style={{ color: 'var(--text-tertiary)' }}>SCORE.</span>
        </h1>
        <p className="hero-subtitle animate-fade-in delay-2" style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
          ScribeScore is an AI-powered intelligent exam grading system that automatically evaluates handwritten student answer sheets using a multi-stage AI pipeline
        </p>
        <div className="hero-ctas animate-fade-in delay-3">
          <Link to="/login" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            Try ScribScore Now
          </Link>
          <Link to="/login" className="btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            View Documentation
          </Link>
        </div>
        
      </header>


      {/* 4. Features 3-Column Grid */}
      <section className="features-section section-padding section-border-bottom">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="section-title">Everything you need, <br/>all in one place</h2>
        </div>
        
        <div className="features-grid-3">
          <div className="feature-card">
            <div className="feature-icon-wrapper"><Layers size={28} /></div>
            <h3 className="feature-title">Multi-Stage AI Pipeline</h3>
            <p className="feature-desc">Leveraging advanced machine learning, ScribeScore processes raw handwritten answers through specialized OCR and semantic analysis stages for unparalleled accuracy.</p>
            <Link to="/login" className="feature-link">Learn More <ArrowRight size={16} /></Link>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper"><ScanText size={28} /></div>
            <h3 className="feature-title">Handwritten Answer Recognition</h3>
            <p className="feature-desc">Our proprietary computer vision models are trained specifically on student handwriting, effortlessly digitizing and parsing even the most challenging cursive.</p>
            <Link to="/login" className="feature-link">Learn More <ArrowRight size={16} /></Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper"><Bot size={28} /></div>
            <h3 className="feature-title">Automated Intelligent Grading</h3>
            <p className="feature-desc">Instantly evaluate exams against your provided answer keys and rubrics, automatically assigning partial credit and identifying logical steps in student responses.</p>
            <Link to="/login" className="feature-link">Learn More <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* 5. How It Works Workflow */}
      <section className="pipeline-section section-padding section-border-bottom">
        <div className="pipeline-grid">
          <div>
            <h2 className="section-title" style={{ textAlign: 'left' }}>How ScribScore <br/>actually works</h2>
            <p className="section-subtitle">
              A transparent, 4-step workflow that transforms raw, messy answer sheets into finalized, analytical grade reports.
            </p>
            <Link to="/login" className="btn-primary">Try the Workflow</Link>
          </div>
          
          <div className="agentic-workflow-wrapper">
            {/* Terminal Window */}
            <div className="agentic-terminal animate-fade-in delay-1">
              <div className="terminal-header">
                <div className="terminal-dots"><span></span><span></span><span></span></div>
                <div className="terminal-title">ScribeScore AI Engine</div>
              </div>
              <div className="terminal-body typing-container">
                {activeWorkflowStep === 0 && <p className="typing-text"><span className="term-prompt">&gt;</span> [System] Initializing batch ingest...<br/><span className="term-prompt">&gt;</span> Scanning handwriting features... <span className="term-blink">_</span></p>}
                {activeWorkflowStep === 1 && <p className="typing-text"><span className="term-prompt">&gt;</span> [Vision Core] Running proprietary OCR...<br/><span className="term-prompt">&gt;</span> Digitizing cursive student logic... <span className="term-blink">_</span></p>}
                {activeWorkflowStep === 2 && <p className="typing-text"><span className="term-prompt">&gt;</span> [AI Engine] Cross-referencing answer key...<br/><span className="term-prompt">&gt;</span> Awarding partial credit for step 2... <span className="term-blink">_</span></p>}
                {activeWorkflowStep === 3 && <p className="typing-text"><span className="term-prompt">&gt;</span> [Audit] Flagging anomalies for review...<br/><span className="term-prompt">&gt;</span> Syncing finalized grades to LMS... <span className="term-success">COMPLETE</span></p>}
              </div>
            </div>

            {/* Visual Nodes */}
            <div className="agentic-nodes-container">
              {[
                { title: 'Scan', desc: 'Batch ingest PDFs', icon: <ScanText size={20}/> },
                { title: 'Vision', desc: 'Handwriting OCR', icon: <Zap size={20}/> },
                { title: 'Evaluate', desc: 'Semantic grading', icon: <Brain size={20}/> },
                { title: 'Verify', desc: 'Teacher approval', icon: <ShieldCheck size={20}/> }
              ].map((step, index) => (
                <React.Fragment key={index}>
                  <div className={`agentic-node ${activeWorkflowStep >= index ? 'active' : ''} ${activeWorkflowStep === index ? 'pulsing' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="node-icon">{step.icon}</div>
                    <div className="node-info">
                      <h4>{step.title}</h4>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                  {index < 3 && <div className={`agentic-connector ${activeWorkflowStep > index ? 'active' : ''}`}></div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* 7. Standards 2x2 Grid */}
      <section className="features-section section-padding section-border-bottom">
        <div style={{ textAlign: 'center', marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="section-title" style={{ textAlign: 'center', width: '100%' }}>
            <span style={{ color: '#ffffff', textShadow: '0 0 15px rgba(255, 255, 255, 0.3)' }}>Elevating</span> <span style={{ color: '#8b92a5', textShadow: '0 0 12px rgba(139, 146, 165, 0.3)' }}>Standards</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto', color: '#ffffff' }}>Built for scale, precision, and compliance.</p>
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
        <div style={{ textAlign: 'center', marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="section-title" style={{ textAlign: 'center', width: '100%' }}>
            <span style={{ color: '#ffffff', textShadow: '0 0 15px rgba(255, 255, 255, 0.3)' }}>Got questions?</span><br/>
            <span style={{ color: '#8b92a5', textShadow: '0 0 12px rgba(139, 146, 165, 0.3)' }}>We have answers.</span>
          </h2>
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
          Try ScribScore Now <ArrowRight size={20} />
        </Link>
        

      </section>

      {/* 11. Footer */}
      <footer className="landing-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <Link to="/" className="footer-logo">
              <Brain size={24} />
              ScribScore
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
          <p>© {new Date().getFullYear()} ScribScore Educational Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
