import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_PEDIDO });

export const criarPedido = (dados) =>
  api.post('/api/pedido', dados);

export const listarPedidosCliente = (clienteId) =>
  api.get(`/api/pedido/cliente/${clienteId}`);

export const cancelarPedido = (id) =>
  api.delete(`/api/pedido/${id}/cancelar`);
