import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Alterna entre login e cadastro
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !senha || (!isLogin && !nome)) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setError('');
    // Simula a autenticação e redireciona para a home '/'
    navigate('/');
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

              <button type="submit" className="login-submit-btn">
                {isLogin ? 'Entrar' : 'Cadastrar'}
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
