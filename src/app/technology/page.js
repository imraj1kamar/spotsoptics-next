'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Data & CSS Import
import techData from '@/data/ourTechnology.json';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Cta from '@/components/common/Cta';
import Sidebar from '@/components/common/Sidebar';
import sidebarData from '@/data/sidebar.json';
import '../../../public/assets/css/all-products.css';
import '../../../public/assets/css/ourTechnology.css';

// Icon Mapping
const ICON_MAP = {
  wavefront: (
    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
      <circle cx="12" cy="4" r="1.5" strokeWidth="2" />
      <circle cx="12" cy="20" r="1.5" strokeWidth="2" />
      <circle cx="4" cy="12" r="1.5" strokeWidth="2" />
      <circle cx="20" cy="12" r="1.5" strokeWidth="2" />
      <circle cx="6.34" cy="6.34" r="1.5" strokeWidth="2" />
      <circle cx="17.66" cy="17.66" r="1.5" strokeWidth="2" />
      <circle cx="6.34" cy="17.66" r="1.5" strokeWidth="2" />
      <circle cx="17.66" cy="6.34" r="1.5" strokeWidth="2" />
    </svg>
  ),
  software: (
    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 21h8m-4-4v4M7 10l3-3 3 3 4-4" />
    </svg>
  ),
  metrology: (
    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 1v4m0 14v4M1 12h4m14 0h4" />
    </svg>
  ),
  calibration: (
    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
};

export default function OurTechnologyPage() {
  const page = techData?.page || {};
  const hero = techData?.hero || {};
  const pillars = techData?.technology_pillars || {};
  const software = techData?.software_platform || {};
  const products = techData?.products || {};
  const applications = techData?.applications || {};
  const workflow = techData?.workflow || {};
  const calibration = techData?.calibration || {};
  const capabilities = techData?.technical_capabilities || {};
  const advantages = techData?.advantages || {};
  const stats = techData?.statistics || [];
  const cta = techData?.cta || {};

  return (
    <main className="page-section py-5">
      
      {/* Header Section */}
      <section className="technology-page mt-5">
        <div className="container">
          <motion.div
            className="all-products-top-bar mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Our Technology' },
              ]}
              className="all-products-breadcrumbs"
            />

            <div className="top-bar-center d-none d-lg-block">
              <h1 className="product-detail-title">{page.title || 'Our Technology'}</h1>
            </div>
          </motion.div>

          {/* Page Description */}
          <header className="row mb-5 justify-content-center text-center">
            <div className="col-lg-10">
              <p className="page-tagline">{page.description || ''}</p>
            </div>
          </header>
        </div>
      </section>

      {/* ==========================================
          2. CORE TECHNOLOGY PILLARS
          ========================================== */}
      {pillars.items && pillars.items.length > 0 && (
      <section className="tech-pillars-section pb-5" id="pillars">
        <div className="container py-lg-4">
          <header className="text-center mb-5">
            <h2 className="tech-section-title text-uppercase mb-0">
              {pillars.title}
            </h2>
            <p className="section-intro mt-3">{pillars.description}</p>
          </header>

          <div className="row g-4">
            {pillars.items.map((pillar, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-3">
                <div className="tech-pillar-card p-4 rounded-4 h-100 d-flex flex-column text-center">
                  <div className="tech-pillar-icon-box mb-4">
                    {ICON_MAP[pillar.icon] || ICON_MAP.wavefront}
                  </div>
                  <h3 className="tech-pillar-title mb-3">
                    {pillar.title}
                  </h3>
                  <p className="tech-pillar-desc mb-0 flex-grow-1">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ==========================================
          3. SENSOFT SOFTWARE PLATFORM
          ========================================== */}
      {software.title && (
      <section className="tech-sensoft-section py-5" id="software">
        <div className="container py-lg-4">
          <div className="row align-items-center ">
            
            {/* Left Content */}
            <div className="col-12 col-lg-5 text-center text-lg-start">
              <span className="tech-sub-tagline text-uppercase mb-2 d-inline-block">
                {software.subtitle}
              </span>

              <h2 className="tech-sensoft-heading mb-4">
                {software.title}
              </h2>

              <p className="tech-sensoft-desc mb-4">
                {software.description}
              </p>

              {/* Feature Checklist */}
              {software.features && (
              <ul className="list-unstyled tech-checklist mb-4">
                {software.features.map((feat, idx) => (
                  <li key={idx} className="d-flex align-items-start gap-2.5 mb-2.5">
                    <span className="tech-check-badge flex-shrink-0">
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="tech-checklist-text">{feat}</span>
                  </li>
                ))}
              </ul>
              )}
            </div>

            {/* Right UI Screenshot */}
            {software.image && (
            <div className="col-12 col-lg-7 text-center">
              <div className="tech-sensoft-ui-frame rounded-4 overflow-hidden shadow-lg border">
                <Image
                  src={software.image}
                  alt="SenSoft Software Wavefront Analysis UI"
                  width={750}
                  height={480}
                  className="img-fluid w-100 h-auto"
                  unoptimized
                />
              </div>
            </div>
            )}

          </div>
        </div>
      </section>
      )}

      {/* ==========================================
          4. TECHNOLOGY-ENABLED PRODUCTS
          ========================================== */}
      {products.items && products.items.length > 0 && (
      <section className="tech-products-section " id="products">
        <div className="container py-lg-4">
          <header className="text-center mb-5">
            <h2 className="tech-section-title text-uppercase mb-0">
              {products.title}
            </h2>
            <p className="section-intro mt-3">{products.description}</p>
          </header>

          <div className="row g-4">
            {products.items.map((prod, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div className="tech-product-card custom-glass-card p-4 rounded-4 h-100 d-flex flex-column text-center">
                  <h4 className="tech-product-title mb-3">
                    {prod.name}
                  </h4>
                  <p className="tech-product-desc mb-0 flex-grow-1">
                    {prod.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ==========================================
          5. APPLICATIONS GRID
          ========================================== */}
      {applications.items && applications.items.length > 0 && (
      <section className="tech-applications-section" id="applications">
        <div className="container py-lg-4">
          <header className="text-center mb-5">
            <h2 className="tech-section-title text-uppercase mb-0">
              {applications.title}
            </h2>
            <p className="section-intro mt-3">{applications.description}</p>
          </header>

          <div className="row g-4">
            {applications.items.map((app, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-3">
                <div className="tech-app-dark-card custom-glass-card rounded-4 overflow-hidden position-relative d-flex flex-column justify-content-between p-4 text-decoration-none">
                  {app.image && (
                    <Image
                      src={app.image}
                      alt={app.title}
                      fill
                      className="tech-app-card-bg"
                      unoptimized
                      style={{ zIndex: 0 }}
                    />
                  )}
                  <div className="tech-app-card-overlay" />
                  
                  <div className="tech-app-content position-relative z-2 text-center">
                    <h3 className="tech-app-title mb-2">{app.title}</h3>
                    <p className="tech-app-desc mb-0">{app.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ==========================================
          6. INTEGRATED MEASUREMENT WORKFLOW
          ========================================== */}
      {workflow.steps && workflow.steps.length > 0 && (
      <section className="tech-workflow-section ">
        <div className="container py-lg-4">
          <header className="text-center mb-5">
            <h2 className="tech-section-title text-uppercase mb-0">
              {workflow.title}
            </h2>
            <p className="section-intro mt-3">{workflow.description}</p>
          </header>

          <div className="row g-4 justify-content-center text-center">
            {workflow.steps.map((step, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg-3">
                <div className="tech-workflow-item custom-glass-card h-100 p-4 rounded-4">
                  <div className="tech-step-circle-badge mx-auto mb-3">
                    <span className="h3 mb-0">{step.step}</span>
                  </div>
                  <div className="tech-workflow-icon-box mx-auto mb-3">
                    {ICON_MAP[step.icon] || ICON_MAP.wavefront}
                  </div>
                  <h4 className="tech-step-title mb-2">{step.title}</h4>
                  <p className="tech-step-desc mb-0">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ==========================================
          7. CALIBRATION & ADVANTAGES
          ========================================== */}
      {(calibration.items || advantages.items || stats.length > 0) && (
      <section className="tech-calibration-section ">
        <div className="container py-lg-4">
          {calibration.title && (
            <>
              <header className="text-center mb-5">
                <h2 className="tech-section-title text-uppercase mb-0">{calibration.title}</h2>
                <p className="section-intro mt-3">{calibration.description}</p>
              </header>

              <div className="row mb-5">
                <div className="col-lg-8 mx-auto">
                  {calibration.items && (
                    <ul className="list-unstyled"> {/* text-center here for any block-level text, but flex items need more */}
                      {calibration.items.map((item, idx) => (
                        <li key={idx} className="d-flex align-items-center justify-content-center gap-3 py-3 border-bottom">
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-primary flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}

          {advantages.items && advantages.items.length > 0 && (
            <div className="row g-4">
              <div className="col-12">
                <h3 className="text-center mb-5">{advantages.title}</h3>
              </div>
              {advantages.items.map((adv, idx) => (
                <div key={idx} className="col-md-6 col-lg-4">
                  <div className="custom-glass-card p-4 h-100 rounded-4">
                    <h5 className="mb-3">{adv.title}</h5>
                    <p className="mb-0">{adv.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {stats.length > 0 && (
            <div className="row g-4 mt-5 text-center">
              {stats.map((stat, idx) => (
                <div key={idx} className="col-6 col-md-3">
                  <div className="custom-glass-card p-4 rounded-4">
                    <div className="h3 mb-2 fw-bold text-primary">{stat.value}</div>
                    <p className="mb-0 small">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      )}

      {/* ==========================================
          8. BOTTOM CTA
          ========================================== */}
        <Cta/>

    </main>
  );
}