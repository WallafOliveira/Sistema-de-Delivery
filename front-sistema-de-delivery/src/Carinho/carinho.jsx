import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './carinho.css';

const Carrinho = () => {
  const navigate = useNavigate();
  const [itens, setItens] = useState([
    {
      id: 1,
      nome: 'X-Burger Especial',
      descricao: 'Hambúrguer premium, queijo cheddar, bacon e molho especial.',
      preco: 35.0,
      quantidade: 1,
    },
    {
      id: 2,
      nome: 'Pizza Calabresa',
      descricao: 'Massa fina, molho de tomate fresco e calabresa fatiada.',
      preco: 55.0,
      quantidade: 2,
    },
    {
      id: 3,
      nome: 'Refrigerante Lata',
      descricao: 'Refrigerante gelado 350ml.',
      preco: 7.0,
      quantidade: 1,
    },
  ]);

  const alterarQuantidade = (id, delta) => {
    setItens((prevItens) =>
      prevItens
        .map((item) => {
          if (item.id !== id) return item;
          return {
            ...item,
            quantidade: Math.max(1, item.quantidade + delta),
          };
        })
        .filter((item) => item.quantidade > 0)
    );
  };

  const removerItem = (id) => {
    setItens((prevItens) => prevItens.filter((item) => item.id !== id));
  };

  const subtotal = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  const entrega = itens.length > 0 ? 8.9 : 0;
  const total = subtotal + entrega;

  const finalizarPedido = () => {
    const pedido = {
      id: Date.now(),
      itens,
      subtotal,
      entrega,
      total,
      data: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Pedido confirmado',
    };

    setItens([]);
    navigate('/pedido', { state: { pedidoConfirmado: true, pedido } });
  };

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
              <div key={item.id} className="item-card">
                <div className="item-card-info">
                  <div className="item-img-mini">Foto</div>
                  <div>
                    <h3>{item.nome}</h3>
                    <p>{item.descricao}</p>
                    <span className="item-preco">R$ {item.preco.toFixed(2)}</span>
                  </div>
                </div>

                <div className="item-card-actions">
                  <div className="quantidade-control">
                    <button onClick={() => alterarQuantidade(item.id, -1)}>-</button>
                    <span>{item.quantidade}</span>
                    <button onClick={() => alterarQuantidade(item.id, 1)}>+</button>
                  </div>
                  <button className="btn-remover" onClick={() => removerItem(item.id)}>
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
              <button className="btn-primary btn-finalizar" onClick={finalizarPedido}>Finalizar Pedido</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Carrinho;