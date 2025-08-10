import React, { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // External styles for cleaner code

const Login = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/items');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/google`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ credential: credentialResponse.credential }),
        }
      );

      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-subtitle">Sign in to continue</p>
        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert('Login failed')}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
