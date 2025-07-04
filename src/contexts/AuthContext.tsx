
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  fullName: string;
  email: string;
  ktpNumber: string;
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
  role: 'customer' | 'admin';
  loanLimit: number;
  loanBalance: number;
  savingsBalance: number;
  isBlocked: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  ktpNumber: string;
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loginUser = localStorage.getItem('loginUser');
    if (loginUser) {
      setUser(JSON.parse(loginUser));
    }
    
    // Initialize admin user if not exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminExists = users.find((u: User) => u.email === 'admin@smartpay.com');
    if (!adminExists) {
      const adminUser: User = {
        id: 'admin-1',
        fullName: 'Admin SmartPAY',
        email: 'admin@smartpay.com',
        ktpNumber: '0000000000000000',
        accountNumber: '0000000000',
        bankName: 'Bank Admin',
        accountHolderName: 'Admin SmartPAY',
        role: 'admin',
        loanLimit: 0,
        loanBalance: 0,
        savingsBalance: 0,
        isBlocked: false,
        createdAt: new Date().toISOString()
      };
      users.push(adminUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Store admin password
      const passwords = JSON.parse(localStorage.getItem('passwords') || '{}');
      passwords['admin@smartpay.com'] = '123456';
      localStorage.setItem('passwords', JSON.stringify(passwords));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const passwords = JSON.parse(localStorage.getItem('passwords') || '{}');
    
    const foundUser = users.find(u => u.email === email);
    if (foundUser && passwords[email] === password && !foundUser.isBlocked) {
      setUser(foundUser);
      localStorage.setItem('loginUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const passwords = JSON.parse(localStorage.getItem('passwords') || '{}');
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      return false;
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: userData.fullName,
      email: userData.email,
      ktpNumber: userData.ktpNumber,
      accountNumber: userData.accountNumber,
      bankName: userData.bankName,
      accountHolderName: userData.accountHolderName,
      role: 'customer',
      loanLimit: 7000000, // Default 7 million
      loanBalance: 0,
      savingsBalance: 0,
      isBlocked: false,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    passwords[userData.email] = userData.password;
    
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('passwords', JSON.stringify(passwords));
    
    // Auto login after registration
    setUser(newUser);
    localStorage.setItem('loginUser', JSON.stringify(newUser));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('loginUser');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('loginUser', JSON.stringify(updatedUser));
      
      // Update in users array
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
