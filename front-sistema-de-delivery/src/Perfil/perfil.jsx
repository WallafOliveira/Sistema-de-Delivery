import React, { useState } from 'react';
import './perfil.css';
import { useAuth } from '../context/AuthContext';
import { atualizarUsuario } from '../api/usuario';

const Perfil = () => {
  const { usuario, salvarUsuario } = useAuth();
  const [isEditarDadosOpen, setIsEditarDadosOpen] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroSalvar, setErroSalvar] = useState('');

  const [listaEnderecos, setListaEnderecos] = useState(() => {
    const saved = localStorage.getItem('perfil_enderecos');
    return saved ? JSON.parse(saved) : [];
  });
  const [enderecoAtivoId, setEnderecoAtivoId] = useState(() => {
    const saved = localStorage.getItem('perfil_endereco_ativo_id');
    return saved ? parseInt(saved, 10) : null;
  });
  const [isNovoEnderecoOpen, setIsNovoEnderecoOpen] = useState(false);

  const selecionarEndereco = (id) => {
    setEnderecoAtivoId(id);
    localStorage.setItem('perfil_endereco_ativo_id', id.toString());
  };

  const excluirEndereco = (id) => {
    const novos = listaEnderecos.filter((end) => end.id !== id);
    setListaEnderecos(novos);
    localStorage.setItem('perfil_enderecos', JSON.stringify(novos));
    if (enderecoAtivoId === id) {
      const novoId = novos.length > 0 ? novos[0].id : null;
      setEnderecoAtivoId(novoId);
      if (novoId) localStorage.setItem('perfil_endereco_ativo_id', novoId.toString());
      else localStorage.removeItem('perfil_endereco_ativo_id');
    }
  };

  const handleSalvarDados = async (e) => {
    e.preventDefault();
    if (!usuario) return;
    const formData = new FormData(e.currentTarget);
    const novosDados = {
      nome: formData.get('nome'),
      email: formData.get('email'),
      telefone: formData.get('telefone'),
    };
    setSalvando(true);
    setErroSalvar('');
    try {
      await atualizarUsuario(usuario.id, novosDados);
      salvarUsuario({ ...usuario, ...novosDados });
      setIsEditarDadosOpen(false);
    } catch {
      setErroSalvar('Erro ao salvar os dados. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  if (!usuario) {
    return (
      <div className="perfil-container">
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>
          Você precisa estar logado para acessar o perfil.
        </p>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <header className="perfil-header">
        <h2>Meu Perfil</h2>
        <p>Gerencie suas informações pessoais e endereços</p>
      </header>

      <div className="perfil-grid">
        <section className="perfil-card">
          <div className="perfil-avatar-section">
            <div className="avatar-placeholder">{usuario.nome?.charAt(0)}</div>
            <div className="perfil-nome-info">
              <h3>{usuario.nome}</h3>
              <p>Conta {usuario.tipo || 'cliente'}</p>
            </div>
          </div>

          <div className="perfil-detalhes">
            <div className="info-group">
              <label>E-mail</label>
              <p>{usuario.email}</p>
            </div>
            <div className="info-group">
              <label>Telefone</label>
              <p>{usuario.telefone || '—'}</p>
            </div>
          </div>

          <div className="perfil-acoes">
            <button className="btn-outline" onClick={() => setIsEditarDadosOpen(true)}>Editar Dados</button>
          </div>
        </section>

        <section className="enderecos-section">
          <div className="enderecos-header">
            <h3>Meus Endereços</h3>
            <button className="btn-primary" onClick={() => setIsNovoEnderecoOpen(true)}>+ Novo Endereço</button>
          </div>

          <div className="enderecos-lista">
            {listaEnderecos.map((endereco) => (
              <div
                key={endereco.id}
                className={`endereco-card ${enderecoAtivoId === endereco.id ? 'ativo' : ''}`}
                onClick={() => selecionarEndereco(endereco.id)}
              >
                <div className="endereco-checkbox-wrapper">
                  <div className={`endereco-radio-circle ${enderecoAtivoId === endereco.id ? 'active' : ''}`}>
                    {enderecoAtivoId === endereco.id && <span className="endereco-radio-dot"></span>}
                  </div>
                </div>
                <div className="endereco-info">
                  <div className="endereco-titulo-wrapper">
                    <h4>{endereco.titulo}</h4>
                    {enderecoAtivoId === endereco.id && <span className="badge-ativo">Ativo</span>}
                  </div>
                  <p>{endereco.rua}</p>
                  <p>{endereco.bairro}, {endereco.cidade}</p>
                </div>
                <div className="endereco-acoes">
                  <button
                    className="btn-icon"
                    title="Excluir"
                    onClick={(e) => { e.stopPropagation(); excluirEndereco(endereco.id); }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            {listaEnderecos.length === 0 && (
              <p style={{ color: '#888', textAlign: 'center' }}>Nenhum endereço cadastrado.</p>
            )}
          </div>
        </section>
      </div>

      {isEditarDadosOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Editar Dados</h3>
              <button className="btn-close" onClick={() => setIsEditarDadosOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSalvarDados}>
              <div className="form-group">
                <label>Nome</label>
                <input type="text" name="nome" defaultValue={usuario.nome} required />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input type="email" name="email" defaultValue={usuario.email} required />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input type="text" name="telefone" defaultValue={usuario.telefone} />
              </div>
              {erroSalvar && <p style={{ color: 'red', fontSize: '0.875rem' }}>{erroSalvar}</p>}
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setIsEditarDadosOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={salvando}>
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isNovoEnderecoOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Novo Endereço</h3>
              <button className="btn-close" onClick={() => setIsNovoEnderecoOpen(false)}>&times;</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const novo = {
                id: Date.now(),
                titulo: fd.get('titulo'),
                rua: fd.get('rua'),
                bairro: fd.get('bairro'),
                cidade: fd.get('cidade'),
              };
              const novos = [...listaEnderecos, novo];
              setListaEnderecos(novos);
              localStorage.setItem('perfil_enderecos', JSON.stringify(novos));
              setIsNovoEnderecoOpen(false);
            }}>
              <div className="form-group">
                <label>Título (ex: Casa, Trabalho)</label>
                <input type="text" name="titulo" required />
              </div>
              <div className="form-group">
                <label>Rua</label>
                <input type="text" name="rua" required />
              </div>
              <div className="form-group">
                <label>Bairro</label>
                <input type="text" name="bairro" required />
              </div>
              <div className="form-group">
                <label>Cidade - Estado</label>
                <input type="text" name="cidade" placeholder="Ex: São Paulo - SP" required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setIsNovoEnderecoOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;
