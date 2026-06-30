import api from './api';

export interface CalificacionRequest {
  subastaId: number;
  calificadoId: number;
  puntuacion: number;
  comentario?: string;
}

export interface CalificacionResponse {
  id: number;
  puntuacion: number;
  comentario: string | null;
  fechaCreacion: string;
  subastaId: number;
  calificadorId: number;
  calificadorNombre: string;
  calificadoId: number;
  calificadoNombre: string;
}

interface PaginatedCalificaciones {
  content: CalificacionResponse[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export async function calificar(request: CalificacionRequest): Promise<CalificacionResponse> {
  const { data } = await api.post<CalificacionResponse>('/api/calificaciones', request);
  return data;
}

export async function obtenerCalificacionesPorUsuario(
  userId: number,
  page = 0,
  size = 10
): Promise<PaginatedCalificaciones> {
  const { data } = await api.get<PaginatedCalificaciones>(
    `/api/calificaciones/usuario/${userId}?page=${page}&size=${size}`
  );
  return data;
}
