'use client';

import React from 'react';
import Image from 'next/image';

// Dynamic Data & Components Import
import Sidebar from '@/components/common/Sidebar';
import contactData from '@/data/contact-us.json';
import sidebarData from '@/data/sidebar.json';

// CSS Import (Aapki CSS file path)
import '../../../public/assets/css/contact-us.css';

export default function ContactUsPage() {
  const pageInfo = contactData?.page || {};
  const distributors = pageInfo.distributors || [];

  return (
    <section className="company-profile-wrapper py-5">
      <div className="container mt-5">
        {/* Page Hero Header — Dynamic H1 + Tagline */}
        <header className="row mb-5 justify-content-center text-center">
          <div className="col-lg-10">
            <h1 className="page-title-section">{pageInfo.title || 'Contact Us'}</h1>
            <p className="page-tagline">{pageInfo.description || ''}</p>
          </div>
        </header>

        <div className="row g-4 justify-content-center">
          {/* Main Content Column (9/12) */}
          <div className="col-lg-9">
            <div className="row">
              {distributors.map((dist, index) => {
                // Website URL normalization
                let websiteUrl = dist.website || '';
                if (websiteUrl && !websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
                  websiteUrl = `https://${websiteUrl}`;
                }

                // Logo path normalization
                const logoSrc = dist.logo
                  ? dist.logo.startsWith('/')
                    ? dist.logo
                    : `/${dist.logo}`
                  : '';

                return (
                  <div key={index} className="col-lg-6 col-md-6 col-sm-12 mb-4">
                    <div className="contact-premium-card">
                      {/* Country Badge */}
                      <div>
                        <span className="country-badge">{dist.country}</span>
                      </div>

                      {/* Distributor Logo */}
                      <div className="distributor-logo-wrapper">
                        {logoSrc && (
                          <Image
                            src={logoSrc}
                            alt={`${dist.company} Logo`}
                            width={180}
                            height={60}
                            style={{ objectFit: 'contain' }}
                            unoptimized
                          />
                        )}
                      </div>

                      {/* Distributor Name & Tagline */}
                      <h4 className="distributor-name">{dist.company}</h4>
                      {dist.tagline && (
                        <p className="distributor-tagline">{dist.tagline}</p>
                      )}

                      {/* Contact Details List */}
                      <div className="contact-details-list">
                        {/* Address */}
                        {dist.address && dist.address.length > 0 && (
                          <div className="detail-item d-flex">
                            <div className="custom-icon-box">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                viewBox="0 0 24 24"
                              >
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                            </div>
                            <div className="detail-text">
                              {dist.address.map((line, lIdx) => (
                                <span key={lIdx} className="d-block">
                                  {line}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-auto" />

                        {/* Email */}
                        {dist.email && (
                          <div className="detail-item d-flex">
                            <div className="custom-icon-box">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                viewBox="0 0 24 24"
                              >
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                              </svg>
                            </div>
                            <div className="detail-text pt-1">
                              <a
                                href={`mailto:${dist.email}`}
                                className="detail-link"
                              >
                                {dist.email}
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Website */}
                        {dist.website && (
                          <div className="detail-item d-flex">
                            <div className="custom-icon-box">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                viewBox="0 0 24 24"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
                              </svg>
                            </div>
                            <div className="detail-text pt-1">
                              <a
                                href={websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="detail-link"
                              >
                                {dist.website}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Column (3/12) */}
          <div className="col-lg-3 ms-auto pb-4 d-none d-lg-block">
            <Sidebar
              title={sidebarData.title || 'Categories'}
              links={sidebarData.links || []}
            />
          </div>
        </div>
      </div>
    </section>
  );
}