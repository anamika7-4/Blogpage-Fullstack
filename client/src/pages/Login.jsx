import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValues.username || !formValues.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    const data = await login(formValues.username, formValues.password);
    setLoading(false);
    if (data.success) {
      toast.success(`Welcome back, ${data.user.username}!`);
      navigate('/');
    } else {
      toast.error(data.message || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-bg)' }}>

      
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px', background: 'var(--color-text-primary)', color: '#fff',
        display: 'none',
      }}
        className="auth-left-panel">
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 40, fontWeight: 700, lineHeight: 1.2, marginBottom: 24 }}>
          "The scariest moment is always just before you start."
        </div>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>— Stephen King</p>
      </div>

      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 400 }} className="animate-fade-in-up">

          <div style={{ marginBottom: 40 }}>
            <Link to="/" style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)', textDecoration: 'none' }}>
              myBlog
            </Link>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 32, marginBottom: 8, letterSpacing: '-0.02em' }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>
              Sign in to continue reading and writing.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="label" htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                value={formValues.username}
                onChange={handleChange}
                type="text"
                placeholder="Enter your username"
                className="input"
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="input"
                  autoComplete="current-password"
                  style={{ paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                  ) : (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
            >
              {loading ? (
                <span className="loading-dots"><span /><span /><span /></span>
              ) : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 15, color: 'var(--color-text-secondary)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--color-text-primary)', fontWeight: 600, textDecoration: 'underline' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;