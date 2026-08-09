import React from 'react';
import { Link } from 'react-router-dom';
import InfoLayout from '../../components/InfoLayout';
import { 
  Brain, 
  Zap, 
  ScanText, 
  ShieldCheck, 
  CheckCircle2, 
  BarChart3, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  FileSpreadsheet, 
  Users, 
  Award,
  Target
} from 'lucide-react';

const About = () => {
  const steps = [
    {
      num: '01',
      title: 'Batch Document Ingestion',
      desc: 'Upload multi-page PDFs or single images of handwritten student answer booklets with instantaneous file parsing.',
      icon: <FileSpreadsheet size={22} style={{ color: '#FF3535' }} />,
      delay: '0.1s'
    },
    {
      num: '02',
      title: 'Multimodal OCR Parsing',
      desc: 'High-precision optical character recognition parses messy cursive handwriting, math symbols, and step derivations.',
      icon: <ScanText size={22} style={{ color: '#FF3535' }} />,
      delay: '0.2s'
    },
    {
      num: '03',
      title: 'Rubric-Based AI Grading',
      desc: 'Evaluates answers against teacher rubrics, assigning step-by-step partial credit with transparent scoring logic.',
      icon: <Brain size={22} style={{ color: '#FF3535' }} />,
      delay: '0.3s'
    },
    {
      num: '04',
      title: 'Teacher Verification & Export',
      desc: 'Educators verify results with 1-click score overrides, flag edge cases, and export formatted analytical marksheets.',
      icon: <ShieldCheck size={22} style={{ color: '#FF3535' }} />,
      delay: '0.4s'
    }
  ];

  const features = [
    {
      title: 'Handwriting Recognition',
      desc: 'Recognizes diverse student handwriting styles and mathematical derivations with over 98% accuracy.',
      icon: <Zap size={24} style={{ color: '#FF3535' }} />
    },
    {
      title: 'Step-by-Step Credit',
      desc: 'Awards partial marks for correct mathematical steps even if the final calculation has minor numerical mistakes.',
      icon: <Target size={24} style={{ color: '#FF3535' }} />
    },
    {
      title: 'Educator Sovereignty',
      desc: 'Teachers remain in full command with instant score overrides, custom feedback notes, and flag controls.',
      icon: <ShieldCheck size={24} style={{ color: '#FF3535' }} />
    },
    {
      title: 'Class Analytics',
      desc: 'Uncovers classroom-wide concept gaps, question difficulty metrics, and grading distribution curves in real time.',
      icon: <BarChart3 size={24} style={{ color: '#FF3535' }} />
    },
    {
      title: 'Curated Answer Rubrics',
      desc: 'Standardize evaluation across multiple evaluators to eliminate bias and maintain grading consistency.',
      icon: <Layers size={24} style={{ color: '#FF3535' }} />
    },
    {
      title: '1-Click CSV / PDF Export',
      desc: 'Seamlessly export finalized grades, itemized feedback, and confidence flags for institutional record keeping.',
      icon: <Award size={24} style={{ color: '#FF3535' }} />
    }
  ];

  return (
    <InfoLayout title="About ScribScore">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
        
        {/* Animated Hero Header Banner with Red Laser */}
        <div 
          className="about-anim-card about-pulse-glow" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(255, 53, 53, 0.12) 0%, rgba(10, 10, 15, 0.9) 100%)', 
            padding: '2.5rem', 
            borderRadius: '16px', 
            border: '1px solid rgba(255, 53, 53, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Animated Red Laser Beam */}
          <div className="about-red-laser"></div>

          <div className="announcement-chip about-badge-float" style={{ marginBottom: '1.25rem', borderColor: 'rgba(255, 53, 53, 0.6)', background: 'rgba(255, 53, 53, 0.1)' }}>
            <Sparkles size={14} style={{ color: '#FF3535', display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Academic Evaluation Engine
          </div>

          <h2 style={{ fontSize: '2rem', color: '#FFFFFF', marginBottom: '1rem', lineHeight: '1.3', fontWeight: 800 }}>
            Intelligent, Transparent & <br />
            <span style={{ color: '#FF3535', textShadow: '0 0 22px rgba(255, 53, 53, 0.6)' }}>Educator-First Exam Evaluation</span>
          </h2>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-primary)', lineHeight: '1.7', maxWidth: '780px' }}>
            ScribScore is an AI-assisted evaluation platform engineered to make handwritten answer sheet grading 
            faster, consistent, and transparent—while keeping educators fully in control of final decisions.
          </p>

          {/* Metric Pills with Red Glow Hover */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <div className="about-metric-pill" style={{ padding: '0.6rem 1.25rem', borderRadius: '100px', background: 'rgba(255, 53, 53, 0.08)', border: '1px solid rgba(255, 53, 53, 0.25)', fontSize: '0.9rem', fontWeight: 600, color: '#FAFAFA' }}>
              ⚡ 98%+ OCR Precision
            </div>
            <div className="about-metric-pill" style={{ padding: '0.6rem 1.25rem', borderRadius: '100px', background: 'rgba(255, 53, 53, 0.08)', border: '1px solid rgba(255, 53, 53, 0.25)', fontSize: '0.9rem', fontWeight: 600, color: '#FAFAFA' }}>
              🛡️ 100% Teacher Control
            </div>
            <div className="about-metric-pill" style={{ padding: '0.6rem 1.25rem', borderRadius: '100px', background: 'rgba(255, 53, 53, 0.08)', border: '1px solid rgba(255, 53, 53, 0.25)', fontSize: '0.9rem', fontWeight: 600, color: '#FAFAFA' }}>
              ⏱️ 10x Faster Grading
            </div>
          </div>
        </div>

        {/* Section 2: Animated How It Works Timeline */}
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ color: '#FF3535', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}>
              TRANSPARENT PIPELINE
            </span>
            <h2 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginTop: '0.4rem', fontWeight: 800 }}>
              How ScribScore Works
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="about-anim-card about-step-node" 
                style={{ 
                  animationDelay: step.delay,
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '14px',
                  padding: '1.5rem 1.75rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.5rem'
                }}
              >
                <div className="about-step-number">
                  {step.num}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    {step.icon}
                    <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>{step.title}</h3>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.98rem' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Key Capabilities Grid */}
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ color: '#FF3535', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}>
              ENGINEERED FOR EXCELLENCE
            </span>
            <h2 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginTop: '0.4rem', fontWeight: 800 }}>
              Why Educators Choose ScribScore
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {features.map((feat, index) => (
              <div 
                key={index} 
                className="about-anim-card" 
                style={{ 
                  animationDelay: `${0.1 * index}s`,
                  background: 'rgba(23, 23, 23, 0.6)',
                  padding: '1.75rem',
                  borderRadius: '14px',
                  border: '1px solid var(--border-glass)'
                }}
              >
                <div style={{ marginBottom: '1rem', display: 'inline-block', padding: '0.75rem', borderRadius: '12px', background: 'rgba(255, 53, 53, 0.12)' }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '0.6rem', fontWeight: 700 }}>
                  {feat.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Human-in-the-Loop Philosophy */}
        <div 
          className="about-anim-card" 
          style={{ 
            background: 'rgba(255, 53, 53, 0.05)', 
            padding: '2.25rem', 
            borderRadius: '16px', 
            border: '1px solid rgba(255, 53, 53, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users size={26} style={{ color: '#FF3535' }} />
            <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>
              Human-in-the-Loop Philosophy
            </h2>
          </div>
          <p style={{ lineHeight: '1.7', color: 'var(--text-primary)', margin: 0 }}>
            ScribScore is designed strictly to assist teachers, not replace them. AI executes the repetitive task of OCR scanning, rubric mapping, and initial scoring suggestions—while the educator remains responsible for final approvals and grade assignments.
          </p>
          <p style={{ lineHeight: '1.7', fontWeight: 600, color: '#FF3535', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} /> Combining the speed of machine learning with the empathy & precision of human judgment.
          </p>
        </div>

        {/* Section 5: Project Scope & Our Vision */}
        <div 
          className="about-anim-card about-vision-box" 
          style={{ 
            background: 'linear-gradient(180deg, rgba(23, 23, 23, 0.9) 0%, rgba(10, 10, 15, 0.95) 100%)', 
            padding: '2.5rem', 
            borderRadius: '16px', 
            border: '1px solid rgba(255, 53, 53, 0.35)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div className="about-red-laser"></div>
          <span style={{ color: '#FF3535', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}>
            PROJECT VISION
          </span>
          <h2 style={{ fontSize: '1.75rem', color: '#FFFFFF', margin: 0, fontWeight: 800, maxWidth: '650px' }}>
            Modernizing Academic Evaluation for Everyone
          </h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.08rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: 0 }}>
            Our vision is to make handwritten answer sheet grading more efficient, transparent, and accessible 
            through practical applications of multimodal artificial intelligence and human-guided verification flows.
          </p>
          
          <div style={{ marginTop: '1rem' }}>
            <Link 
              to="/login" 
              className="btn-primary" 
              style={{ padding: '0.9rem 2.25rem', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
            >
              Try ScribScore Demo <ArrowRight size={18} />
            </Link>
          </div>
        </div>

      </div>
    </InfoLayout>
  );
};

export default About;
