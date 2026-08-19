
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Reusable SliderNav & Data & CSS Import
import SliderNav from '@/components/common/SliderNav';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import applicationData from '@/data/application.json';
import '../../../public/assets/css/all-products.css';
import '../../../public/assets/css/application.css';

// Category Badges Icons
const CATEGORY_ICONS = {
  AUTOMOTIVE: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
    </svg>
  ),
  OPHTHALMIC: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  TELESCOPE: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  IMAGING: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <circle cx="12" cy="13" r="3" strokeWidth="2" />
    </svg>
  ),
};

export default function ApplicationsSection() {
  const page = applicationData?.page || {};
  const applications = applicationData?.applications || [];
  const router = useRouter();
  const searchParams = useSearchParams();
  const appQuery = searchParams?.get('app');

  // Modal State
  const [detailModalApp, setDetailModalApp] = useState(null);

  const handleCloseModal = () => {
    setDetailModalApp(null);

    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (!params.has('app')) return;
    params.delete('app');

    const newSearch = params.toString();
    const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}${window.location.hash || ''}`;
    router.replace(newUrl);
  };

  // Open the selected application modal when the query param is present
  useEffect(() => {
    if (!appQuery) return;
    const selectedApp = applications.find((application) => application.id === appQuery);
    if (selectedApp) {
      setDetailModalApp(selectedApp);
    }
  }, [appQuery, applications]);

  // GSAP Entrance Animation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      const timer = setTimeout(() => {
        gsap.fromTo(
          '.application-card-col',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power2.out',
            clearProps: 'all',
            scrollTrigger: {
              trigger: '.application-grid-wrapper',
              start: 'top 85%',
            },
          }
        );
        ScrollTrigger.refresh();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section className="page-section py-5" id="applications" >
      
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
              { label: 'Applications' },
            ]}
            className="all-products-breadcrumbs"
          />

          <div className="d-none d-lg-block top-bar-center">
            <h1 className="product-detail-title">Applications</h1>
          </div>

          <div className="all-products-counter text-end">
              <span className="counter-label d-block text-muted small">TOTAL</span>
              <span className="counter-value fw-bold">{applications.length}</span>
            </div>
        </motion.div>

        {/* Page Description */}
        <header className="row mb-5 justify-content-center text-center">
          <div className="col-lg-10">
            <p className="page-tagline">
              {page.description ||
              'Explore diverse applications where SpotOptics precision drives excellence.'}
            </p>
          </div>
        </header>
        {applications.length > 0 ? (
          <div className="row g-4 application-grid-wrapper mb-5">
            {applications.map((application, index) => {
              const gallery = application.image_gallery || application.gallery || [];

              const subUpper = (application.subtitle || application.id || '').toUpperCase();
              const categoryIcon = subUpper.includes('HUD') || subUpper.includes('HEAD-UP') || subUpper.includes('AUTOMOTIVE')
                ? CATEGORY_ICONS.AUTOMOTIVE
                : subUpper.includes('OPTINO') || subUpper.includes('OPHTHALMIC') || subUpper.includes('LENS')
                ? CATEGORY_ICONS.OPHTHALMIC
                : subUpper.includes('TELESCOPE')
                ? CATEGORY_ICONS.TELESCOPE
                : CATEGORY_ICONS.IMAGING;

              const hasSeparateTitle =
                application.title && application.title !== application.subtitle;

              return (
                <div key={index} className="col-12 col-lg-6 application-card-col">
                  <article className="app-redesigned-card h-100 p-3 p-lg-4 rounded-4 bg-white border border-slate-200 shadow-sm">
                    <div className="row g-3 g-lg-4 align-items-center h-100">
                      
                      {/* Left Column (Mobile/Tablet: Carousel Top) */}
                      <div className="col-12 col-md-5 order-1">
                        <CardCarousel
                          gallery={gallery}
                          appTitle={application.subtitle || application.title}
                          onImageClick={() => setDetailModalApp(application)}
                        />
                      </div>

                      {/* Right Column (Mobile/Tablet: Content Bottom) */}
                      <div className="col-12 col-md-7 order-2 d-flex flex-column h-100 justify-content-between">
                        <div>
                          {/* Subtitle Badge */}
                          {application.subtitle && (
                            <div className="d-flex align-items-center gap-2 mb-2 products-tag fw-bold small text-uppercase tracking-wide">
                              {categoryIcon}
                              <span>{application.subtitle}</span>
                            </div>
                          )}

                          {/* Distinct Title */}
                          {hasSeparateTitle && (
                            <h3 className="h6 fw-bold text-dark mb-2">
                              {application.title}
                            </h3>
                          )}

                          {/* Content Clamped to Image Height (~180px) */}
                          <div className="card-clamped-content text-muted small mb-2 position-relative">
                            {/* Description */}
                            {application.description && (
                              <p className="mb-2">{application.description}</p>
                            )}

                            {/* Top-level Bullets */}
                            {application.bullets && application.bullets.length > 0 && (
                              <ul className="list-unstyled mb-2">
                                {application.bullets.map((b, bIdx) => (
                                  <li key={bIdx} className="mb-1 d-flex align-items-start gap-1">
                                    <span className="text-primary fw-bold">✦</span>
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* Sections Bullets */}
                            {application.sections && application.sections.length > 0 && (
                              <div className="mb-2">
                                {application.sections.map((sec, sIdx) => (
                                  <div key={sIdx} className="mb-2">
                                    {sec.heading && (
                                      <strong className="d-block text-dark fw-bold mb-1">{sec.heading}:</strong>
                                    )}
                                    {sec.bullets && (
                                      <ul className="list-unstyled mb-0">
                                        {sec.bullets.map((b, bIdx) => (
                                          <li key={bIdx} className="mb-1 d-flex align-items-start gap-1">
                                            <span className="text-primary fw-bold">✦</span>
                                            <span>{b}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Inline ... View More Link */}
                          <button
                            type="button"
                            className="btn btn-link a-link p-0 text-uppercase text-decoration-none fw-bold small d-inline-flex align-items-center gap-1"
                            onClick={() => setDetailModalApp(application)}
                          >
                            <span>View More</span>
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </button>
                        </div>
                      </div>

                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        ) : null}

        

      </div>

      {/* Detail Modal with Smooth Slow Motion Transitions */}
      {detailModalApp && (
        <DetailModal app={detailModalApp} onClose={handleCloseModal} />
      )}
    </section>
  );
}

/* ==========================================================================
   Card Image Carousel Component with Autoplay & Smooth Fade
   ========================================================================== */
function CardCarousel({ gallery, appTitle, onImageClick }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto Play Carousel (Every 3.5 seconds)
  useEffect(() => {
    if (!gallery || gallery.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % gallery.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [gallery]);

  if (!gallery || gallery.length === 0) return null;

  const currentImg = gallery[activeIndex]?.image || '/assets/images/placeholder.png';
  const imgSrc = currentImg.startsWith('/') ? currentImg : `/${currentImg}`;

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="app-card-media-box rounded-4 overflow-hidden position-relative w-100">
      <Image
        key={activeIndex}
        src={imgSrc}
        alt={appTitle || 'Application image'}
        width={360}
        height={260}
        className="img-fluid w-100 h-100 object-fit-cover cursor-pointer hover-zoom carousel-slide-fade"
        onClick={onImageClick}
        unoptimized
      />

      {gallery.length > 1 && (
        <div className="position-absolute bottom-0 end-0 p-2 z-3">
          <SliderNav
            wrapperClass="app-carousel-nav"
            prevClass="slider-nav-btn swiper-prev"
            nextClass="slider-nav-btn swiper-next"
            onPrev={handlePrev}
            onNext={handleNext}
            size={20}
                type="div"
          />
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   Detail Modal Component with Smooth Exit Animation & Matching Card Styling
   ========================================================================== */
function DetailModal({ app, onClose }) {
  const gallery = app.image_gallery || app.gallery || [];
  const [expandedImage, setExpandedImage] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  // Smooth Exit Handle
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 400); // 400ms transition time
  };

  // Keyboard Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (expandedImage) {
          setExpandedImage(null);
        } else {
          handleClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedImage]);

  return (
    <div
      className={`modal d-block bg-dark bg-opacity-75 ${
        isClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop'
      }`}
      tabIndex="-1"
      onClick={handleClose}
    >
      <div
        className={`modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable ${
          isClosing ? 'animate-modal-dialog-out' : 'animate-modal-dialog'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content rounded-4 border-0 p-3 p-md-4 shadow-lg position-relative overflow-hidden">
          
          <div className="modal-header border-0 pb-0">
            <div>
              {app.subtitle && (
                <span className="badge bg-primary bg-opacity-10 text-primary mb-2 text-uppercase">
                  {app.subtitle}
                </span>
              )}
              <h4 className="modal-title fw-bold text-dark">{app.title || app.subtitle}</h4>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            />
          </div>

          <div className="modal-body py-4">
            {/* Full Description in Consistent Box */}
            {app.description && (
              <div className="app-content-section-box mb-4">
                {app.description.split(/\n\s*\n/).map((para, i) => (
                  <p key={i} className="mb-2 text-muted fs-6 lh-base">{para}</p>
                ))}
              </div>
            )}

            {/* Top-level Bullets List in Consistent Box */}
            {app.bullets && app.bullets.length > 0 && (
              <div className="app-content-section-box mb-4">
                <h6 className="fw-bold text-dark mb-2">Key Observations:</h6>
                <ul className="list-unstyled mb-0">
                  {app.bullets.map((bullet, i) => (
                    <li key={i} className="mb-2 d-flex align-items-start gap-2 text-muted small">
                      <span className="text-primary fw-bold">✦</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sections List (5Star & Stella Modules) */}
            {app.sections && app.sections.length > 0 && (
              <div className="mb-4">
                {app.sections.map((sec, i) => (
                  <div key={i} className="app-content-section-box mb-3">
                    {sec.heading && (
                      <h6 className="fw-bold text-dark mb-2">{sec.heading} Module:</h6>
                    )}
                    {sec.bullets && (
                      <ul className="list-unstyled mb-0">
                        {sec.bullets.map((b, j) => (
                          <li key={j} className="mb-1.5 d-flex align-items-start gap-2 text-muted small">
                            <span className="text-primary fw-bold">✦</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Image Gallery Grid */}
            {gallery.length > 0 && (
              <div className="mt-4 pt-3 border-top">
                <h6 className="fw-bold text-dark mb-3">Gallery ({gallery.length})</h6>
                <div className="row g-3">
                  {gallery.map((img, i) => {
                    const imgSrc = img.image?.startsWith('/') ? img.image : `/${img.image}`;
                    return (
                      <div key={i} className="col-6 col-md-4">
                        <div
                          className="rounded-3 overflow-hidden cursor-pointer border shadow-sm modal-gallery-thumb position-relative"
                          onClick={() => setExpandedImage(imgSrc)}
                          style={{ height: '140px' }}
                        >
                          <Image
                            src={imgSrc}
                            alt={img.caption || 'Gallery Image'}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="hover-scale"
                            unoptimized
                          />
                        </div>
                        {img.caption && (
                          <small className="d-block text-muted text-center mt-1 xx-small">
                            {img.caption}
                          </small>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Slow Motion Image Expansion Overlay inside Modal */}
          {expandedImage && (
            <div
              className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-95 rounded-4 d-flex align-items-center justify-content-center p-3 z-3 modal-image-expand-overlay"
              onClick={() => setExpandedImage(null)}
            >
              <button
                type="button"
                className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                onClick={() => setExpandedImage(null)}
              />
              <img
                src={expandedImage}
                alt="Expanded view"
                className="img-fluid max-h-100 rounded-3 shadow-lg slow-zoom-image"
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}