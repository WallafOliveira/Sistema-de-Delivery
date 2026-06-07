import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_CARDAPIO });

export const listarRestaurantes = () =>
  api.get('/api/restaurante');

export const buscarRestaurante = (id) =>
  api.get(`/api/restaurante/${id}`);

export const listarProdutos = (restauranteId) =>
  api.get(`/api/produto/restaurante/${restauranteId}`);
