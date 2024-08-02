import axios from 'axios';


const apiClient = axios.create({
  baseURL: 'https://gummy-dang.com/', 
  withCredentials: true 
});


apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Authorization');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
