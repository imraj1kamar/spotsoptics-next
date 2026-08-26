'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Dynamic / Static Data Import
import knowledgeData from '@/data/knowledge.json'; 
import Sidebar from '@/components/common/Sidebar';
import "../../../../public/assets/css/accuracy-detail.css";
import sidebarData from '@/data/sidebar.json';
import PageTopBar from '@/components/common/PageTopBar';

export default function WavefrontAccuracyDetailPage({ data }) {
  // Data resolution: Prop se mile, ya articles array se find karein, ya direct JSON se
  const currentData =
    data ||
    (Array.isArray(knowledgeData?.articles)
      ? knowledgeData.articles.find((a) => a.id === 'wavefront-sensor-accuracy' || a.slug === 'wavefront-sensor-accuracy') || knowledgeData.articles[0]
      : knowledgeData) ||
    {};

  const details = currentData?.details || currentData || {};
  const overview = details?.overview || {};
    
  const hero = details?.hero || {};
  const comparison = details?.comparison || {};
  const zygo = details?.zygo_comparison || {};
  const params = details?.measured_parameters || {};
  const surfacePlots = details?.surface_plots?.items || [];
  const veeco = details?.veeco_comparison || {};
  const contourPlots = details?.contour_comparison?.items || [];
  const conclusion = details?.conclusion || {};
  const finalPlot = details?.final_plot || {};
  const footerCta = details?.footer_cta || {};

  // Safe image URL resolver
  const resolveImg = (src) => {
    if (!src) return '';
    return src.startsWith('/') ? src : `/${src}`;
  };

  return (
    <div className="page-section py-5">
      <div className="container mt-5">

<div className="d-flex justify-content-between align-items-start position-relative z-2 mt-5 mb-3 mx-3">
                      <PageTopBar
                            breadcrumbs={[
                            { label: 'Home', href: '/' },
                            { label: 'Knowledge Corner', href: '/knowledge' },
                            { label: 'Wavefront Sensor Accuracy', href: '/knowledge/wavefront-sensor-accuracy' },
                            ]}
                            showCounter={false}
                            />
            </div> 
              {/* ================= 1. DARK BLUE HERO BANNER ================= */}
        <div className="knowledge-hero-card mb-4 position-relative overflow-hidden rounded-4 p-4 p-lg-5">
          <div className="row align-items-center">

                       
            <div className="col-lg-7 col-md-8 position-relative z-2">
              <h1 className="accuracy-hero-title text-white fw-bold mb-3">
                {hero.title || 'Exceptional accuracy and precision of our Wavefront Sensors'}
              </h1>
              <div className="hero-accent-line mb-3"></div>
            </div>
            
            
            <div className="col-lg-5 col-md-4 text-end position-relative z-1 d-none d-md-block">
              <div className="hero-3d-lens-wrapper">
                <Image
                               src={resolveImg(hero.image)}
                               alt={hero.caption || 'Hartmann vs Shack-Hartmann Setup'}
                               width={850}
                               height={380}
                               className="img-fluid rounded object-fit-contain"
                               style={{ maxHeight: '360px' }}
                               priority
                               unoptimized
                             />
              </div>
            </div>
          </div>
        </div>
       <div className="row">
        <div className="col-lg-9 col-12">
        

        {/* ================= 2. TOP COMPARISON CARD (VEECO VS OPTINO) ================= */}
        <div className="accuracy-card custom-glass-card p-4 rounded-4 border mb-4 bg-white shadow-sm">
          <div className="row g-4 align-items-center">
            
            {/* Left Image with Badge */}
            <div className="col-md-6 text-center">
              <div className="comparison-media-box position-relative rounded-3 p-2 bg-light d-flex flex-column align-items-center justify-content-center">
                <span className="comparison-floating-badge badge  text-white px-3 py-2 rounded-pill fw-semibold mb-2">
                  {comparison.title || 'veeco Results Vs Optino Results Contour of Wavefront'}
                </span>
                {comparison.left_image && (
                  <Image
                    src={resolveImg(comparison.left_image)}
                    alt="Veeco Wavefront Contour"
                    width={400}
                    height={300}
                    className="img-fluid rounded object-fit-contain"
                    style={{ maxHeight: '280px' }}
                    unoptimized
                  />
                )}
              </div>
            </div>

            {/* Right Image */}
            <div className="col-md-6 text-center">
              <div className="comparison-media-box rounded-3 p-2 bg-light d-flex align-items-center justify-content-center">
                {comparison.right_image && (
                  <Image
                    src={resolveImg(comparison.right_image)}
                    alt="Optino Wavefront Contour"
                    width={400}
                    height={300}
                    className="img-fluid rounded object-fit-contain"
                    style={{ maxHeight: '280px' }}
                    unoptimized
                  />
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ================= 3. OVERVIEW ALERT BOX ================= */}
        <div className="accuracy-alert-box d-flex align-items-center gap-3 p-3 p-md-4 rounded-4 mb-4">
          <div className="alert-icon-circle bg-primary text-white flex-shrink-0">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path strokeWidth="2" d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
            </svg>
          </div>

          
          <p className="alert-text mb-0 fw-medium custom-link-text"   style={{ lineHeight: '1.7' }} dangerouslySetInnerHTML={{ __html: overview.text }}/>
        </div>

        {/* ================= 4. ZYGO COMPARISON SECTION ================= */}
        <div className="accuracy-card p-4 rounded-4 border mb-4 bg-white shadow-sm">
          <div className="row g-4 align-items-center">
            
            {/* Sample Image */}
            <div className="col-md-3 col-sm-4 text-center">
              {zygo.image && (
                <div className="sample-img-container p-2 bg-light rounded-3 d-inline-block">
                  <Image
                    src={resolveImg(zygo.image)}
                    alt="Zygo Sample"
                    width={180}
                    height={180}
                    className="img-fluid rounded-circle"
                    unoptimized
                  />
                </div>
              )}
            </div>

            {/* Bullets Content */}
            <div className="col-md-5 col-sm-8">
              <h5 className="section-subheading fw-bold mb-3">
                <span className="text-primary-red">SpotOptics</span> <span className="text-primary-blue">Optino vs. Zygo Interferometer</span>
              </h5>
              <ul className="accuracy-bullet-list ps-3 mb-0">
                {zygo.bullets?.map((item, idx) => (
                  <li key={idx} className="text-muted mb-2 small" style={{ lineHeight: '1.5' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Download Document Box */}
            <div className="col-md-4">
              <Link
              target='_blank'
                href={zygo.download?.url || '#'}
                className="download-doc-card text-decoration-none d-flex flex-column align-items-center justify-content-center p-4 rounded-4 text-center h-100"
              >
                <div className="download-icon text-primary-blue mb-2">
                  <svg width="34" height="34" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                  </svg>
                </div>
                <span className="fw-bold text-primary-blue fs-6 d-block">
                  {zygo.download?.title || 'Download document'}
                </span>
                <span className="small text-muted d-block mt-1">
                  on <span className="text-primary-red fw-semibold">{zygo.download?.description || 'Accuracy of SpotOptics Wavefront Sensors'}</span>
                </span>
              </Link>
            </div>

          </div>
        </div>

        {/* ================= 5. MEASURED PARAMETERS TABLE ================= */}
        <div className="accuracy-table-card rounded-4 border mb-4 bg-white overflow-hidden shadow-sm p-4">
          <h5 className="text-primary-blue fw-bold mb-3">{params.title || 'Measured parameters'}</h5>
          <div className="table-responsive">
            <table className="table table-bordered accuracy-custom-table mb-0 align-middle">
              <thead>
                <tr>
                  {params.columns?.map((col, idx) => (
                    <th key={idx} className="text-uppercase small fw-bold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {params.rows?.map((row, idx) => (
                  <tr key={idx}>
                    <td className="fw-bold text-dark">{row.parameter}</td>
                    <td className="text-muted">{row.zygo}</td>
                    <td className="text-muted">{row.optino}</td>
                    <td className="text-muted">{row.difference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= 6. 3D SURFACE PLOT COMPARISON ================= */}
        <div className="row g-4 mb-4">
          {surfacePlots.map((plot, idx) => (
            <div key={idx} className="col-md-6">
              <div className="accuracy-card p-3 rounded-4 border bg-white shadow-sm h-100 d-flex flex-column">
                <h6 className="comparison-floating-badge badge  text-white px-3 py-2 rounded-pill fw-semibold mb-2">{plot.title}</h6>
                {plot.image && (
                  <div className="plot-img-box rounded-3 bg-light p-2 flex-grow-1 d-flex align-items-center justify-content-center">
                    <Image
                      src={resolveImg(plot.image)}
                      alt={plot.title}
                      width={450}
                      height={280}
                      className="img-fluid rounded object-fit-contain"
                      style={{ maxHeight: '250px' }}
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ================= 7. VEECO COMPARISON SECTION ================= */}
        <div className="accuracy-card p-4 rounded-4 border mb-4 bg-white shadow-sm">
          <div className="row g-4 align-items-center">
            
            {/* Bullets Content */}
            <div className="col-md-8">
              <h5 className="section-subheading fw-bold mb-3">
                <span className="text-primary-red">SpotOptics</span> <span className="text-primary-blue">Optino vs. Veeco Interferometer</span>
              </h5>
              <ul className="accuracy-bullet-list ps-3 mb-0">
                {veeco.bullets?.map((item, idx) => (
                  <li key={idx} className="text-muted mb-2 small" style={{ lineHeight: '1.5' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Download Document Box */}
            <div className="col-md-4">
              <Link
                href={veeco.download?.url || '#'}
                className="download-doc-card text-decoration-none d-flex flex-column align-items-center justify-content-center p-4 rounded-4 text-center h-100"
              >
                <div className="download-icon text-primary-blue mb-2">
                  <svg width="34" height="34" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                  </svg>
                </div>
                <span className="fw-bold text-primary-blue fs-6 d-block">
                  {veeco.download?.title || 'Download document'}
                </span>
                <span className="small text-muted d-block mt-1">
                  on <span className="text-primary-red fw-semibold">{veeco.download?.description || 'Accuracy of SpotOptics Wavefront Sensors'}</span>
                </span>
              </Link>
            </div>

          </div>
        </div>

        {/* ================= 8. CONTOUR COMPARISON CARDS ================= */}
        <div className="row g-4 mb-4">
          {contourPlots.map((item, idx) => (
            <div key={idx} className="col-md-6">
              <div className="accuracy-card p-3 rounded-4 border bg-white shadow-sm h-100 d-flex flex-column">
                <h6 className="comparison-floating-badge badge  text-white px-3 py-2 rounded-pill fw-semibold mb-2">{item.title}</h6>
                {item.image && (
                  <div className="plot-img-box rounded-3 bg-light p-2 flex-grow-1 d-flex align-items-center justify-content-center">
                    <Image
                      src={resolveImg(item.image)}
                      alt={item.title}
                      width={400}
                      height={260}
                      className="img-fluid rounded object-fit-contain"
                      style={{ maxHeight: '240px' }}
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ================= 9. CONCLUSION ALERT BOX ================= */}
        <div className="accuracy-alert-box d-flex align-items-center gap-3 p-3 p-md-4 rounded-4 mb-4">
          <div className="alert-icon-circle bg-primary text-white flex-shrink-0">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 13l4-8 4 14 4-10 4 6h2" />
            </svg>
          </div>
          <div className="flex-grow-1">
            <div className="d-flex flex-wrap align-items-center gap-3 fw-bold text-dark mb-1 small">
              <span>Veeco: PV 10nm, RMS 1nm</span>
              <span className="text-muted">|</span>
              <span>Optino: PV 14nm, RMS 2.1nm</span>
            </div>
            <p className="alert-text mb-0 text-muted small">
              {conclusion.text ||
                'The wavefront from Veeco (on left) and the wavefront as measured by Sensoft (right). A clear correspondence between the two is seen.'}
            </p>
          </div>
        </div>

        {/* ================= 10. VEECO FINAL CONTOUR PLOT ================= */}
        {finalPlot.image && (
          <div className="accuracy-card p-4 rounded-4 border mb-4 bg-white shadow-sm text-center">
            <div className="final-plot-wrapper p-2 bg-light rounded-3 d-inline-block w-100">
              <Image
                src={resolveImg(finalPlot.image)}
                alt={finalPlot.title || 'Veeco Final Contour Plot'}
                width={800}
                height={500}
                className="img-fluid rounded object-fit-contain"
                style={{ maxHeight: '480px' }}
                unoptimized
              />
            </div>
          </div>
        )}

        {/* ================= 11. FOOTER DARK BLUE STATISTICS BANNER ================= */}
        
        </div>
       <div className="col-lg-3 mb-4 d-none d-lg-block">
                   <div className="sticky-top" style={{ top: '100px' }}>
                     <Sidebar
                       title={sidebarData?.title || 'Categories'}
                       links={sidebarData?.links || []}
                     />
                   </div>
                 </div>

                 <div className="accuracy-footer-banner d-flex align-items-center justify-content-center gap-3 p-3 rounded-4 shadow-sm">
          <div className="footer-banner-icon text-white">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path strokeWidth="2" d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
            </svg>
          </div>
          <h5 className="footer-banner-title text-white mb-0 fw-bold fs-6">
            {footerCta.title || 'Statistics of the wavefront from Veeco'}
          </h5>
        </div>
        </div>
    

      </div>
    </div>
  );
}