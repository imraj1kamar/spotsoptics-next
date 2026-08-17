'use client';

import { useState, useEffect } from 'react';
import { gsap } from 'gsap';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1.2 seconds ke baad smooth GSAP fade-out animation
    const timer = setTimeout(() => {
      gsap.to('#preloader-screen', {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => setIsLoading(false),
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      id="preloader-screen"
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark d-flex align-items-center justify-content-center"
      style={{ zIndex: 99999 }}
    >
      <div className="text-center">
        {/* Spinner */}
        <div
          className="spinner-border mb-3"
          role="status"
          style={{
            width: '3.5rem',
            height: '3.5rem',
            color: 'var(--primary-blue, #1D4ED8)',
          }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>

        {/* Title */}
        <h4
          className="fw-bold text-uppercase text-white"
          style={{ letterSpacing: '4px' }}
        >
          SpotOptics
        </h4>
      </div>
    </div>
  );
}