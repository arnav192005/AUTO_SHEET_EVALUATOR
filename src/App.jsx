import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import ReviewSession from './pages/ReviewSession';
import Export from './pages/Export';
import Account from './pages/Account';

import Login from './pages/Login';
import Landing from './pages/Landing';

// Info Pages
import Features from './pages/info/Features';
import Integrations from './pages/info/Integrations';
import Documentation from './pages/info/Documentation';
import Changelog from './pages/info/Changelog';
import About from './pages/info/About';
import Careers from './pages/info/Careers';
import Blog from './pages/info/Blog';
import Contact from './pages/info/Contact';
import Privacy from './pages/info/Privacy';
import Terms from './pages/info/Terms';
import Security from './pages/info/Security';
import CookieBanner from './components/CookieBanner';

// Force redirect to landing page on hard refresh
if (window.performance) {
  const navEntries = window.performance.getEntriesByType("navigation");
  if (navEntries.length > 0 && navEntries[0].type === "reload") {
    window.location.hash = "/";
  }
}

// A simple layout wrapper
const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem', height: '100vh', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <HashRouter>
      <CookieBanner />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Info Routes */}
        <Route path="/features" element={<Features />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/security" element={<Security />} />
        
        {/* Authenticated Routes wrapped in Layout */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/upload" element={<Layout><Upload /></Layout>} />
        <Route path="/review" element={<Layout><ReviewSession /></Layout>} />
        <Route path="/export" element={<Layout><Export /></Layout>} />
        <Route path="/account" element={<Layout><Account /></Layout>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
