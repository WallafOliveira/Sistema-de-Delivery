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

  useEffect(() => {
    listarRestaurantes()
      .then(({ data }) => setRestaurantes(data))
      .catch(() => setErro('Não foi possível carregar os restaurantes.'))
      .finally(() => setLoading(false));
  }, []);

  const restaurantesFiltrados = restaurantes.filter((r) =>
    r.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const abertos = restaurantesFiltrados.filter((r) => r.estaAberto);
  const fechados = restaurantesFiltrados.filter((r) => !r.estaAberto);

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

      {restaurantesFiltrados.length === 0 && !erro && (
        <div className="no-results-card">
          <span className="no-results-icon">🔍</span>
          <h4>Nenhuma loja encontrada</h4>
          <p>Tente outro termo de busca.</p>
        </div>
      )}

      {abertos.length > 0 && (
        <>
          <div className="section-title-wrapper">
            <h3 className="section-title-abertos">
              <span className="dot-live" /> Abertos Agora
            </h3>
            <span className="count-badge">{abertos.length} {abertos.length === 1 ? 'loja' : 'lojas'}</span>
          </div>
          <div className="grid-lojas animate-fade-in">
            {abertos.map((loja) => (
              <div key={loja.id} className="loja-card" onClick={() => abrirLoja(loja.id)}>
                <div className="loja-img-wrapper">
                  {loja.logo
                    ? <img src={loja.logo} alt={loja.nome} className="loja-logo-img" />
                    : <span className="loja-emoji-banner">{EMOJI_PADRAO}</span>}
                  <span className="loja-badge-category">Aberto</span>
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
        </>
      )}

      {fechados.length > 0 && (
        <>
          <div className="section-title-wrapper" style={{ marginTop: abertos.length > 0 ? '2rem' : '0' }}>
            <h3>Fechados</h3>
            <span className="count-badge">{fechados.length} {fechados.length === 1 ? 'loja' : 'lojas'}</span>
          </div>
          <div className="grid-lojas animate-fade-in grid-lojas-fechados">
            {fechados.map((loja) => (
              <div key={loja.id} className="loja-card loja-card-fechada" onClick={() => abrirLoja(loja.id)}>
                <div className="loja-img-wrapper">
                  {loja.logo
                    ? <img src={loja.logo} alt={loja.nome} className="loja-logo-img" />
                    : <span className="loja-emoji-banner">{EMOJI_PADRAO}</span>}
                  <span className="loja-badge-category fechado">Fechado</span>
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
        </>
      )}
    </div>
  );
};

export default Home;
