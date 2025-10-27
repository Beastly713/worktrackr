import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Header = () => {
  const { user, logout } = useAuth();

  const onLogout = () => {
    logout();
    toast.success('Logged out');
    // No need to navigate, App will re-render and ProtectedRoute will redirect
  };

  // Simple inline styles
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#f4f4f4',
    borderBottom: '1px solid #ccc',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
  };

  const navStyle = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  };

  const buttonStyle = {
    padding: '0.3rem 0.6rem',
    cursor: 'pointer',
  };

  return (
    <header style={headerStyle}>
      <div className="logo">
        <Link to="/" style={linkStyle}>WorkTrackr</Link>
      </div>
      <nav style={navStyle}>
        {user ? (
          <>
            <span>{user.email}</span>
            <button onClick={onLogout} style={buttonStyle}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;