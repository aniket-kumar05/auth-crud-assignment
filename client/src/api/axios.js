import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Send httpOnly cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

let storeInstance = null;

export const injectStore = (store) => {
  storeInstance = store;
};

// Request Interceptor: Attach access token
api.interceptors.request.use(
  (config) => {
    const token = storeInstance?.getState().auth.accessToken || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & auto refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and request hasn't been retried yet (and not trying to login/register/refresh itself)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/register') &&
      !originalRequest.url.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint (sends httpOnly cookie automatically)
        const res = await axios.post(
          '/api/auth/refresh-token',
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data?.data?.accessToken;
        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);

          // Update Redux state if store is injected
          if (storeInstance) {
            storeInstance.dispatch({
              type: 'auth/setAccessToken',
              payload: newAccessToken,
            });
          }

          // Retry failed request with new access token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        // Refresh token expired or invalid -> logout user
        localStorage.removeItem('accessToken');
        if (storeInstance) {
          storeInstance.dispatch({ type: 'auth/logout/fulfilled' });
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
