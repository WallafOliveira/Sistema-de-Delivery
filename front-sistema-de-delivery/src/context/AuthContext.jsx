import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('auth_usuario');
    return saved ? JSON.parse(saved) : null;
  });

  const [restauranteId, setRestauranteId] = useState(() => {
    const saved = localStorage.getItem('auth_usuario');
    if (saved) {
      const u = JSON.parse(saved);
      return u.restauranteId || localStorage.getItem('auth_restaurante_id') || null;
    }
    return localStorage.getItem('auth_restaurante_id') || null;
  });

  const salvarUsuario = (dados) => {
    setUsuario(dados);
    localStorage.setItem('auth_usuario', JSON.stringify(dados));
    // extrai restauranteId do payload do login, se vier
    if (dados.restauranteId) {
      setRestauranteId(dados.restauranteId);
      localStorage.setItem('auth_restaurante_id', dados.restauranteId);
    }
  };

  const salvarRestauranteId = (id) => {
    setRestauranteId(id);
    localStorage.setItem('auth_restaurante_id', id);
  };

  const logout = () => {
    setUsuario(null);
    setRestauranteId(null);
    localStorage.removeItem('auth_usuario');
    localStorage.removeItem('auth_restaurante_id');
  };

  return (
    <AuthContext.Provider value={{ usuario, salvarUsuario, restauranteId, salvarRestauranteId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
