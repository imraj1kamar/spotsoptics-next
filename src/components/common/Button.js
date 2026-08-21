import React from 'react';
import Link from 'next/link';

const icons = {
  arrow: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  'arrow-left': (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  download: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  external: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  'chevron-left': (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
  ),
  'chevron-right': (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  ),
};

const getVariantClass = (variant) => {
  switch (variant) {
    case 'primary':
      return 'btn-primary-custom';
    case 'outline':
      return 'btn-outline-custom';
    case 'secondary':
      return 'btn-secondary-custom';
    case 'detail-primary':
      return 'product-detail-btn product-detail-btn-primary';
    case 'detail-secondary':
      return 'product-detail-btn product-detail-btn-secondary';
    default:
      return 'btn-primary-custom';
  }
};

export default function Button({
  text = 'Button',
  url = '#',
  variant = 'primary',
  icon = 'arrow',
  iconPosition = 'right',
  className = '',
  target,
  rel,
}) {
  const btnClass = `${getVariantClass(variant)} ${className}`.trim();
  const IconComponent = icon !== 'none' ? icons[icon] : null;

  return (
    <Link
      href={url}
      className={btnClass}
      target={target}
      rel={rel}
    >
      {IconComponent && iconPosition === 'left' && (
        <span className="me-2 d-inline-flex align-items-center">{IconComponent}</span>
      )}

      <span>{text}</span>

      {IconComponent && iconPosition === 'right' && (
        <span className="ms-2 d-inline-flex align-items-center">{IconComponent}</span>
      )}
    </Link>
  );
}