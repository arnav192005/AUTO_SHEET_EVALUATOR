import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, FileCheck2, Settings, Download, LogOut, User } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const authData = localStorage.getItem('auth');
  let role = 'teacher';
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      role = parsed.role || 'teacher';
    } catch (e) {}
  }

  const navItems = role === 'teacher' ? [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Sheets', path: '/upload', icon: UploadCloud },
    { name: 'Review Session', path: '/review', icon: FileCheck2 },
    { name: 'Export Grades', path: '/export', icon: Download },
  ] : [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Results', path: '/results', icon: FileCheck2 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth');
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
        <div className="profile-container">
          <button 
            className={`user-profile card-hover ${profileOpen ? 'open' : ''}`}
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="avatar">{role === 'teacher' ? 'AP' : 'ST'}</div>
            <div className="user-info">
              <p className="name">{role === 'teacher' ? 'Arnav Panwala' : 'Student User'}</p>
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
