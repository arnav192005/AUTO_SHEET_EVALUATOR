import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, FileCheck2, Settings, Download, LogOut, User, Info } from 'lucide-react';
import { AppApi, getAuth, clearAuth } from '../api/client';
import './Sidebar.css';

const Sidebar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkConnection = async () => setIsConnected(await AppApi.health());

    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  const auth = getAuth();
  const role = auth?.role || 'student';
  const userName = auth?.name || (role === 'teacher' ? 'Teacher' : 'Student');

  const navItems = role === 'teacher' ? [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Create Exam', path: '/create-exam', icon: FileCheck2 },
    { name: 'Upload Sheets', path: '/upload', icon: UploadCloud },
    { name: 'Review Session', path: '/review', icon: FileCheck2 },
    { name: 'Export Grades', path: '/export', icon: Download },
    { name: 'About', path: '/about', icon: Info },
  ] : [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Results', path: '/results', icon: FileCheck2 },
    { name: 'About', path: '/about', icon: Info },
  ];

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <aside className="sidebar animate-fade-in delay-1">
      <div className="sidebar-logo">
        <div className="logo-icon">SS</div>
        <h2>ScribScore</h2>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} className="nav-icon" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="connection-status" style={{ marginBottom: '1rem', marginLeft: '0.75rem', marginRight: '0.75rem', width: 'auto' }}>
          <div className={`status-dot ${isConnected === true ? 'online' : isConnected === false ? 'offline' : 'pending'}`}></div>
          <span className="status-text">
            {isConnected === true ? 'Server Online' : isConnected === false ? 'Server Offline' : 'Connecting...'}
          </span>
        </div>

        <div className="profile-container">
          <button 
            className={`user-profile card-hover ${profileOpen ? 'open' : ''}`}
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="avatar">{userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}</div>
            <div className="user-info">
              <p className="name">{userName}</p>
              <p className="role">{role === 'teacher' ? 'Administrator' : 'Student'}</p>
            </div>
          </button>

          {profileOpen && (
            <div className="profile-dropdown animate-fade-in">
              <button className="dropdown-item" onClick={() => { navigate('/account'); setProfileOpen(false); }}>
                <User size={16} />
                <span>My Account</span>
              </button>
              <button className="dropdown-item" onClick={() => { navigate('/account'); setProfileOpen(false); }}>
                <Settings size={16} />
                <span>Preferences</span>
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
