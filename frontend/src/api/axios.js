import axios from 'axios';

// In development the Vite dev server proxies /api → localhost:3001.
// In production the Express server serves both the API and the built frontend
// from the same origin, so /api works without any hardcoded host.
const BASE = '/api';

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const url = original?.url || '';
    const isAuthCall = url.includes('/auth/refresh') || url.includes('/auth/login');

    if (err.response?.status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        const { data } = await axios.post(`${BASE}/auth/refresh`, {}, { withCredentials: true });
        setAccessToken(data.accessToken);
        original.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        setAccessToken(null);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
