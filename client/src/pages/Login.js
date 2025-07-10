import React, { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';

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
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/google`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ credential: credentialResponse.credential }),
});

      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      setUser(data.user); // Store user info in context (not localStorage!)
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Login with Google</h2>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => alert('Login failed')}
      />
    </div>
  );
};

export default Login;
