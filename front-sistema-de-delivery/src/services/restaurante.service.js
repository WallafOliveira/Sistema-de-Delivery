import ApiService from './api.service';
import { API_CONFIG } from '../config/api.config';

const BASE_URL = `${API_CONFIG.BASE_URL_CARDAPIO}/Restaurante`;

const RestauranteService = {
  /** Lista todos os restaurantes cadastrados. */
  listarTodos() {
    return ApiService.get(BASE_URL);
  },

  /** Lista apenas os restaurantes com estaAberto = true. */
  listarAbertos() {
    return ApiService.get(`${BASE_URL}/abertos`);
  },

  /** Busca um restaurante pelo ID (GUID). */
  buscarPorId(id) {
    return ApiService.get(`${BASE_URL}/${id}`);
  },

  /** Cria um restaurante. */
  criar(data) {
    return ApiService.post(BASE_URL, data);
  },

  /** Atualiza dados de um restaurante. */
  atualizar(id, data) {
    return ApiService.put(`${BASE_URL}/${id}`, data);
  },
};

export default RestauranteService;
