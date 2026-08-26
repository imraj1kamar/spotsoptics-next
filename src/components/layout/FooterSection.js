'use client';

import React from 'react';
import Link from 'next/link';

// Data & CSS Import
import footerData from '@/data/footerSection.json';
import '../../../public/assets/css/footerSection.css';

// Social SVG Icons
const SOCIAL_ICONS = {
  linkedin: (
    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  ),
  x: (
    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  facebook: (
    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.66 8.84 8.44 9.68v-6.85H7.9v-2.83h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.83h-2.33v6.85C18.34 20.84 22 16.84 22 12z" />
    </svg>
  ),
  instagram: (
    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
  youtube: (
    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

export default function FooterSection() {
  const brand = footerData?.brand || {};
  const columns = footerData?.columns || [];
  const legalLinks = footerData?.legal_links || [];

  return (
    <footer className="footer-section-wrapper pt-5 pb-4 position-relative overflow-hidden" id="footer">
      <div className="footer-bg-glow" />
      <div className="container py-lg-3">
        
        {/* Main Footer Body Grid */}
        <div className="row g-4 g-lg-5 pb-5 text-center text-lg-start">
          
          {/* Brand Info Column */}
          <div className="col-12 col-lg-4">
            <div className="pe-lg-3 text-center text-lg-start">
              {/* Brand Logo */}
              <Link href="/" className="footer-logo d-inline-flex align-items-center  gap-2 text-decoration-none mb-2">
                <div className="footer-logo-target-icon">
                  <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" strokeWidth="2" />
                    <circle cx="12" cy="12" r="3" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 1v3m0 16v3M1 12h3m16 0h3" />
                  </svg>
                </div>
                <span className="fw-extrabold fs-4 text-white tracking-wider">
                  SPOT<span className="text-primary-blue">OPTICS</span>
                </span>
              </Link>

              {/* Tagline */}
              <div className="footer-tagline small text-primary-blue fw-bold mb-3">
                {brand.tagline || 'Precision in Light & Shape'}
              </div>

              {/* Description */}
              <p className="footer-desc text-muted small mb-4">
                {brand.description || ''}
              </p>

              {/* Social Icons Row */}
              <div className="d-flex justify-content-center justify-content-lg-start gap-2 footer-socials">
                {brand.socials?.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn d-flex align-items-center justify-content-center rounded-circle text-white text-decoration-none"
                    aria-label={social.label}
                  >
                    {SOCIAL_ICONS[social.platform] || SOCIAL_ICONS.linkedin}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Columns (PRODUCTS, APPLICATIONS, COMPANY, SUPPORT) */}
          <div className="col-12 col-lg-8">
            <div className="row g-4">
              {columns.map((col, cIdx) => (
                <div key={cIdx} className="col-6 col-sm-3">
                
                  <h4 className="footer-col-title h6 fw-bold text-white text-uppercase tracking-wider mb-3"> {col.title}</h4>
                  <ul className="list-unstyled footer-nav-list mb-0">
                    {col.links?.map((link, lIdx) => (
                      <li key={lIdx} className="mb-2">
                        <Link href={link.url} className="footer-nav-link text-muted small text-decoration-none">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="footer-bottom-bar pt-4 border-top border-secondary border-opacity-25 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 text-muted small">
          <div>
            <span>{brand.copyright || '© SpotOptics S.r.l. 2025 All rights reserved.'}</span>
          </div>

          <div className="d-flex align-items-center gap-4">
            {legalLinks.map((item, idx) => (
              <Link key={idx} href={item.url} className="footer-legal-link text-muted text-decoration-none">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}