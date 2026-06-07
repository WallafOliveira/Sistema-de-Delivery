import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_PEDIDO });

export const criarPedido = (dados) =>
  api.post('/api/pedido', dados);

export const listarTodosPedidos = () =>
  api.get('/api/pedido');

export const buscarPedido = (id) =>
  api.get(`/api/pedido/${id}`);

export const listarPedidosCliente = (clienteId) =>
  api.get(`/api/pedido/cliente/${clienteId}`);

export const atualizarStatusPedido = (id, status) =>
  api.put(`/api/pedido/${id}/status`, { id, status: status });

export const cancelarPedido = (id) =>
  api.delete(`/api/pedido/${id}/cancelar`);
