import React, { useState } from 'react';
import './perfil.css';

const Perfil = () => {
  const [isEditarDadosOpen, setIsEditarDadosOpen] = useState(false);
  const [isNovoEnderecoOpen, setIsNovoEnderecoOpen] = useState(false);

  // Dados simulados do usuário para demonstração
  const usuario = {
    nome: 'João da Silva',
    email: 'joao.silva@email.com',
    telefone: '(11) 98765-4321',
    membroDesde: 'Janeiro de 2026',
  };

  // Dados simulados de endereços
  const enderecos = [
    { id: 1, titulo: 'Casa', rua: 'Rua das Flores, 123', bairro: 'Centro', cidade: 'São Paulo - SP', principal: true },
    { id: 2, titulo: 'Trabalho', rua: 'Av. Paulista, 1000 - Sala 45', bairro: 'Bela Vista', cidade: 'São Paulo - SP', principal: false },
  ];

  return (
    <div className="perfil-container">
      <header className="perfil-header">
        <h2>Meu Perfil</h2>
        <p>Gerencie suas informações pessoais e endereços</p>
      </header>

      <div className="perfil-grid">
        {/* Coluna 1: Informações Pessoais */}
        <section className="perfil-card">
          <div className="perfil-avatar-section">
            <div className="avatar-placeholder">
              {/* Pega a primeira letra do nome */}
              {usuario.nome.charAt(0)}
            </div>
            <div className="perfil-nome-info">
              <h3>{usuario.nome}</h3>
              <p>Membro desde {usuario.membroDesde}</p>
            </div>
          </div>

          <div className="perfil-detalhes">
            <div className="info-group">
              <label>E-mail</label>
              <p>{usuario.email}</p>
            </div>
            <div className="info-group">
              <label>Telefone</label>
              <p>{usuario.telefone}</p>
            </div>
          </div>

          <div className="perfil-acoes">
            <button className="btn-outline" onClick={() => setIsEditarDadosOpen(true)}>Editar Dados</button>
          </div>
        </section>

        {/* Coluna 2: Endereços */}
        <section className="enderecos-section">
          <div className="enderecos-header">
            <h3>Meus Endereços</h3>
            <button className="btn-primary" onClick={() => setIsNovoEnderecoOpen(true)}>+ Novo Endereço</button>
          </div>

          <div className="enderecos-lista">
            {enderecos.map((endereco) => (
              <div key={endereco.id} className={`endereco-card ${endereco.principal ? 'principal' : ''}`}>
                <div className="endereco-info">
                  <div className="endereco-titulo-wrapper">
                    <h4>{endereco.titulo}</h4>
                    {endereco.principal && <span className="badge-principal">Principal</span>}
                  </div>
                  <p>{endereco.rua}</p>
                  <p>{endereco.bairro}, {endereco.cidade}</p>
                </div>
                <div className="endereco-acoes">
                  <button className="btn-icon" title="Editar">✏️</button>
                  <button className="btn-icon" title="Excluir">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      {/* Modal Editar Dados */}
      {isEditarDadosOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Editar Dados</h3>
              <button className="btn-close" onClick={() => setIsEditarDadosOpen(false)}>&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setIsEditarDadosOpen(false); }}>
              <div className="form-group">
                <label>Nome</label>
                <input type="text" defaultValue={usuario.nome} required />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input type="email" defaultValue={usuario.email} required />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input type="text" defaultValue={usuario.telefone} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setIsEditarDadosOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Novo Endereço */}
      {isNovoEnderecoOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Novo Endereço</h3>
              <button className="btn-close" onClick={() => setIsNovoEnderecoOpen(false)}>&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setIsNovoEnderecoOpen(false); }}>
              <div className="form-group">
                <label>Título (ex: Casa, Trabalho)</label>
                <input type="text" required />
              </div>
              <div className="form-group">
                <label>Rua</label>
                <input type="text" required />
              </div>
              <div className="form-group">
                <label>Bairro</label>
                <input type="text" required />
              </div>
              <div className="form-group">
                <label>Cidade - Estado</label>
                <input type="text" required />
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