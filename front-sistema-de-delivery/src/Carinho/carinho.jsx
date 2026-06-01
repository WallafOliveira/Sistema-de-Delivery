import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './carinho.css';
import { getCart, saveCart, clearCart, removerDoCarrinho, alterarQuantidade as cartAlterarQuantidade, calcularTotal } from '../utils/cart';
import { getUsuario, isLogado } from '../utils/auth';
import { formatarMoeda } from '../utils/formatters';
import PedidoService from '../services/pedido.service';

const Carrinho = () => {
  const navigate = useNavigate();

  // Carrega carrinho do localStorage
  const [cart, setCart] = useState(() => getCart());
  const itens = cart?.itens ?? [];
  const restauranteId = cart?.restauranteId ?? null;
  const restauranteNome = cart?.restauranteNome ?? '';

  const [showCheckout, setShowCheckout] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');

  // Dados do cliente do localStorage
  const usuario = getUsuario();
  const [enderecoTexto, setEnderecoTexto] = useState(() => {
    const enderecosSalvos = JSON.parse(localStorage.getItem('perfil_enderecos') || '[]');
    const ativoId = localStorage.getItem('perfil_endereco_ativo_id');
    const ativo = ativoId
      ? enderecosSalvos.find((e) => e.id === parseInt(ativoId, 10))
      : enderecosSalvos[0];
    return ativo ? `${ativo.rua}, ${ativo.bairro} - ${ativo.cidade}` : '';
  });

  const subtotal = calcularTotal(itens);
  const entrega = itens.length > 0 ? 8.9 : 0;
  const total = subtotal + entrega;

  const handleAlterarQuantidade = (produtoId, delta) => {
    const novoCart = cartAlterarQuantidade(produtoId, delta);
    setCart(novoCart ? { ...novoCart } : null);
  };

  const handleRemover = (produtoId) => {
    const novoCart = removerDoCarrinho(produtoId);
    setCart(novoCart ? { ...novoCart } : null);
  };

  const abrirConfirmacao = () => {
    if (!isLogado()) {
      navigate('/login');
      return;
    }
    setShowCheckout(true);
  };

  const confirmarPedido = async () => {
    if (!isLogado()) {
      navigate('/login');
      return;
    }
    if (!restauranteId) {
      setErroEnvio('Restaurante não identificado. Adicione produtos ao carrinho novamente.');
      return;
    }
    setErroEnvio('');
    setEnviando(true);

    try {
      const payload = {
        clienteId: usuario.id,
        restauranteId,
        itens: itens.map((i) => ({
          produtoId: i.produtoId,
          nomeProduto: i.nomeProduto,
          quantidade: i.quantidade,
          valorUnitario: i.valorUnitario,
        })),
      };

      const pedidoCriado = await PedidoService.criar(payload);

      // Salva o ID do pedido ativo e limpa o carrinho
      localStorage.setItem('activePedidoId', pedidoCriado.id);
      clearCart();
      setCart(null);
      setShowCheckout(false);

      navigate('/pedido', { state: { pedidoConfirmado: true, pedidoId: pedidoCriado.id } });
    } catch (err) {
      setErroEnvio(err.message || 'Erro ao enviar o pedido. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  // ─── Tela de confirmação ────────────────────────────────────────────────────
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
            <h3>Restaurante</h3>
            <p>{restauranteNome || 'Restaurante selecionado'}</p>

            <h3>Endereço de entrega</h3>
            <textarea
              rows={3}
              className="confirmacao-textarea"
              value={enderecoTexto}
              onChange={(e) => setEnderecoTexto(e.target.value)}
              placeholder="Informe o endereço de entrega..."
            />

            <h3>Dados do cliente</h3>
            <p className="confirmacao-label">Nome</p>
            <p>{usuario?.nome || '—'}</p>
            <p className="confirmacao-label">Email</p>
            <p>{usuario?.email || '—'}</p>
            <p className="confirmacao-label">Telefone</p>
            <p>{usuario?.telefone || '—'}</p>

            <h3>Forma de pagamento</h3>
            <p>Pagamento na entrega</p>

            {erroEnvio && <p className="erro-envio">{erroEnvio}</p>}
          </section>

          <aside className="confirmacao-resumo">
            <div className="resumo-box">
              <h3>Resumo do pedido</h3>
              {itens.map((item) => (
                <div key={item.produtoId} className="confirmacao-item-row">
                  <span>{item.quantidade}x {item.nomeProduto}</span>
                  <strong>{formatarMoeda(item.valorUnitario * item.quantidade)}</strong>
                </div>
              ))}
              <div className="resumo-linha">
                <span>Subtotal</span>
                <strong>{formatarMoeda(subtotal)}</strong>
              </div>
              <div className="resumo-linha">
                <span>Entrega</span>
                <strong>{formatarMoeda(entrega)}</strong>
              </div>
              <div className="resumo-total">
                <span>Total</span>
                <strong>{formatarMoeda(total)}</strong>
              </div>
              <div className="confirmacao-actions">
                <button className="btn-outline" onClick={() => setShowCheckout(false)}>
                  Voltar ao carrinho
                </button>
                <button
                  className="btn-primary"
                  onClick={confirmarPedido}
                  disabled={enviando}
                >
                  {enviando ? 'Enviando...' : 'Confirmar e enviar pedido'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // ─── Tela principal do carrinho ─────────────────────────────────────────────
  return (
    <div className="carrinho-container">
      <header className="carrinho-header">
        <div>
          <h2>Meu Carrinho</h2>
          <p>Revise os itens e finalize sua compra.</p>
          {restauranteNome && <p className="carrinho-restaurante">🏪 {restauranteNome}</p>}
        </div>
        <span className="badge-carrinho">{itens.length} {itens.length === 1 ? 'item' : 'itens'}</span>
      </header>

      {itens.length === 0 ? (
        <div className="carrinho-vazio">
          <h3>Seu carrinho está vazio</h3>
          <p>Adicione produtos na loja para continuar.</p>
          <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
            Ver restaurantes
          </button>
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
                    <span className="item-preco">{formatarMoeda(item.valorUnitario)}</span>
                  </div>
                </div>

                <div className="item-card-actions">
                  <div className="quantidade-control">
                    <button onClick={() => handleAlterarQuantidade(item.produtoId, -1)}>-</button>
                    <span>{item.quantidade}</span>
                    <button onClick={() => handleAlterarQuantidade(item.produtoId, 1)}>+</button>
                  </div>
                  <button className="btn-remover" onClick={() => handleRemover(item.produtoId)}>
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
                <strong>{formatarMoeda(subtotal)}</strong>
              </div>
              <div className="resumo-linha">
                <span>Entrega</span>
                <strong>{formatarMoeda(entrega)}</strong>
              </div>
              <div className="resumo-total">
                <span>Total</span>
                <strong>{formatarMoeda(total)}</strong>
              </div>
              <button className="btn-primary btn-finalizar" onClick={abrirConfirmacao}>
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
