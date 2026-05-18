import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importe o hook
import './home.css';

const Home = () => {
  const navigate = useNavigate(); // Inicialize o hook
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFreeDelivery, setOnlyFreeDelivery] = useState(false);

  // Categorias estilo iFood
  const categorias = [
    { id: 'Todos', nome: 'Todos', emoji: '🍽️', color: 'rgba(220, 38, 38, 0.1)' },
    { id: 'Lanches', nome: 'Lanches', emoji: '🍔', color: 'rgba(249, 115, 22, 0.1)' },
    { id: 'Pizzaria', nome: 'Pizzas', emoji: '🍕', color: 'rgba(234, 179, 8, 0.1)' },
    { id: 'Padaria', nome: 'Padaria', emoji: '🍞', color: 'rgba(16, 185, 129, 0.1)' },
    { id: 'Doces & Bolos', nome: 'Doces', emoji: '🍰', color: 'rgba(236, 72, 153, 0.1)' },
    { id: 'Japonesa', nome: 'Japonesa', emoji: '🍣', color: 'rgba(14, 165, 233, 0.1)' },
    { id: 'Saudável', nome: 'Saudável', emoji: '🥗', color: 'rgba(34, 197, 94, 0.1)' },
    { id: 'Bebidas', nome: 'Bebidas', emoji: '🥤', color: 'rgba(168, 85, 247, 0.1)' },
  ];

  // Dados reais e dinâmicos de lojas com categorias associadas
  const todasLojas = [
    { id: 1, nome: 'Burger House', categoria: 'Lanches', img: '🍔', nota: '4.8', tempo: '20-30 min', frete: 'Grátis' },
    { id: 2, nome: 'Bella Pizza', categoria: 'Pizzaria', img: '🍕', nota: '4.9', tempo: '30-40 min', frete: 'R$ 4,90' },
    { id: 3, nome: 'Pão de Ouro Padaria', categoria: 'Padaria', img: '🍞', nota: '4.7', tempo: '15-25 min', frete: 'R$ 2,90' },
    { id: 4, nome: 'Doce Sonho Confeitaria', categoria: 'Doces & Bolos', img: '🍰', nota: '4.6', tempo: '25-35 min', frete: 'R$ 5,00' },
    { id: 5, nome: 'Sushi Hakura', categoria: 'Japonesa', img: '🍣', nota: '4.9', tempo: '40-50 min', frete: 'Grátis' },
    { id: 6, nome: 'Green Salads', categoria: 'Saudável', img: '🥗', nota: '4.5', tempo: '20-30 min', frete: 'R$ 3,90' },
    { id: 7, nome: 'Adega Imperial', categoria: 'Bebidas', img: '🥤', nota: '4.8', tempo: '10-20 min', frete: 'R$ 1,99' },
    { id: 8, nome: 'Texas Grill & Burger', categoria: 'Lanches', img: '🍔', nota: '4.7', tempo: '25-35 min', frete: 'Grátis' },
  ];
  
  // Filtragem de lojas com base na categoria selecionada, texto de pesquisa e frete grátis
  const lojasFiltradas = todasLojas.filter(loja => {
    const matchesCategory = selectedCategory === 'Todos' || loja.categoria === selectedCategory;
    const matchesSearch = loja.nome.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFreeDelivery = !onlyFreeDelivery || loja.frete === 'Grátis';
    return matchesCategory && matchesSearch && matchesFreeDelivery;
  });

  // Função que será chamada ao clicar no card da loja
  const abrirLoja = (idDaLoja) => {
    navigate(`/loja/${idDaLoja}`);
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <h2>Fazer um Pedido</h2>
        <p>Escolha o seu restaurante favorito</p>
      </header>

      {/* Barra de Pesquisa */}
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

      {/* Filtros Rápidos (Pills) */}
      <div className="quick-filters-container">
        <button 
          className={`filter-pill ${onlyFreeDelivery ? 'active' : ''}`}
          onClick={() => setOnlyFreeDelivery(!onlyFreeDelivery)}
        >
          <span className="filter-pill-icon">🚚</span>
          Frete Grátis
        </button>
      </div>

      {/* Carrossel de Filtros de Categoria estilo iFood */}
      <div className="categories-scroll-wrapper">
        <div className="categories-list">
          {categorias.map((cat) => (
            <div 
              key={cat.id} 
              className={`category-card ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <div className="category-emoji-box" style={{ backgroundColor: cat.color }}>
                <span className="category-emoji">{cat.emoji}</span>
              </div>
              <span className="category-name">{cat.nome}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid de Lojas Disponíveis */}
      <div className="section-title-wrapper">
        <h3>{selectedCategory === 'Todos' ? 'Lojas Disponíveis' : `Categoria: ${selectedCategory}`}</h3>
        <span className="count-badge">{lojasFiltradas.length} {lojasFiltradas.length === 1 ? 'loja' : 'lojas'}</span>
      </div>

      {lojasFiltradas.length > 0 ? (
        <div className="grid-lojas animate-fade-in">
          {lojasFiltradas.map((loja) => (
            <div key={loja.id} className="loja-card" onClick={() => abrirLoja(loja.id)}>
              <div className="loja-img-wrapper">
                <span className="loja-emoji-banner">{loja.img}</span>
                <span className="loja-badge-category">{loja.categoria}</span>
              </div>
              <div className="loja-card-content">
                <h3>{loja.nome}</h3>
                <div className="loja-meta-info">
                  <span className="loja-rating">⭐ {loja.nota}</span>
                  <span className="dot-divider">•</span>
                  <span>{loja.tempo}</span>
                  <span className="dot-divider">•</span>
                  <span className="loja-delivery-price">{loja.frete === 'Grátis' ? 'Frete grátis' : loja.frete}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results-card">
          <span className="no-results-icon">🔍</span>
          <h4>Nenhuma loja encontrada</h4>
          <p>Não encontramos lojas na categoria {selectedCategory} no momento.</p>
        </div>
      )}
    </div>
  );
};

export default Home;