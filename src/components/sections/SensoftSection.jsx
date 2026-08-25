

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
// Data & CSS Import
import sensoftData from '@/data/sensoftSection.json';
import applicationData from '@/data/application.json';
import '../../../public/assets/css/sensoftSection.css';

export default function SensoftSection() {
  const featuresList = sensoftData?.features || [];
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.6], [0, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.04, 0.98]);

  // Extract all gallery screenshots dynamically from application.json
  const applications = applicationData?.applications || [];
  const screenImages = applications
    .flatMap((app) => app.image_gallery?.map((g) => g.image) || [])
    .filter(Boolean);

  // Fallback screenshots list
  const slides = screenImages.length > 0 ? screenImages : [
    '/assets/images/applications/display.png',
    '/assets/images/applications/Roddenstock-ophthalmic.png',
    '/assets/images/applications/support-stress.webp',
    '/assets/images/applications/Contour_PNG.png',
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Autoplay interval every 3.5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [slides]);

  const activeImage = slides[currentSlideIndex];
  const imgSrc = activeImage.startsWith('/') ? activeImage : `/${activeImage}`;

  return (
    <motion.section
      className="sensoft-section-wrapper py-5 position-relative overflow-hidden"
      id="sensoft"
      style={{ y, scale }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
    >
      {/* Background Particle / Radial Glow */}
      <div className="sensoft-bg-glow" />

      <div className="container position-relative z-2 py-lg-4">
        <div className="row g-5 align-items-center">
          
        {/* LEFT COLUMN: Desktop Monitor with Screen Overlay Carousel */}
<div className="col-12 col-lg-6 text-center">
  <div className="desktop-frame-wrapper position-relative d-inline-block">
    
    {/* 1. Outer Desktop Monitor Frame */}
    <Image
      src="/assets/images/desktop.png"
      alt="Desktop Monitor Frame"
      width={600}
      height={420}
      className="desktop-frame-img img-fluid"
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
      }}
      priority
    />

    {/* 2. Inner Display Screen Area (Auto-play Screenshots Carousel) */}
    <div className="monitor-screen-display position-absolute">
      <Image
        key={currentSlideIndex}
        src={
          imgSrc
            ? imgSrc.startsWith('/')
              ? imgSrc
              : `/${imgSrc}`
            : '/assets/images/placeholder.png'
        }
        alt="SenSoft Software Screenshot"
        width={520}
        height={320}
        className="screen-slide-img"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>

  </div>
</div>

          {/* RIGHT COLUMN: Tagline, Heading, Description & Checkmarks List */}
          <div className="col-12 col-lg-6 text-center text-lg-start">
            <span className="text-uppercase products-tag mb-2 d-inline-block">
              {sensoftData?.tagline || 'SENSOFT™ SOFTWARE'}
            </span>

            <h2 className="sensoft-heading mb-4">
              {sensoftData?.heading_main || 'Powerful software.'} <br />
              <span className="text-white">{sensoftData?.heading_sub || 'Smarter results.'}</span>
            </h2>

            <p className="sensoft-description mb-4 pe-lg-3">
              {sensoftData?.description || ''}
            </p>

            {/* Checkmark Feature List */}
            {featuresList.length > 0 && (
              <ul className="list-unstyled sensoft-features-list mb-4">
                {featuresList.map((item, index) => (
                  <li key={index} className="d-flex align-items-center gap-3 mb-2.5">
                    <span className="sensoft-check-icon flex-shrink-0">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-slate-200 fw-semibold fs-6">{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* CTA Button */}
            {sensoftData?.button && (
              <Link
                href={sensoftData.button.url || '/software'}
                className="btn btn-primary-custom px-2 px-sm-4 py-2 fw-bold d-inline-flex align-items-center justify-content-center gap-1 gap-sm-2 text-nowrap"
              >
                <span>{sensoftData.button.text || 'EXPLORE SENSOFT'}</span>
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