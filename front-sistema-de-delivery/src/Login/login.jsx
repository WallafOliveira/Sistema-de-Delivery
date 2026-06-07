import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { login as apiLogin, cadastrar as apiCadastrar } from '../api/usuario';
import { criarRestaurante } from '../api/restaurante';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { salvarUsuario } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipo, setTipo] = useState('cliente');
  const [nomeRestaurante, setNomeRestaurante] = useState('');
  const [cnpj, setCnpj] = useState('');

  const handleCnpj = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 14);
    const masked = digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
    setCnpj(masked);
  };
  const [enderecoRestaurante, setEnderecoRestaurante] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const faltaCampoRestaurante = !isLogin && tipo === 'restaurante' && (!nomeRestaurante || !cnpj || !enderecoRestaurante);
    if (!email || !senha || (!isLogin && !nome) || faltaCampoRestaurante) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data } = await apiLogin(email, senha);
        salvarUsuario(data);
        navigate(data.tipo === 'restaurante' ? '/restaurante' : '/');
      } else {
        let restauranteId = null;
        if (tipo === 'restaurante') {
          const { data: rest } = await criarRestaurante({
            nome: nomeRestaurante,
            cpnj: cnpj,
            endereco: enderecoRestaurante,
            estaAberto: true,
          });
          restauranteId = rest.id;
        }
        await apiCadastrar({ nome, email, telefone, tipo, senha, restauranteId });
        const { data } = await apiLogin(email, senha);
        salvarUsuario(data);
        navigate(data.tipo === 'restaurante' ? '/restaurante' : '/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Erro ao conectar com o servidor.';
      setError(typeof msg === 'string' ? msg : 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="bg-shape shape1"></div>
        <div className="bg-shape shape2"></div>
        <div className="bg-shape shape3"></div>
      </div>

      <div className="login-container animate-fade-in">
        <div className="login-brand-side">
          <div className="brand-overlay"></div>
          <div className="brand-content">
            <span className="brand-logo-icon">🍔</span>
            <h1 className="brand-title">FoodDelivery</h1>
            <p className="brand-subtitle">
              Sua comida favorita, entregue na velocidade da luz.
            </p>
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">✨</span>
                <span>Os melhores restaurantes da cidade</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Entrega rápida e segura</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎁</span>
                <span>Cupom de desconto na primeira compra</span>
              </div>
            </div>
          </div>
        </div>

        <div className="login-form-side">
          <div className="form-card">
            <div className="form-header">
              <h2>{isLogin ? 'Bem-vindo de volta!' : 'Criar sua conta'}</h2>
              <p>{isLogin ? 'Faça login para continuar pedindo' : 'Preencha os dados abaixo para começar'}</p>
            </div>

            {error && <div className="login-error-badge">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form-element">
              {!isLogin && (
                <>
                  <div className="login-input-group">
                    <label>Tipo de conta</label>
                    <div className="tipo-tab-selector">
                      <button
                        type="button"
                        className={`tipo-tab ${tipo === 'cliente' ? 'active' : ''}`}
                        onClick={() => setTipo('cliente')}
                      >
                        <span>👤</span> Cliente
                      </button>
                      <button
                        type="button"
                        className={`tipo-tab ${tipo === 'restaurante' ? 'active' : ''}`}
                        onClick={() => setTipo('restaurante')}
                      >
                        <span>🍽️</span> Restaurante
                      </button>
                    </div>
                  </div>
                </>
              )}

              {!isLogin && (
                <div className="login-input-group">
                  <label htmlFor="nome">Nome Completo</label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      id="nome"
                      placeholder="Ex: João da Silva"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="login-input-group">
                <label htmlFor="email">E-mail</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    id="email"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="login-input-group">
                    <label htmlFor="telefone">Telefone (Opcional)</label>
                    <div className="input-wrapper">
                      <span className="input-icon">📞</span>
                      <input
                        type="tel"
                        id="telefone"
                        placeholder="(11) 99999-9999"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                      />
                    </div>
                  </div>

                  {tipo === 'restaurante' && (
                    <>
                      <div className="login-section-divider">
                        <span>Dados do Restaurante</span>
                      </div>

                      <div className="login-input-group">
                        <label htmlFor="nomeRestaurante">Nome do Restaurante *</label>
                        <div className="input-wrapper">
                          <span className="input-icon">🍽️</span>
                          <input
                            type="text"
                            id="nomeRestaurante"
                            placeholder="Ex: Pizzaria do João"
                            value={nomeRestaurante}
                            onChange={(e) => setNomeRestaurante(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="login-input-group">
                        <label htmlFor="cnpj">CNPJ *</label>
                        <div className="input-wrapper">
                          <span className="input-icon">🪪</span>
                          <input
                            type="text"
                            id="cnpj"
                            placeholder="00.000.000/0001-00"
                            value={cnpj}
                            onChange={handleCnpj}
                            required
                          />
                        </div>
                      </div>

                      <div className="login-input-group">
                        <label htmlFor="enderecoRestaurante">Endereço *</label>
                        <div className="input-wrapper">
                          <span className="input-icon">📍</span>
                          <input
                            type="text"
                            id="enderecoRestaurante"
                            placeholder="Rua, número, bairro, cidade"
                            value={enderecoRestaurante}
                            onChange={(e) => setEnderecoRestaurante(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="login-input-group">
                <label htmlFor="senha">Senha</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    id="senha"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </div>
              </div>

              {isLogin && (
                <div className="form-extra-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Lembrar de mim</span>
                  </label>
                  <a href="#forgot" className="forgot-password" onClick={(e) => e.preventDefault()}>
                    Esqueceu a senha?
                  </a>
                </div>
              )}

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Cadastrar'}
              </button>
            </form>

            <div className="form-divider">
              <span>ou continue com</span>
            </div>

            <div className="social-login-grid">
              <button type="button" className="social-btn google-btn">
                <span className="social-icon">🌐</span> Google
              </button>
              <button type="button" className="social-btn facebook-btn">
                <span className="social-icon">📘</span> Facebook
              </button>
            </div>

            <div className="form-toggle-footer">
              {isLogin ? (
                <p>
                  Não tem uma conta?{' '}
                  <button type="button" className="toggle-view-btn" onClick={() => { setIsLogin(false); setError(''); }}>
                    Cadastre-se aqui
                  </button>
                </p>
              ) : (
                <p>
                  Já possui uma conta?{' '}
                  <button type="button" className="toggle-view-btn" onClick={() => { setIsLogin(true); setError(''); }}>
                    Faça login aqui
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
