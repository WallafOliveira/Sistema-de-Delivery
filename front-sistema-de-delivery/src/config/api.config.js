// URLs base das 3 APIs do Sistema de Delivery
export const API_CONFIG = {
  BASE_URL_BACK: 'http://localhost:5117/api',       // API Usuários
  BASE_URL_CARDAPIO: 'http://localhost:5272/api',   // API Restaurantes / Produtos
  BASE_URL_PEDIDO: 'http://localhost:5292/api',     // API Pedidos
  TIMEOUT: 30000,
};

export const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
