import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ userName: '', fullName: '', email: '', password: '' });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'avatar') { setAvatar(file); setAvatarPreview(url); }
    else { setCoverImage(file); setCoverPreview(url); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatar) return toast.error('Avatar image is required!');

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('avatar', avatar);
      if (coverImage) fd.append('coverImage', coverImage);

      await api.post('/register', fd);
      toast.success('Account created! Please sign in. 🎉');
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-page" style={{ alignItems: 'flex-start', paddingTop: 48, paddingBottom: 48 }}>
      <div className="auth-card fade-up" style={{ maxWidth: 540 }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">✦</div>
          <div>
            <div className="auth-title">Create Account</div>
            <div className="auth-subtitle">Join StreamVault today</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" name="fullName" placeholder="John Doe"
                value={form.fullName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" name="userName" placeholder="johndoe"
                value={form.userName} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" name="email" type="email" placeholder="john@example.com"
              value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" name="password" type="password" placeholder="Choose a strong password"
              value={form.password} onChange={handleChange} required />
          </div>

          {/* Avatar upload */}
          <div className="form-group">
            <label className="form-label">Avatar <span style={{ color: 'var(--danger)' }}>*</span></label>
            <div className="file-input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="preview" style={{
                  width: 54, height: 54, borderRadius: '50%', objectFit: 'cover',
                  border: '2px solid var(--accent-primary)', flexShrink: 0
                }} />
              ) : (
                <div style={{
                  width: 54, height: 54, borderRadius: '50%',
                  background: 'var(--bg-hover)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0
                }}>👤</div>
              )}
              <div className="file-input-label">
                <span>Click to upload</span> your avatar<br />
                <small style={{ color: 'var(--text-muted)' }}>JPG, PNG, WebP</small>
              </div>
              <input type="file" accept="image/*" onChange={(e) => handleFile(e, 'avatar')} />
            </div>
          </div>

          {/* Cover Image upload */}
          <div className="form-group">
            <label className="form-label">Cover Image <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
            <div className="file-input-wrapper" style={{ position: 'relative', padding: 0, overflow: 'hidden', height: 90, borderRadius: 'var(--radius-sm)' }}>
              {coverPreview ? (
                <img src={coverPreview} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <span style={{ fontSize: '1.4rem' }}>🖼️</span>
                  <div className="file-input-label"><span>Upload</span> cover image</div>
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => handleFile(e, 'cover')} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary form-btn" disabled={loading}>
            {loading ? <><span className="spinner" /> Creating...</> : '✓ Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')}>Sign in</button>
        </div>
      </div>
    </div>
  );
}
