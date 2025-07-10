import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SubmitItem from './pages/SubmitItem';
import ViewItems from './pages/ViewItems';
import Login from './pages/Login';
import { UserProvider, useUser } from './UserContext';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  return user ? children : <Navigate to="/login" />;
};

// NavBar with logout logic
const NavBar = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/logout`, {
  method: 'POST',
  credentials: 'include'
});

    setUser(null);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="custom-navbar">
      <style>{`
        .custom-navbar {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 14px 32px;
          background: linear-gradient(90deg, #1976d2 60%, #1565c0 100%);
          color: #fff;
          box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
          border-radius: 0 0 10px 10px;
          font-family: 'Segoe UI', Arial, sans-serif;
          position: sticky;
          top: 0;
          z-index: 100;

        }
        .custom-navbar span {
          margin-right: 20px;
          font-weight: 500;
          font-size: 1.08rem;
        }
        .custom-navbar a {
          color: #fff;
          text-decoration: none;
          margin-right: 18px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 4px;
          transition: background 0.15s;
        }
        .custom-navbar a:hover, .custom-navbar a.active {
          background: rgba(255,255,255,0.15);
        }
        .custom-navbar button {
          margin-left: 18px;
          padding: 7px 18px;
          background: #ff4444;
          color: #fff;
          border: none;
          border-radius: 5px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.18s;
        }
        .custom-navbar button:hover, .custom-navbar button:focus {
          background: #d32f2f;
        }
      `}</style>
      <span>Welcome, {user.name}</span>
      <Link to="/">Submit Item</Link>
      <Link to="/items">View Items</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};


// Wrapper to fetch user info on app load
const AppWithAuth = () => {
  const { setUser } = useUser();

useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/me`, {
  credentials: 'include'
});

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else if (res.status === 401) {
        setUser(null); // Clear invalid user state
      }
    } catch (err) {
      setUser(null);
    }
  };
  fetchUser();
}, [setUser]);


  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><SubmitItem /></ProtectedRoute>} />
        <Route path="/items" element={<ProtectedRoute><ViewItems /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <UserProvider>
        <Router>
          <AppWithAuth />
        </Router>
      </UserProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
