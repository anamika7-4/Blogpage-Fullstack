import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000';

const CATEGORIES = ['Technology', 'Science', 'Design', 'Business', 'Culture', 'Health', 'Travel', 'Food', 'Sports', 'Other'];

const computeReadTime = (text) => {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const CreateBlog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    title: '',
    content: '',
    category: 'Technology',
    image: '',
    tags: '',
    isPublished: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValues.title.trim() || !formValues.content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Story published! 🎉');
        navigate(`/blog/${data.blog._id}`);
      } else {
        toast.error(data.message || 'Failed to create blog');
      }
    } catch {
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  const readTime = computeReadTime(formValues.content || '');
  const wordCount = formValues.content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>

        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>New Story</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>
              Write something worth reading.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/" className="btn btn-ghost">Discard</Link>
            <button
              form="create-blog-form"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? <span className="loading-dots"><span /><span /><span /></span> : (formValues.isPublished ? 'Publish' : 'Save draft')}
            </button>
          </div>
        </div>

        <form id="create-blog-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          
          <div className="form-group">
            <label className="label" htmlFor="blog-title">Title *</label>
            <input
              id="blog-title"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              placeholder="Your story title..."
              className="input"
              style={{ fontSize: 22, fontFamily: 'var(--font-serif)', fontWeight: 700, padding: '14px 16px' }}
            />
          </div>

          
          <div className="form-group">
            <label className="label" htmlFor="blog-image">Cover Image URL</label>
            <input
              id="blog-image"
              name="image"
              value={formValues.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="input"
            />
            {formValues.image && (
              <img src={formValues.image} alt="Preview" style={{ marginTop: 12, width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                onError={e => { e.target.style.display = 'none'; }} />
            )}
          </div>

          
          <div className="form-group">
            <label className="label" htmlFor="blog-category">Category *</label>
            <select
              id="blog-category"
              name="category"
              value={formValues.category}
              onChange={handleChange}
              className="input"
              style={{ cursor: 'pointer' }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          
          <div className="form-group">
            <label className="label" htmlFor="blog-tags">Tags <span style={{ textTransform: 'none', color: 'var(--color-text-muted)', fontWeight: 400 }}>(comma-separated)</span></label>
            <input
              id="blog-tags"
              name="tags"
              value={formValues.tags}
              onChange={handleChange}
              placeholder="e.g. react, webdev, javascript"
              className="input"
            />
            {formValues.tags && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {formValues.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                  <span key={tag} className="badge">#{tag}</span>
                ))}
              </div>
            )}
          </div>

    
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="label" htmlFor="blog-content">Content *</label>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                {wordCount} words · {readTime} min read
              </span>
            </div>
            <textarea
              id="blog-content"
              name="content"
              value={formValues.content}
              onChange={handleChange}
              placeholder="Tell your story..."
              className="textarea"
              style={{ minHeight: 400, fontSize: 16, lineHeight: 1.8 }}
            />
          </div>

          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-tag-bg)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Publish immediately</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>
                Toggle off to save as draft
              </div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
              <input
                type="checkbox"
                name="isPublished"
                checked={formValues.isPublished}
                onChange={handleChange}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute', cursor: 'pointer', inset: 0, borderRadius: 12,
                background: formValues.isPublished ? 'var(--color-accent)' : 'var(--color-border)',
                transition: 'var(--transition)',
              }}>
                <span style={{
                  position: 'absolute', left: formValues.isPublished ? 22 : 2, top: 2,
                  width: 20, height: 20, background: '#fff', borderRadius: '50%',
                  transition: 'var(--transition)',
                }} />
              </span>
            </label>
          </div>

        
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--color-accent)', fontSize: 16 }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Publishing as {user?.username}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{user?.email}</div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ justifyContent: 'center' }}>
            {loading ? <span className="loading-dots"><span /><span /><span /></span> : (formValues.isPublished ? '🚀 Publish Story' : '💾 Save Draft')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
