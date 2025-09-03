import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth';
import errorHandlingService from '../services/errorHandling';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        // Don't set error here, just log it
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await authService.login(credentials);
      setUser(userData);
      return userData;
    } catch (err) {
      const errorObj = errorHandlingService.handleAuthError(err);
      setError(errorObj.message);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newUser = await authService.register(userData);
      setUser(newUser);
      return newUser;
    } catch (err) {
      const errorObj = errorHandlingService.handleAuthError(err);
      setError(errorObj.message);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      const errorObj = errorHandlingService.handleAuthError(err);
      setError(errorObj.message);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const errorObj = errorHandlingService.handleAuthError(err);
      setError(errorObj.message);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.resetPassword(email);
    } catch (err) {
      const errorObj = errorHandlingService.handleAuthError(err);
      setError(errorObj.message);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  // Change password function
  const changePassword = async (passwords) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.changePassword(passwords);
    } catch (err) {
      const errorObj = errorHandlingService.handleAuthError(err);
      setError(errorObj.message);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  // For development/demo purposes, let's add a mock user function
  const setMockUser = (mockUserData) => {
    setUser({
      id: 'mock-user-id',
      name: 'Demo User',
      email: 'demo@example.com',
      subscriptionTier: mockUserData.subscriptionTier || 'free',
      editsRemaining: mockUserData.editsRemaining || 3,
      ...mockUserData
    });
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    changePassword,
    setMockUser // Only for development
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

