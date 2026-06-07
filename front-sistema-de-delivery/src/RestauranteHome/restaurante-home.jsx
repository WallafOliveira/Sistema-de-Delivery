import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './restaurante-home.css';
import { useAuth } from '../context/AuthContext';
import { listarRestaurantes, buscarRestaurante, listarProdutos, atualizarRestaurante } from '../api/restaurante';
import { listarTodosPedidos } from '../api/pedido';

const RestauranteHome = () => {
  const navigate = useNavigate();
  const { usuario, restauranteId, salvarRestauranteId } = useAuth();

  const [restaurante, setRestaurante] = useState(null);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listaRestaurantes, setListaRestaurantes] = useState([]);
  const [selecionando, setSelecionando] = useState(false);
  const [alterandoStatus, setAlterandoStatus] = useState(false);

  const carregarDados = async (id) => {
    setLoading(true);
    try {
      const [resRest, resProd, resPedidos] = await Promise.allSettled([
        buscarRestaurante(id),
        listarProdutos(id),
        listarTodosPedidos(),
      ]);
      if (resRest.status === 'fulfilled') setRestaurante(resRest.value.data);
      if (resProd.status === 'fulfilled') setTotalProdutos(resProd.value.data.length);
      if (resPedidos.status === 'fulfilled') {
        const meusPedidos = resPedidos.value.data.filter((p) => p.restauranteId === id);
        setPedidos(meusPedidos);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    if (!restaurante || !restauranteId) return;
    setAlterandoStatus(true);
    try {
      const novoStatus = !restaurante.estaAberto;
      await atualizarRestaurante(restauranteId, { ...restaurante, estaAberto: novoStatus });
      setRestaurante((r) => ({ ...r, estaAberto: novoStatus }));
    } finally {
      setAlterandoStatus(false);
    }
  };

  const selecionarRestaurante = (id) => {
    salvarRestauranteId(id);
    setSelecionando(false);
    carregarDados(id);
  };

  useEffect(() => {
    if (!usuario) { navigate('/login'); return; }
    if (usuario.tipo !== 'restaurante') { navigate('/'); return; }

    if (restauranteId) {
      carregarDados(restauranteId);
    } else {
      listarRestaurantes()
        .then(({ data }) => {
          if (data.length === 1) {
            salvarRestauranteId(data[0].id);
            carregarDados(data[0].id);
          } else {
            setListaRestaurantes(data);
            setSelecionando(true);
            setLoading(false);
          }
        })
        .catch(() => setLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  if (loading) {
    return (
      <div className="rest-home-container animate-fade-in">
        <div className="rest-loading-card">
          <span>⏳</span>
          <p>Carregando painel...</p>
        </div>
      </div>
    );
  }

  if (selecionando) {
    return (
      <div className="rest-home-container animate-fade-in">
        <header className="rest-home-header">
          <h2>Selecione seu Restaurante</h2>
          <p>Escolha o restaurante que você gerencia para continuar</p>
        </header>
        <div className="rest-selector-grid">
          {listaRestaurantes.map((r) => (
            <div key={r.id} className="rest-selector-card" onClick={() => selecionarRestaurante(r.id)}>
              <span className="rest-selector-emoji">🍽️</span>
              <h3>{r.nome}</h3>
              <p>{r.endereco}</p>
              <span className={`rest-badge ${r.estaAberto ? 'aberto' : 'fechado'}`}>
                {r.estaAberto ? 'Aberto' : 'Fechado'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const pedidosAtivos = pedidos.filter(p => p.status !== 'Entregue' && p.status !== 'Cancelado');
  const pedidosFinalizados = pedidos.filter(p => p.status === 'Entregue');
  const receitaTotal = pedidosFinalizados.reduce((acc, p) => acc + Number(p.valorTotal || 0), 0);

  return (
    <div className="rest-home-container animate-fade-in">
      <header className="rest-home-header">
        <div className="rest-home-header-left">
          <span className="rest-home-avatar">🍽️</span>
          <div>
            <h2>{restaurante?.nome || 'Meu Restaurante'}</h2>
            <p>📍 {restaurante?.endereco || 'Endereço não disponível'}</p>
          </div>
        </div>
        <button
          className={`rest-toggle-btn ${restaurante?.estaAberto ? 'aberto' : 'fechado'}`}
          onClick={toggleStatus}
          disabled={alterandoStatus}
          title={restaurante?.estaAberto ? 'Clique para fechar o restaurante' : 'Clique para abrir o restaurante'}
        >
          <span className="rest-toggle-dot" />
          {alterandoStatus ? 'Alterando...' : restaurante?.estaAberto ? 'Aberto' : 'Fechado'}
        </button>
      </header>

      <div className="rest-stats-grid">
        <div className="rest-stat-card">
          <span className="stat-icon">🛒</span>
          <div>
            <p className="stat-label">Pedidos em andamento</p>
            <h3 className="stat-value">{pedidosAtivos.length}</h3>
          </div>
        </div>
        <div className="rest-stat-card">
          <span className="stat-icon">✅</span>
          <div>
            <p className="stat-label">Pedidos entregues</p>
            <h3 className="stat-value">{pedidosFinalizados.length}</h3>
          </div>
        </div>
        <div className="rest-stat-card">
          <span className="stat-icon">🍴</span>
          <div>
            <p className="stat-label">Itens no cardápio</p>
            <h3 className="stat-value">{totalProdutos}</h3>
          </div>
        </div>
        <div className="rest-stat-card">
          <span className="stat-icon">💰</span>
          <div>
            <p className="stat-label">Receita total</p>
            <h3 className="stat-value">R$ {receitaTotal.toFixed(2).replace('.', ',')}</h3>
          </div>
        </div>
      </div>

      <div className="rest-quick-actions">
        <h3>Acesso Rápido</h3>
        <div className="rest-actions-grid">
          <button className="rest-action-card" onClick={() => navigate('/restaurante/pedidos')}>
            <span className="action-icon">🧾</span>
            <span className="action-label">Ver Pedidos</span>
            {pedidosAtivos.length > 0 && (
              <span className="action-badge">{pedidosAtivos.length}</span>
            )}
          </button>
          <button className="rest-action-card" onClick={() => navigate('/restaurante/cardapio')}>
            <span className="action-icon">📋</span>
            <span className="action-label">Meu Cardápio</span>
          </button>
          <button className="rest-action-card" onClick={() => navigate('/perfil')}>
            <span className="action-icon">👤</span>
            <span className="action-label">Meu Perfil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestauranteHome;
