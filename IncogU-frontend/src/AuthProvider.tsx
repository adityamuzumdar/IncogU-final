import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  university: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  isTokenValid?: (token: string) => boolean; // Optional validation function for tokens
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, isTokenValid }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      if (!isTokenValid || isTokenValid(token)) {
        setIsAuthenticated(true);
        setUser(parsedUser);
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, [isTokenValid]);

  const login = (token: string, user: User) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
