import axios from "axios";
const LOGIN_URL = import.meta.env.VITE_LOGIN_URI;

export const axiosLogin = axios.create({
  baseURL: LOGIN_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Frontend-Domain": window.location.hostname,
  },
});

// export const axiosOther = axios.create({
//   baseURL: LOGIN_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

export const axiosOther = axios.create({
  baseURL: LOGIN_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Frontend-Domain": window.location.hostname,
  },
});

axiosOther.interceptors.request.use(
  (config) => {
    const storedData = localStorage.getItem("token");
    const credentials = JSON.parse(storedData);

    if (credentials?.token) {
      config.headers["Authorization"] = `Bearer ${credentials?.token}`; // Add token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors globally
axiosOther.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response && error.response.status === 401) ||
      error.response.status === 403
    ) {
      if (error.response.data.status == -2 || error.response.data.status == 0) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
