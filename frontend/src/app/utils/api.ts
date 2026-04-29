const SESSION_KEY = 'bridge-86-51-auth-session';

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  institution?: string;
  rollNumber?: string;
  role?: string;
  joinedAt?: string;
}

export const getStoredAuthToken = () => {
  const saved = localStorage.getItem(SESSION_KEY);
  if (!saved) return null;

  try {
    return JSON.parse(saved).token || null;
  } catch {
    return null;
  }
};

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredAuthToken();
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data as T;
}
