import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import { listarRestaurantes } from '../api/restaurante';

const EMOJI_PADRAO = '🍽️';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const [favoritos, setFavoritos] = useState(() => {
    const saved = localStorage.getItem('favoritos_restaurantes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    listarRestaurantes()
      .then(({ data }) => setRestaurantes(data))
      .catch(() => setErro('Não foi possível carregar os restaurantes.'))
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorito = (id) => {
    const novosFavoritos = favoritos.includes(id)
      ? favoritos.filter((favId) => favId !== id)
      : [...favoritos, id];
    setFavoritos(novosFavoritos);
    localStorage.setItem('favoritos_restaurantes', JSON.stringify(novosFavoritos));
  };

  const restaurantesFiltrados = restaurantes.filter((r) =>
    r.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const abrirLoja = (id) => navigate(`/loja/${id}`);

  if (loading) {
    return (
      <div className="home-container">
        <div className="no-results-card">
          <span className="no-results-icon">⏳</span>
          <h4>Carregando restaurantes...</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h2>Fazer um Pedido</h2>
        <p>Escolha o seu restaurante favorito</p>
      </header>

      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Busque por restaurantes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>
      </div>

      {erro && (
        <div className="no-results-card">
          <span className="no-results-icon">⚠️</span>
          <h4>{erro}</h4>
        </div>
      )}

      <div className="section-title-wrapper">
        <h3>Lojas Disponíveis</h3>
        <span className="count-badge">
          {restaurantesFiltrados.length}{' '}
          {restaurantesFiltrados.length === 1 ? 'loja' : 'lojas'}
        </span>
      </div>

      {restaurantesFiltrados.length > 0 ? (
        <div className="grid-lojas animate-fade-in">
          {restaurantesFiltrados.map((loja) => (
            <div key={loja.id} className="loja-card" onClick={() => abrirLoja(loja.id)}>
              <div className="loja-img-wrapper">
                <span className="loja-emoji-banner">{EMOJI_PADRAO}</span>
                <span className={`loja-badge-category ${loja.estaAberto ? '' : 'fechado'}`}>
                  {loja.estaAberto ? 'Aberto' : 'Fechado'}
                </span>
                <button
                  className={`loja-favorite-btn ${favoritos.includes(loja.id) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorito(loja.id);
                  }}
                  title={favoritos.includes(loja.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                >
                  {favoritos.includes(loja.id) ? '❤️' : '🤍'}
                </button>
              </div>
              <div className="loja-card-content">
                <h3>{loja.nome}</h3>
                <div className="loja-meta-info">
                  <span>📍 {loja.endereco}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !erro && (
          <div className="no-results-card">
            <span className="no-results-icon">🔍</span>
            <h4>Nenhuma loja encontrada</h4>
            <p>Tente outro termo de busca.</p>
          </div>
        )
      )}
    </div>
  );
};

export default Home;
