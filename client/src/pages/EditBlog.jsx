import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000';
const CATEGORIES = ['Technology', 'Science', 'Design', 'Business', 'Culture', 'Health', 'Travel', 'Food', 'Sports', 'Other'];

const EditBlog = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState({
    title: '', content: '', category: 'Technology', image: '', tags: '', isPublished: true,
  });

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`${API}/api/blogs/${id}`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        const b = data.blog;
        if (b.author?._id !== user?._id) {
          toast.error('Not authorized');
          navigate('/');
          return;
        }
        setFormValues({
          title: b.title || '',
          content: b.content || '',
          category: b.category || 'Technology',
          image: b.image || '',
          tags: (b.tags || []).join(', '),
          isPublished: b.isPublished,
        });
      }
    } catch { toast.error('Failed to load blog'); navigate('/'); }
    setLoading(false);
  };

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
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Story updated!');
        navigate(`/blog/${id}`);
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch { toast.error('Something went wrong'); }
    setSaving(false);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="loading-dots" style={{ color: 'var(--color-accent)', fontSize: 24 }}><span /><span /><span /></div>
    </div>
  );

  const wordCount = formValues.content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700 }}>Edit Story</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>Make your story even better.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to={`/blog/${id}`} className="btn btn-ghost">Cancel</Link>
            <button form="edit-blog-form" type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="loading-dots"><span /><span /><span /></span> : 'Save changes'}
            </button>
          </div>
        </div>

        <form id="edit-blog-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          <div className="form-group">
            <label className="label" htmlFor="edit-title">Title *</label>
            <input id="edit-title" name="title" value={formValues.title} onChange={handleChange} className="input"
              style={{ fontSize: 22, fontFamily: 'var(--font-serif)', fontWeight: 700, padding: '14px 16px' }} />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="edit-image">Cover Image URL</label>
            <input id="edit-image" name="image" value={formValues.image} onChange={handleChange} className="input" placeholder="https://..." />
            {formValues.image && (
              <img src={formValues.image} alt="Preview" style={{ marginTop: 12, width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                onError={e => e.target.style.display = 'none'} />
            )}
          </div>

          <div className="form-group">
            <label className="label" htmlFor="edit-category">Category *</label>
            <select id="edit-category" name="category" value={formValues.category} onChange={handleChange} className="input" style={{ cursor: 'pointer' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="edit-tags">Tags</label>
            <input id="edit-tags" name="tags" value={formValues.tags} onChange={handleChange} className="input" placeholder="react, webdev..." />
            {formValues.tags && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {formValues.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                  <span key={tag} className="badge">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="label" htmlFor="edit-content">Content *</label>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{wordCount} words · {readTime} min</span>
            </div>
            <textarea id="edit-content" name="content" value={formValues.content} onChange={handleChange} className="textarea"
              style={{ minHeight: 400, fontSize: 16, lineHeight: 1.8 }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-tag-bg)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Published</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Visible to all readers</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
              <input type="checkbox" name="isPublished" checked={formValues.isPublished} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', cursor: 'pointer', inset: 0, borderRadius: 12, background: formValues.isPublished ? 'var(--color-accent)' : 'var(--color-border)', transition: 'var(--transition)' }}>
                <span style={{ position: 'absolute', left: formValues.isPublished ? 22 : 2, top: 2, width: 20, height: 20, background: '#fff', borderRadius: '50%', transition: 'var(--transition)' }} />
              </span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ justifyContent: 'center' }}>
            {saving ? <span className="loading-dots"><span /><span /><span /></span> : '💾 Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
