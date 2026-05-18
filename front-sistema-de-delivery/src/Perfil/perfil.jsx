import React, { useState } from 'react';
import './perfil.css';

const Perfil = () => {
  const [isEditarDadosOpen, setIsEditarDadosOpen] = useState(false);
  const [isNovoEnderecoOpen, setIsNovoEnderecoOpen] = useState(false);

  // Dados simulados do usuário para demonstração
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('perfil_usuario');
    return saved ? JSON.parse(saved) : {
      nome: 'João da Silva',
      email: 'joao.silva@email.com',
      telefone: '(11) 98765-4321',
      membroDesde: 'Janeiro de 2026',
    };
  });

  // Dados simulados de endereços com localStorage
  const [listaEnderecos, setListaEnderecos] = useState(() => {
    const saved = localStorage.getItem('perfil_enderecos');
    return saved ? JSON.parse(saved) : [
      { id: 1, titulo: 'Casa', rua: 'Rua das Flores, 123', bairro: 'Centro', cidade: 'São Paulo - SP' },
      { id: 2, titulo: 'Trabalho', rua: 'Av. Paulista, 1000 - Sala 45', bairro: 'Bela Vista', cidade: 'São Paulo - SP' },
    ];
  });

  // Estado para armazenar o ID do endereço ativo
  const [enderecoAtivoId, setEnderecoAtivoId] = useState(() => {
    const saved = localStorage.getItem('perfil_endereco_ativo_id');
    if (saved) return parseInt(saved, 10);
    return 1; // Default para o primeiro id
  });

  // Função para selecionar o endereço ativo
  const selecionarEndereco = (id) => {
    setEnderecoAtivoId(id);
    localStorage.setItem('perfil_endereco_ativo_id', id.toString());
  };

  // Exclui um endereço
  const excluirEndereco = (id) => {
    const novos = listaEnderecos.filter((end) => end.id !== id);
    setListaEnderecos(novos);
    localStorage.setItem('perfil_enderecos', JSON.stringify(novos));
    
    // Se o endereço excluído for o ativo, seleciona o primeiro restante
    if (enderecoAtivoId === id) {
      const novoAtivoId = novos.length > 0 ? novos[0].id : null;
      setEnderecoAtivoId(novoAtivoId);
      if (novoAtivoId) {
        localStorage.setItem('perfil_endereco_ativo_id', novoAtivoId.toString());
      } else {
        localStorage.removeItem('perfil_endereco_ativo_id');
      }
    }
  };

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
                    onClick={(e) => {
                      e.stopPropagation();
                      excluirEndereco(endereco.id);
                    }}
                  >
                    🗑️
                  </button>
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
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              const formData = new FormData(e.currentTarget);
              const novosDados = {
                ...usuario,
                nome: formData.get('nome'),
                email: formData.get('email'),
                telefone: formData.get('telefone')
              };
              setUsuario(novosDados);
              localStorage.setItem('perfil_usuario', JSON.stringify(novosDados));
              setIsEditarDadosOpen(false); 
            }}>
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
                <input type="text" name="telefone" defaultValue={usuario.telefone} required />
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
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              const formData = new FormData(e.currentTarget);
              const titulo = formData.get('titulo');
              const rua = formData.get('rua');
              const bairro = formData.get('bairro');
              const cidade = formData.get('cidade');
              
              const novo = {
                id: Date.now(),
                titulo,
                rua,
                bairro,
                cidade
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