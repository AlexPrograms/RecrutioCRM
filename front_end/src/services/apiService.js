import axios from 'axios';
import { getAuthHeader } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add logging for debugging
console.log('API Service initialized with base URL:', API_URL);

// Add an interceptor to include auth header for every request
api.interceptors.request.use((config) => {
  console.log(`API Request to: ${config.method?.toUpperCase()} ${config.url}`);
  const headers = getAuthHeader();
  config.headers = {
    ...config.headers,
    ...headers,
  };
  return config;
}, (error) => {
  console.error('API Request error:', error);
  return Promise.reject(error);
});

// Prevent excessive console logging in production
const logApiCalls = process.env.NODE_ENV === 'development';

// Handle token expiration and response logging
api.interceptors.response.use(
  (response) => {
    if (logApiCalls) {
      console.log(`API Response from ${response.config.url}:`, {
        status: response.status,
        statusText: response.statusText
      });
    }
    return response;
  },
  async (error) => {
    // Don't log 401s from API health checks - reduces console noise
    const isHealthCheck = error.config?.url?.includes('/health') || 
                          error.config?.url?.includes('/api/');
    
    if (logApiCalls && (!isHealthCheck || error.response?.status !== 401)) {
      console.error('API Response error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message
      });
    }

    // Only handle 401 errors for non-login endpoints
    if (error.response && error.response.status === 401 && 
        !error.config.url.includes('/auth/token')) {
      
      // Create a flag to prevent infinite redirect loops
      const redirectingToLogin = sessionStorage.getItem('redirecting_to_login');
      
      if (!redirectingToLogin) {
        try {
          // Set the flag to prevent additional redirects while this one is processing
          sessionStorage.setItem('redirecting_to_login', 'true');
          console.warn('Authentication expired, redirecting to login');
          
          // Short delay to allow for potential parallel requests to complete
          setTimeout(() => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            sessionStorage.removeItem('redirecting_to_login');
            window.location.href = '/login';
          }, 300);
          
        } catch (refreshError) {
          console.error('Error during auth handling:', refreshError);
          sessionStorage.removeItem('redirecting_to_login');
        }
      }
    }
    return Promise.reject(error);
  }
);

// API functions for each entity type
export const employeesApi = {
  getAll: () => api.get('/api/employees/'),
  getById: (id) => api.get(`/api/employees/${id}/`),
  create: (data) => api.post('/api/employees/', data),
  update: (id, data) => api.put(`/api/employees/${id}/`, data),
  delete: (id) => api.delete(`/api/employees/${id}/`),
};

export const candidatesApi = {
  getAll: () => api.get('/api/candidates/'),
  getById: (id) => api.get(`/api/candidates/${id}/`),
  create: (data) => api.post('/api/candidates/', data),
  update: (id, data) => api.put(`/api/candidates/${id}/`, data),
  delete: (id) => api.delete(`/api/candidates/${id}/`),
};

export const projectsApi = {
  getAll: () => api.get('/api/projects/'),
  getById: (id) => api.get(`/api/projects/${id}/`),
  create: (data) => api.post('/api/projects/', data),
  update: (id, data) => api.put(`/api/projects/${id}/`, data),
  delete: (id) => api.delete(`/api/projects/${id}/`),
};

export const vacanciesApi = {
  getAll: () => api.get('/api/vacancies/'),
  getById: (id) => api.get(`/api/vacancies/${id}/`),
  create: (data) => api.post('/api/vacancies/', data),
  update: (id, data) => api.put(`/api/vacancies/${id}/`, data),
  delete: (id) => api.delete(`/api/vacancies/${id}/`),
};

// Additional APIs
export const tagsApi = {
  getAll: () => api.get('/api/tags/'),
};

export const statusesApi = {
  getAll: () => api.get('/api/statuses/'),
};

export default {
  employees: employeesApi,
  candidates: candidatesApi,
  projects: projectsApi,
  vacancies: vacanciesApi,
  tags: tagsApi,
  statuses: statusesApi,
};
