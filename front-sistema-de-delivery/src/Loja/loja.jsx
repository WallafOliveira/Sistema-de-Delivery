import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './loja.css';

const Loja = () => {
  const { id } = useParams(); // Pega o número da loja que está na URL
  const navigate = useNavigate();

  // Itens simulados do cardápio
  const itens = [
    { id: 101, nome: 'X-Burger Especial', descricao: 'Pão brioche, hambúrguer artesanal 180g, queijo cheddar e bacon.', preco: 'R$ 35,00' },
    { id: 102, nome: 'Pizza Calabresa', descricao: 'Massa de fermentação natural, molho de tomate, mussarela e calabresa fatiada.', preco: 'R$ 55,00' },
    { id: 103, nome: 'Refrigerante Lata', descricao: 'Coca-cola ou Guaraná 350ml bem gelado.', preco: 'R$ 7,00' },
  ];

  return (
    <div className="loja-detalhes-container">
      {/* Botão para voltar para a Home */}
      <button className="btn-voltar" onClick={() => navigate(-1)}>
        ⬅ Voltar para Lojas
      </button>

      <header className="loja-header-info">
        <div className="loja-capa">Capa do Restaurante {id}</div>
        <h2>Restaurante Exemplo {id}</h2>
        <p>Aberto • Entrega em 30-45 min</p>
      </header>

      <div className="cardapio-section">
        <h3>Cardápio</h3>
        
        <div className="grid-itens">
          {itens.map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-info">
                <h4>{item.nome}</h4>
                <p>{item.descricao}</p>
                <span className="preco">{item.preco}</span>
              </div>
              <div className="item-acoes">
                <div className="item-img-mini">Foto</div>
                <button className="btn-add-item">+ Adicionar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loja;