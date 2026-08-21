'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import Breadcrumbs from '@/components/common/Breadcrumbs';
import knowledgeData from '@/data/knowledge.json';
import sidebarData from '@/data/sidebar.json';
import Sidebar from '@/components/common/Sidebar';
import '../../../../public/assets/css/accuracy-detail.css';

export default function ShackHartmannVsHartmannDetailPage({ data }) {
  // Data resolution: Props ya JSON se
  const currentData =
    data ||
    (Array.isArray(knowledgeData?.articles)
      ? knowledgeData.articles.find(
          (a) => a.id === 'shack-hartmann-vs-hartmann' || a.slug === 'shack-hartmann-vs-hartmann'
        ) || knowledgeData.articles
      : knowledgeData) ||
    {};

  const details = currentData?.details || currentData || {};
  const hero = details?.hero || {};
  const hartmann = details?.hartmann_test || {};
  const shackHartmann = details?.shack_hartmann_test || {};
  const history = details?.technology_history || {};
  const comparison = details?.comparison || {};
  const spotopticsSensors = details?.spotoptics_sensors || {};
  const keyPoints = details?.key_points || [];
  const conclusion = details?.conclusion || {};

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
                { label: currentData.title || 'Shack-Hartmann vs Hartmann' },
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
                {details.page_title || currentData.title || 'Shack-Hartmann vs. Hartmann Test'}
              </h1>
              <div className="hero-accent-line mb-3"></div>
              <p className="text-white-50 mb-0 small" style={{ maxWidth: '650px', lineHeight: '1.6' }}>
                {details.subtitle }              </p>
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
    style={{ width: 'auto', height: 'auto' }}
    priority
    unoptimized
  />
</div>
            </div>
          </div>
        </div>
       <div className="row">
        <div className="col-lg-9 col-12">
        {/* ================= 3. SETUP SCHEMATIC DIAGRAM CARD ================= */}
        {hero.image && (
          <div className="accuracy-card p-4 rounded-4 border mb-4 bg-white shadow-sm text-center">
           <div className="p-3 bg-light rounded-3 d-inline-block w-100 border">
  <Image
    src={resolveImg(hero.image)}
    alt={hero.caption || 'Hartmann vs Shack-Hartmann Setup'}
    width={850}
    height={380}
    className="img-fluid rounded object-fit-contain"
    style={{
      width: '100%',
      height: 'auto',
      maxHeight: '360px',
    }}
    priority
    unoptimized
  />
</div>
            {hero.caption && (
              
             
                                       <figcaption className="  justify-content-center align-items-center knowledge-caption micro-caption px-2 py-1">
                                        <span className="caption-dot"></span>
                                        <span className="caption-text">  {hero.caption}</span>
                                       
                                      </figcaption>
            )}
          </div>
        )}

        {/* ================= 4. METHOD COMPARISON (2 COLUMNS) ================= */}
        <div className="row g-4 mb-4">
          
          {/* Classical Hartmann Test */}
          <div className="col-md-6">
            <div className="accuracy-card p-4 rounded-4 border bg-white shadow-sm h-100 d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold mb-0 text-primary-blue -red">{hartmann.title || 'Classical Hartmann Test'}</h5>
                <span className="badge bg-danger-subtle text-primary-red fw-semibold px-3 py-1 rounded-pill small">
                  Classical / Obsolete
                </span>
              </div>
             
              <p 
  className="text-muted small mb-3 custom-link-text" 
  style={{ lineHeight: '1.7' }}
  dangerouslySetInnerHTML={{ __html: hartmann.description }}
/>
            </div>
          </div>

          {/* Modern Shack-Hartmann Test */}
          <div className="col-md-6">
            <div className="accuracy-card p-4 rounded-4 border bg-white shadow-sm h-100 d-flex flex-column border-primary">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold mb-0 text-primary-blue ">{shackHartmann.title || 'Modern Shack-Hartmann Test'}</h5>
                <span className="comparison-floating-badge badge  text-white px-3 py-2 rounded-pill fw-semibold mb-2">
                  Industry Standard
                </span>
              </div>
 <p 
  className="text-muted small mb-3 custom-link-text" 
  style={{ lineHeight: '1.7' }}
  dangerouslySetInnerHTML={{ __html: shackHartmann.description }}
/>
              {shackHartmann.aberration_analysis && (
                <div className="p-3 bg-light rounded-3 border-start border-primary border-3 small text-dark mt-auto">
                  <strong>Aberration Analysis: </strong>  <p 
  className="text-muted small mb-3 custom-link-text" 
  style={{ lineHeight: '1.7' }}
  dangerouslySetInnerHTML={{ __html: shackHartmann.aberration_analysis }}
/>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ================= 5. WHY SHACK-HARTMANN IS BETTER ================= */}
        <div className="accuracy-card p-4 rounded-4 border mb-4 bg-white shadow-sm">
          <div className="d-flex align-items-start gap-3">
            <div className="alert-icon-circle flex-shrink-0 text-white" style={{ background: 'var(--primary-blue, #0d6efd)' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="w-100">
              <h5 className="fw-bold text-dark mb-2">{comparison.title || 'Why Shack-Hartmann is Better'}</h5>
              <p className="text-muted small mb-3" style={{ lineHeight: '1.6' }}>
                {comparison.description}
              </p>

              {comparison.advantages?.length > 0 && (
                <div className="row g-2">
                  {comparison.advantages.map((adv, idx) => (
                    <div key={idx} className="col-md-4 col-sm-6">
                      <div className="p-2 px-3 rounded-3 bg-light border d-flex align-items-center gap-2">
                        <span className="text-success fw-bold">✓</span>
                        <span className="small fw-semibold text-dark">{adv}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= 6. TECHNOLOGY HISTORY & ESO HERITAGE ================= */}
        <div className="accuracy-card p-4 rounded-4 border mb-4 bg-white shadow-sm">
          <div className="d-flex align-items-start gap-3">
            <div className="alert-icon-circle flex-shrink-0 text-white bg-dark">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path strokeWidth="2" d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
              </svg>
            </div>
            <div>
              <h5 className="fw-bold text-dark mb-2">{history.title || 'Application of Shack-Hartmann Technology'}</h5>
      {history.paragraphs?.map((p, idx) => (
  <p
    key={idx}
    suppressHydrationWarning
    className="text-muted small mb-3 custom-link-text"
    style={{ lineHeight: '1.7' }}
    dangerouslySetInnerHTML={{ __html: p }}
  />
))}

              {/* Scientists & Organization Tags */}
              <div className="d-flex flex-wrap gap-2 mt-3">
                <span className="badge bg-dark text-white px-3 py-2 rounded-pill small">
                  🏛️ {history.organization || 'ESO'} ({history.telescope || '3.5mt NTT Telescope'})
                </span>
                {history.scientists?.map((sci, idx) => (
                  <span key={idx} className="badge bg-light text-dark border px-3 py-2 rounded-pill small fw-normal">
                    🔬 {sci}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= 7. SPOTOPTICS WAVEFRONT SENSORS CAPABILITIES ================= */}
        <div className="accuracy-card p-4 rounded-4 border mb-4 bg-white shadow-sm">
          <div className="row g-4 align-items-center">
            
            <div className="col-lg-7">
              <h5 className="fw-bold mb-2" style={{ color: 'var(--primary-blue, #0d6efd)' }}>
                {spotopticsSensors.title || 'SpotOptics Shack-Hartmann Wavefront Sensors'}
              </h5>
              <p className="text-muted small mb-3" style={{ lineHeight: '1.6' }}>
                {spotopticsSensors.description}
              </p>

              {spotopticsSensors.capabilities?.length > 0 && (
                <div className="row g-2 mb-3">
                  {spotopticsSensors.capabilities.map((cap, idx) => (
                    <div key={idx} className="col-sm-6">
                      <div className="d-flex align-items-center gap-2 small text-dark">
                        <span className="text-primary-blue  fw-bold">•</span>
                        <span>{cap}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {spotopticsSensors.accessories && (
                <p className="small text-muted mb-0 fst-italic">
                  {spotopticsSensors.accessories}
                </p>
              )}
            </div>

            {/* Wavelength Range Highlight Box */}
            <div className="col-lg-5">
              <div className="p-4 rounded-4 text-center border h-100 d-flex flex-column justify-content-center" style={{ background: '#f0f7ff', borderColor: '#cde4ff' }}>
                <span className="small text-uppercase fw-bold text-muted mb-1" style={{ letterSpacing: '0.5px' }}>
                  Broad Wavelength Coverage
                </span>
                <span className="fs-3 fw-bold text-primary-blue  mb-2">
                  {spotopticsSensors.wavelength_range?.minimum || '193 nm'} – {spotopticsSensors.wavelength_range?.maximum || '10.6 µm'}
                </span>
                <p className="small text-muted mb-0">
                  {spotopticsSensors.wavelength_range?.description || 'Testing at UV, Visible, and Infrared wavelengths.'}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ================= 8. KEY POINTS GRID (5 CARDS) ================= */}
        {keyPoints.length > 0 && (
          <div className="mb-4">
            <h5 className="fw-bold mb-3" style={{ color: 'var(--primary-blue, #0d6efd)' }}>
              Key Takeaways
            </h5>
            <div className="row g-3">
              {keyPoints.map((item, idx) => (
                <div key={idx} className="col-lg-4 col-md-6">
                  <div className="accuracy-card p-3 rounded-4 border bg-white shadow-sm h-100 d-flex flex-column">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', fontSize: '12px' }}>
                        0{idx + 1}
                      </span>
                      <h6 className="fw-bold text-dark mb-0 fs-6">{item.title}</h6>
                    </div>
                    <p className="text-muted small mb-0 ps-4 flex-grow-1" style={{ lineHeight: '1.5' }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 9. CONCLUSION ALERT BOX ================= */}
        {conclusion.description && (
          <div className="accuracy-alert-box d-flex align-items-center gap-3 p-3 p-md-4 rounded-4 mb-4">
            <div className="alert-icon-circle flex-shrink-0 text-white" style={{ background: 'var(--primary-blue, #0d6efd)' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h6 className="fw-bold text-dark mb-1">{conclusion.title || 'Conclusion'}</h6>
              <p className="alert-text mb-1 text-muted small" style={{ lineHeight: '1.6' }}>
                {conclusion.description}
              </p>
              {conclusion.final_text && (
                <p className="alert-text mb-0 text-dark fw-medium small" style={{ lineHeight: '1.6' }}>
                  {conclusion.final_text}
                </p>
              )}
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
                  {/* ================= 10. FOOTER DARK BLUE CTA BANNER ================= */}
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
                Explore SpotOptics Shack-Hartmann Sensors
              </h5>
              <p className="text-white-50 mb-0 small">
                High precision on-axis and off-axis wavefront metrology systems.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="btn btn-light text-primary-blue  fw-bold px-4 py-2 rounded-pill shadow-sm"
          >
            Request Metrology Consultation →
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}