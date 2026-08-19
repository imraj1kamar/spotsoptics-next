'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import Breadcrumbs from '@/components/common/Breadcrumbs';
import knowledgeData from '@/data/knowledge.json';
import sidebarData from '@/data/sidebar.json';
import Sidebar from '@/components/common/Sidebar';
import '../../../../public/assets/css/accuracy-detail.css';

export default function ZernikePolynomialsDetailPage({ data }) {
  // Data resolution: Props ya JSON se
  const currentData =
    data ||
    (Array.isArray(knowledgeData?.articles)
      ? knowledgeData.articles.find(
          (a) => a.id === 'zernike-polynomials' || a.slug === 'zernike-polynomials'
        ) || knowledgeData.articles
      : knowledgeData) ||
    {};

  const details = currentData?.details || currentData || {};
  const hero = details?.hero || {};
  const intro = details?.introduction || {};
  const annular = details?.annular_zernike || {};
  const sensoft = details?.sensoft_selection || {};
  const polynomialTypes = details?.polynomial_types || [];
  const comparisonTable = details?.comparison_table || {};
  const keyParams = details?.key_parameters || {};
  const summary = details?.summary || {};

  // Safe image URL resolver
  const resolveImg = (src) => {
    if (!src) return '';
    return src.startsWith('/') ? src : `/${src}`;
  };

  return (
    <div className="page-section py-5">
      <div className="container mt-5">
        
        {/* ================= 1. BREADCRUMBS ================= */}
        <div className="mb-3">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              ...(currentData.breadcrum?.map((item) => ({
                label: item.label,
                href: item.url,
              })) || [
                { label: 'Knowledge Corner', href: '/knowledge' },
                { label: currentData.title || 'Zernike Polynomials' },
              ]),
            ]}
            className="knowledge-breadcrumbs mb-0"
          />
        </div>

        {/* ================= 2. DARK BLUE HERO BANNER ================= */}
        <div className="accuracy-hero-banner mb-4 position-relative overflow-hidden rounded-4 p-4 p-lg-5">
          <div className="row align-items-center">
            <div className="col-lg-8 col-md-7 position-relative z-2">
              <h1 className="accuracy-hero-title text-white fw-bold mb-3">
                {details.page_title || currentData.title || 'Zernike Polynomials in Sensoft'}
              </h1>
              <div className="hero-accent-line mb-3"></div>
              <p className="text-white-50 mb-0 small" style={{ maxWidth: '650px', lineHeight: '1.6' }}>
                {hero.title || currentData.description}
              </p>
            </div>

            {/* 3D Glowing Lens Graphic */}
            <div className="col-lg-4 col-md-5 text-end position-relative z-1 d-none d-md-block">
              <div className="hero-3d-lens-wrapper">
                <Image
                  src="/assets/images/focal-lance.png"
                  alt="3D Optical Lens"
                  width={340}
                  height={200}
                  className="img-fluid hero-lens-img"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
     <div className="row">
        <div className="col-lg-9 col-12">
        {/* ================= 3. DIAGRAM & FORMULA OVERVIEW CARD ================= */}
        <div className="accuracy-card p-4 rounded-4 border mb-4 bg-white shadow-sm">
          <div className="row g-4 align-items-center">
            
            {/* Left: Coordinate Diagram */}
            <div className="col-lg-5 col-md-6 text-center">
              <div className="p-3 bg-light rounded-3 border d-flex flex-column align-items-center justify-content-center">
                {hero.image && (
                  <Image
                    src={resolveImg(hero.image)}
                    alt="Zernike Pupil Diagram"
                    width={380}
                    height={280}
                    className="img-fluid rounded object-fit-contain"
                    style={{ maxHeight: '260px' }}
                    unoptimized
                  />
                )}
                {/* <span className="small text-muted mt-2">
                  {currentData.caption || 'Zernike Coordinate System on Circular Pupil'}
                </span> */}

                <figcaption className="justify-content-center align-items-center knowledge-caption micro-caption px-2 py-1">
                                        <span className="caption-dot"></span>
                                        <span className="caption-text">  {currentData.caption || 'Zernike Coordinate System on Circular Pupil'}</span>
                                       
                                      </figcaption>
              </div>
            </div>

            {/* Right: Formula & Parameters */}
            <div className="col-lg-7 col-md-6">
              <h5 className="fw-bold mb-3" style={{ color: 'var(--primary-blue, #0d6efd)' }}>
                Mathematical Formulation
              </h5>
              <p className="text-muted small mb-3" style={{ lineHeight: '1.6' }}>
                {hero.description}
              </p>

              {/* Formula Box */}
              {hero.formula && (
                <div className="formula-highlight-box p-3 rounded-3 mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <span className="small fw-semibold text-muted">General Expression:</span>
                  <span className="fs-5 fw-bold text-dark font-monospace">
                {hero.formula}
                  </span>
                </div>
              )}

              {/* Key Parameter Pills */}
              {keyParams && (
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {Object.entries(keyParams).map(([key, val]) => (
                    <span key={key} className="badge bg-light text-dark border px-2 py-1 small fw-normal">
                      <strong className="text-primary">{val}</strong> : {key.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ================= 4. THEORY & BALANCING CARD ================= */}
        <div className="accuracy-card p-4 rounded-4 border mb-4 bg-white shadow-sm">
          <div className="d-flex align-items-start gap-3">
            <div className="alert-icon-circle flex-shrink-0 text-white" style={{ background: 'var(--primary-blue, #0d6efd)' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h5 className="fw-bold text-dark mb-2">Aberration Balancing & Conventions</h5>
              <ul className="accuracy-bullet-list ps-3 mb-3">
                {intro.paragraphs?.map((p, idx) => (
                  <li key={idx} className="text-muted mb-2 small" style={{ lineHeight: '1.6' }}>
                    {p}
                  </li>
                ))}
              </ul>
              {annular.description && (
                <div className="p-3 bg-light rounded-3 border-start border-primary border-3 small text-muted">
                  <strong>{annular.title}: </strong> {annular.description}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= 5. SENSOFT POLYNOMIAL OPTIONS (4 CARDS GRID) ================= */}
        <div className="mb-4">
          <div className="mb-3">
            <h5 className="fw-bold mb-1" style={{ color: 'var(--primary-blue, #0d6efd)' }}>
              {sensoft.title || 'Zernike polynomial options in Sensoft'}
            </h5>
            <p className="text-muted small mb-0">{sensoft.description}</p>
          </div>

          <div className="row g-3">
            {polynomialTypes.map((poly) => (
              <div key={poly.number} className="col-md-6">
                <div className="accuracy-card p-4 rounded-4 border bg-white shadow-sm h-100 d-flex flex-column">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <span className="badge rounded-circle bg-primary-subtle text-primary fw-bold fs-6 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                      0{poly.number}
                    </span>
                    <h6 className="fw-bold text-dark mb-0 fs-6">{poly.title}</h6>
                  </div>
                  <p className="text-muted small mb-0 mt-2 flex-grow-1" style={{ lineHeight: '1.6' }}>
                    {poly.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 6. COMPARISON TABLE ================= */}
        {comparisonTable.rows?.length > 0 && (
          <div className="accuracy-table-card rounded-4 border mb-4 bg-white overflow-hidden shadow-sm p-4">
            <h5 className="fw-bold mb-3" style={{ color: 'var(--primary-blue, #0d6efd)' }}>
              {comparisonTable.title || 'Zernike Polynomial Comparison Table'}
            </h5>
            <div className="table-responsive">
              <table className="table table-bordered accuracy-custom-table mb-0 align-middle">
                <thead>
                  <tr>
                    {comparisonTable.columns?.map((col, idx) => (
                      <th key={idx} className="text-uppercase small fw-bold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.rows?.map((row, idx) => (
                    <tr key={idx}>
                      <td className="fw-bold text-dark">{row.aberration}</td>
                      <td className="font-monospace text-muted small">{row.standard_zernike}</td>
                      <td className="font-monospace text-muted small">{row.annular_zernike}</td>
                      <td className="font-monospace text-muted small">{row.seidel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 7. SUMMARY ALERT BOX ================= */}
        {summary.description && (
          <div className="accuracy-alert-box d-flex align-items-center gap-3 p-3 p-md-4 rounded-4 mb-4">
            <div className="alert-icon-circle flex-shrink-0 text-white" style={{ background: 'var(--primary-blue, #0d6efd)' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h6 className="fw-bold text-dark mb-1">{summary.title || 'Summary'}</h6>
              <p className="alert-text mb-0 text-muted small" style={{ lineHeight: '1.6' }}>
                {summary.description}
              </p>
            </div>
          </div>
        )}

       
 </div>
       <div className="col-lg-3 mb-4 d-none d-lg-block">
                   <div className="sticky-top" style={{ top: '100px' }}>
                     <Sidebar
                       title={sidebarData?.title || 'Categories'}
                       links={sidebarData?.links || []}
                     />
                   </div>
                 </div>
                  {/* ================= 8. FOOTER DARK BLUE CTA BANNER ================= */}
        <div className="accuracy-footer-banner d-flex align-items-center justify-content-between flex-wrap gap-3 p-4 rounded-4 shadow-sm text-white">
          <div className="d-flex align-items-center gap-3">
            <div className="footer-banner-icon text-white">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path strokeWidth="2" d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
              </svg>
            </div>
            <div>
              <h5 className="text-white mb-1 fw-bold fs-6">
                Configure Wavefront Analysis in Sensoft
              </h5>
              <p className="text-white-50 mb-0 small">
                Learn how SpotOptics software fits and analyzes wavefront aberrations with custom Zernike options.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="btn btn-light text-primary-blue fw-bold px-4 py-2 rounded-pill shadow-sm"
          >
            Request Consultation →
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}