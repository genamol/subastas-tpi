import { useState, useEffect, useCallback } from 'react';
import * as subastaService from '../services/subastaService';
import * as pujaService from '../services/pujaService';
import type { Auction, Bid } from '../types';

export function useSubastas() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const cargar = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await subastaService.listarSubastas(p);
      setAuctions(prev => p === 0 ? result.items : [...prev, ...result.items]);
      setTotalPages(result.totalPages);
      setPage(p);
    } catch {
      setError('No se pudo cargar el catálogo. Verificá que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar(0);
  }, [cargar]);

  const pujar = useCallback(async (subastaId: string, monto: number): Promise<{ bid: Bid | null; error: string | null }> => {
    try {
      const bid = await pujaService.registrarPuja(subastaId, monto);
      setAuctions(prev => prev.map(a =>
        a.id === subastaId
          ? { ...a, currentPrice: monto, bidsCount: a.bidsCount + 1, bids: [bid, ...a.bids] }
          : a
      ));
      return { bid, error: null };
    } catch (err: unknown) {
      if (err instanceof Error && 'response' in err) {
        const axiosErr = err as { response?: { data?: { mensaje?: string } } };
        return { bid: null, error: axiosErr.response?.data?.mensaje ?? 'Error al registrar la puja' };
      }
      return { bid: null, error: 'Error de conexión al registrar la puja' };
    }
  }, []);

  const cargarMas = useCallback(() => {
    if (page < totalPages - 1) {
      cargar(page + 1);
    }
  }, [page, totalPages, cargar]);

  return { auctions, loading, error, pujar, cargarMas, totalPages, page };
}
