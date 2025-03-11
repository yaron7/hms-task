import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  login: (firstName: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    if (storedLoginStatus === 'true') {
      setIsLoggedIn(true);
      const storedFirstName = localStorage.getItem('firstName');
      if (storedFirstName) {
        setUserName(storedFirstName);
      }
    }
    setLoading(false);
  }, []);

  const login = (firstName: string) => {
    setIsLoggedIn(true);
    setUserName(firstName);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('firstName', firstName);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName('');
    localStorage.removeItem('firstName');
    localStorage.removeItem('isLoggedIn');
  };

  const value: AuthContextType = {
    isLoggedIn,
    userName,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};