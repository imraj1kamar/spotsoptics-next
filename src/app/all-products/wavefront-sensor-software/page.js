'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Common Components & Data Imports
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Sidebar from '@/components/common/Sidebar';
import Cta from '@/components/common/Cta';

// JSON Data Imports
import softwareData from '@/data/wavefront-sensor-software.json';
import sidebarData from '@/data/sidebar.json';

// Individual CSS Import
import '../../../../public/assets/css/wavefront-sensor-software.css';

export default function SensoftSoftwarePage() {
  const containerRef = useRef(null);

  const { page, overview, highlights, diagnostics, advanced_capabilities, simulation_packages, downloads } = softwareData;



  // GSAP ScrollTrigger Animations
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Reveal content sections on scroll
      const sections = gsap.utils.toArray('.gsap-section-reveal');
      sections.forEach((sec) => {
        gsap.fromTo(
          sec,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // 2. Stagger cards inside grids
      const cardGrids = gsap.utils.toArray('.gsap-grid-trigger');
      cardGrids.forEach((grid) => {
        const cards = grid.querySelectorAll('.gsap-card-target');
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: grid,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="page-section software-page-wrapper py-4 py-lg-5">
      <div className="container mt-3">
        
        {/* ================= 1. TOP BAR ================= */}
        <div className="d-flex justify-content-between align-items-start position-relative z-2 mt-5 mb-2 mx-3">
       

          <Breadcrumbs
                      items={[
                        { label: 'Home', href: '/' },
                        ...(softwareData.page.breadcrum?.map((item) => ({
                          label: item.label,
                          href: item.url,
                        })) || [
                          { label: 'Single Pass', href: '/all-products/omi-test-in-single-pass' },
                          { label: softwareData.title || 'Shack-Hartmann vs Hartmann' },
                        ]),
                      ]}
                      className="knowledge-breadcrumbs mb-0"
                    />

          
        </div>

        {/* ================= 2. HERO BANNER ================= */}
        <motion.div
          className="software-hero-card p-4 p-md-5 mb-5 text-white"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="row align-items-center position-relative z-2">
            <div className="col-lg-8">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill hero-pill-badge mb-3">
                <span className="hero-pulse-dot"></span>
                <span className="text-uppercase">Wavefront Analysis Software</span>
              </div>
              
              <h1 className="knowledge-hero-title text-white fw-bold mb-3">
                {page?.title }
              </h1>
              
              <div className="hero-accent-line mb-3"></div>
              
              <p className="knowledge-hero-description text-white text-opacity-75 mb-0" >
                {page?.subtitle}
              </p>

              {/* {downloads?.brochure?.url && (
                <a
                  href={downloads.brochure.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-light text-primary fw-bold px-4 py-2 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>{downloads.brochure.title || 'Download Brochure'}</span>
                </a>
              )} */}
            </div>

            <div className="col-lg-4 text-start text-lg-end mt-4 mt-lg-0">
              <div className="hero-info-glass-box p-3 d-inline-block text-start w-100">
                <div className="text-uppercase small fw-bold text-info mb-1">Spectral Range</div>
                <h4 className="fw-bold text-white mb-1">DUV to LWIR</h4>
                <p className="small text-white text-opacity-75 mb-0" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                  Complete on-axis & off-axis diagnostics across all optical test wavelengths.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================= 3. MAIN CONTENT (9 COLS) & SIDEBAR (3 COLS) ================= */}
        <div className="row g-4 mb-5">
          
          {/* Left Column: 9/12 */}
          <div className="col-lg-9">
            
            {/* Section 1: Overview */}
            <section className="gsap-section-reveal software-content-card p-4 p-md-5 mb-4">
              <h2 className="section-title-bar">
                {overview?.title || 'About SenSoft'}
              </h2>
              <div className="text-secondary" style={{ lineHeight: '1.75' }}>
                {overview?.paragraphs?.map((para, idx) => (
                  <p key={idx} className={idx === overview.paragraphs.length - 1 ? 'mb-0' : 'mb-3'}>
                    {para}
                  </p>
                ))}
              </div>
            </section>

            {/* Section 2: Key Highlights Grid */}
            <section className="gsap-section-reveal mb-5">
              <h2 className="section-title-bar">
                {highlights?.title || 'Highlight of SenSoft software'}
              </h2>
              <div className="row g-3 gsap-grid-trigger">
                {highlights?.items?.map((item, idx) => (
                  <div key={idx} className="col-12 col-md-6 gsap-card-target">
                    <div className="software-highlight-card">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div className="highlight-icon-box">
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="h6 fw-bold text-dark mb-0">{item.label}</h3>
                      </div>
                      <p className="small text-muted mb-0" style={{ lineHeight: '1.55' }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Diagnostics Capabilities */}
            <section className="gsap-section-reveal software-content-card p-4 p-md-5 mb-5">
              <h2 className="section-title-bar">
                {diagnostics?.title || 'Diagnostics with SenSoft'}
              </h2>
              <div className="d-flex flex-column gap-3 gsap-grid-trigger">
                {diagnostics?.items?.map((item, idx) => (
                  <div key={idx} className="diagnostic-item gsap-card-target">
                    <h3 className="h6 fw-bold text-dark mb-1">{item.feature}</h3>
                    <p className="small text-secondary mb-0" style={{ lineHeight: '1.5' }}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: Advanced Capabilities */}
            <section className="gsap-section-reveal mb-5">
              <h2 className="section-title-bar">
                Advanced Metrology & Remote Control
              </h2>
              <div className="row g-3 gsap-grid-trigger">
                {advanced_capabilities?.map((cap, idx) => (
                  <div key={cap.id || idx} className="col-12 col-md-4 gsap-card-target">
                    <div className="advanced-cap-card">
                      <span className="cap-badge-pill text-uppercase d-inline-block mb-3">
                        Featured
                      </span>
                      <h3 className="h6 fw-bold text-dark mb-2">{cap.title}</h3>
                      <p className="small text-muted mb-0" style={{ lineHeight: '1.55' }}>
                        {cap.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5: Simulation Packages */}
            <section className="gsap-section-reveal software-content-card p-4 p-md-5 mb-5">
              <div className="mb-4">
                <h2 className="section-title-bar">
                  {simulation_packages?.title || 'Simulation Package'}
                </h2>
                <p className="text-secondary small mb-0">
                  {simulation_packages?.description}
                </p>
              </div>

              <div className="d-flex flex-column gap-4 gsap-grid-trigger">
                {simulation_packages?.packages?.map((pkg, idx) => (
                  <div key={pkg.id || idx} className="simulation-pkg-card gsap-card-target">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="pkg-number-badge">{idx + 1}</span>
                      <h3 className="h6 fw-bold text-dark mb-0">{pkg.title}</h3>
                    </div>
                    <p className="small text-secondary mb-3" style={{ lineHeight: '1.5' }}>
                      {pkg.description}
                    </p>

                    {(pkg.outputs || pkg.supported_components) && (
                      <div className="d-flex flex-wrap gap-2 pt-3 border-top">
                        {(pkg.outputs || pkg.supported_components).map((pill, pIdx) => (
                          <span key={pIdx} className="pkg-output-pill">
                            ✓ {pill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Section 6: Brochure Download Footer */}
            {downloads?.brochure && (
              <section className="gsap-section-reveal brochure-download-banner d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 text-center text-md-start">
                <div>
                  <h3 className="h5 fw-bold text-primary mb-1">
                    {downloads.brochure.title}
                  </h3>
                  <p className="small text-secondary mb-0">
                    Get detailed technical parameters, hardware requirements, and optical analysis capabilities.
                  </p>
                </div>
                <a
                  href={downloads.brochure.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-brochure-download text-nowrap"
                >
                  Download Brochure
                </a>
              </section>
            )}

          </div>

          {/* Right Column: Sticky Sidebar (3/12) */}
          <div className="col-lg-3 d-none d-lg-block">
            <aside className="sticky-top" style={{ top: '100px', zIndex: 10 }}>
              <Sidebar
                title={sidebarData?.title || 'Categories'}
                links={sidebarData?.links || []}
              />
            </aside>
          </div>

        </div>

        {/* ================= 4. BOTTOM CTA ================= */}
        <div className="mt-5">
          <Cta />
        </div>

      </div>
    </section>
  );
}