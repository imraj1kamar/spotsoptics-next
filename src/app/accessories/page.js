'use client';

import React, { useEffect, useRef } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTopBar from '@/components/common/PageTopBar';
// CSS file import
import '../../../public/assets/css/accessories.css';
import pageData from '@/data/accessories.json';
import Cta from '@/components/common/Cta';
import Sidebar from '@/components/common/Sidebar';
import sidebarData from '@/data/sidebar.json';

export default function Accessories() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const overviewRef = useRef(null);

  const { page, section, accessories, sidebar } = pageData;

  // 1. Bullets overview data
  const bulletData = accessories.find((item) => item.bullets);

  // 2. Filter detail products (jo sections images ya details rakhte hain)
  const detailedAccessories = accessories.filter(
    (item) => item.id && (item.images || item.details || item.description)
  );

  // GSAP Animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero Animation
      if (heroRef.current) {
        gsap.from(heroRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out',
        });
      }

      // Overview Card Animation
      if (overviewRef.current) {
        gsap.from(overviewRef.current, {
          scrollTrigger: {
            trigger: overviewRef.current,
            start: 'top 85%',
          },
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: 'power2.out',
        });
      }

      // Detailed Cards Scroll Animations
      const cards = gsap.utils.toArray('.detail-card');
      cards.forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
          },
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power2.out',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="page-section accessories-page-wrapper py-5">
      <div className="container mt-5">
      
       
         
 <PageTopBar
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'Accessories' },
            ]}
            showCounter={true}
            counterValue="12"
            
                           />
        {/* ================= 2. HERO BANNER ================= */}
        <div ref={heroRef} className="knowledge-hero-card mb-4 position-relative overflow-hidden rounded-4 p-4 p-lg-5">
          <div className="row align-items-center position-relative z-2">
            <div className="col-lg-7 col-md-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-10 text-white border border-white border-opacity-15 mb-3">
                <span className="hero-pulse-dot"></span>
                <span className="small fw-semibold text-uppercase letter-spacing-1">
                  {page?.hero?.tagline || 'Optical Metrology Accessories'}
                </span>
              </div>
              <h1 className="knowledge-hero-title text-white fw-bold mb-3">
                {section.title}
              </h1>
              <div className="hero-accent-line mb-3"></div>
              <p className="hero-description text-white text-opacity-75 mb-0">
                {section.description}
              </p>
            </div>

            {page?.hero?.image && (
              <div className="col-lg-5 col-md-5 text-center mt-4 mt-md-0 d-none d-lg-block">
               <div className="hero-image-box">
  <Image
    src={page.hero.image}
    alt={page.hero.alt || page.hero.title}
    width={800} 
    height={600} 
    loading="eager"
    className="img-fluid rounded"
  />
</div>
              </div>
            )}
          </div>
          <div className="hero-card-glow-bg" aria-hidden="true"></div>
        </div>

        {/* ================= 3. MAIN 2-COLUMN LAYOUT ================= */}
        <div className="row g-4">
          {/* Left Column: Content (9 Cols) */}
          <div className="col-lg-9 col-md-12">
            {/* Overview / Bullet Points Card */}
            {bulletData?.bullets && (
              <div ref={overviewRef} className="bullets-card mb-5">
                <h2 className="bullets-heading">Overview</h2>
                <ul className="accessories-bullet-list">
                  {bulletData.bullets.map((bulletHtml, index) => (
                    <li
                      key={index}
                      className="bullet-item"
                      dangerouslySetInnerHTML={{ __html: bulletHtml }}
                    />
                  ))}
                </ul>
              </div>
            )}

            {/* Detailed Product Cards */}
            <div className="detail-sections-wrapper d-flex flex-column gap-5">
              {detailedAccessories.map((product) => (
                <div key={product.id} id={product.id} className="detail-card">
                  <div className="detail-header">
                    {/* Badges / Model Codes */}
                    {product.codes ? (
                      <div className="badge-group mb-2">
                        {product.codes.map((c) => (
                          <span key={c} className="badge-primary">{c}</span>
                        ))}
                      </div>
                    ) : product.code ? (
                      <span className="badge-primary mb-2">{product.code}</span>
                    ) : null}

                    <h2 className="detail-title">{product.title || product.name}</h2>
                    {product.description && (
                      <p className="lead-text">{product.description}</p>
                    )}
                  </div>

                  {/* Showcase Images with Captions */}
                  {product.images && product.images.length > 0 && (
                    <div className="image-grid">
                      {product.images.map((img, index) => (
                        <figure key={index} className="figure-card">
                          <div className="image-container">
                           <Image
                              src={img.image || img.src}
                              alt={img.caption || product.name}
                              className="product-image"
                              width={600} // Replace with actual product image width
    height={600} // Replace with actual product image height

                            />
                          </div>
                          {img.caption && (
                           
                            <figcaption className="knowledge-caption px-3 py-2 justify-content-center align-items-center">
                                  <span className="caption-dot"></span>
                                  <span className="caption-text">{img.caption}</span>
                                </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  )}

                  {/* Technical Details */}
                  {product.details && product.details.length > 0 && (
                    <div className="details-content">
                      {product.details.map((detail, idx) => (
                        <div key={idx} className="detail-item">
                          <span className="bullet-icon">•</span>
                          <p className="detail-paragraph">{detail}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  
                </div>
              ))}
            </div>
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

        {/* ================= 4. BOTTOM CTA ================= */}
        <div className="accessories-cta-section mt-5 pt-4">
          <Cta />
        </div>
      </div>
    </section>
  );
}
