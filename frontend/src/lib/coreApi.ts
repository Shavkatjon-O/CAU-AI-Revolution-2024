import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.withCredentials = true;

const coreApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

coreApi.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

coreApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { config, response } = error;

    if (response && response.status === 401 && !config._retry) {
      config._retry = true;
      const refreshToken = Cookies.get("refreshToken");

      try {
        const refreshResponse = await coreApi.post('/users/token/refresh/', {
          refresh: refreshToken,
        });
        const { access, refresh } = refreshResponse.data;

        Cookies.set("accessToken", access);
        Cookies.set("refreshToken", refresh);

        config.headers.Authorization = `Bearer ${access}`;

        return coreApi(config);
      } catch (refreshError) {
        console.log('Refresh token error:', refreshError);

        window.location.href = '/sign-in';
        
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default coreApi;