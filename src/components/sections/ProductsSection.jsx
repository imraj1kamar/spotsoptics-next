'use client';

import React from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Swiper React components & modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/navigation';

// Custom Components & Data & CSS
import ProductCard from '@/components/common/ProductCard';
import SliderNav from '@/components/common/SliderNav';
import productsData from '@/data/products.json';
import '../../../public/assets/css/products.css';

export default function ProductsSection() {
  const items = productsData?.items || [];
  const sectionTagline = productsData?.section_tagline || 'OUR PRODUCTS';
  const sectionHeading = productsData?.section_heading || 'Precision Instruments & Systems';
  
  // 1. Raw Scroll Transform
  const { scrollYProgress } = useScroll();
  const rawScale = useTransform(scrollYProgress, [0.05, 0.25], [0.96, 1]);

  // 2. Physics-based Spring Inertia (Smoothes out scroll jerk/lag completely)
  const scale = useSpring(rawScale, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.section
      className="products-section"
      id="products"
      style={{ scale, willChange: 'transform' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
    >
      <div className="container hero-container">
        <div className="products-wrapper pb-5">
          
          {/* Section Heading & Top Controls */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 pb-2">
            <div>
              <span className="text-uppercase products-tag mb-2 d-inline-block">
                {sectionTagline}
              </span>
              <h2 className="mb-0 section-heading">
                {sectionHeading}
              </h2>
            </div>

            <div className="d-flex align-items-center justify-lg-end gap-4 mt-3 mt-md-0">
              
              <Link
                href="/all-products"
                className="view-all-link d-inline-flex align-items-center gap-2 text-decoration-none text-nowrap"
              >
                <span>VIEW ALL PRODUCTS</span>
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

              {/* Desktop Navigation Buttons */}
              <SliderNav
                wrapperClass="d-none d-sm-flex gap-2"
                prevClass="slider-nav-btn swiper-prev"
                nextClass="slider-nav-btn swiper-next"
                size={20}
                type="div"
              />
            </div>
          </div>

          {/* Swiper Slider */}
          <Swiper
            className="productsSwiper overflow-hidden"
            modules={[Autoplay, Navigation]}
            slidesPerView={1}
            spaceBetween={10}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: '.swiper-next',
              prevEl: '.swiper-prev',
            }}
            breakpoints={{
              576: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              992: { slidesPerView: 4, spaceBetween: 20 },
              1200: { slidesPerView: 6, spaceBetween: 20 },
            }}
          >
            {items.map((item, index) => (
              <SwiperSlide key={index}>
                <ProductCard
                  index={index}
                  name={item.name || ''}
                  description={item.description || ''}
                  image={item.image || ''}
                  link={`/all-products/${encodeURIComponent(item.slug || index)}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Mobile Navigation Buttons */}
          <SliderNav
            wrapperClass="d-sm-none justify-content-center gap-3 mt-4"
            prevClass="slider-nav-btn swiper-prev"
            nextClass="slider-nav-btn swiper-next"
            size={20}
            type="div"
          />

        </div>
      </div>
    </motion.section>
  );
}