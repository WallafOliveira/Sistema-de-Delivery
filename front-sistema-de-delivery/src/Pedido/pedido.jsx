<<<<<<< Updated upstream
import React, { useState } from 'react';
import './pedido.css';

const Pedido = () => {
  // Simulando dados de pedidos com histórico e um pedido ativo
  const [pedidos, setPedidos] = useState([
    {
      id: '8492',
      loja: 'Burger House',
      emoji: '🍔',
      data: 'Hoje, 20:01',
      status: 'Preparando', // Status possíveis: 'Confirmado' | 'Preparando' | 'A caminho' | 'Entregue' | 'Cancelado'
      itens: [
        { nome: 'Monster Burger Mega', qtd: 1, preco: 32.90 },
        { nome: 'Batata Rústica Grande', qtd: 1, preco: 11.00 },
        { nome: 'Coca-Cola Zero Caneca', qtd: 1, preco: 5.00 }
      ],
      total: 48.90,
      pagamento: 'Cartão de Crédito (Final 4821)',
      endereco: 'Rua das Flores, 123 - Centro, São Paulo - SP',
      previsao: '20:30 - 20:45',
      etapa: 2 // 1: Confirmado, 2: Preparando, 3: A caminho, 4: Entregue
    },
    {
      id: '3920',
      loja: 'Bella Pizza',
      emoji: '🍕',
      data: '15 de Maio de 2026, 21:15',
      status: 'Entregue',
      itens: [
        { nome: 'Pizza Grande Meio Calabresa / Meio 4 Queijos', qtd: 1, preco: 54.00 },
        { nome: 'Guaraná Antarctica 2L', qtd: 1, preco: 10.00 }
      ],
      total: 64.00,
      pagamento: 'PIX',
      endereco: 'Rua das Flores, 123 - Centro, São Paulo - SP',
      etapa: 4
    },
    {
      id: '1092',
      loja: 'Sushi Hakura',
      emoji: '🍣',
      data: '12 de Maio de 2026, 19:30',
      status: 'Entregue',
      itens: [
        { nome: 'Combo Premium Hot Holl & Niguiri (24 peças)', qtd: 1, preco: 74.90 },
        { nome: 'Temaki Salmão Grelhado', qtd: 1, preco: 15.00 }
      ],
      total: 89.90,
      pagamento: 'Cartão de Débito',
      endereco: 'Rua das Flores, 123 - Centro, São Paulo - SP',
      etapa: 4
    },
    {
      id: '0981',
      loja: 'Doce Sonho Confeitaria',
      emoji: '🍰',
      data: '08 de Maio de 2026, 15:45',
      status: 'Cancelado',
      itens: [
        { nome: 'Fatia de Bolo Vulcão Ninho com Nutella', qtd: 2, preco: 28.00 },
        { nome: 'Milkshake Ovomaltine 500ml', qtd: 1, preco: 10.00 }
      ],
      total: 38.00,
      pagamento: 'Cartão de Crédito',
      endereco: 'Rua das Flores, 123 - Centro, São Paulo - SP',
      etapa: 0
    }
  ]);

  // Estados para Modal de Cancelamento
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [pedidoParaCancelar, setPedidoParaCancelar] = useState(null);

  // Estados para Modal de Avaliação
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [pedidoParaAvaliar, setPedidoParaAvaliar] = useState(null);
  const [comidaRating, setComidaRating] = useState(0);
  const [comidaHover, setComidaHover] = useState(0);
  const [entregaRating, setEntregaRating] = useState(0);
  const [entregaHover, setEntregaHover] = useState(0);
  const [comentario, setComentario] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Estados para Modal de Refazer Pedido
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [pedidoParaRefazer, setPedidoParaRefazer] = useState(null);

  // Estados para Modal de Ajuda
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [pedidoParaAjuda, setPedidoParaAjuda] = useState(null);
  const [opcaoAjudaSelecionada, setOpcaoAjudaSelecionada] = useState(null);
  const [mensagemAjuda, setMensagemAjuda] = useState('');

  // Estados para Modal de Chat de Suporte
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState('');

  // Abre o chat de suporte
  const abrirChatSuporte = (pedido) => {
    setIsChatModalOpen(true);
    setChatMessages([
      {
        id: 1,
        sender: 'agent',
        text: `Olá! Sou a Ana, sua atendente virtual. Vi que você precisa de ajuda com o pedido #${pedido.id} da loja ${pedido.loja}. Como posso te ajudar hoje?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Envia mensagem no chat
  const enviarMensagemChat = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const novaMensagemUsuario = {
      id: Date.now(),
      sender: 'user',
      text: typedMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, novaMensagemUsuario]);
    const msgEnviada = typedMessage;
    setTypedMessage('');

    setTimeout(() => {
      let respostaAgente = "Entendi o problema. Estou verificando com o restaurante e a nossa equipe de entregas para resolver o mais rápido possível para você. Por favor, aguarde um instante.";
      if (msgEnviada.toLowerCase().includes('atras') || msgEnviada.toLowerCase().includes('demor')) {
        respostaAgente = "Sinto muito pelo atraso! Já entrei em contato com o entregador e ele informou que está a caminho do seu endereço com a sua refeição quente. Deve chegar em menos de 5 minutos.";
      } else if (msgEnviada.toLowerCase().includes('errado') || msgEnviada.toLowerCase().includes('falt')) {
        respostaAgente = "Pedimos sinceras desculpas pelo erro no pedido. Gostaria de receber um reembolso do valor correspondente na sua carteira do app ou prefere que solicitemos o reenvio?";
      }

      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'agent',
        text: respostaAgente,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };
  const abrirRefazerPedido = (pedido) => {
    setPedidoParaRefazer(pedido);
    setIsReorderModalOpen(true);
  };

  // Executa o refazer pedido
  const confirmarRefazerPedido = () => {
    setIsReorderModalOpen(false);
    showToast(`Sacola atualizada! Adicionamos os itens de ${pedidoParaRefazer.loja}.`);
  };

  // Abre o modal de ajuda
  const abrirAjuda = (pedido) => {
    setPedidoParaAjuda(pedido);
    setOpcaoAjudaSelecionada(null);
    setMensagemAjuda('');
    setIsHelpModalOpen(true);
  };

  // Envia solicitação de ajuda
  const enviarSolicitacaoAjuda = (e) => {
    e.preventDefault();
    setIsHelpModalOpen(false);
    showToast('Solicitação de suporte enviada! Entraremos em contato em breve.');
  };

  // Abre confirmação de cancelamento
  const abrirConfirmarCancelamento = (id) => {
    setPedidoParaCancelar(id);
    setIsCancelModalOpen(true);
  };

  // Confirma o cancelamento do pedido ativo
  const confirmarCancelamento = () => {
    setPedidos(pedidos.map(p => {
      if (p.id === pedidoParaCancelar) {
        return { ...p, status: 'Cancelado', etapa: 0 };
      }
      return p;
    }));
    setIsCancelModalOpen(false);
    setPedidoParaCancelar(null);
    showToast('Pedido cancelado com sucesso.');
  };

  // Abre modal de avaliação
  const abrirAvaliacao = (pedido) => {
    setPedidoParaAvaliar(pedido);
    setComidaRating(0);
    setEntregaRating(0);
    setComentario('');
    setIsRatingModalOpen(true);
  };

  // Envia avaliação
  const submeterAvaliacao = (e) => {
    e.preventDefault();
    if (comidaRating === 0 || entregaRating === 0) {
      alert('Por favor, avalie a comida e a entrega antes de enviar.');
      return;
    }
    
    // Aqui você enviaria os dados
    setIsRatingModalOpen(false);
    showToast(`Obrigado! Sua avaliação para ${pedidoParaAvaliar.loja} foi enviada.`);
  };

  // Função para exibir mensagem rápida (toast)
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  const pedidosEmAndamento = pedidos.filter(p => p.status !== 'Entregue' && p.status !== 'Cancelado');
  const historicoPedidos = pedidos.filter(p => p.status === 'Entregue' || p.status === 'Cancelado');
=======
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './pedido.css';

const Pedido = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pedidoConfirmado = location.state?.pedidoConfirmado;
  const pedido = location.state?.pedido;

  if (pedidoConfirmado && pedido) {
    return (
      <div className="pedido-confirmado-container">
        <div className="pedido-confirmado-card">
          <div className="pedido-status-badge">Pedido confirmado</div>
          <h2>Obrigado pelo pedido!</h2>
          <p>Seu pedido foi enviado ao restaurante e está em preparação.</p>

          <div className="pedido-resumo">
            <div className="pedido-resumo-item">
              <span>Número do pedido</span>
              <strong>#{pedido.id}</strong>
            </div>
            <div className="pedido-resumo-item">
              <span>Data</span>
              <strong>{pedido.data}</strong>
            </div>
            <div className="pedido-resumo-item">
              <span>Itens</span>
              <strong>{pedido.itens.length} produtos</strong>
            </div>
            <div className="pedido-resumo-item">
              <span>Total</span>
              <strong>R$ {pedido.total.toFixed(2)}</strong>
            </div>
          </div>

          <div className="pedido-itens-list">
            {pedido.itens.map((item) => (
              <div key={item.id} className="pedido-item-card">
                <div>
                  <h4>{item.nome}</h4>
                  <p>{item.descricao}</p>
                </div>
                <div className="pedido-item-valor">
                  <span>{item.quantidade}x</span>
                  <strong>R$ {(item.preco * item.quantidade).toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="pedido-acoes">
            <button className="btn-primary" onClick={() => navigate('/')}>Continuar comprando</button>
          </div>
        </div>
      </div>
    );
  }
>>>>>>> Stashed changes

  return (
    <>
      <div className="pedidos-container animate-fade-in">
        <header className="pedidos-header">
          <h2>Meus Pedidos</h2>
          <p>Acompanhe seus pedidos em tempo real ou reveja suas compras anteriores</p>
        </header>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="toast-notification animate-toast">
            <span className="toast-icon">✨</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* --- Seção de Pedido Ativo / Em Andamento --- */}
        {pedidosEmAndamento.length > 0 && (
          <section className="pedidos-ativos-section">
            <div className="section-title-highlight">
              <span className="live-indicator-pulse"></span>
              <h3>Pedido em Andamento</h3>
            </div>

            {pedidosEmAndamento.map((pedido) => (
              <div key={pedido.id} className="pedido-ativo-card">
                <div className="pedido-ativo-header">
                  <div className="pedido-loja-info">
                    <span className="loja-emoji-circle">{pedido.emoji}</span>
                    <div>
                      <h4>{pedido.loja}</h4>
                      <span className="pedido-id-text">Pedido #{pedido.id} • {pedido.data}</span>
                    </div>
                  </div>
                  <div className="pedido-status-badge status-preparando">
                    {pedido.status}
                  </div>
                </div>

                {/* Barra de Progresso / Stepper */}
                <div className="pedido-stepper-container">
                  <div className="stepper-track">
                    <div className="stepper-fill" style={{ width: `${((pedido.etapa - 1) / 3) * 100}%` }}></div>
                  </div>
                  
                  <div className="stepper-steps">
                    <div className={`step-item ${pedido.etapa >= 1 ? 'completed' : ''} ${pedido.etapa === 1 ? 'active' : ''}`}>
                      <div className="step-circle">✓</div>
                      <span className="step-label">Confirmado</span>
                    </div>
                    <div className={`step-item ${pedido.etapa >= 2 ? 'completed' : ''} ${pedido.etapa === 2 ? 'active' : ''}`}>
                      <div className="step-circle">🍳</div>
                      <span className="step-label">Preparando</span>
                    </div>
                    <div className={`step-item ${pedido.etapa >= 3 ? 'completed' : ''} ${pedido.etapa === 3 ? 'active' : ''}`}>
                      <div className="step-circle">🛵</div>
                      <span className="step-label">A caminho</span>
                    </div>
                    <div className={`step-item ${pedido.etapa >= 4 ? 'completed' : ''} ${pedido.etapa === 4 ? 'active' : ''}`}>
                      <div className="step-circle">🎁</div>
                      <span className="step-label">Entregue</span>
                    </div>
                  </div>
                </div>

                {/* Detalhes Adicionais */}
                <div className="pedido-ativo-details">
                  <div className="details-col">
                    <h5>Itens do Pedido</h5>
                    <ul className="details-itens-list">
                      {pedido.itens.map((item, idx) => (
                        <li key={idx}>
                          <span className="item-qtd">{item.qtd}x</span> {item.nome}
                        </li>
                      ))}
                    </ul>
                    <div className="details-total-row">
                      <span>Total Pago:</span>
                      <strong>R$ {pedido.total.toFixed(2).replace('.', ',')}</strong>
                    </div>
                  </div>

                  <div className="details-col separator">
                    <h5>Dados de Entrega</h5>
                    <div className="details-meta-group">
                      <label>Endereço</label>
                      <p>{pedido.endereco}</p>
                    </div>
                    <div className="details-meta-group">
                      <label>Previsão de Entrega</label>
                      <p className="delivery-time-prediction">{pedido.previsao}</p>
                    </div>
                    <div className="details-meta-group">
                      <label>Pagamento</label>
                      <p>{pedido.pagamento}</p>
                    </div>
                  </div>
                </div>

                <div className="pedido-ativo-actions">
                  <button 
                    className="btn-outline-cancel" 
                    onClick={() => abrirConfirmarCancelamento(pedido.id)}
                  >
                    Cancelar Pedido
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* --- Seção de Histórico de Pedidos --- */}
        <section className="historico-section">
          <div className="section-title-wrapper">
            <h3>Histórico de Pedidos</h3>
            <span className="count-badge">{historicoPedidos.length} pedidos</span>
          </div>

          <div className="historico-lista">
            {historicoPedidos.map((pedido) => (
              <div key={pedido.id} className="pedido-historico-card">
                <div className="historico-card-main">
                  <div className="historico-loja-header">
                    <span className="loja-emoji-circle-small">{pedido.emoji}</span>
                    <div className="historico-loja-meta">
                      <h4>{pedido.loja}</h4>
                      <span className="historico-date">{pedido.data} • Pedido #{pedido.id}</span>
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
                    {pedido.itens.map(item => `${item.qtd}x ${item.nome}`).join(', ')}
                  </p>
                  <div className="historico-total-info">
                    <span>Valor: <strong>R$ {pedido.total.toFixed(2).replace('.', ',')}</strong></span>
                    <span className="historico-pay-method">({pedido.pagamento})</span>
                  </div>
                </div>

                <div className="historico-card-footer">
                  <button className="btn-primary-sm" onClick={() => abrirRefazerPedido(pedido)}>Refazer Pedido</button>
                  <button className="btn-outline-sm" onClick={() => abrirAjuda(pedido)}>Ajuda</button>
                  {pedido.status === 'Entregue' && (
                    <button 
                      className="btn-outline-sm rating-btn"
                      onClick={() => abrirAvaliacao(pedido)}
                    >
                      Avaliar Refeição
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* --- Modal de Confirmação de Cancelamento --- */}
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
              <p>
                Esta ação não pode ser desfeita. O restaurante já pode ter começado a preparar a sua comida.
              </p>
            </div>
            <div className="modal-actions-horizontal">
              <button className="btn-outline" onClick={() => setIsCancelModalOpen(false)}>Não, Voltar</button>
              <button className="btn-primary btn-red" onClick={confirmarCancelamento}>Sim, Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal de Avaliação --- */}
      {isRatingModalOpen && pedidoParaAvaliar && (
        <div className="modal-overlay">
          <div className="modal-content rating-modal animate-scale-up">
            <div className="modal-header">
              <h3>Avaliar Refeição</h3>
              <button className="btn-close" onClick={() => setIsRatingModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={submeterAvaliacao} className="rating-form">
              <div className="rating-store-header">
                <span className="store-emoji-large">{pedidoParaAvaliar.emoji}</span>
                <div>
                  <h4>{pedidoParaAvaliar.loja}</h4>
                  <p>Pedido #{pedidoParaAvaliar.id}</p>
                </div>
              </div>

              {/* Avaliação da Comida */}
              <div className="rating-form-group">
                <label>O que achou da comida? 🍔</label>
                <div className="star-rating-box">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`star-btn ${(comidaHover || comidaRating) >= star ? 'selected' : ''}`}
                      onClick={() => setComidaRating(star)}
                      onMouseEnter={() => setComidaHover(star)}
                      onMouseLeave={() => setComidaHover(0)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="rating-value-label">
                  {comidaRating === 1 && 'Péssima 😞'}
                  {comidaRating === 2 && 'Ruim 😕'}
                  {comidaRating === 3 && 'Regular 😐'}
                  {comidaRating === 4 && 'Muito Boa 🙂'}
                  {comidaRating === 5 && 'Excelente! 😍'}
                </span>
              </div>

              {/* Avaliação da Entrega */}
              <div className="rating-form-group">
                <label>Como foi o serviço de entrega? 🛵</label>
                <div className="star-rating-box">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`star-btn ${(entregaHover || entregaRating) >= star ? 'selected' : ''}`}
                      onClick={() => setEntregaRating(star)}
                      onMouseEnter={() => setEntregaHover(star)}
                      onMouseLeave={() => setEntregaHover(0)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="rating-value-label">
                  {entregaRating === 1 && 'Péssima 😞'}
                  {entregaRating === 2 && 'Ruim 😕'}
                  {entregaRating === 3 && 'Regular 😐'}
                  {entregaRating === 4 && 'Muito Rápida 🙂'}
                  {entregaRating === 5 && 'Excepcional! 😍'}
                </span>
              </div>

              {/* Comentário Adicional */}
              <div className="rating-form-group">
                <label htmlFor="comentario">Deixe sua opinião (Opcional)</label>
                <textarea
                  id="comentario"
                  rows="3"
                  placeholder="Conte-nos o que achou da comida, embalagem ou tempo de entrega..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                ></textarea>
              </div>

              <div className="modal-actions-horizontal">
                <button type="button" className="btn-outline" onClick={() => setIsRatingModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Enviar Avaliação</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Modal de Confirmação de Refazer Pedido --- */}
      {isReorderModalOpen && pedidoParaRefazer && (
        <div className="modal-overlay">
          <div className="modal-content reorder-modal animate-scale-up">
            <div className="modal-header">
              <h3>Refazer Pedido?</h3>
              <button className="btn-close" onClick={() => setIsReorderModalOpen(false)}>&times;</button>
            </div>
            
            <div className="reorder-modal-body">
              <div className="reorder-store-banner">
                <span className="reorder-store-emoji">{pedidoParaRefazer.emoji}</span>
                <div>
                  <h4>{pedidoParaRefazer.loja}</h4>
                  <p>Deseja adicionar os mesmos itens à sua sacola?</p>
                </div>
              </div>

              <div className="reorder-items-list-container">
                <h5>Itens a serem adicionados:</h5>
                <ul className="reorder-items-list">
                  {pedidoParaRefazer.itens.map((item, idx) => (
                    <li key={idx} className="reorder-item-row">
                      <span className="reorder-item-qty">{item.qtd}x</span>
                      <span className="reorder-item-name">{item.nome}</span>
                      <span className="reorder-item-price">R$ {(item.preco * item.qtd).toFixed(2).replace('.', ',')}</span>
                    </li>
                  ))}
                </ul>
                <div className="reorder-total-row">
                  <span>Subtotal do Pedido:</span>
                  <strong>R$ {pedidoParaRefazer.total.toFixed(2).replace('.', ',')}</strong>
                </div>
              </div>

              <div className="reorder-disclaimer">
                <p>⚠️ Os preços dos itens podem ter sofrido alterações desde o seu último pedido.</p>
              </div>
            </div>

            <div className="modal-actions-horizontal">
              <button type="button" className="btn-outline" onClick={() => setIsReorderModalOpen(false)}>Cancelar</button>
              <button type="button" className="btn-primary" onClick={confirmarRefazerPedido}>Adicionar à Sacola</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal de Ajuda com o Pedido --- */}
      {isHelpModalOpen && pedidoParaAjuda && (
        <div className="modal-overlay">
          <div className="modal-content help-modal animate-scale-up">
            <div className="modal-header">
              <h3>Precisa de Ajuda?</h3>
              <button className="btn-close" onClick={() => setIsHelpModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={enviarSolicitacaoAjuda} className="help-modal-body">
              {/* Resumo do Pedido */}
              <div className="help-order-summary">
                <span className="help-store-emoji">{pedidoParaAjuda.emoji}</span>
                <div>
                  <h4>{pedidoParaAjuda.loja}</h4>
                  <p className="help-order-meta">Pedido #{pedidoParaAjuda.id} • {pedidoParaAjuda.data}</p>
                </div>
              </div>

              {!opcaoAjudaSelecionada ? (
                <>
                  <p className="help-intro-text">Selecione o problema que você teve com este pedido:</p>
                  
                  {/* Grade de Problemas Comuns */}
                  <div className="help-issues-grid">
                    <button 
                      type="button" 
                      className="help-issue-card"
                      onClick={() => setOpcaoAjudaSelecionada('Pedido veio errado/faltando')}
                    >
                      <span className="issue-icon">❌</span>
                      <span className="issue-label">Itens errados ou faltando</span>
                    </button>
                    <button 
                      type="button" 
                      className="help-issue-card"
                      onClick={() => setOpcaoAjudaSelecionada('Atraso na entrega')}
                    >
                      <span className="issue-icon">⏱️</span>
                      <span className="issue-label">Pedido muito atrasado</span>
                    </button>
                    <button 
                      type="button" 
                      className="help-issue-card"
                      onClick={() => setOpcaoAjudaSelecionada('Qualidade da comida/embalagem')}
                    >
                      <span className="issue-icon">📦</span>
                      <span className="issue-label">Comida ou embalagem danificada</span>
                    </button>
                    <button 
                      type="button" 
                      className="help-issue-card"
                      onClick={() => setOpcaoAjudaSelecionada('Cobrança ou pagamento')}
                    >
                      <span className="issue-icon">💳</span>
                      <span className="issue-label">Problemas com pagamento</span>
                    </button>
                  </div>

                  {/* Contato direto adicional */}
                  <div className="help-direct-contact">
                    <h5>Prefere falar com a gente agora?</h5>
                    <div className="help-contact-buttons">
                      <button 
                        type="button" 
                        className="btn-contact-sm chat"
                        onClick={() => {
                          setIsHelpModalOpen(false);
                          abrirChatSuporte(pedidoParaAjuda);
                        }}
                      >
                        💬 Chat de Suporte 24h
                      </button>
                      <button 
                        type="button" 
                        className="btn-contact-sm phone"
                        onClick={() => {
                          setIsHelpModalOpen(false);
                          showToast("Ligando para nossa Central: 0800-770-FOOD");
                        }}
                      >
                        📞 Ligação Gratuita
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="help-issue-form-area animate-fade-in">
                  <div className="help-selected-header">
                    <button 
                      type="button" 
                      className="btn-back-help"
                      onClick={() => setOpcaoAjudaSelecionada(null)}
                    >
                      ← Voltar às opções
                    </button>
                    <h5>Assunto: {opcaoAjudaSelecionada}</h5>
                  </div>

                  <div className="help-form-group">
                    <label htmlFor="mensagem-ajuda">Descreva brevemente o que aconteceu:</label>
                    <textarea
                      id="mensagem-ajuda"
                      rows="4"
                      required
                      placeholder="Ex: Pedi duas cocas e veio apenas uma..."
                      value={mensagemAjuda}
                      onChange={(e) => setMensagemAjuda(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="help-actions-box">
                    <button type="button" className="btn-outline-sm" onClick={() => setOpcaoAjudaSelecionada(null)}>Voltar</button>
                    <button type="submit" className="btn-primary-sm">Enviar Mensagem</button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* --- Modal de Chat de Suporte Visual --- */}
      {isChatModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content chat-modal animate-scale-up">
            <div className="chat-modal-header">
              <div className="chat-agent-info">
                <div className="chat-agent-avatar">👩‍💼</div>
                <div>
                  <h4>Ana do Suporte</h4>
                  <p className="chat-agent-status"><span className="status-dot-blink"></span> Online • Responde na hora</p>
                </div>
              </div>
              <button className="btn-close-chat" onClick={() => setIsChatModalOpen(false)}>&times;</button>
            </div>

            <div className="chat-messages-container">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`chat-message-bubble ${msg.sender}`}>
                  <p className="chat-message-text">{msg.text}</p>
                  <span className="chat-message-time">{msg.time}</span>
                </div>
              ))}
            </div>

            <div className="chat-quick-actions">
              <button 
                type="button" 
                className="btn-quick-msg"
                onClick={() => {
                  setTypedMessage("Onde está o meu pedido?");
                }}
              >
                📍 Onde está meu pedido?
              </button>
              <button 
                type="button" 
                className="btn-quick-msg"
                onClick={() => {
                  setTypedMessage("Meu pedido veio errado.");
                }}
              >
                ❌ Pedido veio errado
              </button>
              <button 
                type="button" 
                className="btn-quick-msg"
                onClick={() => {
                  setTypedMessage("Quero falar com um atendente humano.");
                }}
              >
                👤 Falar com atendente
              </button>
            </div>

            <form onSubmit={enviarMensagemChat} className="chat-input-area">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                maxLength={200}
              />
              <button type="submit" className="btn-send-message">
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Pedido;