'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Common Components & Data Imports
import PageTopBar from '@/components/common/PageTopBar';
import Sidebar from '@/components/common/Sidebar';
import tableData from '@/data/omi-selection-guide.json';
import sidebarData from '@/data/sidebar.json';
import '../../../../public/assets/css/OmiSelectionTable.css';

// Register GSAP ScrollTrigger plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function OmiSelectionTable({ softwareData = null }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const sectionRef = useRef(null);
  const tableContainerRef = useRef(null);

  // GSAP ScrollTrigger Entrance Animation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      if (tableContainerRef.current) {
        gsap.from(tableContainerRef.current, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Dynamic Search Filter
  const filteredData = useMemo(() => {
    return (tableData?.items || []).filter((item) => {
      const search = searchTerm.toLowerCase();
      return (
        item.model?.toLowerCase().includes(search) ||
        (item.variant && item.variant.toLowerCase().includes(search)) ||
        item.wavelength?.toLowerCase().includes(search) ||
        item.sampling?.some((s) => s.toLowerCase().includes(search)) ||
        item.lenslet?.some((l) => l.toLowerCase().includes(search)) ||
        item.speed?.toLowerCase().includes(search)
      );
    });
  }, [searchTerm]);

  // Pagination Calculations
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentEntries = filteredData.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  return (
    <section ref={sectionRef} className="page-section mt-5 py-4 py-lg-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-start position-relative z-2 mb-4">
          <PageTopBar
            breadcrumbs={[
    { label: 'Home', href: '/' },
    ...(softwareData?.page?.breadcrum?.map((item) => ({
      label: item.label,
      href: item.url,
    })) || [
      { label: 'Single Pass', href: '/all-products/omi-test-in-single-pass' },
      { label: softwareData?.title || 'OMI Selection Guide' },
    ]),
  ]}
            showCounter={false}
          
          />
        </div>

        {/* ================= 2. MAIN 2-COLUMN GRID ================= */}
        <div className="row g-4">
          {/* Left Column: Dynamic Data Table (9/12) */}
          <div className="col-12 col-lg-9">
            <div ref={tableContainerRef} className="omi-table-wrapper">
              {/* Table Header & Controls */}
              <div className="omi-table-header">
                <h3 className="omi-table-title">{tableData?.title || 'OMI Selection Guide'}</h3>

                <div className="omi-table-controls">
                  <div className="omi-entries-control">
                    <span>Show</span>
                    <select
                      className="omi-select"
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                    <span>entries</span>
                  </div>

                  <div className="omi-search-wrapper">
                    <span>Search:</span>
                    <input
                      type="text"
                      className="omi-search-input"
                      placeholder="Search model, wavelength..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Responsive Table */}
              <div className="omi-table-responsive">
                <table className="omi-custom-table">
                  <thead>
                    <tr>
                      <th>{tableData?.columns?.model || 'Model'}</th>
                      <th>{tableData?.columns?.wavelength || 'λλ (µ)'}</th>
                      <th>{tableData?.columns?.sampling || 'Sampling (S) Spots'}</th>
                      <th>{tableData?.columns?.lenslet || 'Lenslet (d, fl) mm'}</th>
                      <th>{tableData?.columns?.speed || 'Speed Camera / Loop (Hz)'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="wait">
                      {currentEntries.length > 0 ? (
                        currentEntries.map((item, index) => (
                          <motion.tr
                            key={item.id || index}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                          >
                            <td>
                              {item.isLink ? (
                                <a href={`${item.url}`} target='_blank' className="omi-model-link">
                                  {item.model}
                                </a>
                              ) : (
                                <span className="omi-model-name">{item.model}</span>
                              )}
                              {item.variant && (
                                <span className="omi-variant-tag">({item.variant})</span>
                              )}
                            </td>
                            <td>{item.wavelength}</td>
                            <td>
                              <div className="omi-cell-list">
                                {item.sampling?.map((s, idx) => (
                                  <span key={idx} className="omi-cell-item">{s}</span>
                                ))}
                              </div>
                            </td>
                            <td>
                              <div className="omi-cell-list">
                                {item.lenslet?.map((l, idx) => (
                                  <span key={idx} className="omi-cell-item">{l}</span>
                                ))}
                              </div>
                            </td>
                            <td>{item.speed}</td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>
                            No matching models found.
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Footer & Pagination */}
              <div className="omi-table-footer">
                <div className="omi-info-text">
                  Showing {totalEntries > 0 ? startIndex + 1 : 0} to{' '}
                  {Math.min(startIndex + pageSize, totalEntries)} of {totalEntries} entries
                </div>

                <div className="omi-pagination">
                  <button
                    type="button"
                    className="omi-page-btn"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      type="button"
                      key={p}
                      className={`omi-page-btn ${currentPage === p ? 'active' : ''}`}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="omi-page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Note */}
              {tableData?.note && (
                <ul className="omi-table-note">
                  <li>{tableData.note}</li>
                </ul>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Sidebar (3/12) */}
          <div className="col-lg-3 d-none d-lg-block">
            <aside className="sticky-top" style={{ top: '100px', zIndex: 10 }}>
              <Sidebar
                title={sidebarData?.title || 'Categories'}
                links={sidebarData?.links || []}
              />
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}