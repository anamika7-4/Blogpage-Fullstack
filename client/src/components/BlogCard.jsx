import React from 'react';
import { Link } from 'react-router-dom';

const AvatarDisplay = ({ user, size = 32 }) => {
  if (user?.avatar) {
    return <img src={user.avatar} alt={user?.username} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />;
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'var(--color-accent-light)', color: 'var(--color-accent)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: Math.round(size * 0.4),
    }}>
      {user?.username?.[0]?.toUpperCase() || '?'}
    </div>
  );
};

const BlogCard = ({ blog, variant = 'default' }) => {
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  if (variant === 'featured') {
    return (
      <Link to={`/blog/${blog._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{
          position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          height: 340, background: '#1a1a1a', cursor: 'pointer',
        }}
          className="card"
          onMouseEnter={e => { e.currentTarget.querySelector('.blog-img').style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.querySelector('.blog-img').style.transform = 'scale(1)'; }}
        >
          {blog.image && (
            <img
              className="blog-img"
              src={blog.image}
              alt={blog.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', opacity: 0.7 }}
            />
          )}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '32px 24px 24px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
          }}>
            <Link to={`/category/${blog.category?.toLowerCase()}`} style={{ textDecoration: 'none' }}
              onClick={e => e.stopPropagation()}>
              <span className="badge badge-accent" style={{ marginBottom: 10, display: 'inline-block' }}>{blog.category}</span>
            </Link>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 12 }}>
              {blog.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AvatarDisplay user={blog.author} size={28} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{blog.author?.username}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>·</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{blog.readTime} min read</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <article style={{ padding: '24px 0', borderBottom: '1px solid var(--color-border)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <AvatarDisplay user={blog.author} size={24} />
          <Link to={`/profile/${blog.author?._id}`} style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
            onMouseLeave={e => e.target.style.textDecoration = 'none'}
          >
            {blog.author?.username}
          </Link>
          <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>·</span>
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{formattedDate}</span>
        </div>

    
        <Link to={`/blog/${blog._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700, lineHeight: 1.3, marginBottom: 8, color: 'var(--color-text-primary)', cursor: 'pointer' }}
            onMouseEnter={e => e.target.style.color = '#555'}
            onMouseLeave={e => e.target.style.color = 'var(--color-text-primary)'}
          >
            {blog.title}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {blog.excerpt || blog.content?.substring(0, 140) + '…'}
          </p>
        </Link>

        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link to={`/category/${blog.category?.toLowerCase()}`} style={{ textDecoration: 'none' }}>
            <span className="badge">{blog.category}</span>
          </Link>
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{blog.readTime} min read</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-text-muted)' }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            {blog.likes?.length || 0}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-text-muted)' }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            {blog.views || 0}
          </div>
        </div>
      </div>
      {blog.image && (
        <Link to={`/blog/${blog._id}`}>
          <img
            src={blog.image}
            alt={blog.title}
            style={{ width: 112, height: 84, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0, display: 'block' }}
          />
        </Link>
      )}
    </article>
  );
};

export default BlogCard;
export { AvatarDisplay };
