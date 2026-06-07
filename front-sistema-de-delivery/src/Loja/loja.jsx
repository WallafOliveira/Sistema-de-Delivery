import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './loja.css';
import { buscarRestaurante, listarProdutos } from '../api/restaurante';
import { useCarrinho } from '../context/CarrinhoContext';

const Loja = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adicionarItem } = useCarrinho();

  const [restaurante, setRestaurante] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    Promise.all([buscarRestaurante(id), listarProdutos(id)])
      .then(([resRest, resProd]) => {
        setRestaurante(resRest.data);
        setProdutos(resProd.data);
      })
      .catch(() => setErro('Não foi possível carregar o cardápio.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdicionar = (produto) => {
    adicionarItem(id, {
      produtoId: produto.id,
      nomeProduto: produto.nome,
      valorUnitario: produto.valor,
    });
    setToast(`${produto.nome} adicionado ao carrinho!`);
    setTimeout(() => setToast(''), 2500);
  };

  if (loading) {
    return (
      <div className="loja-detalhes-container">
        <button className="btn-voltar" onClick={() => navigate(-1)}>⬅ Voltar para Lojas</button>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>⏳ Carregando cardápio...</div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="loja-detalhes-container">
        <button className="btn-voltar" onClick={() => navigate(-1)}>⬅ Voltar para Lojas</button>
        <div style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>{erro}</div>
      </div>
    );
  }

  return (
    <div className="loja-detalhes-container">
      {toast && (
        <div className="toast-notification animate-toast" style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999 }}>
          <span className="toast-icon">🛒</span>
          <span>{toast}</span>
        </div>
      )}

      <button className="btn-voltar" onClick={() => navigate(-1)}>
        ⬅ Voltar para Lojas
      </button>

      <header className="loja-header-info">
        <div className="loja-capa">🍽️</div>
        <h2>{restaurante?.nome}</h2>
        <p>
          {restaurante?.estaAberto ? '🟢 Aberto' : '🔴 Fechado'} •{' '}
          📍 {restaurante?.endereco}
        </p>
      </header>

      <div className="cardapio-section">
        <h3>Cardápio</h3>

        {produtos.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '1rem', color: '#888' }}>
            Nenhum produto disponível no momento.
          </div>
        ) : (
          <div className="grid-itens">
            {produtos.map((produto) => (
              <div key={produto.id} className="item-card">
                <div className="item-info">
                  <h4>{produto.nome}</h4>
                  <p>Estoque: {produto.quantidadeEstoque} unidades</p>
                  <span className="preco">
                    R$ {Number(produto.valor).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="item-acoes">
                  <div className="item-img-mini">🍽️</div>
                  <button
                    className="btn-add-item"
                    onClick={() => handleAdicionar(produto)}
                    disabled={produto.quantidadeEstoque === 0}
                  >
                    + Adicionar
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
