import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login/', { username, password });
      const { access, refresh, user: userData, profile: profileData } = res.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_data', JSON.stringify(userData));
      localStorage.setItem('user_profile', JSON.stringify(profileData));

      setToken(access);
      setUser(userData);
      setProfile(profileData);
      return { success: true, user: userData };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Login failed. Please check credentials.'
      };
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = async (role) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/quick-demo/', { role });
      const { access, refresh, user: userData, profile: profileData } = res.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_data', JSON.stringify(userData));
      localStorage.setItem('user_profile', JSON.stringify(profileData));

      setToken(access);
      setUser(userData);
      setProfile(profileData);
      return { success: true, user: userData };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Demo login failed.'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register/', formData);
      const { access, refresh, user: userData } = res.data;

      if (access) {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setToken(access);
        setUser(userData);
      }
      return { success: true, user: userData };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Registration failed.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_profile');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfileState = (newProfile) => {
    setProfile(newProfile);
    localStorage.setItem('user_profile', JSON.stringify(newProfile));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        login,
        quickDemoLogin,
        register,
        logout,
        updateProfileState,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
