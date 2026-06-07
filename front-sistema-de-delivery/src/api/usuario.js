import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_USUARIO });

export const login = (email, senha) =>
  api.post('/api/usuario/login', { email, senha });

export const cadastrar = (dados) =>
  api.post('/api/usuario', dados);

export const listarUsuarios = () =>
  api.get('/api/usuario');

export const buscarUsuario = (id) =>
  api.get(`/api/usuario/${id}`);

export const atualizarUsuario = (id, dados) =>
  api.put(`/api/usuario/${id}`, dados);
