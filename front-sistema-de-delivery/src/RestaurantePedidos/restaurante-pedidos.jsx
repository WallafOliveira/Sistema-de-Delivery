import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './restaurante-pedidos.css';
import { useAuth } from '../context/AuthContext';
import { listarTodosPedidos, atualizarStatusPedido, cancelarPedido } from '../api/pedido';

const PROXIMOS_STATUS = {
  Pendente:   { label: 'Confirmar',          proximo: 'Confirmado',  cor: 'btn-confirmar' },
  Confirmado: { label: 'Iniciar Preparo',     proximo: 'EmPreparo',   cor: 'btn-preparo' },
  EmPreparo:  { label: 'Saiu para Entrega',   proximo: 'EmEntrega',   cor: 'btn-entrega' },
  EmEntrega:  { label: 'Confirmar Entrega',   proximo: 'Entregue',    cor: 'btn-entregue' },
};

const STATUS_BADGE = {
  Pendente:   { label: 'Pendente',      cor: 'status-pendente' },
  Confirmado: { label: 'Confirmado',    cor: 'status-confirmado' },
  EmPreparo:  { label: 'Em Preparo',    cor: 'status-preparo' },
  EmEntrega:  { label: 'Em Entrega',    cor: 'status-entrega' },
  Entregue:   { label: 'Entregue',      cor: 'status-entregue' },
  Cancelado:  { label: 'Cancelado',     cor: 'status-cancelado' },
};

const formatarData = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const RestaurantePedidos = () => {
  const navigate = useNavigate();
  const { usuario, restauranteId } = useAuth();

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [filtro, setFiltro] = useState('ativos');
  const [toast, setToast] = useState('');
  const [atualizando, setAtualizando] = useState(null);
  const [modalCancelar, setModalCancelar] = useState(null);

  useEffect(() => {
    if (!usuario) { navigate('/login'); return; }
    if (usuario.tipo !== 'restaurante') { navigate('/'); return; }
    if (!restauranteId) { setLoading(false); return; }

    listarTodosPedidos()
      .then(({ data }) => {
        const meusPedidos = data.filter((p) => p.restauranteId === restauranteId);
        setPedidos(meusPedidos);
      })
      .catch(() => setErro('Não foi possível carregar os pedidos.'))
      .finally(() => setLoading(false));
  }, [usuario, restauranteId, navigate]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const avancarStatus = async (pedidoId, novoStatus) => {
    setAtualizando(pedidoId);
    try {
      await atualizarStatusPedido(pedidoId, novoStatus);
      setPedidos((prev) => prev.map((p) => p.id === pedidoId ? { ...p, status: novoStatus } : p));
      showToast(`Status atualizado para "${STATUS_BADGE[novoStatus]?.label}".`);
    } catch {
      showToast('Erro ao atualizar o status.');
    } finally {
      setAtualizando(null);
    }
  };

  const confirmarCancelamento = async () => {
    try {
      await cancelarPedido(modalCancelar);
      setPedidos((prev) => prev.map((p) => p.id === modalCancelar ? { ...p, status: 'Cancelado' } : p));
      showToast('Pedido cancelado.');
    } catch {
      showToast('Erro ao cancelar o pedido.');
    } finally {
      setModalCancelar(null);
    }
  };

  const filtros = [
    { key: 'ativos',      label: 'Em andamento' },
    { key: 'finalizados', label: 'Finalizados' },
    { key: 'todos',       label: 'Todos' },
  ];

  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtro === 'ativos') return p.status !== 'Entregue' && p.status !== 'Cancelado';
    if (filtro === 'finalizados') return p.status === 'Entregue' || p.status === 'Cancelado';
    return true;
  });

  const countAtivos = pedidos.filter((p) => p.status !== 'Entregue' && p.status !== 'Cancelado').length;

  if (loading) {
    return (
      <div className="rest-pedidos-container animate-fade-in">
        <div className="rest-pedidos-loading"><span>⏳</span><p>Carregando pedidos...</p></div>
      </div>
    );
  }

  if (!restauranteId) {
    return (
      <div className="rest-pedidos-container animate-fade-in">
        <div className="rest-pedidos-vazio">
          <span>🏠</span>
          <h4>Restaurante não configurado</h4>
          <p>Vá ao Dashboard para selecionar seu restaurante.</p>
          <button onClick={() => navigate('/restaurante')} className="btn-go-dashboard">Ir ao Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rest-pedidos-container animate-fade-in">
        <header className="rest-pedidos-header">
          <div>
            <h2>Pedidos Recebidos</h2>
            <p>Gerencie e atualize o status dos pedidos do seu restaurante</p>
          </div>
          <div className="rest-pedidos-header-badges">
            {countAtivos > 0 && <span className="badge-ativos-live">{countAtivos} em andamento</span>}
            <span className="rest-pedidos-count-badge">{pedidos.length} no total</span>
          </div>
        </header>

        {toast && <div className="rest-pedidos-toast">✨ {toast}</div>}
        {erro && <div className="rest-pedidos-erro">⚠️ {erro}</div>}

        <div className="rest-pedidos-filtros">
          {filtros.map((f) => (
            <button
              key={f.key}
              className={`filtro-btn ${filtro === f.key ? 'active' : ''}`}
              onClick={() => setFiltro(f.key)}
            >
              {f.label}
              <span className="filtro-count">
                {f.key === 'todos' ? pedidos.length
                  : f.key === 'ativos' ? countAtivos
                  : pedidos.filter(p => p.status === 'Entregue' || p.status === 'Cancelado').length}
              </span>
            </button>
          ))}
        </div>

        {pedidosFiltrados.length === 0 && !erro ? (
          <div className="rest-pedidos-vazio">
            <span>🧾</span>
            <h4>Nenhum pedido encontrado</h4>
            <p>Os pedidos aparecerão aqui quando realizados.</p>
          </div>
        ) : (
          <div className="rest-pedidos-lista">
            {pedidosFiltrados.map((pedido) => {
              const st = STATUS_BADGE[pedido.status] || { label: pedido.status, cor: 'status-pendente' };
              const acao = PROXIMOS_STATUS[pedido.status];
              const emAtualizacao = atualizando === pedido.id;

              return (
                <div key={pedido.id} className="rest-pedido-card">
                  <div className="rest-pedido-card-header">
                    <div className="rest-pedido-info">
                      <span className="rest-pedido-num">Pedido #{pedido.id?.substring(0, 8)}</span>
                      <span className="rest-pedido-data">{formatarData(pedido.dataCriacao)}</span>
                    </div>
                    <span className={`rest-pedido-status ${st.cor}`}>{st.label}</span>
                  </div>

                  <div className="rest-pedido-itens">
                    {(pedido.itens || []).map((item, idx) => (
                      <span key={idx} className="rest-pedido-item-tag">
                        {item.quantidade}x {item.nomeProduto}
                      </span>
                    ))}
                  </div>

                  <div className="rest-pedido-card-footer">
                    <span className="rest-pedido-total">
                      Total: <strong>R$ {Number(pedido.valorTotal).toFixed(2).replace('.', ',')}</strong>
                    </span>
                    <div className="rest-pedido-acoes">
                      {acao && (
                        <button
                          className={`btn-acao-status ${acao.cor}`}
                          onClick={() => avancarStatus(pedido.id, acao.proximo)}
                          disabled={emAtualizacao}
                        >
                          {emAtualizacao ? '...' : acao.label}
                        </button>
                      )}
                      {pedido.status === 'Pendente' && (
                        <button className="btn-cancelar-sm" onClick={() => setModalCancelar(pedido.id)}>
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modalCancelar && (
        <div className="modal-overlay">
          <div className="modal-content animate-scale-up">
            <div className="modal-header">
              <h3>Cancelar Pedido</h3>
              <button className="btn-close" onClick={() => setModalCancelar(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <span className="modal-warning-icon">⚠️</span>
              <h4>Deseja cancelar este pedido?</h4>
              <p>Esta ação não pode ser desfeita.</p>
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setModalCancelar(null)}>Voltar</button>
              <button className="btn-danger" onClick={confirmarCancelamento}>Sim, cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RestaurantePedidos;
