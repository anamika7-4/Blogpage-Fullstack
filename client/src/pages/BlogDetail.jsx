import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AvatarDisplay } from '../components/BlogCard';
import BlogCard from '../components/BlogCard';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000';

const BlogDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    fetchBlog();
    fetchComments();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/blogs/${id}`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setBlog(data.blog);
        setLikesCount(data.blog.likes?.length || 0);
        if (user) setLiked(data.blog.likes?.includes(user._id));
        fetchRelated(data.blog.category, id);
      } else {
        navigate('/404');
      }
    } catch { navigate('/'); }
    setLoading(false);
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API}/api/blogs/${id}/comments`);
      const data = await res.json();
      if (data.success) setComments(data.comments);
    } catch {}
  };

  const fetchRelated = async (category, currentId) => {
    try {
      const res = await fetch(`${API}/api/blogs?category=${category}&limit=3`);
      const data = await res.json();
      if (data.success) setRelatedBlogs(data.blogs.filter(b => b._id !== currentId));
    } catch {}
  };

  const handleLike = async () => {
    if (!user) { toast.error('Sign in to like stories'); return; }
    try {
      const res = await fetch(`${API}/api/blogs/${id}/like`, {
        method: 'POST', credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setLiked(data.liked);
        setLikesCount(data.likesCount);
      }
    } catch { toast.error('Failed to like'); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Sign in to comment'); return; }
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const res = await fetch(`${API}/api/blogs/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText }),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setComments(prev => [data.comment, ...prev]);
        setCommentText('');
        toast.success('Comment added');
      }
    } catch { toast.error('Failed to post comment'); }
    setCommentLoading(false);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await fetch(`${API}/api/blogs/${id}/comments/${commentId}`, {
        method: 'DELETE', credentials: 'include',
      });
      setComments(prev => prev.filter(c => c._id !== commentId));
      toast.success('Comment deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleDeleteBlog = async () => {
    if (!confirm('Delete this story permanently?')) return;
    try {
      const res = await fetch(`${API}/api/blogs/${id}`, {
        method: 'DELETE', credentials: 'include',
      });
      const data = await res.json();
      if (data.success) { toast.success('Story deleted'); navigate('/'); }
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 728, margin: '80px auto', padding: '0 24px' }}>
        <div className="skeleton" style={{ height: 48, width: '80%', marginBottom: 20 }} />
        <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
          <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          <div>
            <div className="skeleton" style={{ width: 120, height: 14, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: 80, height: 12 }} />
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 18, width: `${100 - i * 10}%`, marginBottom: 14 }} />
        ))}
      </div>
    );
  }

  if (!blog) return null;

  const isAuthor = user && blog.author?._id === user._id;
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 728, margin: '0 auto', padding: '48px 24px' }}>

        
        <Link to={`/category/${blog.category?.toLowerCase()}`} style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>
          <span className="badge badge-accent" style={{ fontSize: 13, padding: '4px 12px' }}>{blog.category}</span>
        </Link>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 20, letterSpacing: '-0.02em' }}
          className="animate-fade-in-up">
          {blog.title}
        </h1>

        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, borderBottom: '1px solid var(--color-border)', marginBottom: 32 }}
          className="animate-fade-in-up stagger-1">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to={`/profile/${blog.author?._id}`}>
              <AvatarDisplay user={blog.author} size={44} />
            </Link>
            <div>
              <Link to={`/profile/${blog.author?._id}`} style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-text-primary)', textDecoration: 'none' }}>
                {blog.author?.username}
              </Link>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>
                {formattedDate} · {blog.readTime} min read · {blog.views} views
              </div>
            </div>
          </div>

          
          {isAuthor && (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to={`/blog/${id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
              <button onClick={handleDeleteBlog} className="btn btn-danger btn-sm">Delete</button>
            </div>
          )}
        </div>

        
        {blog.image && (
          <div style={{ marginBottom: 40 }} className="animate-fade-in stagger-1">
            <img src={blog.image} alt={blog.title} style={{ width: '100%', maxHeight: 480, objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} />
          </div>
        )}

        
        {blog.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            {blog.tags.map(tag => (
              <span key={tag} className="badge" style={{ fontSize: 13 }}>#{tag}</span>
            ))}
          </div>
        )}

      
        <div className="blog-content animate-fade-in stagger-2" style={{ whiteSpace: 'pre-wrap', fontSize: 18, lineHeight: 1.8, color: '#292929' }}>
          {blog.content}
        </div>

      
        <div style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '20px 0', margin: '40px 0', display: 'flex', alignItems: 'center', gap: 24 }}>
          <button
            onClick={handleLike}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 15, fontWeight: 500, transition: 'var(--transition)',
              color: liked ? 'var(--color-danger)' : 'var(--color-text-secondary)',
            }}
          >
            <svg width="22" height="22" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            {likesCount} {likesCount === 1 ? 'clap' : 'claps'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)', fontSize: 15 }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </div>
        </div>

      
        <div style={{ background: 'var(--color-tag-bg)', borderRadius: 'var(--radius-lg)', padding: 28, display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 48 }}>
          <Link to={`/profile/${blog.author?._id}`}>
            <AvatarDisplay user={blog.author} size={64} />
          </Link>
          <div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 4 }}>Written by</div>
            <Link to={`/profile/${blog.author?._id}`} style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', textDecoration: 'none' }}>
              {blog.author?.username}
            </Link>
            {blog.author?.bio && (
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 8, lineHeight: 1.6 }}>
                {blog.author.bio}
              </p>
            )}
            <Link to={`/profile/${blog.author?._id}`} className="btn btn-outline btn-sm" style={{ marginTop: 16 }}>
              View profile
            </Link>
          </div>
        </div>

        
        <div id="comments">
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
            Responses ({comments.length})
          </h2>

          {user && (
            <form onSubmit={handleComment} style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <AvatarDisplay user={user} size={36} />
                <div style={{ flex: 1 }}>
                  <textarea
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="What are your thoughts?"
                    className="textarea"
                    style={{ minHeight: 100, fontSize: 15 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                    <button type="submit" className="btn btn-primary" disabled={!commentText.trim() || commentLoading}>
                      {commentLoading ? 'Posting...' : 'Post response'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {!user && (
            <div style={{ background: 'var(--color-tag-bg)', borderRadius: 'var(--radius-lg)', padding: 24, textAlign: 'center', marginBottom: 32 }}>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>Sign in to join the conversation.</p>
              <Link to="/login" className="btn btn-primary">Sign in</Link>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {comments.map(comment => (
              <div key={comment._id} style={{ display: 'flex', gap: 14, paddingBottom: 20, borderBottom: '1px solid var(--color-border)' }}>
                <Link to={`/profile/${comment.author?._id}`}>
                  <AvatarDisplay user={comment.author} size={36} />
                </Link>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <Link to={`/profile/${comment.author?._id}`} style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text-primary)', textDecoration: 'none' }}>
                      {comment.author?.username}
                    </Link>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    {user && comment.author?._id === user._id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', fontSize: 13 }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--color-text-primary)' }}>{comment.content}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 24 }}>No responses yet. Be the first!</p>
            )}
          </div>
        </div>
      </div>

      
      {relatedBlogs.length > 0 && (
        <div style={{ borderTop: '1px solid var(--color-border)', padding: '56px 0', background: 'var(--color-surface)' }}>
          <div className="container-wide">
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 32 }}>More from {blog.category}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {relatedBlogs.slice(0, 3).map(b => (
                <div key={b._id} style={{ borderBottom: 'none' }}>
                  <BlogCard blog={b} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
