'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Dynamic Data & Components Import
import Sidebar from '@/components/common/Sidebar';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import downloadData from '@/data/download.json';
import sidebarData from '@/data/sidebar.json';

// CSS Import (Aapki CSS file path)
import '../../../public/assets/css/all-products.css';
import '../../../public/assets/css/downloads.css';

export default function DownloadsPage() {
  const page = downloadData?.page || {};
  const downloads = downloadData?.downloads || [];

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
              { label: 'Downloads' },
            ]}
            className="all-products-breadcrumbs"
          />

          <div className="d-none d-lg-block top-bar-center">
            <h1 className="product-detail-title">{page.title || 'Downloads'}</h1>
          </div>
          <div className="all-products-counter text-end">
              <span className="counter-label d-block text-muted small">TOTAL</span>
              <span className="counter-value fw-bold">{downloads.length}</span>
            </div>
        </motion.div>

        {/* Page Description */}
        <header className="row mb-5 justify-content-center text-center">
          <div className="col-lg-10">
            <p className="page-tagline">{page.description || ''}</p>
          </div>
        </header>

        <div className="row">
          {/* Main Downloads Column (9/12) */}
          <div className="col-lg-9">
            <div className="downloads-panel vertical-timeline position-relative">
              {downloads.map((item, index) => {
                const fileUrl = item.file
                  ? item.file.startsWith('/')
                    ? item.file
                    : `/${item.file}`
                  : '#';

                return (
                  <div key={index} className="custom-glass-card timeline-item">
                    <div className="timeline-marker" />

                    <div className="download-content">
                      <h5>{item.title}</h5>

                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.button_text}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Column (3/12) */}
          <div className="col-lg-3 ms-auto pb-1 d-none d-lg-block mt-3">
            <Sidebar
              title={sidebarData.title || 'Categories'}
              links={sidebarData.links || []}
            />
          </div>
        </div>
      </div>
    </section>
  );
}