import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_CARDAPIO });

// Restaurante
export const listarRestaurantes = () =>
  api.get('/api/restaurante');

export const listarRestaurantesAbertos = () =>
  api.get('/api/restaurante/abertos');

export const buscarRestaurante = (id) =>
  api.get(`/api/restaurante/${id}`);

export const criarRestaurante = (dados) =>
  api.post('/api/restaurante', dados);

export const atualizarRestaurante = (id, dados) =>
  api.put(`/api/restaurante/${id}`, dados);

// Produto
export const listarTodosProdutos = () =>
  api.get('/api/produto');

export const listarProdutos = (restauranteId) =>
  api.get(`/api/produto/restaurante/${restauranteId}`);

export const criarProduto = (dados) =>
  api.post('/api/produto', dados);

export const atualizarProduto = (id, dados) =>
  api.put(`/api/produto/${id}`, dados);
