'use client';

import React from 'react';
import Link from 'next/link';

export default function SearchResults({ results = [], query = '', onLinkClick }) {
  // Agar query 2 characters se kam ho toh dropdown na dikhe
  if (!query || query.trim().length < 2) {
    return null;
  }

  // Category ke hisaab se Icon choose karne ke liye helper
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Knowledge Article':
        return (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'Page':
        return (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      default:
        return (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        );
    }
  };

  return (
    <div className="search-results-dropdown shadow-lg rounded-4 border">
      {results.length > 0 ? (
        <>
          {/* Header Info */}
          <div className="search-results-header px-3 py-2 border-bottom d-flex justify-content-between align-items-center bg-light rounded-top-4">
            <span className="small text-muted fw-semibold">
              Search Results ({results.length})
            </span>
            <span className="small text-muted">
              Press <strong>Esc</strong> to close
            </span>
          </div>

          {/* Results List */}
          <div className="search-results-list p-2">
            {results.map((item, index) => (
              <Link
                key={index}
                href={item.url || '#'}
                className="search-result-item d-flex align-items-start gap-3 p-3 rounded-3 text-decoration-none"
                onClick={onLinkClick}
              >
                {/* Icon box */}
                <div className="result-icon-box text-primary flex-shrink-0 mt-1">
                  {getCategoryIcon(item.category)}
                </div>

                {/* Content */}
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="result-title fw-bold text-dark text-truncate">
                      {item.title}
                    </span>
                    {item.category && (
                      <span className="badge bg-primary-subtle text-primary border rounded-pill px-2 py-0 small" style={{ fontSize: '10px' }}>
                        {item.category}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="result-desc text-muted mb-0 small text-truncate" style={{ maxWidth: '90%' }}>
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Right Arrow */}
                <div className="result-arrow text-muted flex-shrink-0 mt-2">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="p-4 text-center">
          <div className="text-muted mb-2">
            <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h6 className="fw-bold text-dark mb-1">No results found</h6>
          <p className="small text-muted mb-0">
            No matches found for &quot;<span className="text-primary fw-semibold">{query}</span>&quot;. Try searching with another keyword.
          </p>
        </div>
      )}
    </div>
  );
}