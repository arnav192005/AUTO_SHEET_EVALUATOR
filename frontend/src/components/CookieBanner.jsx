import React, { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consentData = localStorage.getItem('cookie_consent');
    if (consentData) {
      try {
        const { expires } = JSON.parse(consentData);
        if (Date.now() < expires) {
          // Valid consent exists, don't show
          return;
        }
      } catch (e) {}
    }

    // Small delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const saveConsent = (status) => {
    const expires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    localStorage.setItem('cookie_consent', JSON.stringify({ status, expires }));
    setIsVisible(false);
  };

  const handleAccept = () => {
    saveConsent('accepted');
  };

  const handleReject = () => {
    saveConsent('rejected');
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      maxWidth: '450px',
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid var(--border-glass)',
      borderRadius: '16px',
      padding: '24px',
      zIndex: 9999,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
      animation: 'slideUp 0.5s ease-out forwards',
      color: 'var(--text-secondary)'
    }}>
      <style>
        {`
          @keyframes slideUp {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: 'white', marginBottom: '8px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🍪 We value your privacy
        </h3>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
          We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          onClick={handleAccept}
          style={{
            flex: 1,
            padding: '10px 16px',
            backgroundColor: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
          }}
          onMouseOver={(e) => e.target.style.opacity = 0.9}
          onMouseOut={(e) => e.target.style.opacity = 1}
        >
          Accept All
        </button>
        <button 
          onClick={handleReject}
          style={{
            flex: 1,
            padding: '10px 16px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid var(--border-glass)',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          Reject All
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
