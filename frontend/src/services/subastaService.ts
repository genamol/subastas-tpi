import api from './api';
import type { SubastaBackend, PaginatedResponse } from '../utils/backendTypes';
import { mapSubastaToAuction, mapPageToPaginated } from '../utils/mappers';
import type { Auction } from '../types';

export async function listarSubastas(page = 0, size = 20): Promise<{ items: Auction[]; totalPages: number; totalElements: number; page: number }> {
  const { data } = await api.get<PaginatedResponse<SubastaBackend>>(`/api/subastas?page=${page}&size=${size}`);
  return mapPageToPaginated(data, mapSubastaToAuction);
}

export async function obtenerSubasta(id: string | number): Promise<Auction> {
  const { data } = await api.get<SubastaBackend>(`/api/subastas/${id}`);
  return mapSubastaToAuction(data);
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

export async function misSubastas(page = 0, size = 20): Promise<{ items: Auction[]; totalPages: number; totalElements: number; page: number }> {
  const { data } = await api.get<PaginatedResponse<SubastaBackend>>(`/api/subastas/mis-subastas?page=${page}&size=${size}`);
  return mapPageToPaginated(data, mapSubastaToAuction);
}

export async function cancelarSubastaAdmin(id: number): Promise<Auction> {
  const { data } = await api.put<SubastaBackend>(`/api/subastas/${id}/cancelar`);
  return mapSubastaToAuction(data);
}
