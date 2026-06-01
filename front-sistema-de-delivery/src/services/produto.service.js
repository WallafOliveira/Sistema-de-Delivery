import ApiService from './api.service';
import { API_CONFIG } from '../config/api.config';

const BASE_URL = `${API_CONFIG.BASE_URL_CARDAPIO}/Produto`;

const ProdutoService = {
  /** Lista todos os produtos de um restaurante específico. */
  listarPorRestaurante(restauranteId) {
    return ApiService.get(`${BASE_URL}/restaurante/${restauranteId}`);
  },

  /** Lista todos os produtos. */
  listarTodos() {
    return ApiService.get(BASE_URL);
  },
};

export default ProdutoService;
