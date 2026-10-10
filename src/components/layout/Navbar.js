'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// All JSON Data Imports
import navData from '@/data/navigation.json';
import products from '@/data/products.json';
import applications from '@/data/application.json';
import Faqs from '@/data/faq.json';  
import knowledge from '@/data/knowledge.json';
import companyprofile from '@/data/companyprofile.json';
import download from '@/data/download.json';
import ourTechnology from '@/data/ourTechnology.json';
import resourcesSection from '@/data/resourcesSection.json';
import sensoftSection from '@/data/sensoftSection.json';

import SearchResults from './SearchResults';
import '../../../public/assets/css/navbar.css';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

  // State for live search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  const pathname = usePathname();

  // Search open hone par input autofocus
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // ================= DIRECT JSON SEARCH (No fetch, No API route needed) =================
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    
    if (q.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const debounceTimer = setTimeout(() => {
      const results = [];

      // Helper to add unique search results
      const addResult = (title, description, url, category) => {
        if (title && url) {
          if (!results.some((r) => r.url === url && r.title === title)) {
            results.push({
              title,
              description: description || '',
              url,
              category: category || 'General',
            });
          }
        }
      };

      // 1. Knowledge Articles
      const articles = Array.isArray(knowledge?.articles) ? knowledge.articles : [];
      articles.forEach((art) => {
        if (art.title?.toLowerCase().includes(q) || art.description?.toLowerCase().includes(q)) {
          addResult(
            art.title,
            art.description,
            art.url || `/knowledge/${art.id || art.slug}`,
            'Knowledge'
          );
        }
      });

      // 2. Products
      const prodList = Array.isArray(products)
        ? products
        : Array.isArray(products?.products)
        ? products.products
        : Array.isArray(products?.items)
        ? products.items
        : [];
      prodList.forEach((prod) => {
        if (
          prod.title?.toLowerCase().includes(q) ||
          prod.name?.toLowerCase().includes(q) ||
          prod.description?.toLowerCase().includes(q)
        ) {
          addResult(
            prod.title || prod.name,
            prod.description || prod.subtitle,
            prod.url || `/all-products/${prod.id || prod.slug}`,
            'Product'
          );
        }
      });

    // ================= 3. Applications Search =================
const appList = Array.isArray(applications)
  ? applications
  : Array.isArray(applications?.applications)
  ? applications.applications
  : [];

appList.forEach((app) => {
  // Title / Subtitle check
  const title = app.subtitle || app.title || '';
  const description = app.description || '';
  
  // Bullets & Sections ka text bhi search karein
  const bulletsText = Array.isArray(app.bullets) ? app.bullets.join(' ') : '';
  const sectionsText = Array.isArray(app.sections) 
    ? app.sections.map(s => `${s.heading} ${s.bullets?.join(' ')}`).join(' ')
    : '';

  const fullSearchableText = `${title} ${description} ${bulletsText} ${sectionsText}`.toLowerCase();

  if (fullSearchableText.includes(q)) {
    // Agar url "#" ho ya na ho, toh proper application link generate karein
    const appUrl = (app.url && app.url !== '#') 
      ? app.url 
      : `/applications#${app.id}`; // Ya `/applications/${app.id}`

    addResult(
      title,
      description,
      appUrl,
      'Application'
    );
  }
});

      // 4. Downloads
      const dlList = Array.isArray(download)
        ? download
        : Array.isArray(download?.downloads)
        ? download.downloads
        : Array.isArray(download?.items)
        ? download.items
        : [];
      dlList.forEach((dl) => {
        if (dl.title?.toLowerCase().includes(q) || dl.description?.toLowerCase().includes(q)) {
          addResult(
            dl.title,
            dl.description,
            dl.url || dl.file_url || '/download',
            'Download'
          );
        }
      });

      // 5. FAQs
      const faqList = Array.isArray(Faqs)
        ? Faqs
        : Array.isArray(Faqs?.faqs)
        ? Faqs.faqs
        : Array.isArray(Faqs?.items)
        ? Faqs.items
        : [];
      faqList.forEach((f) => {
        if (
          f.question?.toLowerCase().includes(q) ||
          f.answer?.toLowerCase().includes(q) ||
          f.title?.toLowerCase().includes(q)
        ) {
          addResult(
            f.question || f.title,
            f.answer || f.description,
            f.url || '/faq',
            'FAQ'
          );
        }
      });

      // 6. Navigation Menu & Pages
      if (navData?.menu) {
        navData.menu.forEach((item) => {
          if (item.title?.toLowerCase().includes(q) && item.url) {
            addResult(item.title, `Go to ${item.title} page`, item.url, 'Page');
          }
          item.children?.forEach((child) => {
            if (child.title?.toLowerCase().includes(q) && child.url) {
              addResult(child.title, `${item.title} > ${child.title}`, child.url, 'Section');
            }
          });
        });
      }

      setSearchResults(results);
      setIsSearching(false);
    }, 150); // Fast 150ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Mobile Drawer open hone par body scroll lock
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  // Route change hone par mobile drawer aur search auto close
  useEffect(() => {
    setIsMobileOpen(false);
    setIsSearchOpen(false);
    setOpenMobileDropdown(null);
    setSearchQuery('');
    setSearchResults([]);
  }, [pathname]);

  // Escape key dabane par close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleMobileDropdown = (index) => {
    setOpenMobileDropdown((prev) => (prev === index ? null : index));
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <>
      {/* ================= MAIN NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg fixed-top spotoptics-navbar">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          
          {/* Mobile Hamburger Button */}
          <button
            className="navbar-toggler border-0 p-1 d-lg-none me-2"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setIsMobileOpen(true)}
          >
            <div className="mobile-hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          {/* Brand Logo */}
          <Link href="/" className="navbar-brand fw-bold fs-4 d-flex align-items-center">
            <span>{navData?.logo || 'SpotOptics'}</span>
          </Link>

          {/* Desktop Navigation Menu */}
          <div className="collapse navbar-collapse justify-content-center d-none d-lg-flex" id="navbarDesktopContent">
            <ul className="navbar-nav mb-2 mb-lg-0">
              {navData?.menu?.map((item, index) => {
                const isActive =
                  pathname === item.url ||
                  item.children?.some((child) => pathname === child.url);

                return (
                  <li key={index} className={`nav-item ${item.children ? 'dropdown' : ''}`}>
                    {item.children ? (
                      <>
                        <a
                          href="#"
                          className={`nav-link px-lg-3 dropdown-toggle ${isActive ? 'active' : ''}`}
                          role="button"
                          aria-expanded="false"
                        >
                          {item.title}
                        </a>

                        <ul className="dropdown-menu shadow-lg border-0 rounded-3 py-2">
                          {item.children.map((child, childIndex) => {
                            const isChildActive = pathname === child.url;
                            return (
                              <li key={childIndex}>
                                <Link
                                  href={child.url}
                                  className={`dropdown-item py-2 px-4 ${isChildActive ? 'active' : ''}`}
                                >
                                  {child.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    ) : (
                      <Link
                        href={item.url || '#'}
                        className={`nav-link px-lg-3 ${isActive ? 'active' : ''}`}
                      >
                        {item.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Search Trigger Icon Button */}
          <div className="d-flex align-items-center">
            <button
              suppressHydrationWarning
              className="btn btn-link search-trigger p-2 border-0 d-flex align-items-center justify-content-center"
              style={{ color: 'var(--heading-text)' }}
              type="button"
              aria-label="Open Search"
              onClick={() => setIsSearchOpen(true)}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </button>
          </div>

          {/* ================= SEARCH OVERLAY ================= */}
          <div className={`search-overlay ${isSearchOpen ? 'active' : ''}`}>
            <div className="search-overlay-content">
              <div className="container-fluid px-3 px-md-4 position-relative">
                
                {/* Search Input Bar */}
                <div className="d-flex w-100 align-items-center search-form-wrapper py-2">
                  <span className="search-icon-prefix me-3">
                    <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                  </span>

          
                <input
  ref={searchInputRef}
  className="form-control search-input flex-grow-1"
  type="search"
  placeholder="Search for products, applications, or articles..."
  aria-label="Search"
  autoComplete="off"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  suppressHydrationWarning
/>

                  <button
                    className="btn btn-link search-close ms-3 p-1 border-0"
                    type="button"
                    aria-label="Close Search"
                    onClick={handleCloseSearch}
                    suppressHydrationWarning
                  >
                    <svg width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg>
                  </button>
                </div>

                {/* Live Search Results Dropdown Component */}
                <SearchResults
                  results={searchResults}
                  query={searchQuery}
                  loading={isSearching}
                  onLinkClick={handleCloseSearch}
                />

              </div>
            </div>
          </div>

        </div>
      </nav>

      {/* ================= MOBILE / TABLET DRAWER ================= */}
      <div
        className={`spotoptics-mobile-backdrop ${isMobileOpen ? 'active' : ''}`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      <aside className={`spotoptics-mobile-drawer ${isMobileOpen ? 'open' : ''}`}>
        
        {/* Drawer Header */}
        <div className="mobile-drawer-header d-flex align-items-center justify-content-between p-3 border-bottom">
          <Link
            href="/"
            className="navbar-brand fw-bold fs-4 text-dark text-decoration-none"
            onClick={() => setIsMobileOpen(false)}
          >
            <span>{navData?.logo || 'SpotOptics'}</span>
          </Link>

          <button
            type="button"
            className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center border-0"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
            suppressHydrationWarning
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Body Nav Links */}
        <div className="mobile-drawer-body p-3 overflow-y-auto">
          <ul className="navbar-nav">
            {navData?.menu?.map((item, index) => {
              const isActive =
                pathname === item.url ||
                item.children?.some((child) => pathname === child.url);
              const isDropdownExpanded = openMobileDropdown === index;

              return (
                <li key={index} className="nav-item mb-1">
                  {item.children ? (
                    <div className="mobile-dropdown-group">
                      <button
                        type="button"
                        className={`mobile-nav-link w-100 d-flex align-items-center justify-content-between border-0 bg-transparent py-2 px-3 rounded-3 text-start ${
                          isActive ? 'active-parent' : ''
                        }`}
                        onClick={() => toggleMobileDropdown(index)}
                        suppressHydrationWarning
                      >
                        <span className="fw-semibold">{item.title}</span>
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          className={`chevron-icon transition-transform ${isDropdownExpanded ? 'rotate-180' : ''}`}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <div className={`mobile-sub-menu ${isDropdownExpanded ? 'expanded' : ''}`}>
                        <ul className="list-unstyled ps-3 pt-1 mb-2">
                          {item.children.map((child, childIndex) => {
                            const isChildActive = pathname === child.url;
                            return (
                              <li key={childIndex} className="mb-1">
                                <Link
                                  href={child.url}
                                  className={`mobile-sub-link d-block py-2 px-3 rounded-2 text-decoration-none ${
                                    isChildActive ? 'active' : ''
                                  }`}
                                  onClick={() => setIsMobileOpen(false)}
                                >
                                  {child.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.url || '#'}
                      className={`mobile-nav-link d-block py-2 px-3 rounded-3 text-decoration-none ${
                        isActive ? 'active' : ''
                      }`}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <span className="fw-semibold">{item.title}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Drawer Footer CTA */}
        <div className="mobile-drawer-footer p-3 border-top mt-auto bg-light">
          <Link
            href="/contact"
            className="btn text-white w-100 fw-semibold py-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
            onClick={() => setIsMobileOpen(false)}
            style={{ backgroundColor: 'var(--primary-blue)' }}
          >
            <span>Request Consultation</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

      </aside>
    </>
  );
}