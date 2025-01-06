import { axiosClient } from './axiosClient';

const TOKEN_KEY = 'vedaToken';
const REFRESH_TOKEN_KEY = 'vedaRefreshToken';

export const authService = {
  async login(username, password) {
    try {
      // Using URLSearchParams to match FastAPI's form-data expectation
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axiosClient.post('/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      const { access_token } = response.data;
      localStorage.setItem(TOKEN_KEY, access_token);
      
      // Update axios client headers
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to login');
    }
  },

  async getCurrentUser() {
    try {
      const response = await axiosClient.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    delete axiosClient.defaults.headers.common['Authorization'];
    window.location.href = '/login';
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

export default authService;