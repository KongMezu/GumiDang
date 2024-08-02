import axios from 'axios';


const apiClient = axios.create({
  baseURL: 'https://gummy-dang.com/', 
  withCredentials: true 
});


apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('AccessToken');
    if (token) {
      config.headers['AccessToken'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
