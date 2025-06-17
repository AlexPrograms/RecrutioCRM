import axios from 'axios';
import { refreshToken } from '../services/authService';

// Use environment variable if available, otherwise default to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

console.log('API Base URL:', API_URL);

// Debug token storage for troubleshooting
const logTokenStatus = () => {
  const accessToken = localStorage.getItem('access_token');
  const refreshTokenValue = localStorage.getItem('refresh_token');
  console.log('Token status - Access:', !!accessToken, 'Refresh:', !!refreshTokenValue);
};

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending cookies with CORS
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Log token status for debugging
    logTokenStatus();
    
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`Adding auth header for ${config.url}`, { header: `Bearer ${token.substring(0, 10)}...` });
    } else {
      console.log(`No auth token available for request to ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging (uncomment if needed)
    // console.log('API Response Success:', {
    //   url: response.config.url,
    //   status: response.status,
    // });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      console.error('No config in error object');
      return Promise.reject(new Error('Invalid error structure'));
    }

    // Log detailed error information for debugging
    if (error.response) {
      console.error(`API Error (${error.response.status}) for ${originalRequest.url}:`, {
        url: originalRequest.url,
        method: originalRequest.method,
        status: error.response.status,
        data: error.response.data,
        headers: originalRequest.headers,
      });
    } else if (error.request) {
      console.error(`Network Error for ${originalRequest.url}:`, {
        url: originalRequest.url,
        method: originalRequest.method,
        request: error.request,
      });
      error.message = 'No response from server. Please check your connection.';
    } else {
      console.error(`Request Error for ${originalRequest?.url || 'unknown'}:`, {
        message: error.message,
      });
    }

    // Handle 401 Unauthorized - Token refresh logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Attempting token refresh...');
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const result = await refreshToken();
        console.log('Token refresh result:', result);
        
        if (result.success) {
          // Update the authorization header with new token
          const newToken = localStorage.getItem('access_token');
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          console.log('Retrying request with new token:', originalRequest.url);
          
          // Retry the original request with new token
          return api(originalRequest);
        } else {
          console.log('Token refresh failed, redirecting to login');
          // If refresh fails, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(new Error('Session expired. Please log in again.'));
        }
      } catch (refreshError) {
        console.error('Token refresh exception:', refreshError);
        // If refresh fails, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please log in again.'));
      }
    }

    // For other errors, enhance the error with more context
    if (error.response?.data) {
      const errorMessage = 
        error.response.data.error || 
        error.response.data.detail || 
        error.message || 
        'An unexpected error occurred.';
      
      console.error(`Enhanced error message: ${errorMessage}`);
      
      const enhancedError = new Error(errorMessage);
      enhancedError.response = error.response;
      enhancedError.status = error.response.status;
      return Promise.reject(enhancedError);
    }

    return Promise.reject(error);
  }
);

/**
 * RAG API methods
 */
export const ragApi = {
  /**
   * Query the RAG API with a question
   * @param {string} question - The user's question
   * @param {number} limit - Maximum number of results to return (default: 5)
   * @returns {Promise<Object>} - The response data
   */
  query: async (question, limit = 5) => {
    try {
      const response = await api.post('/api/rag/query/', { question, limit });
      return response.data;
    } catch (error) {
      console.error('RAG API Error:', error);
      throw error; // Re-throw the enhanced error
    }
  },
};

/**
 * Make a generic API request
 * @param {string} method - HTTP method (get, post, put, delete, etc.)
 * @param {string} url - The API endpoint URL
 * @param {Object} [data] - The request payload (for POST/PUT requests)
 * @param {Object} [config] - Additional axios config options
 * @returns {Promise<Object>} - The response data
 */
export const apiRequest = async (method, url, data = null, config = {}) => {
  try {
    const response = await api({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`API Request Error (${method} ${url}):`, error);
    throw error; // Re-throw the enhanced error
  }
};

// For backward compatibility
export const ragQuery = ragApi.query;

export default api;
