import React from 'react';
import { motion } from 'framer-motion';
import Breadcrumbs from './Breadcrumbs'; // Adjust the import path as needed

// Default Box Icon
const DefaultIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

export default function PageTopBar({ 
  breadcrumbs = [], 
  counterLabel = "TOTAL", 
  counterValue = "0", 
  counterIcon = <DefaultIcon />, 
  showCounter = true,
  className = "" 
}) {
  return (
    <motion.div
      // Added flex classes to properly space breadcrumbs and badge
      className={`page-top-bar mb-4 d-flex justify-content-between px-3 align-items-center flex-wrap gap-3 ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Breadcrumbs
        items={breadcrumbs}
        className="page-breadcrumbs"
      />

      {showCounter && (
        <div className="counter-badge d-flex align-items-center gap-1">
          <div className="counter-icon-box">
            {counterIcon}
          </div>
          <div className="counter-info d-flex flex-column">
            <span className="counter-label text-muted small text-uppercase">
              {counterLabel}
            </span>
            <span className="counter-value fw-bold">
            
              {String(counterValue).padStart(2, '0') || '' } 
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}