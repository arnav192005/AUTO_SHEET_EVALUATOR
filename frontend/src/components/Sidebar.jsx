import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, FileCheck2, Settings, Download, LogOut, User } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Sheets', path: '/upload', icon: UploadCloud },
    { name: 'Review Session', path: '/review', icon: FileCheck2 },
    { name: 'Export Grades', path: '/export', icon: Download },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <aside className="sidebar animate-fade-in delay-1">
      <div className="sidebar-logo">
        <div className="logo-icon">AE</div>
        <h2>AutoEval</h2>
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
            <div className="avatar">PA</div>
            <div className="user-info">
              <p className="name">Prof. Anderson</p>
              <p className="role">Administrator</p>
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
