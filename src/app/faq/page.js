'use client';

import React, { useState } from 'react';

// Data & Components & CSS Import
import faqData from '@/data/faq.json';
import sidebarData from '@/data/sidebar.json';
import Sidebar from '@/components/common/Sidebar';
import PageTopBar from '@/components/common/PageTopBar';
import '../../../public/assets/css/faq.css';

const FAQ_ICON = (
  <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

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
        
        {/* Page Top Bar */}
        <PageTopBar
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'FAQ' },
          ]}
          counterLabel="QUESTIONS"
          counterValue={faqs.length || 0}
          counterIcon={FAQ_ICON}
          showCounter={true}
        />

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