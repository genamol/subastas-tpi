import api from './api';
import type { NotificacionBackend, PaginatedResponse } from '../utils/backendTypes';
import { mapNotificacionToNotification, mapPageToPaginated } from '../utils/mappers';
import type { Notification } from '../types';

export async function listarNotificaciones(page = 0, size = 20): Promise<{ items: Notification[]; totalPages: number; totalElements: number; page: number }> {
  const { data } = await api.get<PaginatedResponse<NotificacionBackend>>(`/api/notificaciones?page=${page}&size=${size}`);
  return mapPageToPaginated(data, mapNotificacionToNotification);
}

export async function marcarLeida(id: number) {
  await api.put(`/api/notificaciones/${id}/leer`);
}

export async function marcarTodasLeidas() {
  await api.put('/api/notificaciones/leer-todas');
}
