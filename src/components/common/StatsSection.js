'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap'; // Tumhari requirement ke hisaab se imported
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Data & CSS Import
import statsData from '@/data/statsSection.json';
import '../../../public/assets/css/statsSection.css';

// SVG Icons
const ICONS = {
  INNOVATION: (
    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v13m0-13V3.5A2.5 2.5 0 0114.5 1h-5A2.5 2.5 0 007 3.5V8m5 0h8.5a2.5 2.5 0 012.5 2.5v7.5A2.5 2.5 0 0120.5 20.5H3.5A2.5 2.5 0 011 18V10.5A2.5 2.5 0 013.5 8H12z" />
    </svg>
  ),
};

export default function StatsSection() {
  const statsList = Array.isArray(statsData) ? statsData : [];

  // Marquee ko seamlessly loop karne ke liye data repeat kar rahe hain
  const repeatedStats = Array(10).fill(statsList).flat();

  // Reference for Framer Motion Scroll Tracking
  const sectionRef = useRef(null);

  // Scroll Progress track karna
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'] // Jab section screen mein aana shuru ho
  });

  // Transform values based on scroll progress
  // Scroll 0 se 1 hone par scale 0.9 se 1 tak aayega (halka sa zoom-in effect)
  const rawScale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  
  // Spring physics add karna taaki animation bohot smooth aur natural lage
  const scale = useSpring(rawScale, { stiffness: 100, damping: 20 });

  return (
    <motion.section
      ref={sectionRef}
      className="stats-marquee-wrapper py-3"
      id="stats"
      // Tumhare diye gaye motion parameters
      style={{ scale, willChange: 'transform' }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }} // animate ki jagah whileInView use kiya hai taaki scroll karne par trigger ho
      viewport={{ once: true, margin: "-50px" }} // Screen mein aane ke thoda baad trigger hoga
      transition={{ duration: 0.75, ease: 'easeOut' }}
    >
      <div className="container-fluid px-0">
        <div className="marquee-container bg-white border-top border-bottom py-3 shadow-sm">
          <div className="marquee-content">
            {repeatedStats.map((item, index) => (
              <div key={`${item.id}-${index}`} className="marquee-item">
                
                {/* Icon */}
                <div className="stats-icon-wrapper" style={{ color: '#42B1A2' }}>
                  {ICONS[item.icon_type] || ICONS.INNOVATION}
                </div>

                {/* Text / Stats */}
                <div className="d-flex align-items-baseline gap-2">
                  <h3 className="fw-bold mb-0 text-dark">
                    {item.value}
                  </h3>
                  <p className="text-muted mb-0 fw-medium">
                    {item.label}
                  </p>
                </div>
                
                {/* Divider Dot/Separator */}
                <span className="marquee-divider mx-4 text-muted">•</span>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}