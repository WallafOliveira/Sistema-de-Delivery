import ApiService from './api.service';
import { API_CONFIG } from '../config/api.config';

const BASE_URL = `${API_CONFIG.BASE_URL_BACK}/Usuario`;

const UsuarioService = {
  /** Cria um novo usuário. Retorna o UsuarioDTO com id. */
  criar(data) {
    return ApiService.post(BASE_URL, data);
  },

  /** Busca um usuário pelo ID (GUID). */
  buscarPorId(id) {
    return ApiService.get(`${BASE_URL}/${id}`);
  },

  /** Lista todos os usuários. Usado para simular login (sem JWT). */
  listarTodos() {
    return ApiService.get(BASE_URL);
  },

  /** Atualiza os dados do usuário. */
  atualizar(id, data) {
    return ApiService.put(`${BASE_URL}/${id}`, { id, ...data });
  },
};

export default UsuarioService;
