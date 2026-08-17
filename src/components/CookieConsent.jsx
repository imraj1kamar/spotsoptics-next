'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

// CSS Import
import '../../public/assets/css/cookieConsent.css';

const CATEGORY_LABELS = [
  { key: 'functional', label: 'Functional', description: 'Improves website performance and user interface behavior.' },
  { key: 'statistics', label: 'Statistics', description: 'Helps us analyze traffic and improve feature prioritization.' },
  { key: 'marketing', label: 'Marketing', description: 'Delivers tailored support, product updates, and relevant resources.' },
];

const formatCategoryId = (category) => `cookie-consent-${category}`;

function CookieToggle({ category, label, description, checked, disabled, onChange }) {
  return (
    <div className="cookie-toggle row g-0 align-items-center mb-3 p-3 rounded-3 bg-white bg-opacity-5 border border-white border-opacity-10">
      <div className="col">
        <div className="cookie-toggle-copy me-3">
          <div className="cookie-modal-category-title mb-1">{label}</div>
          <div className="cookie-toggle-description small text-muted">{description}</div>
        </div>
      </div>
      <div className="col-auto">
        <div className="form-check form-switch m-0">
          <input
            id={formatCategoryId(category)}
            className="form-check-input role-switch cursor-pointer"
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(event) => onChange(category, event.target.checked)}
            aria-checked={checked}
            aria-label={`${label} cookies toggle`}
          />
        </div>
      </div>
    </div>
  );
}

export default function CookieConsent() {
  const { consent, hasConsent, acceptAll, rejectAll, savePreferences } = useCookieConsent();
  
  // 1. Client-side Mounting state check
  const [isMounted, setIsMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    functional: consent.functional,
    statistics: consent.statistics,
    marketing: consent.marketing,
  });
  const bannerRef = useRef(null);
  const modalRef = useRef(null);

  // 2. Client-side Mount check (Prevents SSR Flicker)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 3. Sync showBanner with hasConsent status
  useEffect(() => {
    if (isMounted) {
      setShowBanner(!hasConsent);
    }
  }, [hasConsent, isMounted]);

  useEffect(() => {
    setPreferences({
      functional: consent.functional,
      statistics: consent.statistics,
      marketing: consent.marketing,
    });
  }, [consent]);

  useEffect(() => {
    if (!isModalOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      modalRef.current?.focus();
    }
  }, [isModalOpen]);

  const onAcceptAll = () => {
    acceptAll();
    setShowBanner(false);
  };

  const onRejectAll = () => {
    rejectAll();
    setShowBanner(false);
  };

  const onOpenPreferences = () => {
    setIsModalOpen(true);
  };

  const onClosePreferences = () => {
    setIsModalOpen(false);
  };

  const onSavePreferences = () => {
    savePreferences(preferences);
    setShowBanner(false);
    setIsModalOpen(false);
  };

  const onToggleCategory = (category, value) => {
    setPreferences((current) => ({ ...current, [category]: value }));
  };

  const bannerClassName = useMemo(
    () => `cookie-banner ${showBanner ? 'cookie-banner-visible' : 'cookie-banner-hidden'}`,
    [showBanner]
  );

  // 4. FIX: Agar user already consent de chuka hai ya page load nahi hua hai, toh NULL return karein
  if (!isMounted || hasConsent || !showBanner) {
    return null;
  }

  return (
    <div>
      {/* FLOATING COOKIE BANNER */}
      <div className={bannerClassName} ref={bannerRef} role="region" aria-label="cookie consent banner">
        <div className="cookie-banner-panel container-fluid position-relative">
          <div className="cookie-banner-content d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-4 p-4 rounded-4">
            
            {/* Left Side */}
            <div className="d-flex align-items-center gap-3">
              <div className="cookie-shield-icon-wrapper flex-shrink-0">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>

              <div className="cookie-banner-copy">
                <h3 className="cookie-banner-title fw-bold text-white mb-1">
                  We value your privacy
                </h3>
                <p className="cookie-banner-text text-slate-300 small mb-0">
                  Use cookies to improve your experience, analyze website traffic, and enhance product support and documentation. <br className="d-none d-md-inline" />
                  You can manage your preferences anytime.
                </p>
              </div>
            </div>

            {/* Right Side */}
            <div className="cookie-banner-actions flex-shrink-0">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-cookie-outline"
                  onClick={onOpenPreferences}
                >
                  Preferences
                </button>

                <button
                  type="button"
                  className="btn btn-cookie-outline"
                  onClick={onRejectAll}
                >
                  Reject All
                </button>

                <button
                  type="button"
                  className="btn btn-cookie-accept"
                  onClick={onAcceptAll}
                >
                  Accept All
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* COOKIE PREFERENCES MODAL */}
      <div className={`cookie-modal-backdrop ${isModalOpen ? 'cookie-modal-backdrop-visible' : ''}`} onClick={onClosePreferences} />
      <div
        className={`cookie-modal ${isModalOpen ? 'cookie-modal-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
        tabIndex={-1}
        ref={modalRef}
      >
        <div className="cookie-modal-card">
          <div className="cookie-modal-header">
            <div>
              <h2 id="cookie-preferences-title">Cookie preferences</h2>
              <p className="cookie-modal-description">
                Choose the cookies that help us deliver a refined product experience while respecting your privacy.
              </p>
            </div>
            <button type="button" className="cookie-modal-close" aria-label="Close preferences" onClick={onClosePreferences}>
              ×
            </button>
          </div>

          <div className="cookie-modal-body">
            <div className="cookie-modal-category cookie-modal-category-essential p-3 rounded-3 bg-white bg-opacity-5 border border-white border-opacity-10 mb-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="cookie-modal-category-title mb-1">Essential</div>
                  <div className="cookie-modal-category-subtitle small text-muted">Required for website security and functionality.</div>
                </div>
                <div className="cookie-toggle-static">
                  <span style={{ backgroundColor: 'var(--primary-blue)' }} className="badge bg-primary bg-opacity-20 text-white border-opacity-30 rounded-pill px-3 py-1">Enabled</span>
                </div>
              </div>
            </div>

            {CATEGORY_LABELS.map(({ key, label, description }) => (
              <CookieToggle
                key={key}
                category={key}
                label={label}
                description={description}
                checked={preferences[key]}
                disabled={false}
                onChange={onToggleCategory}
              />
            ))}
          </div>

          <div className="cookie-modal-footer">
            <button type="button" className="btn btn-cookie-outline" onClick={onClosePreferences}>
              Cancel
            </button>
            <button type="button" className="btn btn-cookie-accept" onClick={onSavePreferences}>
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}