import api from './api';
import type { PujaBackend } from '../utils/backendTypes';
import { mapPujaToBid } from '../utils/mappers';
import type { Bid } from '../types';

export async function registrarPuja(subastaId: number | string, monto: number): Promise<Bid> {
  const { data } = await api.post<PujaBackend>('/api/pujas', {
    subastaId: Number(subastaId),
    monto,
  });
  return mapPujaToBid(data);
}
