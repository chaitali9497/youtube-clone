import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // https://youtube-clone-5-p6cw.onrender.com/api
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // token MUST be stored separately
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
