'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HeroBanner({
  title,
  description,
  imageSrc,
  tagline = "Optical Metrology & Wavefront Research",
  imageAlt = "Hero graphic",
  imageWidth = 850,
  imageHeight = 380,
  defaultTitle = "Knowledge Corner"
}) {
  return (
    <motion.div
      className="knowledge-hero-card mb-4 position-relative overflow-hidden rounded-4 p-4 p-lg-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="row align-items-center position-relative z-2">
        <div className="col-lg-6 col-md-7">
          
          {/* Dynamic Tagline */}
          {tagline && (
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-10 text-white border border-white border-opacity-15 mb-3">
              <span className="hero-pulse-dot"></span>
              <span className="small fw-semibold letter-spacing-1 text-uppercase">
                {tagline}
              </span>
            </div>
          )}

          {/* Dynamic Title */}
          <h1 className="knowledge-hero-title text-white fw-bold mb-3">
            {title || defaultTitle}
          </h1>
          <div className="hero-accent-line mb-3"></div>
          
          {/* Dynamic Description */}
          {description && (
            <p className="knowledge-hero-description text-white text-opacity-75 mb-0">
              {description}
            </p>
          )}
        </div>

        {/* Dynamic Image */}
        {imageSrc && (
          <div className="col-lg-6 col-md-4 text-end position-relative z-1 d-none d-md-block">
            <div className="hero-3d-lens-wrapper">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
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
  );
}