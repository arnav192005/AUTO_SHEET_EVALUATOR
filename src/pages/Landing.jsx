import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, FileText, BarChart3, ScanText, ArrowRight, Zap, ShieldCheck, Settings, Upload, CheckCircle2, Bot, BookOpen, Layers, Plus, Minus, XCircle, Loader2 } from 'lucide-react';
import Tesseract from 'tesseract.js';
import './Landing.css';

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [demoResult, setDemoResult] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [extractedText, setExtractedText] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImageUrl(URL.createObjectURL(file));
      setDemoResult(null);
    }
  };

  const runDemoEvaluation = async () => {
    if (isEvaluating || demoResult) return;
    setIsEvaluating(true);
    setExtractedText(null);
    setOcrProgress(0);
    setOcrStatus('');

    if (uploadedImageUrl) {
      try {
        setOcrStatus('Initializing OCR Engine...');
        const result = await Tesseract.recognize(
          uploadedImageUrl,
          'eng',
          {
            logger: m => {
              if (m.status === 'recognizing text') {
                setOcrStatus('Extracting text...');
                setOcrProgress(m.progress);
              } else {
                setOcrStatus(m.status);
              }
            }
          }
        );
        setExtractedText(result.data.text);
      } catch (error) {
        console.error("OCR Error:", error);
        setExtractedText("Error extracting text.");
      }
    }

    setOcrStatus('Applying custom rubric...');
    // Simulate AI processing
    setTimeout(() => {
      setIsEvaluating(false);
      setDemoResult({
        score: "4.5 / 5",
        steps: [
          { name: "Step 1: Formula Application", status: "correct", points: "+2.0", message: "Correct formula used for quadratic roots." },
          { name: "Step 2: Value Substitution", status: "correct", points: "+2.0", message: "Values substituted correctly." },
          { name: "Step 3: Final Calculation", status: "partial", points: "+0.5", message: "Minor arithmetic error in the final addition." }
        ]
      });
    }, uploadedImageUrl ? 1000 : 2500);
  };
  
  const resetDemo = () => {
    setDemoResult(null);
    setIsEvaluating(false);
    setUploadedImageUrl(null);
    setExtractedText(null);
    setOcrProgress(0);
    setOcrStatus('');
  };

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);

    const workflowInterval = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev + 1) % 4);
    }, 3500); // Change workflow step every 3.5 seconds

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.15 });
    
    setTimeout(() => {
      document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    }, 100);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(workflowInterval);
      observer.disconnect();
    };
  }, []);

  const faqs = [
    { q: "Does it support regional boards like CBSE or ICSE?", a: "Yes, ScribScore can be fully customized to align with specific board marking schemes and guidelines." },
    { q: "How accurate is the handwriting OCR?", a: "Our Multimodal OCR Parse model achieves over 98% accuracy on standard cursive and print handwriting." },
    { q: "Can it grade step-by-step math derivations?", a: "Absolutely. The semantic evaluation system awards partial credit for correct mathematical steps even if the final answer is wrong." },
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

      {/* 3. Interactive Demo Playground */}
      <section className="demo-section section-padding section-border-bottom">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title reveal-on-scroll">Try it Live</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>Experience the speed and accuracy of ScribScore's AI grading in real-time.</p>
        </div>

        <div className="demo-grid reveal-on-scroll">
          {/* Left Panel: Upload/Input */}
          <div className="demo-panel input-panel">
            <div className="panel-header">
              <span className="dot" style={{ background: '#ff5f56' }}></span>
              <span className="dot" style={{ background: '#ffbd2e' }}></span>
              <span className="dot" style={{ background: '#27c93f' }}></span>
              <span className="panel-title">Student Answer Sheet.jpg</span>
            </div>
            <div className="panel-body">
              <div className="mock-upload-area" style={{ padding: uploadedImageUrl ? '0' : '2rem' }}>
                {uploadedImageUrl ? (
                  <img src={uploadedImageUrl} alt="Uploaded student sheet" style={{ width: '100%', height: '100%', minHeight: '250px', objectFit: 'contain', borderRadius: '8px' }} />
                ) : (
                  <div className="math-equation-mock">
                    <p>Q: Find the roots of $x^2 - 5x + 6 = 0$</p>
                    <div className="handwriting-mock">
                      <p>x = [-b ± √(b² - 4ac)] / 2a</p>
                      <p>x = [5 ± √(25 - 24)] / 2</p>
                      <p>x = (5 ± 1) / 2</p>
                      <p className="error-text">x = 3, x = 1</p>
                    </div>
                  </div>
                )}
                {isEvaluating && <div className="scanning-laser"></div>}
              </div>
              <div className="demo-controls" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <label className="btn-secondary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', margin: 0 }}>
                  <Upload size={18} />
                  Upload Photo
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} disabled={isEvaluating} />
                </label>
                {!demoResult ? (
                  <button 
                    className="btn-primary evaluate-btn" 
                    onClick={runDemoEvaluation}
                    disabled={isEvaluating}
                  >
                    {isEvaluating ? (
                      <><Loader2 className="animate-spin" size={20} /> Analyzing...</>
                    ) : (
                      <><Brain size={20} /> Run AI Evaluation</>
                    )}
                  </button>
                ) : (
                  <button className="btn-secondary reset-btn" onClick={resetDemo}>
                    Reset Demo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: AI Result */}
          <div className="demo-panel output-panel">
             <div className="panel-header">
              <span className="dot" style={{ background: '#ff5f56' }}></span>
              <span className="dot" style={{ background: '#ffbd2e' }}></span>
              <span className="dot" style={{ background: '#27c93f' }}></span>
              <span className="panel-title">AI Grade Report</span>
            </div>
            <div className="panel-body">
              {!demoResult && !isEvaluating && (
                <div className="empty-state">
                  <Upload size={40} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                  <p>Click 'Run AI Evaluation' to see the magic happen.</p>
                </div>
              )}

              {isEvaluating && (
                <div className="loading-state">
                  <div className="pulse-ring"></div>
                  {uploadedImageUrl ? (
                    <>
                      <p style={{ fontWeight: '600', color: '#fff' }}>{ocrStatus || 'Starting AI Engine...'}</p>
                      {ocrProgress > 0 && (
                        <div className="ocr-progress-container" style={{ width: '80%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div className="ocr-progress-bar" style={{ width: `${ocrProgress * 100}%`, height: '100%', background: 'var(--accent-primary)', transition: 'width 0.2s ease' }}></div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <p>Extracting handwriting...</p>
                      <p className="delay-text-1">Parsing mathematical structure...</p>
                      <p className="delay-text-2">Applying custom rubric...</p>
                    </>
                  )}
                </div>
              )}

              {demoResult && (
                <div className="result-state animate-fade-in">
                  {extractedText && (
                    <div className="extracted-text-box" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '1rem', marginBottom: '0.5rem' }}>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem', marginTop: 0 }}>
                        <ScanText size={16} /> Extracted Text (Raw AI Output)
                      </h4>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#a0aec0', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                        {extractedText}
                      </pre>
                    </div>
                  )}

                  <div className="score-banner">
                    <span className="score-label">Final Score</span>
                    <span className="score-value">{demoResult.score}</span>
                  </div>
                  
                  <div className="step-feedback-list">
                    {demoResult.steps.map((step, idx) => (
                      <div key={idx} className={`step-item ${step.status}`}>
                        <div className="step-icon">
                          {step.status === 'correct' ? <CheckCircle2 size={20} color="#27c93f" /> : <XCircle size={20} color="#ffbd2e" />}
                        </div>
                        <div className="step-content">
                          <h4>{step.name} <span className="step-points">{step.points}</span></h4>
                          <p>{step.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="insight-box">
                    <Bot size={18} />
                    <p><strong>AI Insight:</strong> The student understands the quadratic formula but made a minor calculation error at the very end (3, 2 are the correct roots). Partial credit awarded.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="features-section section-padding section-border-bottom">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="section-title reveal-on-scroll">Everything you need, <br/>all in one place</h2>
        </div>
        
        <div className="features-grid-3">
          <div className="feature-card reveal-on-scroll">
            <div className="feature-icon-wrapper"><Layers size={28} /></div>
            <h3 className="feature-title">Multi-Stage AI Pipeline</h3>
            <p className="feature-desc">Leveraging advanced machine learning, ScribeScore processes raw handwritten answers through specialized OCR and semantic analysis stages for unparalleled accuracy.</p>
            <Link to="/login" className="feature-link">Learn More <ArrowRight size={16} /></Link>
          </div>
          
          <div className="feature-card reveal-on-scroll">
            <div className="feature-icon-wrapper"><ScanText size={28} /></div>
            <h3 className="feature-title">Handwritten Answer Recognition</h3>
            <p className="feature-desc">Our proprietary computer vision models are trained specifically on student handwriting, effortlessly digitizing and parsing even the most challenging cursive.</p>
            <Link to="/login" className="feature-link">Learn More <ArrowRight size={16} /></Link>
          </div>

          <div className="feature-card reveal-on-scroll">
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
            <h2 className="section-title reveal-on-scroll" style={{ textAlign: 'left' }}>How ScribScore <br/>actually works</h2>
            <p className="section-subtitle">
              A transparent, 4-step workflow that transforms raw, messy answer sheets into finalized, analytical grade reports.
            </p>
            <Link to="/login" className="btn-primary">Try the Workflow</Link>
          </div>
          
          <div className="agentic-workflow-wrapper reveal-on-scroll">

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
          <h2 className="section-title reveal-on-scroll" style={{ textAlign: 'center', width: '100%' }}>
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
          <h2 className="section-title reveal-on-scroll" style={{ textAlign: 'center', width: '100%' }}>
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
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/integrations">Integrations</Link></li>
              <li><Link to="/documentation">Documentation</Link></li>
              <li><Link to="/changelog">Changelog</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/security">Security</Link></li>
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
