import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './loja.css';
import RestauranteService from '../services/restaurante.service';
import ProdutoService from '../services/produto.service';
import { adicionarAoCarrinho, getTotalItens } from '../utils/cart';
import { formatarMoeda } from '../utils/formatters';
import { isLogado } from '../utils/auth';

const Loja = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurante, setRestaurante] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [totalCarrinho, setTotalCarrinho] = useState(getTotalItens());
  const [adicionando, setAdicionando] = useState(null); // id do produto sendo adicionado

  useEffect(() => {
    async function carregar() {
      try {
        const [rest, prods] = await Promise.all([
          RestauranteService.buscarPorId(id),
          ProdutoService.listarPorRestaurante(id),
        ]);
        setRestaurante(rest);
        // Filtra apenas produtos com estoque > 0
        setProdutos((prods || []).filter((p) => p.quantidade > 0));
      } catch (e) {
        setErro(e.message || 'Não foi possível carregar o cardápio.');
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [id]);

  const handleAdicionar = (produto) => {
    if (!isLogado()) {
      navigate('/login');
      return;
    }
    setAdicionando(produto.id);
    adicionarAoCarrinho(produto, restaurante.id, restaurante.nome);
    setTotalCarrinho(getTotalItens());
    setTimeout(() => setAdicionando(null), 600);
  };

  if (loading) {
    return (
      <div className="loja-detalhes-container">
        <button className="btn-voltar" onClick={() => navigate(-1)}>⬅ Voltar</button>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="loja-detalhes-container">
        <button className="btn-voltar" onClick={() => navigate(-1)}>⬅ Voltar para Lojas</button>
        <div className="erro-container">
          <span>⚠️</span>
          <p>{erro}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loja-detalhes-container">
      <button className="btn-voltar" onClick={() => navigate(-1)}>
        ⬅ Voltar para Lojas
      </button>

      <header className="loja-header-info">
        <div className="loja-capa">🍽️</div>
        <div className="loja-header-texto">
          <h2>{restaurante?.nome}</h2>
          <p>
            <span className={`status-badge ${restaurante?.estaAberto ? 'aberto' : 'fechado'}`}>
              {restaurante?.estaAberto ? '🟢 Aberto' : '🔴 Fechado'}
            </span>
            {restaurante?.endereco && <span className="loja-endereco"> • {restaurante.endereco}</span>}
          </p>
        </div>
      </header>

      {totalCarrinho > 0 && (
        <div className="carrinho-flutuante" onClick={() => navigate('/carrinho')}>
          🛒 Ver carrinho ({totalCarrinho} {totalCarrinho === 1 ? 'item' : 'itens'})
        </div>
      )}

      <div className="cardapio-section">
        <h3>Cardápio</h3>

        {produtos.length === 0 ? (
          <div className="cardapio-vazio">
            <span>🍽️</span>
            <p>Nenhum produto disponível no momento.</p>
          </div>
        ) : (
          <div className="grid-itens">
            {produtos.map((produto) => (
              <div key={produto.id} className="item-card">
                <div className="item-info">
                  <h4>{produto.nome}</h4>
                  <p className="item-estoque">Estoque: {produto.quantidade}</p>
                  <span className="preco">{formatarMoeda(produto.valor)}</span>
                </div>
                <div className="item-acoes">
                  <div className="item-img-mini">🍽️</div>
                  <button
                    className={`btn-add-item ${adicionando === produto.id ? 'adicionado' : ''}`}
                    onClick={() => handleAdicionar(produto)}
                    disabled={adicionando === produto.id}
                  >
                    {adicionando === produto.id ? '✓ Adicionado' : '+ Adicionar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Loja;