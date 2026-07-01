import type { Auction, Bid, Notification, Dispute, Seller } from '../types';
import type { SubastaBackend, PujaBackend, NotificacionBackend, PaginatedResponse } from './backendTypes';

export function mapSubastaToAuction(subasta: SubastaBackend): Auction {
  return {
    id: String(subasta.id),
    title: subasta.productoNombre,
    description: subasta.descripcion ?? '',
    category: subasta.categoriaNombre ?? '',
    image: subasta.imagenes?.[0] ?? '',
    startingPrice: subasta.precioBase ?? 0,
    currentPrice: subasta.montoActual ?? subasta.precioBase ?? 0,
    minIncrement: subasta.incrementoMinimo ?? 0,
    bidsCount: subasta.totalPujas ?? 0,
    endTime: subasta.fechaCierre,
    createdAt: subasta.fechaInicio,
    seller: {
      name: subasta.vendedorNombre,
      rating: subasta.vendedorCalificacionPromedio ?? 0,
      avatar: '',
    } as Seller,
    bids: [],
    status: mapEstadoToStatus(subasta.estado),
    estado: subasta.estado,
    vendedorId: subasta.vendedorId,
    ganadorId: subasta.ganadorId,
    ganadorNombre: subasta.ganadorNombre,
    productoId: subasta.productoId,
    estadoPago: subasta.estadoPago ?? null,
    fechaLimitePago: subasta.fechaLimitePago ?? null,
  };
}

export function mapPujaToBid(puja: PujaBackend): Bid {
  return {
    id: String(puja.id),
    auctionId: String(puja.subastaId),
    bidderId: puja.ofertanteId,
    bidderName: puja.ofertanteNombre ?? 'Anónimo',
    bidderAvatar: '',
    amount: puja.monto,
    time: puja.fechaPuja,
  };
}

export function mapNotificacionToNotification(n: NotificacionBackend): Notification {
  return {
    id: String(n.id),
    type: 'info',
    title: 'Notificación',
    message: n.mensaje,
    time: n.fechaCreacion,
    read: n.leida,
    subastaId: n.subastaId != null ? String(n.subastaId) : null,
  };
}

export function mapEstadoToStatus(estado: string): Auction['status'] {
  if (estado === 'ACTIVA') return 'active';
  return 'finished';
}

export function mapPageToPaginated<T, U>(
  page: PaginatedResponse<T>,
  mapper: (item: T) => U
): { items: U[]; totalPages: number; totalElements: number; page: number } {
  return {
    items: page.content.map(mapper),
    totalPages: page.totalPages,
    totalElements: page.totalElements,
    page: page.number,
  };
}
