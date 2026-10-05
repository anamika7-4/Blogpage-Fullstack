import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000';

const Account = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formValues, setFormValues] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    website: user?.website || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        updateUser(data.user);
        toast.success('Profile updated!');
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch { toast.error('Something went wrong'); }
    setSaving(false);
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'account', label: 'Account', icon: '⚙️' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>

        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Settings</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 40 }}>Manage your account and profile</p>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 40, alignItems: 'start' }}>

        
          <nav style={{ position: 'sticky', top: 88 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px',
                  borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: activeTab === tab.id ? 'var(--color-tag-bg)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  fontWeight: activeTab === tab.id ? 600 : 400, fontSize: 15,
                  marginBottom: 4, transition: 'var(--transition)',
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            <hr className="divider" />
            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px',
                borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                background: 'transparent', color: 'var(--color-danger)', fontWeight: 500, fontSize: 15,
                transition: 'var(--transition)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
              Sign out
            </button>
          </nav>

          
          <div>
            {activeTab === 'profile' && (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Public profile</h2>

                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--color-border)' }}>
                    {formValues.avatar ? (
                      <img src={formValues.avatar} alt="Avatar" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }}
                        onError={e => e.target.style.display = 'none'} />
                    ) : (
                      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700 }}>
                        {user?.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="label" htmlFor="acct-avatar">Avatar URL</label>
                      <input id="acct-avatar" name="avatar" value={formValues.avatar} onChange={handleChange} className="input" placeholder="https://..." />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="form-group">
                      <label className="label" htmlFor="acct-username">Username</label>
                      <input id="acct-username" name="username" value={formValues.username} onChange={handleChange} className="input" />
                    </div>

                    <div className="form-group">
                      <label className="label" htmlFor="acct-bio">Bio</label>
                      <textarea id="acct-bio" name="bio" value={formValues.bio} onChange={handleChange} className="textarea"
                        placeholder="Tell readers about yourself..." style={{ minHeight: 100 }} />
                    </div>

                    <div className="form-group">
                      <label className="label" htmlFor="acct-website">Website</label>
                      <input id="acct-website" name="website" value={formValues.website} onChange={handleChange} className="input" placeholder="https://yoursite.com" />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <Link to={`/profile/${user?._id}`} className="btn btn-ghost">View profile</Link>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <span className="loading-dots"><span /><span /><span /></span> : 'Save changes'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'account' && (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Account details</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="form-group">
                      <label className="label" htmlFor="acct-email">Email address</label>
                      <input id="acct-email" name="email" type="email" value={formValues.email} onChange={handleChange} className="input" />
                    </div>
                  </div>
                </div>

                
                <div style={{ background: '#fff8f8', border: '1px solid #fecaca', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 8 }}>Danger zone</h3>
                  <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 16 }}>Once you sign out, you'll need your credentials to sign back in.</p>
                  <button type="button" onClick={handleLogout} className="btn btn-danger btn-sm">Sign out of all sessions</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <span className="loading-dots"><span /><span /><span /></span> : 'Save changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
