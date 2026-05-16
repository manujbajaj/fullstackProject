import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';

/* ---- Profile Tab ---- */
function ProfileTab({ user, refreshUser }) {
  const [form, setForm] = useState({
    updatedUsername: user.userName || '',
    updatedEmail: user.email || '',
    fullName: user.fullName || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch('/update-details', form);
      toast.success('Profile updated! ✓');
      refreshUser();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="card fade-up">
      <div className="card-title">✏️ Edit Profile</div>
      <form onSubmit={handleUpdate}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" name="updatedUsername" value={form.updatedUsername} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" name="fullName" value={form.fullName} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" name="updatedEmail" type="email" value={form.updatedEmail} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <><span className="spinner" /> Saving...</> : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

/* ---- Password Tab ---- */
function PasswordTab() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return toast.error('Passwords do not match!');
    setLoading(true);
    try {
      await api.post('/change-password', form);
      toast.success('Password changed successfully! 🔒');
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password.');
    } finally { setLoading(false); }
  };

  return (
    <div className="card fade-up">
      <div className="card-title">🔐 Change Password</div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Current Password</label>
          <input className="form-input" name="oldPassword" type="password" placeholder="••••••••"
            value={form.oldPassword} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input className="form-input" name="newPassword" type="password" placeholder="••••••••"
              value={form.newPassword} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" name="confirmPassword" type="password" placeholder="••••••••"
              value={form.confirmPassword} onChange={handleChange} required />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <><span className="spinner" /> Updating...</> : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

/* ---- Avatar Tab ---- */
function AvatarTab({ refreshUser }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select an image');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      await api.patch('/change-avatar', fd);
      toast.success('Avatar updated! 🖼️');
      setFile(null); setPreview(null);
      refreshUser();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update avatar.');
    } finally { setLoading(false); }
  };

  return (
    <div className="card fade-up">
      <div className="card-title">🖼️ Update Avatar</div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="file-input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {preview ? (
              <img src={preview} alt="new avatar" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-primary)', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>👤</div>
            )}
            <div className="file-input-label">
              <span>Click to select</span> a new avatar<br />
              <small style={{ color: 'var(--text-muted)' }}>JPG, PNG, WebP recommended</small>
            </div>
            <input type="file" accept="image/*" onChange={handleFile} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading || !file}>
          {loading ? <><span className="spinner" /> Uploading...</> : 'Upload Avatar'}
        </button>
      </form>
    </div>
  );
}

/* ---- Cover Image Tab ---- */
function CoverTab({ refreshUser }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select an image');
    setLoading(true);
    try {
      const fd = new FormData(); fd.append('coverImage', file);
      await api.patch('/update-coverImage', fd);
      toast.success('Cover image updated!');
      setFile(null); setPreview(null);
      refreshUser();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update cover image.');
    } finally { setLoading(false); }
  };

  return (
    <div className="card fade-up">
      <div className="card-title">🎨 Update Cover Image</div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="file-input-wrapper" style={{ padding: 0, overflow: 'hidden', height: 120 }}>
            {preview ? (
              <img src={preview} alt="cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.8rem' }}>🖼️</span>
                <div className="file-input-label"><span>Upload</span> a cover image</div>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFile} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading || !file}>
          {loading ? <><span className="spinner" /> Uploading...</> : 'Upload Cover'}
        </button>
      </form>
    </div>
  );
}

/* ---- Watch History Tab ---- */
function HistoryTab() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/history')
      .then(res => setHistory(res.data.data || []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="card" style={{ textAlign: 'center', padding: 48 }}>
      <div className="spinner" style={{ margin: '0 auto', width: 32, height: 32, borderWidth: 3 }} />
    </div>
  );

  if (!history.length) return (
    <div className="card">
      <div className="empty-state">
        <div className="icon">📺</div>
        <p>No watch history yet. Start watching videos!</p>
      </div>
    </div>
  );

  return (
    <div className="card fade-up">
      <div className="card-title">📺 Watch History ({history.length})</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {history.map((video, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
            background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)'
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 8, background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>▶</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{video.title || 'Untitled Video'}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {video.owner?.fullName || 'Unknown Channel'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Channel Search Tab ---- */
function ChannelTab() {
  const [username, setUsername] = useState('');
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true); setError(''); setChannel(null);
    try {
      const res = await api.get(`/c/${username.trim()}`);
      setChannel(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Channel not found');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="card fade-up">
        <div className="card-title">📡 Search Channel</div>
        <form onSubmit={search} style={{ display: 'flex', gap: 10 }}>
          <input className="form-input" placeholder="Enter username..." value={username}
            onChange={e => setUsername(e.target.value)} style={{ flex: 1 }} />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner" /> : '🔍 Search'}
          </button>
        </form>
        {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: '0.875rem' }}>⚠ {error}</p>}
      </div>

      {channel && (
        <div className="card fade-up">
          {channel.coverImage
            ? <img src={channel.coverImage} alt="cover" className="profile-cover" />
            : <div className="profile-cover-placeholder">No Cover Image</div>}
          <div className="profile-header">
            {channel.avatar
              ? <img src={channel.avatar} alt="avatar" className="profile-avatar" />
              : <div className="profile-avatar-placeholder">{(channel.fullName || '?')[0]}</div>}
            <div className="profile-info">
              <div className="profile-name">{channel.fullName}</div>
              <div className="profile-username">@{channel.username || channel.userName}</div>
              <div className="profile-email">{channel.email}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <div className="stat-chip">👥 <strong>{channel.subscribersCount}</strong> Subscribers</div>
            <div className="stat-chip">📡 <strong>{channel.channelsSubscribedToCount}</strong> Subscriptions</div>
            {channel.isSubscribed !== undefined && (
              <div className="stat-chip" style={{ borderColor: channel.isSubscribed ? 'var(--success)' : 'var(--border)' }}>
                {channel.isSubscribed ? '✅ Subscribed' : '➕ Not Subscribed'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== MAIN DASHBOARD ===== */
const TABS = ['Profile', 'Password', 'Avatar', 'Cover', 'History', 'Channel'];
const TAB_ICONS = ['✏️', '🔐', '🖼️', '🎨', '📺', '📡'];

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="page-container">
      {/* Profile Header */}
      <div className="fade-up" style={{ marginBottom: 32 }}>
        {user?.coverImage
          ? <img src={user.coverImage} alt="cover" className="profile-cover" />
          : <div className="profile-cover-placeholder">No Cover Image</div>}

        <div className="profile-header">
          {user?.avatar
            ? <img src={user.avatar} alt="avatar" className="profile-avatar" />
            : <div className="profile-avatar-placeholder">{(user?.fullName || 'U')[0].toUpperCase()}</div>}
          <div className="profile-info">
            <div className="profile-name">{user?.fullName}</div>
            <div className="profile-username">@{user?.userName}</div>
            <div className="profile-email">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ flexWrap: 'wrap', gap: 0 }}>
        {TABS.map((tab, i) => (
          <button key={tab} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>
            {TAB_ICONS[i]} {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 0 && <ProfileTab user={user} refreshUser={refreshUser} />}
      {activeTab === 1 && <PasswordTab />}
      {activeTab === 2 && <AvatarTab refreshUser={refreshUser} />}
      {activeTab === 3 && <CoverTab refreshUser={refreshUser} />}
      {activeTab === 4 && <HistoryTab />}
      {activeTab === 5 && <ChannelTab />}
    </div>
  );
}
