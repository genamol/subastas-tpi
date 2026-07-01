import api from './api';

export interface PagoFormData {
  numeroTarjeta: string;
  nombreTitular: string;
  vencimiento: string;
  cvv: string;
  medioPago: string;
}

export interface PagoResponse {
  id: number;
  subastaId: number;
  monto: number;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  medioPago: string;
  ultimosCuatroDigitos: string;
  fechaCreacion: string;
  fechaProcesamiento: string | null;
}

export async function procesarPago(subastaId: string, data: PagoFormData): Promise<PagoResponse> {
  const { data: res } = await api.post<PagoResponse>(`/api/pagos/${subastaId}`, data);
  return res;
}

export async function obtenerPago(subastaId: string): Promise<PagoResponse> {
  const { data } = await api.get<PagoResponse>(`/api/pagos/${subastaId}`);
  return data;
}
