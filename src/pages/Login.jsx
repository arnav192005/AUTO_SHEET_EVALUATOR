import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="login-page animate-fade-in">
      <div className="flip-container">
        <input type="checkbox" id="signup_toggle" />
        <div className="form-wrapper">
          {/* Front: Login */}
          <form className="form_front" onSubmit={handleLogin}>
            <div className="login-header-inner">
              <h1>ScribScore</h1>
              <p>System Authentication</p>
            </div>
            <input placeholder="Email" className="flip-input" type="email" required />
            <input placeholder="Password" className="flip-input" type="password" required />
            <button type="submit" className="flip-btn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
            <span className="switch">Don't have an account? 
                <label className="signup_tog" htmlFor="signup_toggle">
                    Sign Up
                </label>
            </span>
          </form>

          {/* Back: Sign Up */}
          <form className="form_back" onSubmit={(e) => e.preventDefault()}>
            <div className="login-header-inner">
              <h1>ScribScore</h1>
              <p>System Registration</p>
            </div>
            <input placeholder="Firstname" className="flip-input" type="text" required />
            <input placeholder="Email" className="flip-input" type="email" required />
            <input placeholder="Password" className="flip-input" type="password" required />
            <button type="submit" className="flip-btn">Register</button>
            <span className="switch">Already have an account? 
                <label className="signup_tog" htmlFor="signup_toggle">
                    Sign In
                </label>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
