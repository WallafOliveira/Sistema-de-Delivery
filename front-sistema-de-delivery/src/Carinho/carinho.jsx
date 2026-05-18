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

  const [showCheckout, setShowCheckout] = useState(false);

  const [clienteInfo, setClienteInfo] = useState({
    nome: 'João da Silva',
    email: 'joao.silva@email.com',
    telefone: '(11) 98765-4321',
  });

  const [enderecosSalvos] = useState([
    { id: 1, label: 'Casa', endereco: 'Rua das Flores, 123 - Centro, São Paulo - SP' },
    { id: 2, label: 'Trabalho', endereco: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP' },
    { id: 3, label: 'Avó', endereco: 'Rua das Cerejeiras, 45 - Jardim, São Paulo - SP' },
  ]);

  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [enderecoTexto, setEnderecoTexto] = useState(enderecosSalvos[0].endereco);
  const [pagamento] = useState('Cartão de Crédito (Final 4821)');

  const subtotal = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  const entrega = itens.length > 0 ? 8.9 : 0;
  const total = subtotal + entrega;

  const abrirConfirmacao = () => {
    const selectedAddress = enderecosSalvos.find((item) => item.id === selectedAddressId);
    if (selectedAddress && selectedAddress.endereco !== enderecoTexto) {
      setEnderecoTexto(selectedAddress.endereco);
    }
    setShowCheckout(true);
  };

  const confirmarPedido = () => {
    const pedido = {
      id: Date.now(),
      itens,
      subtotal,
      entrega,
      total,
      cliente: clienteInfo,
      endereco: enderecoTexto,
      pagamento,
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
    setShowCheckout(false);
    navigate('/pedido', { state: { pedidoConfirmado: true, pedido } });
  };

  if (showCheckout) {
    return (
      <div className="carrinho-confirmacao-container">
        <header className="carrinho-header">
          <div>
            <h2>Confirmar Pedido</h2>
            <p>Confira seus dados antes de enviar o pedido.</p>
          </div>
          <span className="badge-carrinho">{itens.length} {itens.length === 1 ? 'item' : 'itens'}</span>
        </header>

        <div className="confirmacao-grid">
            <section className="confirmacao-card">
            <h3>Dados de entrega</h3>
            <div className="endereco-salvo-section">
              <label className="confirmacao-label" htmlFor="endereco-salvo-select">Endereço salvo</label>
              <select
                id="endereco-salvo-select"
                className="endereco-select"
                value={selectedAddressId}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedAddressId(id);
                  const selected = enderecosSalvos.find((item) => item.id === id);
                  if (selected) {
                    setEnderecoTexto(selected.endereco);
                  }
                }}
              >
                {enderecosSalvos.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label} - {item.endereco}
                  </option>
                ))}
              </select>
            </div>

            <p className="confirmacao-label">Endereço de entrega</p>
            <textarea
              rows={3}
              className="confirmacao-textarea"
              value={enderecoTexto}
              onChange={(e) => setEnderecoTexto(e.target.value)}
            />

            <h3>Dados do cliente</h3>
            <p className="confirmacao-label">Nome</p>
            <input
              type="text"
              value={clienteInfo.nome}
              onChange={(e) => setClienteInfo({ ...clienteInfo, nome: e.target.value })}
            />
            <p className="confirmacao-label">Email</p>
            <input
              type="email"
              value={clienteInfo.email}
              onChange={(e) => setClienteInfo({ ...clienteInfo, email: e.target.value })}
            />
            <p className="confirmacao-label">Telefone</p>
            <input
              type="text"
              value={clienteInfo.telefone}
              onChange={(e) => setClienteInfo({ ...clienteInfo, telefone: e.target.value })}
            />

            <h3>Forma de pagamento</h3>
            <p>{pagamento}</p>
          </section>

          <aside className="confirmacao-resumo">
            <div className="resumo-box">
              <h3>Resumo do pedido</h3>
              {itens.map((item) => (
                <div key={item.id} className="confirmacao-item-row">
                  <span>{item.quantidade}x {item.nome}</span>
                  <strong>R$ {(item.preco * item.quantidade).toFixed(2)}</strong>
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
              <div className="confirmacao-actions">
                <button className="btn-outline" onClick={() => setShowCheckout(false)}>Voltar ao carrinho</button>
                <button className="btn-primary" onClick={confirmarPedido}>Confirmar e enviar pedido</button>
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
              <button className="btn-primary btn-finalizar" onClick={abrirConfirmacao}>Finalizar Pedido</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Carrinho;