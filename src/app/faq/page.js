'use client';

import React, { useState } from 'react';

// Data & Components & CSS Import
import faqData from '@/data/faq.json';
import sidebarData from '@/data/sidebar.json';
import Sidebar from '@/components/common/Sidebar';
import '../../../public/assets/css/faq.css';

export default function FaqSection() {
  const page = faqData?.page || {};
  const faqs = faqData?.faqs || [];

  // Active open FAQ ID State (Default: Pehla FAQ khula rahega)
  const [openFaqId, setOpenFaqId] = useState(faqs[0]?.id || null);

  const toggleFaq = (id) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="faq-section-wrapper py-5 mt-5" id="faq">
      <div className="container py-lg-4">
        
        {/* Section Header */}
        <header className="text-center mb-5 max-w-2xl mx-auto">
          
          <h1 className="page-title-section">
            {page.title || 'Questions on Shack-Hartmann test'}
          </h1>
          <p className="page-tagline">
            {page.description || ''}
          </p>
        </header>

        <div className="row g-4">
          
          {/* Main FAQ Accordion Column (9/12) */}
          <div className="col-12 col-lg-9">
            <div className="faq-accordion-list">
              {faqs.map((faq) => {
                const isOpen = openFaqId === faq.id;

                return (
                  <div
                    key={faq.id}
                    className={`faq-accordion-item ${isOpen ? 'active' : ''}`}
                  >
                    {/* Accordion Question Header */}
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-question-text">{faq.question}</span>
                      <div className="faq-icon-badge">
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
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>

                    {/* Accordion Answer Body */}
                    {isOpen && (
                      <div className="faq-answer-body">
                        {faq.answer.split(/\n\s*\n/).map((para, pIdx) => (
                          <p key={pIdx} className="mb-3">
                            {para}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Column (3/12) */}
          <div className="col-12 col-lg-3 d-none d-lg-block">
            <Sidebar
              title={sidebarData?.title || 'Categories'}
              links={sidebarData?.links || []}
            />
          </div>

        </div>
      </div>
    </section>
  );
}