import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['Technology', 'Science', 'Design', 'Business', 'Culture', 'Health'];

const Footer = () => {
  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)', marginTop: 'auto', padding: '48px 0 32px' }}>
      <div className="container-wide">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>

      
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>myBlog</div>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 240 }}>
              A place to read, write, and deepen your understanding.
            </p>
          </div>

          
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: 16 }}>Topics</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CATEGORIES.map(cat => (
                <Link key={cat} to={`/category/${cat.toLowerCase()}`} style={{ fontSize: 14, color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'var(--transition)' }}
                  onMouseEnter={e => e.target.style.color = 'var(--color-text-primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--color-text-secondary)'}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

    
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: 16 }}>Company</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['/', 'Home'], ['/write', 'Write'], ['/login', 'Sign In'], ['/register', 'Get Started']].map(([to, label]) => (
                <Link key={label} to={to} style={{ fontSize: 14, color: 'var(--color-text-secondary)', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'var(--color-text-primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--color-text-secondary)'}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} myBlog. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Help'].map(link => (
              <a key={link} href="#" style={{ fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'none' }}>{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
