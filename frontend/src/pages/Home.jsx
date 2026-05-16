import { Link, useNavigate } from 'react-router-dom';

const features = [
  { icon: '🔐', title: 'Secure Auth', desc: 'JWT-based access & refresh tokens with HttpOnly cookies.' },
  { icon: '☁️', title: 'Cloud Storage', desc: 'Avatar and cover photos stored on Cloudinary CDN.' },
  { icon: '📺', title: 'Watch History', desc: 'Track your video consumption over time.' },
  { icon: '📡', title: 'Channel Profiles', desc: 'View subscriber counts and subscriptions.' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section className="center-page" style={{ minHeight: 'calc(100vh - 70px)', flexDirection: 'column', textAlign: 'center', gap: 0 }}>
        <div className="fade-up" style={{ maxWidth: 680 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 'var(--radius-full)',
            background: 'rgba(124,58,237,0.12)', border: '1px solid var(--border-accent)',
            fontSize: '0.78rem', color: 'var(--accent-light)', fontWeight: 600,
            marginBottom: 28, letterSpacing: '0.5px', textTransform: 'uppercase'
          }}>
            ✦ Full-Stack Demo
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 900,
            letterSpacing: '-2px', lineHeight: 1.08, marginBottom: 20,
            background: 'linear-gradient(135deg, #f0f0f8 0%, #a855f7 60%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Your Personal<br />StreamVault
          </h1>

          <p style={{
            fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: 500,
            margin: '0 auto 36px', lineHeight: 1.7
          }}>
            A modern video platform with secure authentication, cloud media, and channel profiles. Built on Node.js + MongoDB.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ padding: '13px 28px', fontSize: '1rem' }}
              onClick={() => navigate('/register')}>
              Create Account →
            </button>
            <button className="btn btn-ghost" style={{ padding: '13px 28px', fontSize: '1rem' }}
              onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </div>

        {/* Gradient orb */}
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          pointerEvents: 'none', zIndex: -1
        }} />
      </section>

      {/* Features */}
      <section className="page-container" style={{ paddingTop: 0 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18
        }}>
          {features.map((f, i) => (
            <div key={i} className="card fade-up" style={{
              animationDelay: `${i * 0.08}s`,
              display: 'flex', flexDirection: 'column', gap: 12, cursor: 'default',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: '1.8rem' }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: 40, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Backend running at <code style={{ color: 'var(--accent-light)', background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: 4 }}>http://localhost:8000</code> — Powered by Express + MongoDB
        </p>
      </section>
    </div>
  );
}
