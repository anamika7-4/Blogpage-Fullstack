import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(80px, 15vw, 140px)', fontWeight: 700, lineHeight: 1, color: 'var(--color-border)', marginBottom: 24, userSelect: 'none' }}>
        404
      </div>
      <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>
        This page doesn't exist
      </h1>
      <p style={{ fontSize: 17, color: 'var(--color-text-secondary)', marginBottom: 36, maxWidth: 400, lineHeight: 1.6 }}>
        The page you're looking for may have been moved, deleted, or never existed.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-lg">
          Go back
        </button>
        <Link to="/" className="btn btn-primary btn-lg">
          Take me home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
