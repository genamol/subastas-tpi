import api from './api';
import type { PujaBackend, PaginatedResponse } from '../utils/backendTypes';
import { mapPujaToBid } from '../utils/mappers';
import type { Bid } from '../types';

export async function registrarPuja(subastaId: number | string, monto: number): Promise<Bid> {
  const { data } = await api.post<PujaBackend>('/api/pujas', {
    subastaId: Number(subastaId),
    monto,
  });
  return mapPujaToBid(data);
}

export async function misPujas(page = 0, size = 20): Promise<{ items: Bid[]; totalPages: number; totalElements: number; page: number }> {
  const { data } = await api.get<PaginatedResponse<PujaBackend>>(`/api/pujas/mis-pujas?page=${page}&size=${size}`);
  return {
    items: data.content.map(mapPujaToBid),
    totalPages: data.totalPages,
    totalElements: data.totalElements,
    page: data.number,
  };
}

export async function obtenerPujasPorSubasta(subastaId: string | number, page = 0, size = 50): Promise<Bid[]> {
  const { data } = await api.get<PaginatedResponse<PujaBackend>>(`/api/pujas/subasta/${subastaId}?page=${page}&size=${size}`);
  return data.content.map(mapPujaToBid);
}

export async function obtenerMiPosicion(subastaId: string | number): Promise<number> {
  const { data } = await api.get<{ posicion: number }>(`/api/pujas/subasta/${subastaId}/mi-posicion`);
  return data.posicion;
}
