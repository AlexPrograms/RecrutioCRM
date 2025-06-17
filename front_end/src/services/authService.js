import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const login = async (email, password) => {
  try {
    console.log('Attempting login with:', { email });
    
    // Use an absolute URL with full path to avoid any routing issues
    const fullUrl = `${API_URL}/api/auth/token/`;
    
    // Based on our debugging, we found the correct authentication format
    // for the Django backend is using the email field
    const payload = {
      email: email,
      password: password
    };
    
    // Send authentication request
    const response = await axios.post(
      fullUrl,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    
    console.log('Login response received');

    
    console.log('Login response:', response.data);
    
    // Django typically returns access and refresh tokens
    if (response.data && (response.data.access || response.data.token)) {
      // Store the tokens - handle different formats
      const accessToken = response.data.access || response.data.token;
      localStorage.setItem('access_token', accessToken);
      
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }
      
      // Log the stored tokens to verify they are correctly stored
      console.log('Tokens stored successfully. Access token exists:', 
                 !!localStorage.getItem('access_token'));
                 
      return { success: true };
    }
    
    console.warn('No access token found in response:', response.data);
    return { 
      success: false, 
      error: response.data?.detail || 'No access token received' 
    };
    
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      url: error.config?.url,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    // Enhanced error reporting with specific messages for common errors
    let errorMessage;
    
    if (error.response?.status === 400) {
      errorMessage = 'Invalid credentials format. Please check your username/email format.';
    } else if (error.response?.status === 401) {
      errorMessage = 'Invalid credentials. Please check your username/email and password.';
    } else {
      errorMessage = error.response?.data?.detail || 
               error.response?.data?.error ||
               error.response?.data?.message || 
               error.message ||
               'Login failed. Please check your credentials and try again.';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    return { success: false, error: 'No refresh token available' };
  }

  try {
    const response = await axios.post(
      `${API_URL}/api/auth/token/refresh/`,
      { refresh: refreshToken }
    );

    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }
      return { success: true };
    }
    return { success: false, error: 'No access token received' };
  } catch (error) {
    console.error('Token refresh failed:', error);
    logout();
    return { success: false, error: 'Session expired. Please log in again.' };
  }
};
