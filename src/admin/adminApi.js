export const ADMIN_TOKEN_KEY = 'portfolio_admin_token';
export const ADMIN_PROFILE_KEY = 'portfolio_admin_profile';
const runtimeEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

export const API_BASE = runtimeEnv.VITE_API_BASE_URL || 'http://localhost:5000/api';

export function loadAdminSession() {
  if (typeof window === 'undefined') {
    return { token: '', admin: null };
  }

  const token = window.localStorage.getItem(ADMIN_TOKEN_KEY) || '';
  const adminJson = window.localStorage.getItem(ADMIN_PROFILE_KEY);

  let admin = null;

  if (adminJson) {
    try {
      admin = JSON.parse(adminJson);
    } catch {
      admin = null;
    }
  }

  return { token, admin };
}

export function saveAdminSession({ token, admin }) {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
  window.localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(admin || null));
}

export function clearAdminSession() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_PROFILE_KEY);
}

export async function apiRequest(path, { method = 'GET', token = '', body } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.details = payload?.data || null;
    throw error;
  }

  return payload?.data ?? null;
}

export function fetchEditableContent() {
  return apiRequest('/content');
}

export function saveEditableContent(token, content) {
  return apiRequest('/content', {
    method: 'PUT',
    token,
    body: { content },
  });
}
