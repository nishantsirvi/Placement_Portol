import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

const API_URL = 'http://localhost:8000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          // Token expired, try to refresh
          refreshToken();
        }
      } catch (err) {
        console.error('Error decoding token:', err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/login/`, {
        username,
        password
      });

      const { access, refresh, user: userData } = response.data;

      // Store tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Decode and set user
      const decoded = jwtDecode(access);
      setUser({ ...decoded, ...userData });

      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/register/`, userData);

      const { access, refresh, user: newUser } = response.data.tokens
        ? { ...response.data.tokens, user: response.data.user }
        : response.data;

      // Store tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Decode and set user
      const decoded = jwtDecode(access);
      setUser({ ...decoded, ...newUser });

      return { success: true, user: newUser };
    } catch (err) {
      const errorMsg = err.response?.data || 'Registration failed. Please try again.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await axios.post(`${API_URL}/auth/logout/`, {
          refresh_token: refreshToken
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear storage and state regardless of API call success
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) {
        throw new Error('No refresh token');
      }

      const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
        refresh
      });

      const { access } = response.data;
      localStorage.setItem('access_token', access);

      const decoded = jwtDecode(access);
      setUser(decoded);

      return access;
    } catch (err) {
      console.error('Token refresh failed:', err);
      // If refresh fails, logout user
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      return null;
    }
  };

  // Get user profile
  const getProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/auth/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const userData = response.data;
      setUser(prev => ({ ...prev, ...userData }));
      return userData;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const token = localStorage.getItem('access_token');
      const response = await axios.put(`${API_URL}/auth/profile/update/`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updatedUser = response.data.user;
      setUser(prev => ({ ...prev, ...updatedUser }));
      return { success: true, user: updatedUser };
    } catch (err) {
      const errorMsg = err.response?.data || 'Profile update failed.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Change password
  const changePassword = async (oldPassword, newPassword, newPassword2) => {
    try {
      setError(null);
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `${API_URL}/auth/change-password/`,
        {
          old_password: oldPassword,
          new_password: newPassword,
          new_password2: newPassword2
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMsg = err.response?.data || 'Password change failed.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshToken,
    getProfile,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isStudent: user?.role === 'STUDENT',
    isCompany: user?.role === 'COMPANY',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
