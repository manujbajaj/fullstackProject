import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">▶</div>
          StreamVault
        </Link>

        <div className="navbar-actions">
          {user ? (
            <>
              <div className="navbar-user">
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="navbar-avatar" />
                ) : (
                  <div className="navbar-avatar-placeholder">
                    {(user.fullName || user.userName || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  {user.fullName || user.userName}
                </span>
              </div>
              <Link to="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
