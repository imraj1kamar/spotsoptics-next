'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Dynamic Data & Components
import Sidebar from '@/components/common/Sidebar';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Cta from '@/components/common/Cta';
import knowledgeData from '@/data/knowledge.json';
import sidebarData from '@/data/sidebar.json';

// Stylesheets
import '../../../public/assets/css/all-products.css';
import '../../../public/assets/css/knowledge.css';

// Helper to normalize image paths
const normalizeSrc = (src) => {
  if (!src) return '';
  return src.startsWith('/') || src.startsWith('http') ? src : `/${src}`;
};

export default function KnowledgePage() {
  const containerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const page = knowledgeData?.page || {};
  const allArticles = useMemo(() => knowledgeData?.articles || [], []);

  // Format articles count with leading zero
  const totalCountFormatted = String(allArticles.length).padStart(2, '0');

  // Filter articles based on search & category
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      const matchesSearch =
        searchQuery === '' ||
        article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const category = article.category || article.tag || 'METROLOGY';
      const matchesCategory =
        activeCategory === 'ALL' ||
        category.toUpperCase() === activeCategory.toUpperCase();

      return matchesSearch && matchesCategory;
    });
  }, [allArticles, searchQuery, activeCategory]);

  // Extract unique categories for quick filter chips
  const categories = useMemo(() => {
    const set = new Set(['ALL']);
    allArticles.forEach((art) => {
      const cat = art.category || art.tag;
      if (cat) set.add(cat.toUpperCase());
    });
    return Array.from(set);
  }, [allArticles]);

  // GSAP Scroll Animations with context cleanup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Article Cards Staggered Reveal
      const cards = gsap.utils.toArray('.knowledge-article-card');
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: '.knowledge-articles-grid',
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 2. Media Image Hover Parallax / Scale
      const mediaFigures = gsap.utils.toArray('.knowledge-media-box');
      mediaFigures.forEach((box) => {
        gsap.fromTo(
          box,
          { opacity: 0, scale: 0.98 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: box,
              start: 'top 92%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [filteredArticles]);

  return (
    <section ref={containerRef} className="page-section knowledge-page-wrapper py-5">
      <div className="container mt-4">
        
        {/* ================= 1. TOP BAR: BREADCRUMBS & COUNTER ================= */}
     
  <div className="d-flex justify-content-between align-items-start position-relative z-2 mt-5 mb-2 mx-3">
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
                <span className="counter-value">{totalCountFormatted}</span>
              </div>
            </div>
          </div>
        {/* ================= 2. HERO BANNER ================= */}
        <motion.div
          className="knowledge-hero-card mb-4 position-relative overflow-hidden rounded-4 p-4 p-lg-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="row align-items-center position-relative z-2">
            <div className="col-lg-6 col-md-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-10 text-white border border-white border-opacity-15 mb-3">
                <span className="hero-pulse-dot"></span>
                <span className="small fw-semibold letter-spacing-1 text-uppercase">
                  Optical Metrology & Wavefront Research
                </span>
              </div>
              <h1 className="knowledge-hero-title text-white fw-bold mb-3">
                {page.title || 'Knowledge Corner'}
              </h1>
              <div className="hero-accent-line mb-3"></div>
              <p className="knowledge-hero-description text-white text-opacity-75 mb-0">
                {page.description}
              </p>
            </div>

            {page.hero_graphic && (
             
              <div className="col-lg-6 col-md-4 text-end position-relative z-1 d-none d-md-block">
                            <div className="hero-3d-lens-wrapper">
                              <Image
                                             
                                             src={normalizeSrc(page.hero_graphic)}
                                             alt='Optical wavefront schematic'
                                             width={850}
                                             height={380}
                                             className="img-fluid rounded object-fit-contain"
                                             style={{ maxHeight: '360px' }}
                                             priority
                                             unoptimized
                                             
                                           />
                            </div>
                          </div>
            )}
          </div>
          <div className="hero-card-glow-bg" aria-hidden="true"></div>
        </motion.div>

        {/* ================= 3. FILTER / SEARCH CONTROLS ================= */}
        {categories.length > 1 && (
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div className="d-flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`btn-filter-chip ${activeCategory === cat ? 'active' : ''}`}
                >
                  {cat === 'ALL' ? 'All Publications' : cat}
                </button>
              ))}
            </div>

            <div className="knowledge-search-input-wrapper">
              <input
                type="text"
                placeholder="Search technical papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control form-control-sm knowledge-search-input"
              />
              <svg
                className="search-icon"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* ================= 4. ARTICLES GRID & SIDEBAR ================= */}
        <div className="row g-4 mb-5">
          
          {/* Main Articles Area (9 Cols) */}
          <div className="col-lg-9">
            {filteredArticles.length > 0 ? (
              <div className="row g-4 knowledge-articles-grid">
                {filteredArticles.map((article, index) => {
                  const coverImageSrc = normalizeSrc(article.image);
                  const galleryImages = article.image_gallery || [];
                  const categoryBadge = article.category || article.tag || 'OPTICAL TESTING';

                  return (
                    <div key={article.id || index} className="col-12 col-md-6 d-flex">
                      <article
                        className="knowledge-article-card custom-glass-card w-100 d-flex flex-column rounded-4 p-0"
                        id={article.id || `knowledge-article-${index}`}
                      >
                        {/* Media Section (Cover or Gallery) */}
                        <div className="knowledge-media-wrapper p-3 pb-0">
                          {coverImageSrc ? (
                            <figure className="comparison-media-box rounded-3 p-3 bg-light d-flex flex-column align-items-center justify-content-between h-100 border">
                              <div className="media-img-container">
                                <Image
                                  src={coverImageSrc}
                                  alt={article.caption || article.title || 'Wavefront technical diagram'}
                                  width={500}
                                  height={260}
                                  className="knowledge-article-img"
                                  unoptimized
                                />
                              </div>
                              {article.caption && (
                                <figcaption className="knowledge-caption px-3 py-2">
                                  <span className="caption-dot"></span>
                                  <span className="caption-text">{article.caption}</span>
                                </figcaption>
                              )}
                            </figure>
                          ) : galleryImages.length > 0 ? (
                            <div className="knowledge-gallery-grid">
                              {galleryImages.map((galleryItem, gIdx) => {
                                const gSrc = normalizeSrc(galleryItem.image);
                                return (
                                  <figure
                                    key={gIdx}
                                    className="knowledge-media-box gallery-sub-box mb-0 rounded-3 border overflow-hidden"
                                  >
                                    <div className="gallery-img-container">
                                      {gSrc && (
                                        <Image
                                          src={gSrc}
                                          alt={galleryItem.caption || `Comparative analysis ${gIdx + 1}`}
                                          width={240}
                                          height={140}
                                          className="knowledge-article-img"
                                          unoptimized
                                        />
                                      )}
                                    </div>
                                    {galleryItem.caption && (
                                      <figcaption className="knowledge-caption micro-caption px-2 py-1">
                                        <span className="caption-dot"></span>
                                        <span className="caption-text"> {galleryItem.caption}</span>
                                       
                                      </figcaption>
                                    )}
                                  </figure>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>

                        {/* Content Body */}
                        <div className="knowledge-body-content p-4 d-flex flex-column flex-grow-1">
                          <div className="mb-2">
                            <span className="comparison-floating-badge badge  text-white px-3 py-2 rounded-pill fw-semibold mb-2">
                              {categoryBadge}
                            </span>
                          </div>

                          <h3 className="knowledge-item-title mb-2">
                            <Link href={article.url || '#'} className="title-link">
                              {article.title}
                            </Link>
                          </h3>

                          {article.description && (
                            <p className="knowledge-item-excerpt text-muted mb-4">
                              {article.description}
                            </p>
                          )}

                          {/* Card Footer Action */}
                          <div className="knowledge-card-footer mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
                            <Link
                              href={article.url || '#'}
                              className="a-link mt-auto d-inline-flex align-items-center gap-2 text-decoration-none text-uppercase"
                              aria-label={`Read more about ${article.title}`}
                            >
                              <span>{article.button_text || 'Read Technical Paper'}</span>
                              <svg
                                width="16"
                                height="16"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                className="arrow-icon"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2.2"
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
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
              <div className="empty-state-card text-center p-5 rounded-4 border bg-white">
                <svg
                  width="48"
                  height="48"
                  fill="none"
                  stroke="#94a3b8"
                  viewBox="0 0 24 24"
                  className="mb-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h5 className="text-dark fw-bold">No articles match your query</h5>
                <p className="text-muted small mb-3">Try adjusting your search terms or filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('ALL');
                    setSearchQuery('');
                  }}
                  className="btn btn-outline-primary btn-sm rounded-pill px-3"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Sidebar (3 Cols) */}
          <div className="col-lg-3 d-none d-lg-block">
            <aside className="sticky-top" style={{ top: '100px', zIndex: 10 }}>
              <Sidebar
                title={sidebarData?.title || 'Knowledge Categories'}
                links={sidebarData?.links || []}
              />
            </aside>
          </div>

        </div>

        {/* ================= 5. BOTTOM CTA ================= */}
        <div className="knowledge-cta-section mt-5">
          <Cta />
        </div>

      </div>
    </section>
  );
}