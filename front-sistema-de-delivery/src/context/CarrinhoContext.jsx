import React, { createContext, useContext, useState } from 'react';

const CarrinhoContext = createContext(null);

export const CarrinhoProvider = ({ children }) => {
  const [restauranteId, setRestauranteId] = useState(null);
  const [itens, setItens] = useState([]);

  const adicionarItem = (restauranteIdNovo, produto) => {
    if (restauranteId && restauranteId !== restauranteIdNovo) {
      const confirmar = window.confirm(
        'Seu carrinho tem itens de outro restaurante. Deseja limpar e adicionar este item?'
      );
      if (!confirmar) return;
      setItens([]);
    }

    setRestauranteId(restauranteIdNovo);
    setItens((prev) => {
      const existente = prev.find((i) => i.produtoId === produto.produtoId);
      if (existente) {
        return prev.map((i) =>
          i.produtoId === produto.produtoId
            ? { ...i, quantidade: i.quantidade + 1 }
            : i
        );
      }
      return [...prev, { ...produto, quantidade: 1 }];
    });
  };

  const removerItem = (produtoId) => {
    setItens((prev) => prev.filter((i) => i.produtoId !== produtoId));
  };

  const alterarQuantidade = (produtoId, delta) => {
    setItens((prev) =>
      prev
        .map((i) =>
          i.produtoId === produtoId
            ? { ...i, quantidade: Math.max(1, i.quantidade + delta) }
            : i
        )
        .filter((i) => i.quantidade > 0)
    );
  };

  const limparCarrinho = () => {
    setItens([]);
    setRestauranteId(null);
  };

  const totalItens = itens.reduce((acc, i) => acc + i.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{
        restauranteId,
        itens,
        adicionarItem,
        removerItem,
        alterarQuantidade,
        limparCarrinho,
        totalItens,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => useContext(CarrinhoContext);
