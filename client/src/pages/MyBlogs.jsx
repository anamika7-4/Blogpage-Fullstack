import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/BlogCard';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000';

const MyBlogs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, published, draft

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users/my-blogs`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setBlogs(data.blogs);
    } catch {}
    setLoading(false);
  };

  const handleDelete = async (blogId) => {
    if (!confirm('Delete this story permanently?')) return;
    try {
      const res = await fetch(`${API}/api/blogs/${blogId}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setBlogs(prev => prev.filter(b => b._id !== blogId));
        toast.success('Story deleted');
      }
    } catch { toast.error('Failed to delete'); }
  };

  const filteredBlogs = blogs.filter(b => {
    if (filter === 'published') return b.isPublished;
    if (filter === 'draft') return !b.isPublished;
    return true;
  });

  const publishedCount = blogs.filter(b => b.isPublished).length;
  const draftCount = blogs.filter(b => !b.isPublished).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>My Stories</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
              {blogs.length} total · {publishedCount} published · {draftCount} drafts
            </p>
          </div>
          <Link to="/write" className="btn btn-primary">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New story
          </Link>
        </div>

        
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--color-border)', marginBottom: 24 }}>
          {[['all', 'All'], ['published', 'Published'], ['draft', 'Drafts']].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)}
              style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: filter === key ? 700 : 400, fontSize: 14, borderBottom: filter === key ? '2px solid var(--color-text-primary)' : '2px solid transparent', color: filter === key ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', transition: 'var(--transition)' }}>
              {label}
            </button>
          ))}
        </div>

        
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ padding: '24px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 10 }} />
              <div className="skeleton" style={{ height: 14, width: '90%' }} />
            </div>
          ))
        ) : filteredBlogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✍️</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              {filter === 'draft' ? 'No drafts' : filter === 'published' ? 'No published stories' : 'No stories yet'}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>Your stories will appear here.</p>
            <Link to="/write" className="btn btn-primary">Write your first story</Link>
          </div>
        ) : (
          filteredBlogs.map(blog => (
            <div key={blog._id} style={{ position: 'relative' }}>
              <BlogCard blog={blog} />
              
              <div style={{ display: 'flex', gap: 8, position: 'absolute', bottom: 28, right: 0 }}>
                {!blog.isPublished && (
                  <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>Draft</span>
                )}
                <Link to={`/blog/${blog._id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                <button onClick={() => handleDelete(blog._id)} className="btn btn-sm" style={{ background: '#fef2f2', color: 'var(--color-danger)', border: '1px solid #fecaca' }}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
