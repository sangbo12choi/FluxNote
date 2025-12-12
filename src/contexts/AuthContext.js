import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// API 기본 URL 설정
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 로컬 스토리지에서 사용자 정보 불러오기
  useEffect(() => {
    const savedUser = localStorage.getItem('fluxnote-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        // 서버에서 사용자 정보 확인 (선택사항)
        // verifyUser(userData.id);
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('fluxnote-user');
      }
    }
    setLoading(false);
  }, []);

  // 로그인
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        localStorage.setItem('fluxnote-user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: response.data.error || '로그인에 실패했습니다.' };
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data && error.response.data.error) {
        return { success: false, error: error.response.data.error };
      }
      return { success: false, error: '서버 연결에 실패했습니다. 서버가 실행 중인지 확인해주세요.' };
    }
  };

  // 회원가입
  const signup = async (email, password, name) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
        name
      });

      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        localStorage.setItem('fluxnote-user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: response.data.error || '회원가입에 실패했습니다.' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error.response && error.response.data && error.response.data.error) {
        return { success: false, error: error.response.data.error };
      }
      return { success: false, error: '서버 연결에 실패했습니다. 서버가 실행 중인지 확인해주세요.' };
    }
  };

  // 로그아웃
  const logout = () => {
    setUser(null);
    localStorage.removeItem('fluxnote-user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

