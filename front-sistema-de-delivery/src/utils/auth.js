/** Helpers para persistir e recuperar dados do usuário logado no localStorage. */

const KEYS = {
  USER_ID: 'userId',
  USER_NAME: 'userName',
  USER_EMAIL: 'userEmail',
  USER_TELEFONE: 'userTelefone',
  USER_TIPO: 'userTipo',
};

export function salvarUsuario(usuario) {
  localStorage.setItem(KEYS.USER_ID, usuario.id);
  localStorage.setItem(KEYS.USER_NAME, usuario.nome);
  localStorage.setItem(KEYS.USER_EMAIL, usuario.email);
  localStorage.setItem(KEYS.USER_TELEFONE, usuario.telefone || '');
  localStorage.setItem(KEYS.USER_TIPO, usuario.tipo || 'Cliente');
}

export function getUsuario() {
  const id = localStorage.getItem(KEYS.USER_ID);
  if (!id) return null;
  return {
    id,
    nome: localStorage.getItem(KEYS.USER_NAME) || '',
    email: localStorage.getItem(KEYS.USER_EMAIL) || '',
    telefone: localStorage.getItem(KEYS.USER_TELEFONE) || '',
    tipo: localStorage.getItem(KEYS.USER_TIPO) || 'Cliente',
  };
}

export function isLogado() {
  return !!localStorage.getItem(KEYS.USER_ID);
}

export function logout() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  localStorage.removeItem('cart');
  localStorage.removeItem('activePedidoId');
}
