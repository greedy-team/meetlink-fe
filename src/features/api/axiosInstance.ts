import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
//const BASE_URL = '/api';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. 요청 인터셉터: 토큰 주입
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('meeting_token');
    if (token) {
      config.headers['X-Participant-Token'] = token;
    }
    return config;
  },
  (error) => {
    // 요청 전 에러 발생 시 처리
    return Promise.reject(error);
  },
);

// 2. 응답 인터셉터: 권한 에러 처리
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem('meeting_token');
    }
    return Promise.reject(err);
  },
);
