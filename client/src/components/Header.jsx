import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AvatarDisplay = ({ user, size = 'sm' }) => {
  const sizeClass = `avatar avatar-${size}`;
  if (user?.avatar) {
    return <img src={user.avatar} alt={user.username} className={sizeClass} style={{ borderRadius: '50%', objectFit: 'cover', width: size === 'sm' ? 32 : 40, height: size === 'sm' ? 32 : 40 }} />;
  }
  return (
    <div className={sizeClass} style={{ width: size === 'sm' ? 32 : 40, height: size === 'sm' ? 32 : 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'var(--color-accent-light)', color: 'var(--color-accent)', fontWeight: 700, fontSize: size === 'sm' ? 13 : 16 }}>
      {user?.username?.[0]?.toUpperCase() || '?'}
    </div>
  );
};

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(250,250,248,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div className="container-wide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, gap: 16 }}>

        
        <Link to="/" style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 700, color: 'var(--color-text-primary)', textDecoration: 'none', flexShrink: 0, letterSpacing: '-0.03em' }}>
          myBlog
        </Link>

      
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 360, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-tag-bg)', borderRadius: 'var(--radius-full)', padding: '8px 16px', border: '1px solid var(--color-border)' }}>
          <svg width="16" height="16" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search blogs..."
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, width: '100%', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)' }}
          />
        </form>


        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {user ? (
            <>
            
              <Link to="/write" className="btn btn-ghost" style={{ gap: 6, display: 'flex', alignItems: 'center' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                Write
              </Link>

              
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  aria-label="User menu"
                >
                  <AvatarDisplay user={user} size="sm" />
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text-primary)' }}>{user.username}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{user.email}</div>
                    </div>
                    <Link to={`/profile/${user._id}`} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/></svg>
                      Profile
                    </Link>
                    <Link to="/my-blogs" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v8a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
                      My Stories
                    </Link>
                    <Link to="/account" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                      Settings
                    </Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item" onClick={handleLogout} style={{ color: 'var(--color-danger)' }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Sign in</Link>
              <Link to="/register" className="btn btn-primary">Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;