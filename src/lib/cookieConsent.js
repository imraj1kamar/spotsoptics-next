const CONSENT_KEY = 'spotoptics_cookie_consent';
const DEFAULT_VERSION = '1.0';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function isBrowser() {
  return typeof window !== 'undefined';
}

function normalizeConsent(value) {
  if (!value || typeof value !== 'object') {
    return null;
  }

  return {
    essential: typeof value.essential === 'boolean' ? value.essential : true,
    functional: Boolean(value.functional),
    statistics: Boolean(value.statistics),
    marketing: Boolean(value.marketing),
    timestamp: value.timestamp || new Date().toISOString(),
    version: value.version || DEFAULT_VERSION,
  };
}

function getCookieValue(name) {
  if (!isBrowser()) {
    return null;
  }

  const cookieString = document.cookie || '';
  const cookies = cookieString.split(';').map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));

  if (!match) {
    return null;
  }

  return decodeURIComponent(match.split('=').slice(1).join('=') || '');
}

function setCookieValue(name, value, maxAgeSeconds = COOKIE_MAX_AGE_SECONDS) {
  if (!isBrowser()) {
    return;
  }

  const encoded = encodeURIComponent(value);
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  const sameSite = '; SameSite=Lax';
  const path = '; Path=/';
  const maxAge = `; Max-Age=${maxAgeSeconds}`;

  document.cookie = `${name}=${encoded}${maxAge}${path}${sameSite}${secure}`;

  try {
    // eslint-disable-next-line no-console
    console.debug('[cookieConsent] setCookie', name, JSON.parse(value));
  } catch (error) {
    // ignore
  }
}

function deleteCookie(name) {
  if (!isBrowser()) {
    return;
  }

  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
}

function getLocalStorageValue(name) {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.localStorage.getItem(name);
  } catch (error) {
    return null;
  }
}

function setLocalStorageValue(name, value) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(name, value);
  } catch (error) {
    // ignore storage restrictions
  }
}

function deleteLocalStorageValue(name) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(name);
  } catch (error) {
    // ignore storage restrictions
  }
}

export function getStoredConsent() {
  if (!isBrowser()) {
    return null;
  }

  try {
    const rawValue = getCookieValue(CONSENT_KEY) || getLocalStorageValue(CONSENT_KEY);
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue);
    // eslint-disable-next-line no-console
    console.debug('[cookieConsent] getStoredConsent parsed', parsed);
    return normalizeConsent(parsed);
  } catch (error) {
    console.warn('Unable to read cookie consent from cookies/localStorage', error);
    return null;
  }
}

export function saveStoredConsent(consent) {
  if (!isBrowser()) {
    return consent;
  }

  const normalized = normalizeConsent(consent);

  if (!normalized) {
    return null;
  }

  const serialized = JSON.stringify(normalized);

  try {
    setCookieValue(CONSENT_KEY, serialized);
    setLocalStorageValue(CONSENT_KEY, serialized);
    // eslint-disable-next-line no-console
    console.debug('[cookieConsent] saved consent', normalized);
  } catch (error) {
    console.warn('Unable to save cookie consent to cookies/localStorage', error);
  }

  return normalized;
}

export function clearStoredConsent() {
  if (!isBrowser()) {
    return;
  }

  try {
    deleteCookie(CONSENT_KEY);
    deleteLocalStorageValue(CONSENT_KEY);
  } catch (error) {
    console.warn('Unable to clear cookie consent from cookies/localStorage', error);
  }
}

export function createConsentPayload({ essential = true, functional = false, statistics = false, marketing = false, version = DEFAULT_VERSION }) {
  return {
    essential: Boolean(essential),
    functional: Boolean(functional),
    statistics: Boolean(statistics),
    marketing: Boolean(marketing),
    timestamp: new Date().toISOString(),
    version,
  };
}

export function createAcceptAllPayload() {
  return createConsentPayload({ functional: true, statistics: true, marketing: true });
}

export function createRejectAllPayload() {
  return createConsentPayload({ functional: false, statistics: false, marketing: false });
}
