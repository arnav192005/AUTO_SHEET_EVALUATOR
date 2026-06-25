import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import ReviewSession from './pages/ReviewSession';
import Export from './pages/Export';
import Account from './pages/Account';

import Login from './pages/Login';
import Landing from './pages/Landing';

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Authenticated Routes wrapped in Layout */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/upload" element={<Layout><Upload /></Layout>} />
        <Route path="/review" element={<Layout><ReviewSession /></Layout>} />
        <Route path="/export" element={<Layout><Export /></Layout>} />
        <Route path="/account" element={<Layout><Account /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
