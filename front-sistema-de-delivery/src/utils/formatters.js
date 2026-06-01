/** Helpers de formatação. */

export function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor ?? 0);
}

export function formatarData(dataISO) {
  if (!dataISO) return '';
  const data = new Date(dataISO);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(data);
}

export function formatarDataCurta(dataISO) {
  if (!dataISO) return '';
  const data = new Date(dataISO);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(data);
}

/**
 * Mapeia o status da API para rótulo, classe CSS e etapa numérica
 * para compatibilidade com a UI existente.
 */
export function statusInfo(status) {
  const map = {
    Pendente:   { label: 'Aguardando Confirmação', classe: 'badge-warning',  etapa: 1 },
    Confirmado: { label: 'Confirmado',             classe: 'badge-info',     etapa: 1 },
    EmPreparo:  { label: 'Preparando',             classe: 'badge-primary',  etapa: 2 },
    EmEntrega:  { label: 'A caminho',              classe: 'badge-info',     etapa: 3 },
    Entregue:   { label: 'Entregue',               classe: 'badge-success',  etapa: 4 },
    Cancelado:  { label: 'Cancelado',              classe: 'badge-danger',   etapa: 0 },
  };
  return map[status] ?? { label: status, classe: 'badge-secondary', etapa: 0 };
}
