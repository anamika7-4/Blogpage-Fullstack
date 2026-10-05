import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000';

const CATEGORIES = ['All', 'Technology', 'Science', 'Design', 'Business', 'Culture', 'Health', 'Travel', 'Food', 'Sports'];

const SkeletonCard = () => (
  <div style={{ padding: '24px 0', borderBottom: '1px solid var(--color-border)' }}>
    <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
      <div className="skeleton" style={{ width: 24, height: 24, borderRadius: '50%' }} />
      <div className="skeleton" style={{ width: 120, height: 14 }} />
    </div>
    <div className="skeleton" style={{ width: '80%', height: 24, marginBottom: 10 }} />
    <div className="skeleton" style={{ width: '100%', height: 14, marginBottom: 6 }} />
    <div className="skeleton" style={{ width: '60%', height: 14 }} />
  </div>
);

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchBlogs(1, activeCategory);
    fetchFeatured();
  }, []);

  useEffect(() => {
    fetchBlogs(1, activeCategory);
    setPage(1);
  }, [activeCategory]);

  const fetchFeatured = async () => {
    try {
      const res = await fetch(`${API}/api/blogs/featured`);
      const data = await res.json();
      if (data.success) setFeatured(data.blogs.slice(0, 3));
    } catch {}
  };

  const fetchBlogs = async (p, category) => {
    setLoading(true);
    try {
      const cat = category === 'All' ? '' : category;
      const res = await fetch(`${API}/api/blogs?page=${p}&limit=8${cat ? `&category=${cat}` : ''}`);
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs);
        setPagination(data.pagination);
      }
    } catch {}
    setLoading(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchBlogs(newPage, activeCategory);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  return (
    <div>
      
      {!user && (
        <section style={{
          background: 'var(--color-text-primary)',
          color: '#fff',
          padding: '80px 0',
          textAlign: 'center',
        }}>
          <div className="container-wide" style={{ maxWidth: 700, margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}
              className="animate-fade-in-up">
              Where ideas find their voice.
            </h1>
            <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', marginBottom: 40, lineHeight: 1.6 }}
              className="animate-fade-in-up stagger-1">
              Discover stories, thinking, and expertise from writers on any topic that matters to you.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
              className="animate-fade-in-up stagger-2">
              <Link to="/register" className="btn btn-primary btn-lg" style={{ background: '#fff', color: '#1a1a1a' }}>
                Start reading
              </Link>
              <Link to="/write" className="btn btn-lg" style={{ border: '1.5px solid rgba(255,255,255,0.4)', color: '#fff', borderRadius: 'var(--radius-full)' }}>
                Start writing
              </Link>
            </div>
          </div>
        </section>
      )}

    
      {featured.length > 0 && (
        <section style={{ padding: '48px 0', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="container-wide">
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 24 }}>
              Featured Stories
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {featured.map((blog, i) => (
                <div key={blog._id} className={`animate-fade-in-up stagger-${i + 1}`}>
                  <BlogCard blog={blog} variant="featured" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      
      <div className="container-wide" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 56, paddingTop: 40, paddingBottom: 80, alignItems: 'start' }}>

    
        <div>
          
          <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 12, borderBottom: '1px solid var(--color-border)', marginBottom: 4, WebkitOverflowScrolling: 'touch' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : blogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
              <p style={{ fontSize: 18 }}>No stories found in this category.</p>
              {user && <Link to="/write" className="btn btn-primary" style={{ marginTop: 20 }}>Write the first one</Link>}
            </div>
          ) : (
            <>
              {blogs.map(blog => <BlogCard key={blog._id} blog={blog} />)}

              
              {pagination && pagination.pages > 1 && (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 40 }}>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      style={{
                        width: 36, height: 36, borderRadius: '50%',
                        border: p === page ? 'none' : '1px solid var(--color-border)',
                        background: p === page ? 'var(--color-text-primary)' : 'transparent',
                        color: p === page ? '#fff' : 'var(--color-text-primary)',
                        cursor: 'pointer', fontSize: 14, fontWeight: 500,
                        transition: 'var(--transition)',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        
        <aside style={{ position: 'sticky', top: 88 }}>
          
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Discover by topic</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.slice(1).map(cat => (
                <Link key={cat} to={`/category/${cat.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                  <span className="badge" style={{ padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>{cat}</span>
                </Link>
              ))}
            </div>
          </div>

          
          {user ? (
            <div style={{ background: 'var(--color-tag-bg)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Share your story</h3>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
                Writing is a superpower. Share what you know with the world.
              </p>
              <Link to="/write" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Start writing
              </Link>
            </div>
          ) : (
            <div style={{ background: 'var(--color-text-primary)', borderRadius: 'var(--radius-lg)', padding: 24, color: '#fff' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#fff' }}>Join myBlog</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 20, lineHeight: 1.6 }}>
                Create an account to write stories and engage with a community of readers.
              </p>
              <Link to="/register" className="btn" style={{ background: '#fff', color: '#1a1a1a', width: '100%', justifyContent: 'center' }}>
                Create account — it's free
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Home;