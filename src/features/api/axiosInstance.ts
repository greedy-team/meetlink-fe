import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

//axios 인스턴스로 매번 작성해야 되는 로직을 고정
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});
