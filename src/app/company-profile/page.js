'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Reusable Components & Dynamic Data Import
import Sidebar from '@/components/common/Sidebar';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import companyProfileData from '@/data/companyprofile.json';
import sidebarData from '@/data/sidebar.json';

// CSS Import (Aapki CSS file path)
import '../../../public/assets/css/all-products.css';
import '../../../public/assets/css/company-profile.css';

export default function CompanyProfilePage() {
  const pageInfo = companyProfileData?.page || {};
  const sections = pageInfo.sections || [];

  // Helper function to extract section by ID
  const getSectionById = (id) => sections.find((sec) => sec.id === id) || null;

  const profile = getSectionById('company-profile');
  const milestones = getSectionById('milestones');
  const expertise = getSectionById('expertise');

  // GSAP Scroll Animations (Timeline Glow Line & Marker Pop)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // 1. TIMELINE LINE GLOW EFFECT
      const timelineContainer = document.querySelector('.vertical-timeline');

      if (timelineContainer && !timelineContainer.querySelector('.timeline-glow-line')) {
        const glowLine = document.createElement('div');
        glowLine.className = 'timeline-glow-line';
        glowLine.style.position = 'absolute';
        glowLine.style.top = '0';
        glowLine.style.left = window.innerWidth > 991 ? '20px' : '15px';
        glowLine.style.width = '4px';
        glowLine.style.height = '0%';
        glowLine.style.background = '#1E5EFF';
        glowLine.style.boxShadow = '0 0 20px 6px rgba(30, 94, 255, 0.5)';
        glowLine.style.borderRadius = '4px';
        glowLine.style.zIndex = '0';

        timelineContainer.appendChild(glowLine);

        gsap.to(glowLine, {
          scrollTrigger: {
            trigger: timelineContainer,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 0.5,
          },
          height: '100%',
          ease: 'none',
        });
      }

      // 2. TIMELINE MARKER GLOW EFFECT (Dots)
      const timelineItems = document.querySelectorAll('.timeline-item');

      timelineItems.forEach((item) => {
        const marker = item.querySelector('.timeline-marker');

        if (marker) {
          gsap.to(marker, {
            scrollTrigger: {
              trigger: item,
              start: 'top 55%',
              end: 'bottom 35%',
              toggleActions: 'play reverse play reverse',
            },
            scale: 1.4,
            boxShadow: '0 0 25px 8px rgba(30, 94, 255, 0.6)',
            backgroundColor: '#1E5EFF',
            borderColor: '#FFFFFF',
            duration: 0.5,
            ease: 'back.out(1.7)',
          });
        }
      });
    }
  }, []);

  return (
   <section className="page-section py-5">
      <div className="container mt-5">
        <motion.div
          className="all-products-top-bar mb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'About Us' },
            ]}
            className="all-products-breadcrumbs"
          />

          <div className="d-none d-lg-block top-bar-center">
            <h1 className="product-detail-title">{pageInfo.brand || 'SpotOptics'}</h1>
          </div>

          <div className="all-products-counter text-end">
              <span className="counter-label d-block text-muted small">TOTAL MILESTONES</span>
              <span className="counter-value fw-bold">{milestones?.timeline?.length || 0}</span>
            </div>
        </motion.div>

        {/* Page Description */}
        <header className="row mb-5 justify-content-center text-center">
          <div className="col-lg-10">
            <p className="page-tagline">{pageInfo.tagline || ''}</p>
          </div>
        </header>

        <div className="row g-4 align-items-start">
          <div className="container">
            <div className="row">
              {/* Main Content Column (9/12) */}
              <div className="col-lg-9">
                {/* Company Profile Section */}
                {profile && (
                  <div className="mb-5">
                    <article className="profile-card custom-glass-card">
                      <div className="profile-content mt-4">
                        {profile.content?.map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    </article>
                  </div>
                )}

                {/* Milestones Vertical Timeline Section */}
                {milestones && (
                  <div className="mb-5">
                    <section className="milestone-section">
                      <h2 className="section-title text-center mb-3">
                        {milestones.title}
                      </h2>
                      <p className="section-intro text-center mb-5">
                        {milestones.intro}
                      </p>

                      <div className="vertical-timeline position-relative">
                        {milestones.timeline?.map((item, index) => {
                          const itemImgSrc = item.image
                            ? item.image.startsWith('/')
                              ? item.image
                              : `/${item.image}`
                            : '';

                          return (
                            <div key={index} className="timeline-item">
                              <div className="timeline-marker" />
                              <div className="timeline-content custom-glass-card">
                                <div className="timeline-header">
                                  {itemImgSrc && (
                                    <Image
                                      src={itemImgSrc}
                                      alt={item.product || 'Milestone Product'}
                                      width={50}
                                      height={50}
                                      className="timeline-product-thumb"
                                      unoptimized
                                    />
                                  )}
                                  <span className="timeline-year">
                                    {item.year}
                                  </span>
                                  {item.url ? (
                                    <h4 className="timeline-product">
                                      <Link
                                        href={item.url}
                                        className="timeline-product-link"
                                      >
                                        {item.product}
                                      </Link>
                                    </h4>
                                  ) : (
                                    <h4 className="timeline-product">
                                      {item.product}
                                    </h4>
                                  )}
                                </div>
                                <p className="timeline-desc">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  </div>
                )}

                {/* Expertise Section */}
                {expertise && (
                  <div>
                    <div className="expertise-card custom-glass-card">
                      <h2 className="section-title">{expertise.title}</h2>
                      <div className="expertise-content mt-4">
                        {expertise.content?.map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>

                      <div className="expertise-pills-wrapper mt-4">
                        {expertise.expertiseAreas?.map((area, index) => (
                          <span key={index} className="expertise-pill">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Column (3/12) */}
              <div className="col-lg-3 ms-auto pb-1 d-none d-lg-block">
                <Sidebar
                  title={sidebarData.title || 'Categories'}
                  links={sidebarData.links || []}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}