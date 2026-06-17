import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleAuthLogout = () => {
      setUser(null);
    };

    window.addEventListener('auth_logout', handleAuthLogout);

    const token = localStorage.getItem('gtech_access_token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }

    return () => {
      window.removeEventListener('auth_logout', handleAuthLogout);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user: userData } = response.data;
      
      localStorage.setItem('gtech_access_token', accessToken);
      localStorage.setItem('gtech_refresh_token', refreshToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.'
      };
    }
  };

  const register = async (name, email, phone, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, phone, password });
      const { accessToken, refreshToken, user: userData } = response.data;

      localStorage.setItem('gtech_access_token', accessToken);
      localStorage.setItem('gtech_refresh_token', refreshToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('gtech_refresh_token');
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { token: refreshToken });
      }
    } catch (err) {
      console.warn('Logout request failed:', err);
    } finally {
      localStorage.removeItem('gtech_access_token');
      localStorage.removeItem('gtech_refresh_token');
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return { success: true, resetToken: response.data.resetToken, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reset link.'
      };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password.'
      };
    }
  };

  const updateProfile = async (data) => {
    try {
      setUser(prev => ({ ...prev, ...data }));
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Update failed.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'GTECH_ADMIN'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
