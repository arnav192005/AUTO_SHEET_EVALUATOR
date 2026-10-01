import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { getAuth, clearAuth } from './api/client';
import Sidebar from './components/Sidebar';
// Shared page styles (page-header, tables, badges) used by every signed-in page.
import './pages/Dashboard.css';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const GradedSheets = lazy(() => import('./pages/GradedSheets'));
const ScoreAnalytics = lazy(() => import('./pages/ScoreAnalytics'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const StudentUpload = lazy(() => import('./pages/StudentUpload'));
const MyResults = lazy(() => import('./pages/MyResults'));
const Upload = lazy(() => import('./pages/Upload'));
const ExamSetup = lazy(() => import('./pages/ExamSetup'));
const ReviewSession = lazy(() => import('./pages/ReviewSession'));
const Export = lazy(() => import('./pages/Export'));
const Account = lazy(() => import('./pages/Account'));

import Login from './pages/Login';
import Landing from './pages/Landing';

// Info Pages
const Features = lazy(() => import('./pages/info/Features'));
const Integrations = lazy(() => import('./pages/info/Integrations'));
const Documentation = lazy(() => import('./pages/info/Documentation'));
const Changelog = lazy(() => import('./pages/info/Changelog'));
const About = lazy(() => import('./pages/info/About'));
const Careers = lazy(() => import('./pages/info/Careers'));
const Blog = lazy(() => import('./pages/info/Blog'));
const Contact = lazy(() => import('./pages/info/Contact'));
const Privacy = lazy(() => import('./pages/info/Privacy'));
const Terms = lazy(() => import('./pages/info/Terms'));
const Security = lazy(() => import('./pages/info/Security'));
import CookieBanner from './components/CookieBanner';

const RoleBasedDashboard = () => {
  const auth = getAuth();
  return auth?.role === 'student' ? <StudentDashboard /> : <Dashboard />;
};

// Signed-in users only; optionally restricted to one role. The backend enforces
// the same rules, this just keeps people out of pages they can't use.
const ProtectedRoute = ({ children, role }) => {
  const auth = getAuth();
  if (!auth) {
    clearAuth();
    return <Navigate to="/login" replace />;
  }
  if (role && auth.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const Layout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <main className="app-main">{children}</main>
  </div>
);

const NotFound = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
    <h1>Page not found</h1>
    <p className="text-muted">The page you are looking for doesn't exist.</p>
    <Link to="/" className="btn-primary">Back to Home</Link>
  </div>
);

const page = (element, role) => (
  <ProtectedRoute role={role}><Layout>{element}</Layout></ProtectedRoute>
);

function App() {
  return (
    <HashRouter>
      <CookieBanner />
      <Suspense fallback={<div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading…</div>}>
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
        <Route path="/dashboard" element={page(<RoleBasedDashboard />)} />
        <Route path="/account" element={page(<Account />)} />

        {/* Student pages */}
        <Route path="/submit-sheet" element={page(<StudentUpload />, 'student')} />
        <Route path="/results" element={page(<MyResults />, 'student')} />

        {/* Teacher pages */}
        <Route path="/create-exam" element={page(<ExamSetup />, 'teacher')} />
        <Route path="/upload" element={page(<Upload />, 'teacher')} />
        <Route path="/review" element={page(<ReviewSession />, 'teacher')} />
        <Route path="/graded-sheets" element={page(<GradedSheets />, 'teacher')} />
        <Route path="/analytics" element={page(<ScoreAnalytics />, 'teacher')} />
        <Route path="/export" element={page(<Export />, 'teacher')} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
