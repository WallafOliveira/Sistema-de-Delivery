import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('auth_usuario');
    return saved ? JSON.parse(saved) : null;
  });

  const salvarUsuario = (dados) => {
    setUsuario(dados);
    localStorage.setItem('auth_usuario', JSON.stringify(dados));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('auth_usuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, salvarUsuario, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
