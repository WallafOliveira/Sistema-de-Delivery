/**
 * Helpers para gerenciar o carrinho de compras no localStorage.
 * Estrutura:
 * {
 *   restauranteId: string,
 *   restauranteNome: string,
 *   itens: [{ produtoId, nomeProduto, valorUnitario, quantidade }]
 * }
 */

const CART_KEY = 'cart';

export function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem('activePedidoId');
}

/**
 * Adiciona um produto ao carrinho.
 * Se o carrinho já tiver itens de outro restaurante, limpa antes.
 */
export function adicionarAoCarrinho(produto, restauranteId, restauranteNome) {
  let cart = getCart();

  // Se for de outro restaurante, reinicia o carrinho
  if (cart && cart.restauranteId !== restauranteId) {
    cart = null;
  }

  if (!cart) {
    cart = { restauranteId, restauranteNome, itens: [] };
  }

  const existente = cart.itens.find((i) => i.produtoId === produto.id);
  if (existente) {
    existente.quantidade += 1;
  } else {
    cart.itens.push({
      produtoId: produto.id,
      nomeProduto: produto.nome,
      valorUnitario: produto.valor,
      quantidade: 1,
    });
  }

  saveCart(cart);
  return cart;
}

export function removerDoCarrinho(produtoId) {
  const cart = getCart();
  if (!cart) return null;
  cart.itens = cart.itens.filter((i) => i.produtoId !== produtoId);
  if (cart.itens.length === 0) {
    clearCart();
    return null;
  }
  saveCart(cart);
  return cart;
}

export function alterarQuantidade(produtoId, delta) {
  const cart = getCart();
  if (!cart) return null;
  const item = cart.itens.find((i) => i.produtoId === produtoId);
  if (!item) return cart;
  item.quantidade = Math.max(1, item.quantidade + delta);
  saveCart(cart);
  return cart;
}

export function calcularTotal(itens) {
  return itens.reduce((acc, i) => acc + i.valorUnitario * i.quantidade, 0);
}

export function getTotalItens() {
  const cart = getCart();
  if (!cart) return 0;
  return cart.itens.reduce((acc, i) => acc + i.quantidade, 0);
}
