import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SubmitItem from './pages/SubmitItem';
import ViewItems from './pages/ViewItems';
import Login from './pages/Login';
import { UserProvider, useUser } from './UserContext';
import { FaPlusCircle, FaListUl, FaSignOutAlt, FaUser } from 'react-icons/fa';

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  return user ? children : <Navigate to="/login" />;
};

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
    <nav className="glass-navbar">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        .glass-navbar {
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          box-shadow: 
            0 8px 32px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.2);
          color: #fff;
          margin: 20px auto;
          max-width: 1200px;
          width: calc(100% - 40px);
          position: sticky;
          top: 20px;
          z-index: 100;
          transition: all 0.3s ease;
        }
        
        .glass-navbar:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          box-shadow: 
            0 12px 40px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.3);
        }
        
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          font-size: 1.1rem;
          color: #fff;
        }
        
        .nav-brand .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .glass-navbar a {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fff;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          padding: 12px 18px;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .glass-navbar a::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 12px;
        }
        
        .glass-navbar a:hover::before {
          opacity: 1;
        }
        
        .glass-navbar a:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .glass-navbar a.active {
          background: rgba(255,255,255,0.2);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          background: linear-gradient(135deg, #ff6b6b, #ee5a52);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(238, 90, 82, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .logout-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .logout-btn:hover::before {
          opacity: 1;
        }
        
        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(238, 90, 82, 0.4);
        }
        
        .logout-btn:active {
          transform: translateY(0);
        }
        
        @media (max-width: 768px) {
          .glass-navbar {
            padding: 12px 20px;
            margin: 15px auto;
            width: calc(100% - 30px);
            flex-wrap: wrap;
            gap: 12px;
          }
          
          .nav-brand {
            font-size: 1rem;
          }
          
          .nav-brand .user-avatar {
            width: 35px;
            height: 35px;
          }
          
          .nav-links {
            gap: 6px;
          }
          
          .glass-navbar a, .logout-btn {
            padding: 10px 14px;
            font-size: 0.9rem;
          }
        }
        
        .app-background {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow-x: hidden;
        }
        
        .app-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .app-content {
          position: relative;
          z-index: 1;
          padding-bottom: 60px;
        }
        
        /* Floating animation for background elements */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .floating-element {
          position: absolute;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }
        
        .floating-1 {
          width: 80px;
          height: 80px;
          top: 10%;
          left: 10%;
          animation-delay: -2s;
        }
        
        .floating-2 {
          width: 120px;
          height: 120px;
          top: 60%;
          right: 15%;
          animation-delay: -4s;
        }
        
        .floating-3 {
          width: 60px;
          height: 60px;
          bottom: 20%;
          left: 20%;
          animation-delay: -1s;
        }
      `}</style>
      
      <div className="nav-brand">
        <div className="user-avatar">
          <FaUser />
        </div>
        <span>Hi, {user.name}</span>
      </div>
      
      <div className="nav-links">
        <Link to="/" className={window.location.pathname === '/' ? 'active' : ''}>
          <FaPlusCircle /> Submit Item
        </Link>
        <Link to="/items" className={window.location.pathname === '/items' ? 'active' : ''}>
          <FaListUl /> View Items
        </Link>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
};

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
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, [setUser]);

  return (
    <div className="app-background">
      {/* Floating background elements */}
      <div className="floating-element floating-1"></div>
      <div className="floating-element floating-2"></div>
      <div className="floating-element floating-3"></div>
      
      <div className="app-content">
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><SubmitItem /></ProtectedRoute>} />
          <Route path="/items" element={<ProtectedRoute><ViewItems /></ProtectedRoute>} />
        </Routes>
      </div>
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