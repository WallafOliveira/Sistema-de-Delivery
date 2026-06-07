import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './context/AuthContext';
import { useCarrinho } from './context/CarrinhoContext';

import Home from './Home/home';
import Pedido from './Pedido/pedido';
import Carrinho from './Carinho/carinho';
import Perfil from './Perfil/perfil';
import Loja from './Loja/loja';
import Login from './Login/login';
import RestauranteHome from './RestauranteHome/restaurante-home';
import RestauranteCardapio from './RestauranteCardapio/restaurante-cardapio';
import RestaurantePedidos from './RestaurantePedidos/restaurante-pedidos';

const menuCliente = (totalItens) => [
  { path: '/', name: 'Início (Lojas)', icon: '🏠' },
  { path: '/pedido', name: 'Meus Pedidos', icon: '🧾' },
  { path: '/carrinho', name: `Carrinho${totalItens > 0 ? ` (${totalItens})` : ''}`, icon: '🛒' },
  { path: '/perfil', name: 'Perfil', icon: '👤' },
];

const menuRestaurante = [
  { path: '/restaurante', name: 'Dashboard', icon: '📊' },
  { path: '/restaurante/pedidos', name: 'Pedidos Recebidos', icon: '🧾' },
  { path: '/restaurante/cardapio', name: 'Meu Cardápio', icon: '📋' },
  { path: '/perfil', name: 'Perfil', icon: '👤' },
];

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const { totalItens } = useCarrinho();
  const isLoginPage = location.pathname === '/login';

  const isRestaurante = usuario?.tipo === 'restaurante';
  const menuItems = isRestaurante ? menuRestaurante : menuCliente(totalItens);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/' || path === '/restaurante') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="App">
      {!isLoginPage && (
        <aside className="sidebar">
          <div className="sidebar-header">
            <h1>FoodDelivery</h1>
          </div>

          {isRestaurante && (
            <div className="sidebar-user-type">
              <span className="sidebar-user-badge">🍽️ Restaurante</span>
              {usuario?.nome && <span className="sidebar-user-name">{usuario.nome}</span>}
            </div>
          )}

          <nav className="sidebar-nav">
            <ul>
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <span className="icon">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sidebar-footer">
            <button
              className="menu-item logout"
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={handleLogout}
            >
              <span className="icon">🚪</span> Sair da conta
            </button>
          </div>
        </aside>
      )}

      <main className={isLoginPage ? '' : 'main-content'} style={isLoginPage ? { marginLeft: 0, padding: 0 } : {}}>
        <Routes>
          {/* Rotas compartilhadas */}
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} />

          {/* Rotas do cliente */}
          <Route path="/" element={<Home />} />
          <Route path="/loja/:id" element={<Loja />} />
          <Route path="/pedido" element={<Pedido />} />
          <Route path="/carrinho" element={<Carrinho />} />

          {/* Rotas do restaurante */}
          <Route path="/restaurante" element={<RestauranteHome />} />
          <Route path="/restaurante/cardapio" element={<RestauranteCardapio />} />
          <Route path="/restaurante/pedidos" element={<RestaurantePedidos />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
