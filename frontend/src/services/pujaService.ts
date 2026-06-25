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
