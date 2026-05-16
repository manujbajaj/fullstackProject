import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ userName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [useEmail, setUseEmail] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        password: form.password,
        ...(useEmail ? { email: form.email, userName: '' } : { userName: form.userName, email: '' }),
      };
      const res = await api.post('/login', payload);
      const { user, accessToken, refreshToken } = res.data.data;
      login(user, { accessToken, refreshToken });
      toast.success(`Welcome back, ${user.fullName || user.userName}! 👋`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-page">
      <div className="auth-card fade-up">
        <div className="auth-logo">
          <div className="auth-logo-icon">▶</div>
          <div>
            <div className="auth-title">Welcome back</div>
            <div className="auth-subtitle">Sign in to your StreamVault account</div>
          </div>
        </div>

        {/* Toggle */}
        <div style={{
          display: 'flex', gap: 0, marginBottom: 22,
          background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)',
          padding: 4
        }}>
          {['Username', 'Email'].map((label, i) => (
            <button key={label} onClick={() => setUseEmail(i === 1)}
              style={{
                flex: 1, padding: '8px', border: 'none', borderRadius: 6,
                fontFamily: 'inherit', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
                transition: 'all 0.2s',
                background: (i === 0 && !useEmail) || (i === 1 && useEmail) ? 'var(--accent-gradient)' : 'transparent',
                color: (i === 0 && !useEmail) || (i === 1 && useEmail) ? 'white' : 'var(--text-secondary)',
              }}>
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {!useEmail ? (
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" name="userName" placeholder="johndoe"
                value={form.userName} onChange={handleChange} required autoFocus />
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" name="email" type="email" placeholder="john@example.com"
                value={form.email} onChange={handleChange} required autoFocus />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" name="password" type="password" placeholder="••••••••"
              value={form.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary form-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : '→'} &nbsp;{loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')}>Create one</button>
        </div>
      </div>
    </div>
  );
}
