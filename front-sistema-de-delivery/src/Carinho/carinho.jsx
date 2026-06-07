import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './carinho.css';
import { useCarrinho } from '../context/CarrinhoContext';
import { useAuth } from '../context/AuthContext';
import { criarPedido } from '../api/pedido';

const Carrinho = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { restauranteId, itens, alterarQuantidade, removerItem, limparCarrinho } = useCarrinho();

  const [showCheckout, setShowCheckout] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const subtotal = itens.reduce((acc, item) => acc + item.valorUnitario * item.quantidade, 0);
  const entrega = itens.length > 0 ? 8.9 : 0;
  const total = subtotal + entrega;

  const confirmarPedido = async () => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    setEnviando(true);
    setErro('');

    try {
      await criarPedido({
        clienteId: usuario.id,
        restauranteId,
        itens: itens.map((i) => ({
          produtoId: i.produtoId,
          nomeProduto: i.nomeProduto,
          quantidade: i.quantidade,
          valorUnitario: i.valorUnitario,
        })),
      });

      limparCarrinho();
      setShowCheckout(false);
      navigate('/pedido', { state: { pedidoConfirmado: true } });
    } catch (err) {
      setErro('Erro ao enviar o pedido. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  if (showCheckout) {
    return (
      <div className="carrinho-confirmacao-container">
        <header className="carrinho-header">
          <div>
            <h2>Confirmar Pedido</h2>
            <p>Confira seus itens antes de enviar.</p>
          </div>
          <span className="badge-carrinho">{itens.length} {itens.length === 1 ? 'item' : 'itens'}</span>
        </header>

        <div className="confirmacao-grid">
          <section className="confirmacao-card">
            <h3>Dados do cliente</h3>
            <p><strong>Nome:</strong> {usuario?.nome || '—'}</p>
            <p><strong>E-mail:</strong> {usuario?.email || '—'}</p>
            <p><strong>Telefone:</strong> {usuario?.telefone || '—'}</p>
          </section>

          <aside className="confirmacao-resumo">
            <div className="resumo-box">
              <h3>Resumo do pedido</h3>
              {itens.map((item) => (
                <div key={item.produtoId} className="confirmacao-item-row">
                  <span>{item.quantidade}x {item.nomeProduto}</span>
                  <strong>R$ {(item.valorUnitario * item.quantidade).toFixed(2)}</strong>
                </div>
              ))}
              <div className="resumo-linha">
                <span>Subtotal</span>
                <strong>R$ {subtotal.toFixed(2)}</strong>
              </div>
              <div className="resumo-linha">
                <span>Entrega</span>
                <strong>R$ {entrega.toFixed(2)}</strong>
              </div>
              <div className="resumo-total">
                <span>Total</span>
                <strong>R$ {total.toFixed(2)}</strong>
              </div>
              {erro && <p style={{ color: 'red', fontSize: '0.875rem' }}>{erro}</p>}
              <div className="confirmacao-actions">
                <button className="btn-outline" onClick={() => setShowCheckout(false)}>Voltar ao carrinho</button>
                <button className="btn-primary" onClick={confirmarPedido} disabled={enviando}>
                  {enviando ? 'Enviando...' : 'Confirmar e enviar pedido'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="carrinho-container">
      <header className="carrinho-header">
        <div>
          <h2>Meu Carrinho</h2>
          <p>Revise os itens e finalize sua compra.</p>
        </div>
        <span className="badge-carrinho">{itens.length} {itens.length === 1 ? 'item' : 'itens'}</span>
      </header>

      {itens.length === 0 ? (
        <div className="carrinho-vazio">
          <h3>Seu carrinho está vazio</h3>
          <p>Adicione produtos na loja para continuar.</p>
        </div>
      ) : (
        <div className="carrinho-grid">
          <section className="itens-lista">
            {itens.map((item) => (
              <div key={item.produtoId} className="item-card">
                <div className="item-card-info">
                  <div className="item-img-mini">🍽️</div>
                  <div>
                    <h3>{item.nomeProduto}</h3>
                    <span className="item-preco">R$ {Number(item.valorUnitario).toFixed(2)}</span>
                  </div>
                </div>

                <div className="item-card-actions">
                  <div className="quantidade-control">
                    <button onClick={() => alterarQuantidade(item.produtoId, -1)}>-</button>
                    <span>{item.quantidade}</span>
                    <button onClick={() => alterarQuantidade(item.produtoId, 1)}>+</button>
                  </div>
                  <button className="btn-remover" onClick={() => removerItem(item.produtoId)}>
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </section>

          <aside className="resumo-pedido">
            <div className="resumo-box">
              <h3>Resumo do Pedido</h3>
              <div className="resumo-linha">
                <span>Subtotal</span>
                <strong>R$ {subtotal.toFixed(2)}</strong>
              </div>
              <div className="resumo-linha">
                <span>Entrega</span>
                <strong>R$ {entrega.toFixed(2)}</strong>
              </div>
              <div className="resumo-total">
                <span>Total</span>
                <strong>R$ {total.toFixed(2)}</strong>
              </div>
              <button className="btn-primary btn-finalizar" onClick={() => setShowCheckout(true)}>
                Finalizar Pedido
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Carrinho;
