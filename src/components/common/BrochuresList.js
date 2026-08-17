import React from 'react';
import Link from 'next/link';

// Download icon for PDF
const PdfIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    className="me-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

// External / Page icon
const PageIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    className="me-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

export default function BrochuresList({
  items = [],
  label = 'MORE INFO & BROCHURES',
  className = '',
}) {
  // Agar items empty ho toh component load nahi hoga
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`product-brochures-section ${className}`.trim()}>
      {label && <span className="section-label d-block mb-2 fw-bold">{label}</span>}

      <div className="brochures-grid ">
        {items.map((brochure, index) => {
          const link = brochure.link || '#';
          const isPdf = link.toLowerCase().endsWith('.pdf');
          const isPage = link.startsWith('/');

          let href = link;
          let target = undefined;
          let rel = undefined;
          let itemClass = 'product-brochure-item ';

          if (isPdf) {
            target = '_blank';
            rel = 'noopener noreferrer';
            itemClass += ' pdf-link';
          } else if (isPage) {
            itemClass += ' page-link';
          } else {
            target = '_blank';
            rel = 'noopener noreferrer';
          }

          return (
            <Link
              key={index}
              href={href}
              target={target}
              rel={rel}
              className={itemClass}
            >
              {isPdf && <PdfIcon />}
              {isPage && <PageIcon />}
              <span>{brochure.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}