import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AvatarDisplay } from '../components/BlogCard';
import BlogCard from '../components/BlogCard';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users/${id}/profile`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setProfileData(data);
    } catch {}
    setLoading(false);
  };

  if (loading) return (
    <div style={{ maxWidth: 760, margin: '80px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', gap: 20, marginBottom: 40 }}>
        <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%' }} />
        <div>
          <div className="skeleton" style={{ width: 200, height: 24, marginBottom: 10 }} />
          <div className="skeleton" style={{ width: 300, height: 16 }} />
        </div>
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{ padding: '24px 0', borderBottom: '1px solid var(--color-border)' }}>
          <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 14, width: '90%' }} />
        </div>
      ))}
    </div>
  );

  if (!profileData) return (
    <div style={{ textAlign: 'center', padding: '120px 24px', color: 'var(--color-text-muted)' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
      <h2 style={{ fontSize: 24, fontWeight: 700 }}>User not found</h2>
    </div>
  );

  const { user, blogs } = profileData;
  const isOwnProfile = currentUser?._id === user._id;
  const publishedBlogs = blogs.filter(b => b.isPublished);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px' }}>

        
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 40 }}
          className="animate-fade-in-up">
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-border)' }} />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700 }}>
                  {user.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>{user.username}</h1>
              {user.bio && <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 480 }}>{user.bio}</p>}
              {user.website && (
                <a href={user.website} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 14, color: 'var(--color-accent)', textDecoration: 'none', marginTop: 8, display: 'inline-block' }}>
                  🌐 {user.website.replace(/https?:\/\//, '')}
                </a>
              )}
              <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>{publishedBlogs.length}</strong> Stories
                </span>
                <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
                  Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {isOwnProfile && (
            <Link to="/account" className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>Edit profile</Link>
          )}
        </div>

        <hr className="divider" />

        
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            {isOwnProfile ? 'Your stories' : `Stories by ${user.username}`}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>
            {publishedBlogs.length} published {publishedBlogs.length === 1 ? 'story' : 'stories'}
          </p>

          {publishedBlogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✍️</div>
              <p style={{ fontSize: 16 }}>No stories published yet.</p>
              {isOwnProfile && (
                <Link to="/write" className="btn btn-primary" style={{ marginTop: 20 }}>Write your first story</Link>
              )}
            </div>
          ) : (
            publishedBlogs.map(blog => <BlogCard key={blog._id} blog={blog} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
