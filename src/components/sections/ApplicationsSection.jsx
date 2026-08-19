'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Data & CSS Import
import sectionData from '@/data/applicationSection.json';
import '../../../public/assets/css/applcationSection.css';

// SVG Icons Mapping
const ICONS = {
  AUTOMOTIVE: (
    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
    </svg>
  ),
  OPHTHALMIC: (
    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  TELESCOPE: (
    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  IMAGING: (
    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <circle cx="12" cy="13" r="3" strokeWidth="2" />
    </svg>
  ),
};

export default function ApplicationsSection() {
  const applications = sectionData?.applications || [];
  
  // 1. Raw Scroll Transforms
  const { scrollYProgress } = useScroll();
  const rawY = useTransform(scrollYProgress, [0, 0.6], [0, -40]);
  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.04, 0.98]);

  // 2. Physics Spring Inertia (Stutter & Jerk ko 100% khatam karega)
  const y = useSpring(rawY, { stiffness: 90, damping: 28, restDelta: 0.001 });
  const scale = useSpring(rawScale, { stiffness: 90, damping: 28, restDelta: 0.001 });

  return (
    <motion.section
      className="application-section-wrapper"
      id="applications"
      style={{ y, scale, willChange: 'transform' }}
    >
      <div className="container">
        <div className="row align-items-center">
          
          {/* LEFT COLUMN: Header & CTA Button */}
          <div className="col-12 col-lg-7">
            <div className="row g-3 g-md-4">
              {applications.map((item) => (
                <div key={item.id} className="col-12 col-sm-6">
                  <Link href={item.url || '#'} className="app-image-card">
                    {/* Background Image */}
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="app-image-card-bg"
                      unoptimized
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="app-image-card-overlay" />

                    {/* Top-Left Glowing Icon Badge */}
                    <div className="app-card-icon-badge">
                      {ICONS[item.icon_type] || ICONS.AUTOMOTIVE}
                    </div>

                    {/* Bottom Title & Description */}
                    <div className="app-card-content">
                      <h3 className="app-card-title">{item.title}</h3>
                      <p className="app-card-desc">{item.description}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Dynamic 2x2 Dark Image Cards Grid */}
          <div className="col-12 col-lg-5 text-center text-lg-start">
            <span className="text-uppercase products-tag mb-2 d-inline-block">
              {sectionData?.tagline || 'APPLICATIONS'}
            </span>

            <h2 className="hero-heading fw-bold mb-4">
              {sectionData?.heading_main || 'Real-world applications.'} <br />
              {sectionData?.heading_sub || 'Proven performance.'}
            </h2>

            <p className="app-description mb-4 pe-lg-3">
              {sectionData?.description || ''}
            </p>

            {sectionData?.button && (
              <Link
                href={sectionData.button.url || '/applications'}
                className="btn btn-primary-custom px-2 px-sm-4 py-2 fw-bold d-inline-flex align-items-center justify-content-center gap-1 gap-sm-2 text-nowrap"
              >
                <span>{sectionData.button.text || 'EXPLORE APPLICATIONS'}</span>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}
          </div>

        </div>
      </div>
    </motion.section>
  );
}