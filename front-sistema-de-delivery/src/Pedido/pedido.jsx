import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './pedido.css';
import { useAuth } from '../context/AuthContext';
import { listarPedidosCliente, cancelarPedido as apiCancelarPedido } from '../api/pedido';

const STATUS_ETAPA = {
  Pendente: 1,
  Confirmado: 1,
  EmPreparo: 2,
  EmEntrega: 3,
  Entregue: 4,
  Cancelado: 0,
};

const formatarData = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const Pedido = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const pedidoConfirmado = location.state?.pedidoConfirmado;

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [pedidoParaCancelar, setPedidoParaCancelar] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }
    listarPedidosCliente(usuario.id)
      .then(({ data }) => setPedidos(data))
      .catch(() => setErro('Não foi possível carregar os pedidos.'))
      .finally(() => setLoading(false));
  }, [usuario, navigate]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const abrirConfirmarCancelamento = (id) => {
    setPedidoParaCancelar(id);
    setIsCancelModalOpen(true);
  };

  const confirmarCancelamento = async () => {
    try {
      await apiCancelarPedido(pedidoParaCancelar);
      setPedidos((prev) =>
        prev.map((p) => p.id === pedidoParaCancelar ? { ...p, status: 'Cancelado' } : p)
      );
      showToast('Pedido cancelado com sucesso.');
    } catch {
      showToast('Não foi possível cancelar o pedido.');
    } finally {
      setIsCancelModalOpen(false);
      setPedidoParaCancelar(null);
    }
  };

  const pedidosEmAndamento = pedidos.filter(
    (p) => p.status !== 'Entregue' && p.status !== 'Cancelado'
  );
  const historicoPedidos = pedidos.filter(
    (p) => p.status === 'Entregue' || p.status === 'Cancelado'
  );

  if (loading) {
    return (
      <div className="pedidos-container animate-fade-in">
        <div className="no-results-card" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <span className="no-results-icon">⏳</span>
          <h4>Carregando pedidos...</h4>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pedidos-container animate-fade-in">
        <header className="pedidos-header">
          <h2>Meus Pedidos</h2>
          <p>Acompanhe seus pedidos em tempo real ou reveja suas compras anteriores</p>
        </header>

        {toastMessage && (
          <div className="toast-notification animate-toast">
            <span className="toast-icon">✨</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {pedidoConfirmado && (
          <div className="pedido-confirmacao-card">
            <div className="pedido-confirmacao-header">Pedido finalizado com sucesso!</div>
            <p>Seu pedido foi confirmado e está em processamento.</p>
            <button className="btn-primary-sm" onClick={() => navigate('/')}>Continuar comprando</button>
          </div>
        )}

        {erro && (
          <div className="pedido-confirmacao-card" style={{ background: '#fee2e2' }}>
            <p>{erro}</p>
          </div>
        )}

        {pedidosEmAndamento.length > 0 && (
          <section className="pedidos-ativos-section">
            <div className="section-title-highlight">
              <span className="live-indicator-pulse"></span>
              <h3>Pedido em Andamento</h3>
            </div>

            {pedidosEmAndamento.map((pedido) => {
              const etapa = STATUS_ETAPA[pedido.status] ?? 1;
              return (
                <div key={pedido.id} className="pedido-ativo-card">
                  <div className="pedido-ativo-header">
                    <div className="pedido-loja-info">
                      <span className="loja-emoji-circle">🍽️</span>
                      <div>
                        <h4>Pedido #{pedido.id?.substring(0, 8)}</h4>
                        <span className="pedido-id-text">{formatarData(pedido.dataCriacao)}</span>
                      </div>
                    </div>
                    <div className="pedido-status-badge status-preparando">{pedido.status}</div>
                  </div>

                  <div className="pedido-stepper-container">
                    <div className="stepper-track">
                      <div className="stepper-fill" style={{ width: `${((etapa - 1) / 3) * 100}%` }}></div>
                    </div>
                    <div className="stepper-steps">
                      {[
                        { label: 'Confirmado', icon: '✓', step: 1 },
                        { label: 'Preparando', icon: '🍳', step: 2 },
                        { label: 'A caminho', icon: '🛵', step: 3 },
                        { label: 'Entregue', icon: '🎁', step: 4 },
                      ].map(({ label, icon, step }) => (
                        <div key={step} className={`step-item ${etapa >= step ? 'completed' : ''} ${etapa === step ? 'active' : ''}`}>
                          <div className="step-circle">{icon}</div>
                          <span className="step-label">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pedido-ativo-details">
                    <div className="details-col">
                      <h5>Itens do Pedido</h5>
                      <ul className="details-itens-list">
                        {(pedido.itens || []).map((item, idx) => (
                          <li key={idx}>
                            <span className="item-qtd">{item.quantidade}x</span> {item.nomeProduto}
                          </li>
                        ))}
                      </ul>
                      <div className="details-total-row">
                        <span>Total Pago:</span>
                        <strong>R$ {Number(pedido.valorTotal).toFixed(2).replace('.', ',')}</strong>
                      </div>
                    </div>
                  </div>

                  {pedido.status === 'Pendente' && (
                    <div className="pedido-ativo-actions">
                      <button className="btn-outline-cancel" onClick={() => abrirConfirmarCancelamento(pedido.id)}>
                        Cancelar Pedido
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        <section className="historico-section">
          <div className="section-title-wrapper">
            <h3>Histórico de Pedidos</h3>
            <span className="count-badge">{historicoPedidos.length} pedidos</span>
          </div>

          {historicoPedidos.length === 0 && !erro && (
            <p style={{ color: '#888', textAlign: 'center' }}>Nenhum pedido finalizado ainda.</p>
          )}

          <div className="historico-lista">
            {historicoPedidos.map((pedido) => (
              <div key={pedido.id} className="pedido-historico-card">
                <div className="historico-card-main">
                  <div className="historico-loja-header">
                    <span className="loja-emoji-circle-small">🍽️</span>
                    <div className="historico-loja-meta">
                      <h4>Pedido #{pedido.id?.substring(0, 8)}</h4>
                      <span className="historico-date">{formatarData(pedido.dataCriacao)}</span>
                    </div>
                  </div>
                  <div className="historico-status-col">
                    <span className={`status-badge-compact ${pedido.status.toLowerCase()}`}>
                      {pedido.status === 'Entregue' ? '🟢 Entregue' : '🔴 Cancelado'}
                    </span>
                  </div>
                </div>

                <div className="historico-card-content">
                  <p className="historico-itens-preview">
                    {(pedido.itens || []).map((i) => `${i.quantidade}x ${i.nomeProduto}`).join(', ')}
                  </p>
                  <div className="historico-total-info">
                    <span>Valor: <strong>R$ {Number(pedido.valorTotal).toFixed(2).replace('.', ',')}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {isCancelModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content warning-modal animate-scale-up">
            <div className="modal-header">
              <h3>Confirmar Cancelamento</h3>
              <button className="btn-close" onClick={() => setIsCancelModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body-warning">
              <span className="warning-icon">⚠️</span>
              <h4>Deseja mesmo cancelar este pedido?</h4>
              <p>Esta ação não pode ser desfeita.</p>
            </div>
            <div className="modal-actions-horizontal">
              <button className="btn-outline" onClick={() => setIsCancelModalOpen(false)}>Não, Voltar</button>
              <button className="btn-primary btn-red" onClick={confirmarCancelamento}>Sim, Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Pedido;
