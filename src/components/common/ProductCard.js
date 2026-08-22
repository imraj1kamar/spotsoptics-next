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

  return (
    <motion.div
      className={`product-glass-card h-100 d-flex flex-column ${className}`.trim()}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.06 }}
      whileHover={{ y: -6, scale: 1.01 }}
    >
      <div className="product-img-wrapper position-relative">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={name || 'Product Image'}
            width={500}
            height={350}
            style={{ width: '100%', height: 'auto' }}
            className="img-fluid product-img"
            unoptimized
          />
        ) : (
          <div className="product-img-placeholder bg-light text-muted d-flex align-items-center justify-content-center p-4">
            No Image Available
          </div>
        )}
      </div>

   <div className="product-text-clamp flex-grow-1 mt-3">
    {name && <h3 className="product-title mb-1">{name}</h3>}
    {description && <p className="product-desc mb-0">{description}</p>}
</div>
      <Link
        href={productUrl}
        className="  a-link mt-auto d-inline-flex align-items-center gap-2 text-decoration-none text-uppercase"
      >
        <span>VIEW PRODUCT</span>
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </motion.div>
  );
}