import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  isTokenValid?: (token: string) => boolean; // Optional validation function for tokens
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, isTokenValid }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if token exists in localStorage and validate it if needed
    const token = localStorage.getItem('authToken');
    if (token && (!isTokenValid || isTokenValid(token))) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('authToken'); // Remove invalid or expired token
    }
  }, [isTokenValid]);

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};