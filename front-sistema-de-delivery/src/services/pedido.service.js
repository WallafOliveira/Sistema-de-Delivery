import ApiService from './api.service';
import { API_CONFIG } from '../config/api.config';

const BASE_URL = `${API_CONFIG.BASE_URL_PEDIDO}/Pedido`;

const PedidoService = {
  /**
   * Cria um novo pedido.
   * @param {{ clienteId: string, restauranteId: string, itens: Array }} data
   */
  criar(data) {
    return ApiService.post(BASE_URL, data);
  },

  /** Busca um pedido pelo ID. */
  buscarPorId(id) {
    return ApiService.get(`${BASE_URL}/${id}`);
  },

  /** Lista todos os pedidos de um cliente. */
  listarPorCliente(clienteId) {
    return ApiService.get(`${BASE_URL}/cliente/${clienteId}`);
  },

  /** Lista todos os pedidos (admin). */
  listarTodos() {
    return ApiService.get(BASE_URL);
  },

  /**
   * Atualiza o status de um pedido.
   * status: "Pendente" | "Confirmado" | "EmPreparo" | "EmEntrega" | "Entregue" | "Cancelado"
   */
  atualizarStatus(id, status) {
    return ApiService.put(`${BASE_URL}/${id}/status`, { id, status });
  },

  /** Cancela um pedido. */
  cancelar(id) {
    return ApiService.delete(`${BASE_URL}/${id}/cancelar`);
  },
};

export default PedidoService;
