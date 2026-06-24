import api from './api';
import type { SubastaBackend, PaginatedResponse } from '../utils/backendTypes';
import { mapSubastaToAuction, mapPageToPaginated } from '../utils/mappers';
import { INITIAL_AUCTIONS } from '../initialData';
import type { Auction } from '../types';

export async function listarSubastas(page = 0, size = 20): Promise<{ items: Auction[]; totalPages: number; totalElements: number; page: number }> {
  try {
    const { data } = await api.get<PaginatedResponse<SubastaBackend>>(`/api/subastas?page=${page}&size=${size}`);
    return mapPageToPaginated(data, mapSubastaToAuction);
  } catch {
    return { items: INITIAL_AUCTIONS, totalPages: 1, totalElements: INITIAL_AUCTIONS.length, page: 0 };
  }
}

export async function obtenerSubasta(id: string | number): Promise<Auction> {
  try {
    const { data } = await api.get<SubastaBackend>(`/api/subastas/${id}`);
    return mapSubastaToAuction(data);
  } catch {
    const found = INITIAL_AUCTIONS.find(a => a.id === String(id));
    return found ?? INITIAL_AUCTIONS[0];
  }
}

export async function crearSubasta(request: {
  productoId: number;
  precioBase: number;
  incrementoMinimo: number;
  fechaInicio: string;
  fechaCierre: string;
  descripcion?: string;
}): Promise<Auction> {
  const { data } = await api.post<SubastaBackend>('/api/subastas', request);
  return mapSubastaToAuction(data);
}

export async function publicarSubasta(id: number): Promise<Auction> {
  const { data } = await api.put<SubastaBackend>(`/api/subastas/${id}/publicar`);
  return mapSubastaToAuction(data);
}

export async function cancelarSubasta(id: number): Promise<Auction> {
  const { data } = await api.put<SubastaBackend>(`/api/subastas/${id}/cancelar`);
  return mapSubastaToAuction(data);
}
