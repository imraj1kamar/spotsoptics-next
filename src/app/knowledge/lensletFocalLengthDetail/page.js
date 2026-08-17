'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Static Data Import (Agar JSON direct import karna ho)
import knowledgeData from '@/data/knowledge.json';

import '../../../../public/assets/css/accuracy-detail.css';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import sidebarData from '@/data/sidebar.json';
import Sidebar from '@/components/common/Sidebar';


export default function LensletFocalLengthDetailPage({ data }) {
  // Data resolution: Props ya JSON se
  const currentData =
    data ||
    (Array.isArray(knowledgeData?.articles)
      ? knowledgeData.articles.find(
          (a) => a.id === 'lenslet-array-focal-length' || a.slug === 'lenslet-array-focal-length'
        ) || knowledgeData.articles
      : knowledgeData) ||
    {};

  const details = currentData?.details || currentData || {};
  const intro = details?.intro || {};
  const imageComparison = details?.image_comparison?.items || [];
  const overview = details?.overview || {};
  const simulationCases = details?.simulation_cases?.items || [];
  const simResult = details?.simulation_result || {};
  const noiseSim = details?.noise_simulation || {};
  const figure1 = details?.figure_1 || {};
  const figure2 = details?.figure_2 || {};
  const conclusions = details?.conclusions?.items || [];
  const cta = details?.cta || {};

  // Safe image URL resolver
  const resolveImg = (src) => {
    if (!src) return '';
    return src.startsWith('/') ? src : `/${src}`;
  };

  return (
     <div className="page-section py-5">
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-start position-relative z-2 mt-5 mb-3 mx-3">
                               <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Knowledge Corner', href: '/knowledge' },
            { label: 'Lance let Focal Length', href: '/knowledge/lensletFocalLengthDetail' },
          ]}
          className="knowledge-breadcrumbs mb-0"
        />
                    </div> 
        {/* ================= 1. DARK BLUE HERO BANNER ================= */}
        <div className="accuracy-hero-banner mb-4 position-relative overflow-hidden rounded-4 p-4 p-lg-5">
          <div className="row align-items-center">
            <div className="col-lg-8 col-md-7 position-relative z-2">
              <h1 className="accuracy-hero-title text-white fw-bold mb-3">
                {details.page_title || currentData.title || 'Importance of Using Lenslet Arrays with Long Focal Length'}
              </h1>
              <div className="hero-accent-line mb-3"></div>
              <p className="text-white-50 mb-0 small" style={{ maxWidth: '650px', lineHeight: '1.6' }}>
                {intro.description || currentData.description}
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

        {/* ================= 2. IMAGE COMPARISON CARD (OMI-22 vs OMI-11) ================= */}
        {imageComparison.length > 0 && (
          <div className="accuracy-card p-4 rounded-4 border mb-4 bg-white shadow-sm">
            <h5 className="fw-bold mb-4" style={{ color: 'var(--primary-blue, #0d6efd)' }}>
              {details.image_comparison?.title || 'Shack-Hartmann Image Comparison'}
            </h5>
            
            <div className="row g-4">
              {imageComparison.map((item, idx) => (
                <div key={idx} className="col-md-6">
                  <div className="comparison-media-box rounded-3 p-3 bg-light d-flex flex-column align-items-center justify-content-between h-100 border">
                    <div className="d-flex justify-content-between align-items-center w-100 mb-3 px-2">
                      <span className="fw-bold text-dark">{item.title}</span>
                      <span className="comparison-floating-badge badge  text-white px-3 py-2 rounded-pill fw-semibold mb-2">{item.focal_length}</span>
                    </div>

                    {item.image && (
                      <div className="my-2 p-2 bg-black rounded-3 d-flex align-items-center justify-content-center w-100" style={{ minHeight: '220px' }}>
                        <Image
                          src={resolveImg(item.image)}
                          alt={item.title}
                          width={260}
                          height={260}
                          className="img-fluid rounded object-fit-contain"
                          style={{ maxHeight: '220px' }}
                          unoptimized
                        />
                      </div>
                    )}

                    {item.caption && (
                      <p className="small text-muted text-center mt-3 mb-0" style={{ lineHeight: '1.4' }}>
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 3. OVERVIEW / THEORY ALERT BOX ================= */}
        <div className="accuracy-card p-4 rounded-4 border mb-4 bg-white shadow-sm">
          <div className="d-flex align-items-start gap-3">
            <div className="alert-icon-circle flex-shrink-0 text-white" style={{ background: 'var(--primary-blue, #0d6efd)' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h5 className="fw-bold text-dark mb-2">{overview.title || 'Why Long Focal Length Matters'}</h5>
              {overview.paragraphs?.map((p, idx) => (
                <p key={idx} className="text-muted mb-2 small" style={{ lineHeight: '1.6' }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* ================= 4. SIMULATION CASES (2 CARDS) ================= */}
        {simulationCases.length > 0 && (
          <div className="row g-4 mb-4">
            {simulationCases.map((c, idx) => (
              <div key={idx} className="col-md-6">
                <div className="accuracy-card p-4 rounded-4 border bg-white shadow-sm h-100">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge bg-primary-subtle text-primary-blue fw-bold px-2 py-1 rounded">
                      Case {idx + 1}
                    </span>
                    <h6 className="fw-bold text-dark mb-0">{c.title}</h6>
                  </div>
                  <p className="text-muted small mb-0">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Simulation Result Alert */}
        {simResult.description && (
          <div className="accuracy-alert-box d-flex align-items-center gap-3 p-3 p-md-4 rounded-4 mb-4">
            <div className="alert-icon-circle flex-shrink-0 text-white" style={{ background: 'var(--primary-blue, #0d6efd)' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="alert-text mb-0 fw-medium text-dark small" style={{ lineHeight: '1.6' }}>
              {simResult.description}
            </p>
          </div>
        )}

        {/* ================= 5. FIGURE 1: SPOT DISPLACEMENTS ================= */}
        {figure1.image && (
          <div className="accuracy-card p-4 rounded-4 border mb-4 bg-white shadow-sm">
            <h5 className="fw-bold mb-2" style={{ color: 'var(--primary-blue, #0d6efd)' }}>
              {figure1.title}
            </h5>
            <p className="text-muted small mb-4" style={{ lineHeight: '1.5' }}>
              {figure1.description}
            </p>
            <div className="text-center p-3 bg-light rounded-3">
              <Image
                src={resolveImg(figure1.image)}
                alt={figure1.title}
                width={800}
                height={420}
                className="img-fluid rounded object-fit-contain"
                style={{ maxHeight: '400px' }}
                unoptimized
              />
            </div>
          </div>
        )}

        {/* ================= 6. NOISE SIMULATION & FIGURE 2 ================= */}
        <div className="accuracy-card p-4 rounded-4 border mb-4 bg-white shadow-sm">
          <h5 className="fw-bold mb-2" style={{ color: 'var(--primary-blue, #0d6efd)' }}>
            {noiseSim.title || 'Effect of Random Noise'}
          </h5>
          {noiseSim.paragraphs?.map((p, idx) => (
            <p key={idx} className="text-muted small mb-2" style={{ lineHeight: '1.6' }}>
              {p}
            </p>
          ))}

          {figure2.image && (
            <div className="mt-4">
              <h6 className="fw-bold text-dark mb-2">{figure2.title}</h6>
              <p className="text-muted small mb-3">{figure2.description}</p>
              <div className="text-center p-3 bg-light rounded-3">
                <Image
                  src={resolveImg(figure2.image)}
                  alt={figure2.title}
                  width={800}
                  height={420}
                  className="img-fluid rounded object-fit-contain"
                  style={{ maxHeight: '400px' }}
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>

        {/* ================= 7. CONCLUSIONS GRID ================= */}
        {conclusions.length > 0 && (
          <div className="accuracy-card p-4 rounded-4 border mb-4 bg-white shadow-sm">
            <h5 className="fw-bold mb-4" style={{ color: 'var(--primary-blue, #0d6efd)' }}>
              {details.conclusions?.title || 'Conclusions'}
            </h5>
            <div className="row g-3">
              {conclusions.map((item, idx) => (
                <div key={idx} className="col-md-6">
                  <div className="p-3 rounded-3 border bg-light h-100 d-flex flex-column">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div className="badge-bullet rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '22px', height: '22px', fontSize: '11px' }}>
                        ✓
                      </div>
                      <h6 className="fw-bold text-dark mb-0 fs-6">{item.title}</h6>
                    </div>
                    <p className="text-muted small mb-0 ps-4" style={{ lineHeight: '1.5' }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
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
                {cta.title || 'Learn More About Lenslet Arrays'}
              </h5>
              <p className="text-white-50 mb-0 small">
                {cta.description || 'Explore how lenslet array focal length affects measurement accuracy.'}
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="btn btn-light text-primary-blue fw-bold px-4 py-2 rounded-pill shadow-sm"
          >
            Contact Experts →
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}