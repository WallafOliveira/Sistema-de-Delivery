import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './restaurante-cardapio.css';
import { useAuth } from '../context/AuthContext';
import { listarProdutos, buscarRestaurante, criarProduto, atualizarProduto } from '../api/restaurante';
import ImageUpload from '../components/ImageUpload/ImageUpload';

const PRODUTO_VAZIO = { nome: '', valor: '', quantidade: '', ativo: true, imagemProduto: '' };

const RestauranteCardapio = () => {
  const navigate = useNavigate();
  const { usuario, restauranteId } = useAuth();

  const [produtos, setProdutos] = useState([]);
  const [nomeRestaurante, setNomeRestaurante] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');

  const [modal, setModal] = useState(null); // null | { modo: 'criar' | 'editar', produto }
  const [form, setForm] = useState(PRODUTO_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [erroModal, setErroModal] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!usuario) { navigate('/login'); return; }
    if (usuario.tipo !== 'restaurante') { navigate('/'); return; }
    if (!restauranteId) { setLoading(false); return; }
    carregarDados();
  }, [usuario, restauranteId]);

  const carregarDados = () => {
    setLoading(true);
    Promise.all([listarProdutos(restauranteId), buscarRestaurante(restauranteId)])
      .then(([resProd, resRest]) => {
        setProdutos(resProd.data);
        setNomeRestaurante(resRest.data.nome);
      })
      .catch(() => setErro('Não foi possível carregar o cardápio.'))
      .finally(() => setLoading(false));
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const abrirCriar = () => {
    setForm(PRODUTO_VAZIO);
    setErroModal('');
    setModal({ modo: 'criar' });
  };

  const abrirEditar = (produto) => {
    setForm({ nome: produto.nome, valor: produto.valor, quantidade: produto.quantidade, ativo: produto.ativo, imagemProduto: produto.imagemProduto || '' });
    setErroModal('');
    setModal({ modo: 'editar', produto });
  };

  const fecharModal = () => {
    setModal(null);
    setErroModal('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome || form.valor === '' || form.quantidade === '') {
      setErroModal('Preencha todos os campos obrigatórios.');
      return;
    }
    setSalvando(true);
    setErroModal('');
    try {
      if (modal.modo === 'criar') {
        const { data } = await criarProduto({
          nome: form.nome,
          valor: parseFloat(form.valor),
          quantidade: parseInt(form.quantidade, 10),
          restauranteId,
          imagemProduto: form.imagemProduto || null,
        });
        setProdutos((prev) => [...prev, data]);
        showToast('Produto criado com sucesso!');
      } else {
        const { data } = await atualizarProduto(modal.produto.id, {
          nome: form.nome,
          valor: parseFloat(form.valor),
          quantidade: parseInt(form.quantidade, 10),
          ativo: form.ativo,
          imagemProduto: form.imagemProduto || null,
        });
        setProdutos((prev) => prev.map((p) => p.id === modal.produto.id ? data : p));
        showToast('Produto atualizado com sucesso!');
      }
      fecharModal();
    } catch {
      setErroModal('Erro ao salvar o produto. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  if (loading) {
    return (
      <div className="cardapio-container animate-fade-in">
        <div className="cardapio-loading"><span>⏳</span><p>Carregando cardápio...</p></div>
      </div>
    );
  }

  if (!restauranteId) {
    return (
      <div className="cardapio-container animate-fade-in">
        <div className="cardapio-vazio">
          <span className="cardapio-vazio-icon">🏠</span>
          <h4>Restaurante não configurado</h4>
          <p>Vá ao Dashboard para selecionar seu restaurante.</p>
          <button onClick={() => navigate('/restaurante')} className="btn-ir-dashboard">Ir ao Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="cardapio-container animate-fade-in">
        <header className="cardapio-header">
          <div>
            <h2>Cardápio</h2>
            <p>{nomeRestaurante}</p>
          </div>
          <div className="cardapio-header-actions">
            <span className="cardapio-total-badge">{produtos.length} {produtos.length === 1 ? 'item' : 'itens'}</span>
            <button className="btn-novo-produto" onClick={abrirCriar}>+ Novo Produto</button>
          </div>
        </header>

        {toast && <div className="cardapio-toast">✨ {toast}</div>}

        <div className="cardapio-search-bar">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Buscar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {busca && <button onClick={() => setBusca('')}>✕</button>}
        </div>

        {erro && <div className="cardapio-erro">⚠️ {erro}</div>}

        {produtosFiltrados.length === 0 && !erro ? (
          <div className="cardapio-vazio">
            <span className="cardapio-vazio-icon">📋</span>
            <h4>{busca ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}</h4>
            <p>{busca ? 'Tente outro termo de busca.' : 'Clique em "+ Novo Produto" para começar.'}</p>
          </div>
        ) : (
          <div className="cardapio-grid">
            {produtosFiltrados.map((produto) => (
              <div key={produto.id} className={`produto-card ${!produto.ativo ? 'inativo' : ''}`}>
                <div className="produto-card-icon">
                  {produto.imagemProduto
                    ? <img src={produto.imagemProduto} alt={produto.nome} className="produto-card-img" />
                    : '🍽️'}
                </div>
                <div className="produto-card-info">
                  <div className="produto-card-top">
                    <h4>{produto.nome}</h4>
                    {!produto.ativo && <span className="produto-inativo-tag">Inativo</span>}
                  </div>
                  <div className="produto-card-meta">
                    <span className="produto-preco">R$ {Number(produto.valor).toFixed(2).replace('.', ',')}</span>
                    <span className="produto-estoque">Estoque: <strong>{produto.quantidade}</strong></span>
                  </div>
                </div>
                <button className="btn-editar-produto" onClick={() => abrirEditar(produto)} title="Editar">✏️</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal.modo === 'criar' ? 'Novo Produto' : 'Editar Produto'}</h3>
              <button className="btn-close" onClick={fecharModal}>&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  placeholder="Ex: Pizza Margherita"
                  value={form.nome}
                  onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                  required
                />
              </div>

              <ImageUpload
                label="Imagem do Produto"
                placeholder="🍽️"
                value={form.imagemProduto}
                onChange={(url) => setForm((f) => ({ ...f, imagemProduto: url }))}
              />

              <div className="form-group-row">
                <div className="form-group">
                  <label>Preço (R$) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    value={form.valor}
                    onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Quantidade em estoque *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.quantidade}
                    onChange={(e) => setForm((f) => ({ ...f, quantidade: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {modal.modo === 'editar' && (
                <div className="form-group form-group-toggle">
                  <label>Status</label>
                  <div className="toggle-row">
                    <button
                      type="button"
                      className={`toggle-btn ${form.ativo ? 'active' : ''}`}
                      onClick={() => setForm((f) => ({ ...f, ativo: true }))}
                    >
                      Ativo
                    </button>
                    <button
                      type="button"
                      className={`toggle-btn ${!form.ativo ? 'active inactive' : ''}`}
                      onClick={() => setForm((f) => ({ ...f, ativo: false }))}
                    >
                      Inativo
                    </button>
                  </div>
                </div>
              )}

              {erroModal && <p className="form-erro">{erroModal}</p>}

              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={salvando}>
                  {salvando ? 'Salvando...' : modal.modo === 'criar' ? 'Criar Produto' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RestauranteCardapio;
