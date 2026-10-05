import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlogCard from '../components/BlogCard';

const API = 'http://localhost:5000';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const displayName = category.charAt(0).toUpperCase() + category.slice(1);

  useEffect(() => {
    fetchBlogs(1);
    setPage(1);
    window.scrollTo(0, 0);
  }, [category]);

  const fetchBlogs = async (p) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/blogs?category=${displayName}&page=${p}&limit=10`);
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs);
        setPagination(data.pagination);
      }
    } catch {}
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>

    
      <div style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: '48px 0 32px' }}>
        <div className="container-wide">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: 8, fontWeight: 600 }}>
                Topic
              </div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
                {displayName}
              </h1>
            </div>
            {pagination && (
              <div style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
                {pagination.total} {pagination.total === 1 ? 'story' : 'stories'}
              </div>
            )}
          </div>
        </div>
      </div>

      
      <div className="container-wide" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 760 }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ padding: '24px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 10 }} />
              <div className="skeleton" style={{ height: 14, width: '90%' }} />
            </div>
          ))
        ) : blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No stories in {displayName} yet</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>Be the first to write about {displayName}.</p>
          </div>
        ) : (
          <>
            {blogs.map(blog => <BlogCard key={blog._id} blog={blog} />)}
            {pagination && pagination.pages > 1 && (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 48 }}>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => { setPage(p); fetchBlogs(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{ width: 36, height: 36, borderRadius: '50%', border: p === page ? 'none' : '1px solid var(--color-border)', background: p === page ? 'var(--color-text-primary)' : 'transparent', color: p === page ? '#fff' : 'var(--color-text-primary)', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
