import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

// Importando os componentes exatamente com as pastas que você criou
import Home from './Home/home';
import Pedido from './Pedido/pedido';
import Carrinho from './Carinho/carinho';
import Perfil from './Perfil/perfil';
import Favoritos from './Favoritos/favoritos';

// Importando a tela da Loja (certifique-se de ter criado esta pasta e arquivo)
import Loja from './Loja/loja'; 
import Login from './Login/login';

function App() {
  // O useLocation substitui o useState para saber qual menu deve ficar "ativo" com base na URL
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // Trocamos 'id' por 'path' (o caminho real da URL)
  const menuItems = [
    { path: '/', name: 'Início (Lojas)', icon: '🏠' },
    { path: '/favoritos', name: 'Meus Favoritos', icon: '❤️' },
    { path: '/pedido', name: 'Meus Pedidos', icon: '🧾' },
    { path: '/carrinho', name: 'Carrinho', icon: '🛒' },
    { path: '/perfil', name: 'Perfil', icon: '👤' },
  ];

  return (
    <div className="App">
      {/* Menu Lateral - Ocultado na página de login */}
      {!isLoginPage && (
        <aside className="sidebar">
          <div className="sidebar-header">
            <h1>FoodDelivery</h1>
          </div>

          <nav className="sidebar-nav">
            <ul>
              {menuItems.map((item) => (
                <li key={item.path}>
                  {/* Trocamos o <button> pelo <Link> para mudar a URL sem recarregar a página */}
                  <Link
                    to={item.path}
                    className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
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
            <Link to="/login" className="menu-item logout" style={{ width: '100%', textDecoration: 'none' }}>
              <span className="icon">🚪</span> Sair da conta
            </Link>
          </div>
        </aside>
      )}

      {/* Área de Conteúdo Principal */}
      <main className={isLoginPage ? "" : "main-content"} style={isLoginPage ? { marginLeft: 0, padding: 0 } : {}}>
        {/* O switch do useState foi substituído pelo <Routes> do React Router */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loja/:id" element={<Loja />} /> {/* Rota dinâmica para a loja */}
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/pedido" element={<Pedido />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;