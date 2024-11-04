import axios from 'axios';

// 환경 변수에서 baseURL을 가져오는 것이 좋습니다
const apiClient = axios.create({
  baseURL: 'https://gummy-dang-server.com/',
  withCredentials: true 
});

// 요청 인터셉터 설정
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('AccessToken');
    if (token) {
      config.headers['Authorization'] = `${token}`; // Bearer와 token 사이에 공백 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;