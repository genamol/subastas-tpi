export interface Bid {
  id: string;
  auctionId: string;
  bidderName: string;
  bidderAvatar: string;
  amount: number;
  time: string;
  isCurrentUser?: boolean;
}

export interface Seller {
  name: string;
  rating: number;
  avatar: string;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  startingPrice: number;
  currentPrice: number;
  minIncrement: number;
  bidsCount: number;
  endTime: string;
  createdAt: string;
  seller: Seller;
  bids: Bid[];
  status: 'active' | 'finished';
  estado: string;
  vendedorId: number;
  ganadorId: number | null;
  ganadorNombre: string | null;
}

export interface UserProfile {
  name: string;
  avatar: string;
  balance: number;
  rating: number;
  joinedDate: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
  subastaId: string | null;
}

export interface Dispute {
  id: string;
  subastaId: string;
  subastaTitle: string;
  iniciador: string;
  motivo: 'FRAUDE' | 'FALTA_DE_PAGO' | 'PRODUCTO_NO_RECIBIDO' | 'OTRO';
  descripcion: string;
  fechaCreacion: string;
  estado: 'ABIERTA' | 'RESUELTA';
  resolucionAdmin?: string;
  estadoFinalSubasta?: 'ADJUDICADA' | 'CANCELADA' | 'FINALIZADA';
  fechaResolucion?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  roles: ('USER' | 'SELLER' | 'ADMIN')[];
  rating: number;
  status: 'ACTIVE' | 'BLOCKED';
  createdAt: string;
}
