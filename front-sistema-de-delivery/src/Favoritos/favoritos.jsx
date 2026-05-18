import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { todasLojas } from '../data/lojas';
import './favoritos.css';

const Favoritos = () => {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);

  // Carrega os favoritos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favoritos_restaurantes');
    if (saved) {
      setFavoritos(JSON.parse(saved));
    }
  }, []);

  // Remove um restaurante dos favoritos
  const removerFavorito = (e, id) => {
    e.stopPropagation(); // Evita que clique no card abra a loja
    const novosFavoritos = favoritos.filter(favId => favId !== id);
    setFavoritos(novosFavoritos);
    localStorage.setItem('favoritos_restaurantes', JSON.stringify(novosFavoritos));
  };

  // Filtra as lojas que estão favoritadas
  const lojasFavoritadas = todasLojas.filter(loja => favoritos.includes(loja.id));

  const abrirLoja = (idDaLoja) => {
    navigate(`/loja/${idDaLoja}`);
  };

  return (
    <div className="favoritos-container animate-fade-in">
      <header className="favoritos-header">
        <h2>Meus Favoritos</h2>
        <p>Acesse rapidamente os restaurantes que você mais ama</p>
      </header>

      {lojasFavoritadas.length > 0 ? (
        <div className="favoritos-section">
          <div className="section-title-wrapper">
            <h3>Restaurantes Salvos</h3>
            <span className="count-badge-fav">{lojasFavoritadas.length} {lojasFavoritadas.length === 1 ? 'salvo' : 'salvos'}</span>
          </div>

          <div className="grid-lojas-favoritas">
            {lojasFavoritadas.map((loja) => (
              <div key={loja.id} className="loja-card-fav" onClick={() => abrirLoja(loja.id)}>
                <div className="loja-img-wrapper-fav">
                  <span className="loja-emoji-banner-fav">{loja.img}</span>
                  <span className="loja-badge-category-fav">{loja.categoria}</span>
                  <button 
                    className="loja-favorite-btn-fav active"
                    onClick={(e) => removerFavorito(e, loja.id)}
                    title="Remover dos Favoritos"
                  >
                    ❤️
                  </button>
                </div>
                <div className="loja-card-content-fav">
                  <h3>{loja.nome}</h3>
                  <div className="loja-meta-info-fav">
                    <span className="loja-rating-fav">⭐ {loja.nota}</span>
                    <span className="dot-divider-fav">•</span>
                    <span>{loja.tempo}</span>
                    <span className="dot-divider-fav">•</span>
                    <span className="loja-delivery-price-fav">
                      {loja.frete === 'Grátis' ? 'Frete grátis' : loja.frete}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-favorites-card animate-scale-up">
          <div className="empty-heart-icon-wrapper">
            <span className="empty-heart-emoji">💔</span>
          </div>
          <h4>Sua lista de favoritos está vazia</h4>
          <p>
            Você ainda não salvou nenhum restaurante. Navegue pela página inicial, explore o cardápio e adicione os melhores aos seus favoritos!
          </p>
          <button className="btn-explore-stores" onClick={() => navigate('/')}>
            Explorar Restaurantes
          </button>
        </div>
      )}
    </div>
  );
};

export default Favoritos;
