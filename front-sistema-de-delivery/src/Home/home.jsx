import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importe o hook
import './home.css';

const Home = () => {
  const navigate = useNavigate(); // Inicialize o hook
  const lojas = [1, 2, 3, 4, 5, 6];
  
  // Função que será chamada ao clicar no card
  const abrirLoja = (idDaLoja) => {
    navigate(`/loja/${idDaLoja}`);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h2>Lojas Disponíveis</h2>
        <p>Escolha o seu restaurante favorito</p>
      </header>

      <div className="grid-lojas">
        {lojas.map((loja) => (
          <div key={loja} className="loja-card" onClick={() => abrirLoja(loja)}>
            <div className="loja-img">Imagem da Loja {loja}</div>
            <h3>Restaurante Exemplo {loja}</h3>
            <div className="loja-info">
              <span>Pizza • Lanches</span>
              <span className="status-aberto">Aberto</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;