import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { AppApi, getAuth, setAuth } from '../api/client';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('teacher'); // 'teacher' or 'student'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRoll, setRegRoll] = useState('');
  const [regPassword, setRegPassword] = useState('');

  useEffect(() => {
    // If already logged in, go straight to dashboard
    if (getAuth()) navigate('/dashboard', { replace: true });
  }, [navigate]);

  const finishLogin = (auth) => {
    setAuth(auth);
    navigate('/dashboard');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      finishLogin(await AppApi.login(email.trim(), password, role));
    } catch (err) {
      setError(err.message || 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (role !== 'student') {
      setError('Teacher accounts are created by your administrator. Please register as a student.');
      return;
    }
    const name = regName.trim();
    const regEmailTrim = regEmail.trim();
    const roll = regRoll.trim();
    if (!name) return setError('Please enter your name.');
    if (!roll) return setError('Please enter your roll number.');
    if (!regEmailTrim.includes('@')) return setError('Please enter a valid email address.');
    if (regPassword.length < 6) return setError('Password must be at least 6 characters.');

    setLoading(true);
    try {
      finishLogin(await AppApi.register({ name, email: regEmailTrim, password: regPassword, roll_number: roll }));
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page animate-fade-in" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 100 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#FAFAFA', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600, padding: '0.6rem 1.2rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', backdropFilter: 'blur(10px)', transition: 'all 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-glass)'}>
          <ArrowLeft size={18} /> Back to Home
        </Link>
      </div>
      <div className="flip-container">
        <input type="checkbox" id="signup_toggle" />
        <div className="form-wrapper">
          {/* Front: Login */}
          <form className="form_front" onSubmit={handleLogin}>
            <div className="login-header-inner">
              <h1>ScribScore</h1>
              <p>System Authentication</p>
            </div>
            
            <div className="role-selector" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', width: '100%' }}>
              <button 
                type="button" 
                onClick={() => setRole('teacher')} 
                className={role === 'teacher' ? 'btn-primary' : 'btn-secondary'}
                style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', margin: 0, justifyContent: 'center' }}
              >
                Teacher
              </button>
              <button 
                type="button" 
                onClick={() => setRole('student')} 
                className={role === 'student' ? 'btn-primary' : 'btn-secondary'}
                style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', margin: 0, justifyContent: 'center' }}
              >
                Student
              </button>
            </div>

            <input 
              placeholder="Email" 
              className="flip-input" 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                placeholder="Password" 
                className="flip-input" 
                type={showPassword ? "text" : "password"} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '2.5rem' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {error && <p style={{ color: '#ff3333', fontSize: '0.85rem', margin: '0 0 10px 0', textAlign: 'center' }}>{error}</p>}
            
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
          <form className="form_back" onSubmit={handleRegister}>
            <div className="login-header-inner">
              <h1>ScribScore</h1>
              <p>System Registration</p>
            </div>

            <div className="role-selector" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', width: '100%' }}>
              <button 
                type="button" 
                onClick={() => setRole('teacher')} 
                className={role === 'teacher' ? 'btn-primary' : 'btn-secondary'}
                style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', margin: 0, justifyContent: 'center' }}
              >
                Teacher
              </button>
              <button 
                type="button" 
                onClick={() => setRole('student')} 
                className={role === 'student' ? 'btn-primary' : 'btn-secondary'}
                style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', margin: 0, justifyContent: 'center' }}
              >
                Student
              </button>
            </div>

            {role === 'teacher' && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 0.5rem', textAlign: 'center' }}>
                Teacher accounts are created by your administrator.
              </p>
            )}
            <input placeholder="Full name" aria-label="Full name" className="flip-input" type="text" required value={regName} onChange={(e) => setRegName(e.target.value)} />
            <input placeholder="Roll number" aria-label="Roll number" className="flip-input" type="text" required value={regRoll} onChange={(e) => setRegRoll(e.target.value)} />
            <input placeholder="Email" aria-label="Email" className="flip-input" type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                placeholder="Password" 
                className="flip-input" 
                type={showPassword ? "text" : "password"} 
                required
                aria-label="Password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                style={{ paddingRight: '2.5rem' }} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p style={{ color: '#ff3333', fontSize: '0.85rem', margin: '0 0 10px 0', textAlign: 'center' }}>{error}</p>}
            <button type="submit" className="flip-btn" disabled={loading || role !== 'student'}>
              {loading ? 'Registering...' : 'Register'}
            </button>
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
