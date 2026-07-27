import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain } from 'lucide-react';
import '../pages/Landing.css';

const InfoLayout = ({ children, title }) => {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="landing-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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

      {/* 2. Main Content Wrapper */}
      <main style={{ flex: 1, padding: '8rem 2rem 4rem 2rem', maxWidth: '900px', width: '100%', margin: '0 auto' }}>
        <div className="security-container reveal-on-scroll is-visible" style={{ padding: '3rem', width: '100%', marginBottom: '2rem' }}>
          <h1 className="section-title" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem', marginBottom: '2rem', textAlign: 'left' }}>
            {title}
          </h1>
          <div className="info-content" style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem' }}>
            {children}
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="landing-footer" style={{ marginTop: 'auto' }}>
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
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ScribScore Educational Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default InfoLayout;
