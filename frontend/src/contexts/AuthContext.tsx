import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AuthUser } from '../types/user';
import { loginSuccess, logout } from '../store/slices/authSlice';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for stored token and validate it
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        dispatch(loginSuccess(userData));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, [dispatch]);

  const login = (userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem('token', userData.token || '');
    localStorage.setItem('user', JSON.stringify(userData));
    dispatch(loginSuccess(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(logout());
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout: logoutUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 