import axios from 'axios';

// Axios 인스턴스를 생성합니다.
const apiClient = axios.create({
  baseURL: 'https://gummy-dang.com/', // 여기에 API 서버의 기본 URL을 입력합니다.
  withCredentials: true // 쿠키를 요청에 포함하도록 설정합니다.
});

// 요청 인터셉터를 사용하여 인증 토큰을 자동으로 첨부합니다.
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
