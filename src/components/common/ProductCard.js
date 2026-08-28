import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'product';
}

export default function ProductCard({
  index = 0,
  name = '',
  description = '',
  image = '',
  link = '',
  badge = '',
  tag = '',
  className = '',
}) {
  const fallbackSlug = slugify(name || `product-${index + 1}`);
  const productUrl = link || `/all-products/${fallbackSlug}`;

  let imageSrc = '';
  if (typeof image === 'string' && image.trim() !== '') {
    imageSrc = image.startsWith('/') ? image : `/${image}`;
  } else if (image && typeof image === 'object' && image.url) {
    imageSrc = image.url.startsWith('/') ? image.url : `/${image.url}`;
  }

  const badgeText = badge || tag;

  return (
    <motion.div
      className={`product-card-wrapper h-100 ${className}`.trim()}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.05 }}
      whileHover={{ y: -6 }}
    >
      <Link href={productUrl} className="text-decoration-none d-block h-100">
      <div className="product-custom-card position-relative overflow-hidden w-100">
        {/* Full-Bleed Card Background Image */}
       {/* Full-Bleed Card Background Image ki jagah ab Contained Wrapper */}
        {imageSrc ? (
          <div className="product-img-wrapper"> {/* 👈 YEH NAYA DIV ADD KIYA HAI */}
            <Image
              src={imageSrc}
              alt={name || 'Product Image'}
              
              sizes="(max-width: 575px) 100vw, (max-width: 767px) 50vw, (max-width: 991px) 33vw, 25vw"
              className="product-card-image"
              width={1000}
              height={1000}
            />
          </div>
        ) : (
          <div className="product-img-wrapper product-no-img d-flex align-items-center justify-content-center">
            <span>No Image Available</span>
          </div>
        )}

        {/* Bottom Dark Gradient for Clean Text Legibility */}
        <div className="product-card-overlay" />

        {/* Top-Left Pill Badge (e.g., FROM EUR 28 / Tag) */}
        {badgeText && (
          <div className="product-badge-tag position-absolute">
            {badgeText}
          </div>
        )}

        {/* Bottom Content Area (Title, 1-Line Description, View Product) */}
        <div className="product-card-bottom-content position-absolute">
          {name && (
            <h3 className="product-card-heading mb-1 product-title-link text-decoration-none" title={name}>
            
                {name}
              
            </h3>
          )}

          {description && (
            <p className="product-card-description mb-2" title={description}>
              {description}
            </p>
          )}

          {/* <div className="product-card-footer pt-1">
            <Link
              href={productUrl}
              className="view-product-btn d-inline-flex align-items-center gap-1.5 text-decoration-none"
            >
              <span>VIEW PRODUCT</span>
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="arrow-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div> */}
        </div>
      </div>
      </Link>
    </motion.div>
  );
}