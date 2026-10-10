'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Dynamic Data & Reusable Components
import termsData from '@/data/terms-and-conditions.json';
import PageTopBar from '@/components/common/PageTopBar';

// CSS Imports
import '../../../public/assets/css/terms-and-conditions.css';

// SVG Icons
const ICONS = {
  shield: (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  code: (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  globe: (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  scale: (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
  search: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  print: (
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  ),
  calendar: (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  document: (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  check: (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  ),
  mail: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  phone: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  pin: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  counterDoc: (
    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
};

export default function TermsAndConditionsPage() {
  const page = termsData?.page || {};
  const sections = page.sections || [];
  const highlights = page.keyHighlights || [];
  const company = page.company || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id || '');

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();
    return sections.filter((sec) => {
      const matchTitle = sec.title.toLowerCase().includes(query);
      const matchSummary = sec.summary.toLowerCase().includes(query);
      const matchParagraphs = sec.paragraphs.some((p) => p.toLowerCase().includes(query));
      const matchKeyPoints = sec.keyPoints?.some((kp) => kp.toLowerCase().includes(query));
      return matchTitle || matchSummary || matchParagraphs || matchKeyPoints;
    });
  }, [sections, searchQuery]);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        const el = document.getElementById(sec.id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionId(sec.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // const handlePrint = () => {
  //   if (typeof window !== 'undefined') {
  //     window.print();
  //   }
  // };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSectionId(id);
    }
  };

  return (
    <div className="terms-page-wrapper py-5">
      <div className="container mt-5">
        
        {/* Top Breadcrumb Bar */}
        <PageTopBar
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Terms & Conditions' },
          ]}
          counterLabel="SECTIONS"
          counterValue={sections.length}
          counterIcon={ICONS.counterDoc}
          showCounter={true}
        />

        {/* Header Hero Card */}
        <motion.header
          className="terms-header-card p-4 p-md-5 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
            <span className="terms-badge">
              {ICONS.shield}
              <span>Official Agreement</span>
            </span>

            <div className="d-flex flex-wrap align-items-center gap-2">
              <span className="terms-meta-pill">
                {ICONS.calendar}
                <span>Effective: {page.effectiveDate || 'January 2025'}</span>
              </span>
              <span className="terms-meta-pill">
                {ICONS.document}
                <span>Version: {page.version || 'v2.4'}</span>
              </span>
            </div>
          </div>

          <h1 className="h2 fw-bold text-heading mb-3">
            {page.title || 'Terms and Conditions'}
          </h1>
          <p className="terms-paragraph mb-0 text-muted">
            {page.subtitle || 'Legal terms governing the supply of SpotOptics optical instruments, Shack-Hartmann wavefront sensors, SenSoft software licenses, and technical services.'}
          </p>
        </motion.header>

        {/* Key Highlights Grid */}
        {highlights.length > 0 && (
          <section className="mb-5" aria-label="Key Terms Highlights">
            <div className="row g-3">
              {highlights.map((item, idx) => (
                <div key={idx} className="col-12 col-sm-6 col-lg-3">
                  <motion.div
                    className="terms-highlight-card"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                  >
                    <div className="terms-highlight-icon">
                      {ICONS[item.icon] || ICONS.shield}
                    </div>
                    <h2 className="terms-highlight-title">{item.title}</h2>
                    <p className="terms-highlight-desc">{item.description}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Content & Sticky TOC Layout */}
        <div className="row g-4">
          
          {/* Main Legal Content (8 cols on desktop) */}
          <div className="col-12 col-lg-8 order-2 order-lg-1">
            
            {/* Quick Search inside Terms */}
            <div className="terms-search-wrapper">
              <span className="terms-search-icon">{ICONS.search}</span>
              <input
                type="text"
                className="terms-search-input"
                placeholder="Search within Terms & Conditions (e.g. warranty, software, liability, delivery)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search terms and conditions"
              />
            </div>

            {/* If no search results */}
            {filteredSections.length === 0 && (
              <div className="terms-section-card text-center py-5">
                <p className="text-muted mb-2">No sections matched your search query "{searchQuery}".</p>
                <button
                  type="button"
                  className="btn btn-outline-custom btn-sm"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search Filter
                </button>
              </div>
            )}

            {/* Render Sections */}
            <div className="terms-sections-container">
              {filteredSections.map((section, sIdx) => {
                const isActive = activeSectionId === section.id;

                return (
                  <motion.article
                    key={section.id}
                    id={section.id}
                    className={`terms-section-card ${isActive ? 'focused' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Section Header */}
                    <div className="terms-section-header">
                      <div className="terms-section-number">{section.number}</div>
                      <div>
                        <h2 className="terms-section-title">{section.title}</h2>
                        {section.summary && (
                          <p className="terms-section-summary">{section.summary}</p>
                        )}
                      </div>
                    </div>

                    {/* Paragraphs */}
                    <div className="terms-section-body">
                      {section.paragraphs?.map((para, pIdx) => (
                        <p key={pIdx} className="terms-paragraph">
                          {para}
                        </p>
                      ))}

                      {/* Special Contact Block if section is contact */}
                      {section.id === 'contact-inquiries' && company.name && (
                        <div className="terms-contact-card mt-3">
                          <h3 className="h6 fw-bold text-heading mb-3">SpotOptics Legal & Operations Desk</h3>
                          <div className="terms-contact-info-item">
                            {ICONS.pin}
                            <span>{company.address}</span>
                          </div>
                          <div className="terms-contact-info-item">
                            {ICONS.phone}
                            <a href={`tel:${company.phone}`} className="text-decoration-none text-para">
                              {company.phone}
                            </a>
                          </div>
                          <div className="terms-contact-info-item">
                            {ICONS.mail}
                            <a href={`mailto:${company.email}`} className="text-decoration-none text-para">
                              {company.email}
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Key Points Takeaway */}
                      {section.keyPoints && section.keyPoints.length > 0 && (
                        <div className="terms-keypoints-box">
                          <div className="terms-keypoints-title">
                            {ICONS.check}
                            <span>Key Takeaways</span>
                          </div>
                          <ul className="terms-keypoints-list">
                            {section.keyPoints.map((point, kIdx) => (
                              <li key={kIdx} className="terms-keypoints-item">
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {/* Assistance / Inquiries Banner */}
            <div className="terms-help-banner mt-4">
              <h2 className="terms-help-title">Need Custom Terms or Commercial Clarifications?</h2>
              <p className="terms-help-text">
                For custom Statement of Work (SOW) projects, OEM wavefront integration agreements, or dedicated distribution partnerships, our legal and technical team is ready to assist.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link href="/contact" className="btn btn-primary-custom">
                  Contact Legal & Sales
                </Link>
                <Link href="/contact#quote" className="btn btn-outline-custom text-white border-light">
                  Request Commercial Quote
                </Link>
              </div>
            </div>

          </div>

          {/* Table of Contents Sticky Sidebar (4 cols on desktop) */}
          <div className="col-12 col-lg-4 order-1 order-lg-2">
            <aside className="terms-sidebar-sticky">
              <div className="terms-toc-card">
                <h3 className="terms-toc-title">Table of Contents</h3>

                <nav className="terms-toc-list" aria-label="Table of Contents Navigation">
                  {sections.map((sec) => {
                    const isSelected = activeSectionId === sec.id;
                    return (
                      <div key={sec.id} className="terms-toc-item">
                        <a
                          href={`#${sec.id}`}
                          onClick={(e) => scrollToSection(e, sec.id)}
                          className={`terms-toc-link ${isSelected ? 'active' : ''}`}
                        >
                          <span className="terms-toc-number">{sec.number}.</span>
                          <span>{sec.title}</span>
                        </a>
                      </div>
                    );
                  })}
                </nav>

                <div className="terms-toc-actions">
                  {/* <button
                    type="button"
                    onClick={handlePrint}
                    className="terms-action-btn w-100"
                    aria-label="Print terms and conditions document"
                  >
                    {ICONS.print}
                    <span>Print / Save as PDF</span>
                  </button> */}
                  <Link
                    href="/faq"
                    className="terms-action-btn w-100"
                  >
                    <span>View Shack-Hartmann FAQ</span>
                  </Link>
                </div>
              </div>
            </aside>
          </div>

        </div>

      </div>
    </div>
  );
}
