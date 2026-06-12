import axios from 'axios';

const BASE = 'http://localhost:3001/api';

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
    // Never try to refresh/redirect for the auth endpoints themselves —
    // a 401 from /auth/refresh just means the user is anonymous.
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
