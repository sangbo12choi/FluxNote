import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

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
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    }
    setLoading(false);
  }, []);

  // 로그인
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('fluxnote-users') || '[]');
    const foundUser = users.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name
      };
      setUser(userData);
      localStorage.setItem('fluxnote-user', JSON.stringify(userData));
      return { success: true };
    } else {
      return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    }
  };

  // 회원가입
  const signup = (email, password, name) => {
    const users = JSON.parse(localStorage.getItem('fluxnote-users') || '[]');
    
    // 이메일 중복 확인
    if (users.find(u => u.email === email)) {
      return { success: false, error: '이미 사용 중인 이메일입니다.' };
    }

    // 새 사용자 생성
    const newUser = {
      id: Date.now(),
      email,
      password, // 실제 프로덕션에서는 해시화해야 함
      name,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('fluxnote-users', JSON.stringify(users));

    // 자동 로그인
    const userData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    };
    setUser(userData);
    localStorage.setItem('fluxnote-user', JSON.stringify(userData));

    return { success: true };
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

