
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Dynamic Data & Components Import
import Sidebar from '@/components/common/Sidebar';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Cta from '@/components/common/Cta';
import knowledgeData from '@/data/knowledge.json';
import sidebarData from '@/data/sidebar.json';

// CSS Imports
import '../../../public/assets/css/all-products.css';
import '../../../public/assets/css/knowledge.css';

export default function KnowledgePage() {
  const page = knowledgeData?.page || {};
  const articles = knowledgeData?.articles || [];

  // Format articles count with leading zero (e.g. 04)
  const formattedCount = String(articles.length).padStart(2, '0');

  // GSAP Scroll Animations
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // 1. Fade + Slide Up Animation for Article Cards
      const articleCards = document.querySelectorAll('.knowledge-article');
      articleCards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            clearProps: 'all',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // 2. Image Zoom-In for Article Images
      const articleImages = document.querySelectorAll('.knowledge-article-image');
      articleImages.forEach((img) => {
        gsap.fromTo(
          img,
          { opacity: 0, scale: 1.05 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            clearProps: 'all',
            scrollTrigger: {
              trigger: img,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }
  }, []);

  return (
    <section className="page-section knowledge-page-wrapper py-5">
      <div className="container mt-5">
         {/* Top Bar: Breadcrumbs & Counter Badge */}
          <div className="d-flex justify-content-between align-items-start position-relative z-2 mb-4 mx-3">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: page.title || 'Knowledge Corner' },
              ]}
              className="knowledge-breadcrumbs mb-0"
            />

            {/* Top Right Counter Card Badge */}
            <div className="knowledge-counter-badge d-flex align-items-center gap-3">
              <div className="counter-icon-box">
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div className="counter-info">
                <span className="counter-label">TOTAL ARTICLES</span>
                <span className="counter-value">{formattedCount}</span>
              </div>
            </div>
          </div>
        {/* ================= EXACT TOP HERO BANNER CARD ================= */}
        <motion.div
          className="knowledge-hero-card position-relative overflow-hidden mb-5 p-4 p-md-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Right Background 3D Optical Lens Graphic */}
          <div className="knowledge-hero-bg-graphic" aria-hidden="true">
            <Image
              src={page.hero_graphic || '/assets/images/focal-lance.png'}
              alt="Optical Wavefront Sensor"
              width={650}
              height={320}
              className="hero-lens-img"
              priority
              unoptimized
            />
          </div>

         

          {/* Hero Main Content (Left aligned) */}
          <div className="row position-relative z-2">
            <div className="col-xl-7 col-lg-8 col-md-9">
              <h1 className="knowledge-hero-title mb-3">
                {page.title || 'Knowledge Corner'}
              </h1>
              <p className="knowledge-hero-text mb-0">
                {page.description }  </p>
            </div>
          </div>
        </motion.div>

        {/* ================= ARTICLES GRID & SIDEBAR ================= */}
        <div className="row g-4 mb-5">
          
          {/* Left Column: 2x2 Article Cards Grid (9/12) */}
          <div className="col-lg-9">
            {articles.length > 0 ? (
              <div className="row g-4 knowledge-articles-grid">
                {articles.map((article, index) => {
                  const coverImageSrc = article.image
                    ? article.image.startsWith('/') ? article.image : `/${article.image}`
                    : '';

                  const galleryImages = article.image_gallery || [];

                  return (
                    <div key={article.id || index} className="col-12 col-md-6">
                      <article
                        className="knowledge-article custom-glass-card h-100 d-flex flex-column bg-white rounded-4 border p-3"
                        id={article.id || `knowledge-article-${index}`}
                      >
                        {/* 1. Article Images Area */}
                        <div className="knowledge-article-media mb-3">
                          {coverImageSrc ? (
                            <figure className="knowledge-article-figure mb-0 overflow-hidden rounded-3 bg-light text-center">
                              <Image
                                src={coverImageSrc}
                                alt={article.title || 'Knowledge article'}
                                width={500}
                                height={280}
                                style={{ width: '100%', height: '220px', objectFit: 'contain' }}
                                className="knowledge-article-image p-2"
                                unoptimized
                              />
                              {article.caption && (
                                <figcaption className="knowledge-article-caption small text-muted p-2 text-start">
                                  {article.caption}
                                </figcaption>
                              )}
                            </figure>
                          ) : galleryImages.length > 0 ? (
                            /* Side-by-Side Gallery Images */
                            <div className="row g-2 knowledge-article-gallery">
                              {galleryImages.map((galleryItem, gIdx) => {
                                const gSrc = galleryItem.image
                                  ? galleryItem.image.startsWith('/') ? galleryItem.image : `/${galleryItem.image}`
                                  : '';

                                return (
                                  <div key={gIdx} className="col-6">
                                    <figure className="knowledge-gallery-item mb-0 text-center bg-light rounded-3 p-1 h-100 d-flex flex-column justify-content-between">
                                      {gSrc && (
                                        <Image
                                          src={gSrc}
                                          alt={article.title || 'Gallery item'}
                                          width={220}
                                          height={150}
                                          style={{ width: '100%', height: '120px', objectFit: 'contain' }}
                                          className="knowledge-article-image rounded"
                                          unoptimized
                                        />
                                      )}
                                      {galleryItem.caption && (
                                        <figcaption className="knowledge-gallery-caption text-muted text-start mt-2" style={{ fontSize: '11px', lineHeight: '1.3' }}>
                                          {galleryItem.caption}
                                        </figcaption>
                                      )}
                                    </figure>
                                  </div>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>

                        {/* 2. Article Body */}
                        <div className="knowledge-article-body d-flex flex-column flex-grow-1">
                          
                          {/* Technology Badge */}
                          <div className="mb-2">
                            <span className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1 rounded-2 text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                              {article.category || article.tag || 'TECHNOLOGY'}
                            </span>
                          </div>

                          {/* Article Title */}
                          <h5 className="knowledge-article-title fw-bold text-dark mb-2" style={{ fontSize: '1.1rem', lineHeight: '1.4' }}>
                            {article.title || ''}
                          </h5>

                          {/* Article Description */}
                          {article.description && (
                            <p className="knowledge-article-excerpt text-muted mb-4 small flex-grow-1" style={{ lineHeight: '1.6' }}>
                              {article.description}
                            </p>
                          )}

                          {/* Article Link (Read More) */}
                          <div className="knowledge-article-footer mt-auto pt-2">
                            <Link
                              href={article.url || '#'}
                              className="knowledge-article-link text-primary text-decoration-none fw-semibold d-inline-flex align-items-center gap-1 small"
                            >
                              <span>{article.button_text || 'Read More'}</span>
                              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </Link>
                          </div>
                        </div>

                      </article>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="custom-glass-card p-4 text-center">
                <p className="text-muted mb-0">Knowledge content coming soon.</p>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar (3/12) */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="sticky-top" style={{ top: '100px' }}>
              <Sidebar
                title={sidebarData?.title || 'Categories'}
                links={sidebarData?.links || []}
              />
            </div>
          </div>

        </div>

        {/* ================= BOTTOM CTA BANNER ================= */}
        <div className="knowledge-cta-wrapper mb-4">
          <Cta />
        </div>

      </div>
    </section>
  );
}