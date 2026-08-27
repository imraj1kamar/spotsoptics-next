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
      <div className="product-custom-card h-100 d-flex flex-column">
        {/* Uniform Image Container */}
        <div className="product-img-box position-relative overflow-hidden">
          {badgeText && (
            <span className="product-badge-tag position-absolute">{badgeText}</span>
          )}
          {imageSrc ? (
            <div className="product-img-inner position-relative w-100 h-100">
              <Image
                src={imageSrc}
                alt={name || 'Product Image'}
                fill
                sizes="(max-width: 575px) 100vw, (max-width: 767px) 50vw, (max-width: 991px) 33vw, 25vw"
                className="product-card-image"
              />
            </div>
          ) : (
            <div className="product-no-img d-flex align-items-center justify-content-center h-100 w-100 text-muted">
              No Image Available
            </div>
          )}
        </div>

        {/* Card Body with Title, 3-Line Description & View Product Link */}
        <div className="product-card-body d-flex flex-column flex-grow-1">
          {name && (
            <h3 className="product-card-heading mb-2" title={name}>
              <Link href={productUrl} className="text-decoration-none product-title-link">
                {name}
              </Link>
            </h3>
          )}

          {description && (
            <p className="product-card-description mb-3" title={description}>
              {description}
            </p>
          )}

          <div className="product-card-footer mt-auto pt-2">
            <Link
              href={productUrl}
              className="view-product-btn d-inline-flex align-items-center gap-2 text-decoration-none"
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}