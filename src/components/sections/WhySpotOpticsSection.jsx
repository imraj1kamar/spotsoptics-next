'use client';

import React from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Data & CSS Import
import whyData from '@/data/whySpotOpticsSection.json';
import '../../../public/assets/css/whySpotOpticsSection.css';

// Blue SVG Icons matching image
const ICONS = {
  ACCURACY: (
    <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 1v4m0 14v4M1 12h4m14 0h4" />
    </svg>
  ),
  TECHNOLOGY: (
    <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  SOLUTIONS: (
    <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  ),
  SUPPORT: (
    <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
};

export default function WhySpotOpticsSection() {
  const featuresList = whyData?.features || [];
  
  // 1. Raw Scroll Transforms
  const { scrollYProgress } = useScroll();
  const rawY = useTransform(scrollYProgress, [0, 0.6], [0, -40]);
  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.04, 0.98]);

  // 2. Physics Spring Inertia (Stutter & Jerk ko 100% khatam karega)
  const y = useSpring(rawY, { stiffness: 90, damping: 28, restDelta: 0.001 });
  const scale = useSpring(rawScale, { stiffness: 90, damping: 28, restDelta: 0.001 });

  return (
    <motion.section
      className="why-spotoptics-wrapper py-5 mt-3"
      id="why-spotoptics"
      style={{ y, scale, willChange: 'transform' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
    >
      <div className="container py-lg-4">
        <div className="row g-4 align-items-center">
          
          {/* LEFT COLUMN: Tagline, Heading, Description & Button */}
          <div className="col-12 col-lg-5 text-center text-lg-start py-3">
            <span className="text-uppercase products-tag mb-2 d-inline-block">
              {whyData?.tagline || 'WHY SPOTOPTICS?'}
            </span>

            <h2 className="hero-heading fw-bold mb-4">
              {whyData?.heading_main || 'Engineering precision.'} <br />
              {whyData?.heading_sub || 'Delivering trust.'}
            </h2>

            <p className="why-description mb-4 pe-lg-3">
              {whyData?.description || ''}
            </p>

            {whyData?.button && (
              <Link
                href={whyData.button.url || '/about'}
                className="btn btn-primary-custom px-2 px-sm-4 py-2 fw-bold d-inline-flex align-items-center justify-content-center gap-1 gap-sm-2 text-nowrap"
              >
                <span>{whyData.button.text || 'LEARN MORE'}</span>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}
          </div>

          {/* RIGHT COLUMN: 2x2 Feature Cards Grid */}
          <div className="col-12 col-lg-7">
            <div className="row g-3 g-md-4">
              {featuresList.map((item) => (
                <div key={item.id} className="col-12 col-sm-6">
                  <div className="why-feature-card p-4 rounded-4 bg-white border shadow-sm h-100 d-flex align-items-start gap-3">
                    
                    {/* Blue Icon */}
                    <div className="why-icon-box text-primary flex-shrink-0">
                      {ICONS[item.icon_type] || ICONS.ACCURACY}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="why-card-title fw-bold text-dark mb-2">
                        {item.title}
                      </h3>
                      <p className="why-card-desc text-muted mb-0 small">
                        {item.description}
                      </p>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
}