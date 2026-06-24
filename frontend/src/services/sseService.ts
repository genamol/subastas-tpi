import api from './api';

export async function obtenerTicket(): Promise<string> {
  const { data } = await api.post<{ ticket: string }>('/api/tickets');
  return data.ticket;
}

export async function obtenerTicketNotificaciones(): Promise<string> {
  const { data } = await api.post<{ ticket: string }>('/api/tickets/notificaciones');
  return data.ticket;
}

export async function obtenerTicketAdmin(): Promise<string> {
  const { data } = await api.post<{ ticket: string }>('/api/admin/tickets');
  return data.ticket;
}
