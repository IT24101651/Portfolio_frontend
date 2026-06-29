function isEmailAddress(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export function normalizeLinkHref(href = '', label = '') {
  const value = String(href || '').trim();
  const lower = value.toLowerCase();
  const normalizedLabel = String(label || '').trim().toLowerCase();

  if (!value) {
    return '';
  }

  if (
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:') ||
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('/') ||
    lower.startsWith('#')
  ) {
    return value;
  }

  if (normalizedLabel === 'email' || isEmailAddress(value)) {
    return `mailto:${value}`;
  }

  return value;
}

export function isExternalLink(href = '') {
  const value = String(href || '').trim().toLowerCase();
  return value.startsWith('http://') || value.startsWith('https://');
}

export function getLinkTarget(href = '') {
  return isExternalLink(href) ? '_blank' : undefined;
}

export function getLinkRel(href = '') {
  return isExternalLink(href) ? 'noreferrer' : undefined;
}
