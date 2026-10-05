import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';

const API = 'http://localhost:5000';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [input, setInput] = useState(q);

  useEffect(() => {
    if (q) fetchResults(q);
  }, [q]);

  const fetchResults = async (query) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/blogs?search=${encodeURIComponent(query)}&limit=20`);
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs);
        setPagination(data.pagination);
      }
    } catch {}
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setSearchParams({ q: input.trim() });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>

      
      <div style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: '32px 0' }}>
        <div className="container-wide">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, alignItems: 'center', maxWidth: 560 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--color-tag-bg)', borderRadius: 'var(--radius-full)', padding: '12px 20px', border: '1.5px solid var(--color-border)' }}>
              <svg width="18" height="18" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Search stories..."
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 16, width: '100%', fontFamily: 'var(--font-sans)' }}
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </div>

      
      <div className="container-wide" style={{ maxWidth: 760, paddingTop: 40, paddingBottom: 80 }}>
        {q && (
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 15, color: 'var(--color-text-secondary)' }}>
              {loading ? 'Searching...' : `${pagination?.total || blogs.length} results for`}
              {!loading && <strong style={{ color: 'var(--color-text-primary)', marginLeft: 6 }}>"{q}"</strong>}
            </p>
          </div>
        )}

        {!q && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 18 }}>Search for stories, topics, and authors.</p>
          </div>
        )}

        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ padding: '24px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div className="skeleton" style={{ height: 20, width: '75%', marginBottom: 10 }} />
              <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 14, width: '50%' }} />
            </div>
          ))
        ) : q && blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No results found</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>Try different keywords or browse by topic.</p>
            <Link to="/" className="btn btn-outline">Browse all stories</Link>
          </div>
        ) : (
          blogs.map(blog => <BlogCard key={blog._id} blog={blog} />)
        )}
      </div>
    </div>
  );
};

export default SearchResults;
