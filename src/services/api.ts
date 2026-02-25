import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!localStorage.getItem('accessToken')
    });
    
    const token = localStorage.getItem('accessToken');
    if (token) {
      console.log('🔑 Setting Authorization header with token');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No accessToken found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response Success:', {
      url: response.config.url,
      status: response.status
    });
    return response;
  },
  async (error) => {
    console.error('❌ API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔐 401 Unauthorized detected, attempting to refresh token');
      originalRequest._retry = true;

      try {
        console.log('🔄 Making refresh token request to /auth/login/access-token');
        
        const response = await axios.post(
          `${API_URL}/auth/login/access-token`,
          {},
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('🔄 Refresh token response:', response.data);
        const { accessToken } = response.data;
        
        if (accessToken) {
          console.log('💾 Saving new accessToken to localStorage');
          localStorage.setItem('accessToken', accessToken);
          
          console.log('🔄 Retrying original request with new token');
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          return api(originalRequest);
        } else {
          throw new Error('No accessToken in refresh response');
        }

      } catch (refreshError: any) {
        console.error('❌ Refresh token failed:', {
          message: refreshError.message,
          status: refreshError.response?.status,
          data: refreshError.response?.data
        });
        
 
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        

        if (!window.location.pathname.includes('/auth')) {
          window.location.href = '/auth';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const handleApiError = (error: any): string => {
  console.error('🛑 API Error:', error);
  
  if (error.response?.data?.message) {
    if (Array.isArray(error.response.data.message)) {
      return error.response.data.message.join(', ');
    }
    return error.response.data.message;
  }
  
  return error.message || 'Произошла ошибка';
};