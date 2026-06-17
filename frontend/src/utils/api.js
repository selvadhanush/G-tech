import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5050/api',
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gtech_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('gtech_refresh_token');
      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
          token: refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('gtech_access_token', accessToken);
        localStorage.setItem('gtech_refresh_token', newRefreshToken);

        isRefreshing = false;
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        
        // Clear local storage and log out
        localStorage.removeItem('gtech_access_token');
        localStorage.removeItem('gtech_refresh_token');
        window.dispatchEvent(new Event('auth_logout'));
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
