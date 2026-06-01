import { HEADERS } from '../config/api.config';

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

class ApiService {
  async request(url, method = 'GET', body = null) {
    const options = {
      method,
      headers: { ...HEADERS },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    let response;
    try {
      response = await fetch(url, options);
    } catch {
      throw new ApiError(0, 'Não foi possível conectar ao servidor. Verifique se as APIs estão rodando.');
    }

    if (response.status === 204) return null;

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const message =
        (data && (data.erro || data.message || data.mensagem)) ||
        `Erro ${response.status}`;
      throw new ApiError(response.status, message);
    }

    return data;
  }

  get(url) { return this.request(url, 'GET'); }
  post(url, body) { return this.request(url, 'POST', body); }
  put(url, body) { return this.request(url, 'PUT', body); }
  delete(url) { return this.request(url, 'DELETE'); }
}

export default new ApiService();
