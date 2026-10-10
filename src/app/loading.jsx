import React from 'react';

export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white">
      <div className="text-center">
        {/* Bootstrap Animated Spinner */}
        <div
          className="spinner-border mb-3"
          role="status"
          style={{
            width: '3.5rem',
            height: '3.5rem',
            color: 'var(--primary-blue, #1D4ED8)',
            borderWidth: '0.25em',
          }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>

        {/* Brand Name */}
        <h5
          className="fw-bold text-uppercase"
          style={{ letterSpacing: '3px', color: '#ffffff' }}
        >
          SpotOptics
        </h5>
      </div>
    </div>
  );
}