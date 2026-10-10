'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { clearStoredConsent, createAcceptAllPayload, createRejectAllPayload, getStoredConsent, saveStoredConsent } from '@/lib/cookieConsent';

const DEFAULT_CONSENT = {
  essential: true,
  functional: false,
  statistics: false,
  marketing: false,
  timestamp: null,
  version: '1.0',
};

export function useCookieConsent() {
  const [consent, setConsent] = useState(DEFAULT_CONSENT);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      setConsent(stored);
      setHasConsent(true);
    }
  }, []);

  const acceptAll = useCallback(() => {
    const payload = createAcceptAllPayload();
    setConsent(payload);
    setHasConsent(true);
    saveStoredConsent(payload);
  }, []);

  const rejectAll = useCallback(() => {
    const payload = createRejectAllPayload();
    setConsent(payload);
    setHasConsent(true);
    saveStoredConsent(payload);
  }, []);

  const savePreferences = useCallback((preferences) => {
    const payload = {
      essential: true,
      functional: Boolean(preferences.functional),
      statistics: Boolean(preferences.statistics),
      marketing: Boolean(preferences.marketing),
      timestamp: new Date().toISOString(),
      version: '1.0',
    };
    setConsent(payload);
    setHasConsent(true);
    saveStoredConsent(payload);
  }, []);

  const resetConsent = useCallback(() => {
    clearStoredConsent();
    setConsent(DEFAULT_CONSENT);
    setHasConsent(false);
  }, []);

  const api = useMemo(
    () => ({ consent, hasConsent, acceptAll, rejectAll, savePreferences, resetConsent }),
    [consent, hasConsent, acceptAll, rejectAll, savePreferences, resetConsent]
  );

  return api;
}
