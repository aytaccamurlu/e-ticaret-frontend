import axios from "axios";
import type { AxiosError, AxiosRequestConfig } from "axios";

const API_URL = "https://e-ticaret-backend-z8z7.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
});

// Her istekte localStorage'daki JWT token'ı otomatik ekleyelim
api.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export default api;
