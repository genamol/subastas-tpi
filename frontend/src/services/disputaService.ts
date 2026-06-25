import api from './api';
import type { DisputaBackend, PaginatedResponse } from '../utils/backendTypes';
import type { Dispute } from '../types';

function mapDisputaToDispute(d: DisputaBackend): Dispute {
  return {
    id: String(d.id),
    subastaId: String(d.subastaId),
    subastaTitle: '',
    iniciador: d.iniciadorNombre,
    motivo: d.tipo as Dispute['motivo'],
    descripcion: d.descripcion,
    fechaCreacion: d.fechaCreacion,
    estado: d.resolucionAdmin ? 'RESUELTA' : 'ABIERTA',
    resolucionAdmin: d.resolucionAdmin ?? undefined,
    fechaResolucion: d.fechaResolucion ?? undefined,
  };
}

export async function abrirDisputa(request: {
  subastaId: number;
  tipo: 'FRAUDE' | 'FALTA_DE_PAGO' | 'PRODUCTO_NO_RECIBIDO' | 'OTRO';
  descripcion: string;
}): Promise<Dispute> {
  const { data } = await api.post<DisputaBackend>('/api/disputas', request);
  return mapDisputaToDispute(data);
}

export async function listarDisputasAdmin(page = 0, size = 20): Promise<{ items: Dispute[]; totalPages: number; totalElements: number; page: number }> {
  const { data } = await api.get<PaginatedResponse<DisputaBackend>>(`/api/disputas?page=${page}&size=${size}`);
  return {
    items: data.content.map(mapDisputaToDispute),
    totalPages: data.totalPages,
    totalElements: data.totalElements,
    page: data.number,
  };
}

export async function listarDisputasPorSubasta(subastaId: number | string, page = 0, size = 20): Promise<{ items: Dispute[]; totalPages: number; totalElements: number; page: number }> {
  const { data } = await api.get<PaginatedResponse<DisputaBackend>>(`/api/disputas/subasta/${subastaId}?page=${page}&size=${size}`);
  return {
    items: data.content.map(mapDisputaToDispute),
    totalPages: data.totalPages,
    totalElements: data.totalElements,
    page: data.number,
  };
}

export async function resolverDisputa(disputaId: number | string, resolucion: string): Promise<Dispute> {
  const { data } = await api.put<DisputaBackend>(`/api/disputas/${disputaId}/resolver`, { resolucion });
  return mapDisputaToDispute(data);
}
