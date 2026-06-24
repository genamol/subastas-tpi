import { useState, useEffect, useCallback } from 'react';
import * as subastaService from '../services/subastaService';
import * as pujaService from '../services/pujaService';
import type { Auction, Bid } from '../types';

export function useSubastas() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const cargar = useCallback(async (p: number) => {
    setLoading(true);
    const result = await subastaService.listarSubastas(p);
    setAuctions(prev => p === 0 ? result.items : [...prev, ...result.items]);
    setTotalPages(result.totalPages);
    setPage(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    cargar(0);
  }, [cargar]);

  const pujar = useCallback(async (subastaId: string, monto: number): Promise<Bid | null> => {
    try {
      const bid = await pujaService.registrarPuja(subastaId, monto);
      setAuctions(prev => prev.map(a =>
        a.id === subastaId
          ? { ...a, currentPrice: monto, bidsCount: a.bidsCount + 1, bids: [bid, ...a.bids] }
          : a
      ));
      return bid;
    } catch {
      return null;
    }
  }, []);

  const cargarMas = useCallback(() => {
    if (page < totalPages - 1) {
      cargar(page + 1);
    }
  }, [page, totalPages, cargar]);

  return { auctions, loading, pujar, cargarMas, totalPages, page };
}
