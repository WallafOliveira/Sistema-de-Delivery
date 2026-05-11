import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

// Importando os componentes exatamente com as pastas que você criou
import Home from './Home/home';
import Pedido from './Pedido/pedido';
import Carrinho from './Carinho/carinho';
import Perfil from './Perfil/perfil';

// Importando a tela da Loja (certifique-se de ter criado esta pasta e arquivo)
import Loja from './Loja/loja'; 

function App() {
  // O useLocation substitui o useState para saber qual menu deve ficar "ativo" com base na URL
  const location = useLocation();

  // Trocamos 'id' por 'path' (o caminho real da URL)
  const menuItems = [
    { path: '/', name: 'Início (Lojas)', icon: '🏠' },
    { path: '/pedido', name: 'Meus Pedidos', icon: '🧾' },
    { path: '/carrinho', name: 'Carrinho', icon: '🛒' },
    { path: '/perfil', name: 'Perfil', icon: '👤' },
  ];

  return (
    <div className="App">
      {/* Menu Lateral */}
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
          <button className="menu-item logout" style={{ width: '100%' }}>
            <span className="icon">🚪</span> Sair da conta
          </button>
        </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main className="main-content">
        {/* O switch do useState foi substituído pelo <Routes> do React Router */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loja/:id" element={<Loja />} /> {/* Rota dinâmica para a loja */}
          <Route path="/pedido" element={<Pedido />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;