'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Data & CSS Import
import resourcesData from '@/data/resourcesSection.json';
import '../../../public/assets/css/resourcesSection.css';

// Blue SVG Icons matching image
const ICONS = {
  KNOWLEDGE: (
    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.083 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 14v6.5" />
    </svg>
  ),
  DOWNLOADS: (
    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  CASE_STUDIES: (
    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
};

export default function ResourcesSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  // 1. Raw Scroll Transforms
  const { scrollYProgress } = useScroll();
  const rawY = useTransform(scrollYProgress, [0, 0.6], [0, -40]);
  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.04, 0.98]);

  // 2. Physics Spring Inertia (Stutter & Jerk ko 100% khatam karega)
  const y = useSpring(rawY, { stiffness: 90, damping: 28, restDelta: 0.001 });
  const scale = useSpring(rawScale, { stiffness: 90, damping: 28, restDelta: 0.001 });

  const cardsList = resourcesData?.cards || [];
  const newsletter = resourcesData?.newsletter || {};

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <motion.section
      className="resources-section-wrapper py-5"
      id="resources"
      style={{ y, scale, willChange: 'transform' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
    >
      <div className="container py-lg-4">
        
        {/* Section Header */}
        <header className="mb-4 text-center text-lg-start">
          <span className="text-uppercase products-tag mb-2 d-inline-block">
            {resourcesData?.tagline || 'RESOURCES'}
          </span>
          <h2 className="hero-heading fw-bold mb-4">
            {resourcesData?.heading || 'Knowledge. Insights. Downloads.'}
          </h2>
        </header>

        <div className="row g-4 align-items-stretch">
          
          {/* LEFT SIDE: 3 Resource Cards */}
          <div className="col-12 col-lg-8">
            <div className="row g-3 g-md-4 h-100">
              {cardsList.map((card) => (
                <div key={card.id} className="col-12 col-md-4">
                  <div className="resource-card p-4 rounded-4 bg-white border shadow-sm h-100 d-flex flex-column justify-content-between">
                    <div>
                      {/* Icon */}
                      <div className="resource-icon-box text-primary mb-3">
                        {ICONS[card.icon_type] || ICONS.KNOWLEDGE}
                      </div>

                      {/* Title */}
                      <h3 className="resource-card-title fw-bold text-dark mb-2">
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p className="resource-card-desc text-muted mb-4 small">
                        {card.description}
                      </p>
                    </div>

                    {/* Action Link */}
                    <Link
                      href={card.url || '#'}
                      className="a-link mt-auto d-inline-flex align-items-center gap-2 text-decoration-none text-uppercase"
                    >
                      <span>{card.button_text}</span>
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Blue Newsletter Subscription Card */}
          <div className="col-12 col-lg-4">
            <div className="newsletter-blue-card p-4 p-md-5 rounded-4 text-white h-100 d-flex flex-column justify-content-between position-relative overflow-hidden">
              <div className="newsletter-bg-glow" />
              <div>
                <h3 className="newsletter-title fw-bold mb-3">
                  {newsletter.title || 'Stay updated'}
                </h3>
                <p className="newsletter-desc text-white text-opacity-85 small mb-4">
                  {newsletter.description ||
                    'Subscribe to our newsletter for the latest product releases, technical articles and industry insights.'}
                </p>
              </div>

              <div>
                {/* Email Form */}
        {/* Email Form */}
<form 
  onSubmit={handleSubscribe} className="newsletter-form-box position-relative mb-2" suppressHydrationWarning >
  <input
    type="email"
    required
    placeholder={newsletter.placeholder || 'Enter your email'}
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="form-control newsletter-input rounded-pill py-2.5 ps-3.5 pe-5 shadow-none"
    suppressHydrationWarning 
  />
  <button
    type="submit"
    className="btn btn-newsletter-submit rounded-circle position-absolute top-50 end-0 translate-middle-y me-1 d-flex align-items-center justify-content-center"
    aria-label="Subscribe"
  >
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  </button>
</form>

                {subscribed && (
                  <div className="small text-warning fw-semibold mt-1">
                    Thank you for subscribing!
                  </div>
                )}

                {/* Privacy Disclaimer */}
                <span className="newsletter-privacy-text xx-small text-white text-opacity-70 d-block mt-2">
                  {newsletter.privacy_text || 'We respect your privacy. Unsubscribe anytime.'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
}