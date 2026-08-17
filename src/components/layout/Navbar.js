'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import navData from '@/data/navigation.json';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const searchInputRef = useRef(null);
  
  // Current active URL path check karne ke liye
  const pathname = usePathname();

  // Search Overlay open hone par input par focus karein
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // Escape key dabane par search overlay close karein
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  return (
    <nav className="navbar navbar-expand-lg fixed-top spotoptics-navbar">
      <div className="container-fluid">
        {/* Brand Logo */}
        <Link href="/" className="navbar-brand fw-bold fs-4">
          <span>{navData?.logo || 'SpotOptics'}</span>
        </Link>

        {/* Mobile Menu Toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <span className="navbar-toggler-icon" />
        </button>

       <div className={`collapse navbar-collapse ${isMobileOpen ? 'show' : ''}`}>
  <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
    {navData?.menu?.map((item, index) => {
      const isActive =
        pathname === item.url ||
        item.children?.some((child) => pathname === child.url);

      return (
        <li
          key={index}
          className={`nav-item ${item.children ? 'dropdown' : ''}`}
        >
          {item.children ? (
            <>
              <a
                href="#"
                className={`nav-link px-lg-3 dropdown-toggle ${isActive ? 'active' : ''}`}
                data-bs-toggle="dropdown"
                role="button"
                aria-expanded="false"
                style={
                  isActive
                    ? {
                        color: 'var(--primary-blue)',
                        borderBottom: '3px solid var(--primary-blue)',
                        fontWeight: '600',
                      }
                    : {}
                }
              >
                {item.title}
              </a>

              <ul className="dropdown-menu shadow-lg border-0 rounded-3 py-2">
                {item.children.map((child, childIndex) => (
                  <li key={childIndex}>
                    <Link
                      href={child.url}
                      className={`dropdown-item py-2 px-4 ${
                        pathname === child.url ? 'active' : ''
                      }`}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {child.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Link
              href={item.url || '#'}
              className={`nav-link px-lg-3 ${isActive ? 'active' : ''}`}
              style={
                isActive
                  ? {
                      color: 'var(--primary-blue)',
                      borderBottom: '3px solid var(--primary-blue)',
                      fontWeight: '600',
                    }
                  : {}
              }
              onClick={() => setIsMobileOpen(false)}
            >
              {item.title}
            </Link>
          )}
        </li>
      );
    })}
  </ul>


          {/* Search Trigger Icon */}
          <div className="d-flex align-items-center mt-3 mt-lg-0 ms-lg-3">
            <button
            suppressHydrationWarning
              className="btn btn-link search-trigger p-0 border-0"
              style={{ color: 'var(--primary-blue)' }}
              type="button"
              aria-label="Open Search"
              onClick={() => setIsSearchOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Search Overlay */}
      <div className={`search-overlay ${isSearchOpen ? 'active' : ''}`}>
        <div className="container-fluid h-100 d-flex align-items-center">
          <form
            action="/search"
            method="get"
            className="d-flex w-100 align-items-center"
          >
            <span className="text-white me-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </span>

            <input
              ref={searchInputRef}
              className="form-control search-input flex-grow-1"
              type="search"
              placeholder="Search SpotOptics..."
              aria-label="Search"
              name="q"
            />

            <button
              className="btn btn-link search-close text-white ms-3 p-0 border-0"
              type="button"
              aria-label="Close Search"
              onClick={() => setIsSearchOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}