'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Data & CSS Import
import heroData from '@/data/hero.json';
import '../../../public/assets/css/hero.css';

export default function Hero() {
  const heroRef = useRef(null);

  // 1. Smooth Framer Motion Scroll with Physics Spring Inertia
  const { scrollYProgress } = useScroll();
  const rawY = useTransform(scrollYProgress, [0, 0.3], [0, -40]);
  
  // useSpring se scroll jitter/lag 100% khatam ho jata hai
  const y = useSpring(rawY, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  // 2. Optimized GSAP Mousemove Parallax (120 FPS Performance)
  useEffect(() => {
    const heroSection = heroRef.current;
    if (!heroSection) return;

    const parallaxElements = heroSection.querySelectorAll('.gs-parallax');
    if (parallaxElements.length === 0) return;

    // GSAP quickTo setters for 120 FPS GPU-smooth mouse tracking
    const xSetters = [];
    const ySetters = [];

    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-speed') || '0');
      xSetters.push({
        set: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power2.out' }),
        speed,
      });
      ySetters.push({
        set: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power2.out' }),
        speed,
      });
    });

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const yPos = (e.clientY / window.innerHeight - 0.5) * 2;

      xSetters.forEach((item) => item.set(x * item.speed));
      ySetters.forEach((item) => item.set(yPos * item.speed));
    };

    const handleMouseLeave = () => {
      xSetters.forEach((item) => item.set(0));
      ySetters.forEach((item) => item.set(0));
    };

    heroSection.addEventListener('mousemove', handleMouseMove, { passive: true });
    heroSection.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      heroSection.removeEventListener('mousemove', handleMouseMove);
      heroSection.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <motion.section
      ref={heroRef}
      className="hero-section position-relative overflow-hidden d-flex align-items-center"
      id="hero"
      style={{ y, willChange: 'transform' }}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {/* Background Parallax Effects (Hardware Accelerated) */}
      <div
        className="optical-starburst gs-parallax"
        data-speed="35"
        style={{ zIndex: 1, willChange: 'transform' }}
      >
        <div className="starburst-core" />
        <div className="starburst-ray-h" />
        <div className="starburst-ray-v" />
        <div className="starburst-ray-diag" />
      </div>

      <div
        className="optical-streak streak-1 gs-parallax"
        data-speed="-25"
        style={{ zIndex: 1, willChange: 'transform' }}
      />
      <div
        className="optical-streak streak-2 gs-parallax"
        data-speed="15"
        style={{ zIndex: 1, willChange: 'transform' }}
      />
      <div className="optical-flare flare-bg" style={{ zIndex: 1 }} />

      {/* Main Container */}
      <div
        className="container-fluid  px-xl-5 position-relative"
        style={{ maxWidth: '1400px', zIndex: 3 }}
      >
        <div className="row align-items-center min-vh-100 pt-0 mt-0 hero-row">
          {/* Content Column */}
          <div className="col-md-12 col-lg-6 position-relative hero-content text-center text-lg-start mb-5 mb-lg-0 pe-lg-5 order-2 order-lg-1">
            {/* Tagline */}
            {heroData?.tagline && (
              <span className="hero-tagline text-uppercase fw-bold mb-3 d-inline-block text-primary-blue">
                {heroData.tagline}
              </span>
            )}

            {/* Heading */}
            <h1 className="hero-heading fw-bold mb-4">
              {heroData?.heading_main ? (
                <>
                  <span dangerouslySetInnerHTML={{ __html: heroData.heading_main.replace(/\n/g, '<br/>') }} />
                  <br />
                  <span className="text-primary-blue">
                    {heroData.heading_highlight || ''}
                  </span>
                </>
              ) : (
                <span dangerouslySetInnerHTML={{ __html: (heroData?.heading || '').replace(/\n/g, '<br/>') }} />
              )}
            </h1>

            {/* Description */}
            {heroData?.description && (
              <p
                className="hero-description mb-5"
                dangerouslySetInnerHTML={{ __html: heroData.description.replace(/\n/g, '<br/>') }}
              />
            )}

            {/* CTA Buttons */}
            {heroData?.primary_cta && (
              <div className="hero-buttons d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Link
                  href={heroData.primary_cta.url || '#'}
                  className="btn btn-primary-custom px-2 px-sm-4 py-2 fw-bold d-inline-flex align-items-center justify-content-center gap-1 gap-sm-2 text-nowrap"
                >
                  <span>{heroData.primary_cta.text || ''}</span>
                  <svg
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>

                {heroData?.secondary_cta && (
                  <Link
                    href={heroData.secondary_cta.url || '#'}
                    className="btn btn-outline-custom px-2 px-sm-4 py-2 fw-bold d-inline-flex align-items-center justify-content-center gap-1 gap-sm-2 text-nowrap"
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>{heroData.secondary_cta.text || ''}</span>
                  </Link>
                )}
              </div>
            )}

            {/* Tech Stats / Features */}
            {heroData?.tech_stats && heroData.tech_stats.length > 0 && (
              <div className="row g-4 mt-1 mt-md-5 hero-features text-start">
                {heroData.tech_stats.map((stat, idx) => (
                  <div key={idx} className="col-6 col-md-3 d-flex justify-content-center gap-2">
                    <div
                      className="feature-icon text-white mt-1"
                      dangerouslySetInnerHTML={{ __html: stat.icon_svg || '' }}
                    />
                    <div>
                   
                      <h2 className="h6 mb-1 fw-bold" style={{ color: 'var(--primary-blue)' }}>{stat.title || ''}</h2>
                      <p
                        className="mb-0 lh-sm hero-feature-desc"
                        style={{ fontSize: '0.8rem' }}
                        dangerouslySetInnerHTML={{ __html: (stat.desc || '').replace(/\n/g, '<br/>') }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Image Column */}
          <div
  className="col-12 col-lg-6 position-relative text-center mb-5 mb-lg-0 order-1 order-lg-2 gs-parallax"
  data-speed="-15"
  style={{ zIndex: 4, willChange: 'transform' }}
>
  <Image
    src={
      heroData?.image?.url
        ? heroData.image.url.startsWith('/')
          ? heroData.image.url
          : `/${heroData.image.url}`
        : '/assets/images/hero-image.png'
    }
    alt={heroData?.image?.alt || 'SpotOptics Product'}
    width={650}
    height={450}
    priority 
    className="img-fluid hero-product-img"
    style={{
      width: '100%',
      height: 'auto',
      maxWidth: '580px',
      objectFit: 'contain',
    }}
    unoptimized
  />
</div>
        </div>
      </div>
    </motion.section>
  );
}