export interface SubastaBackend {
  id: number;
  precioBase: number;
  montoActual: number;
  incrementoMinimo: number;
  fechaInicio: string;
  fechaCierre: string;
  estado: string;
  descripcion: string;
  fechaAdjudicacion: string | null;
  productoId: number;
  productoNombre: string;
  categoriaNombre: string;
  imagenes: string[];
  totalPujas: number;
  vendedorId: number;
  vendedorNombre: string;
  ganadorId: number | null;
  ganadorNombre: string | null;
}

export interface PujaBackend {
  id: number;
  monto: number;
  fechaPuja: string;
  subastaId: number;
  ofertanteId: number | null;
  ofertanteNombre: string | null;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface NotificacionBackend {
  id: number;
  mensaje: string;
  tipo: string;
  leida: boolean;
  fechaCreacion: string;
  destinatarioId: number;
  subastaId: number | null;
}

export interface ProductoBackend {
  id: number;
  nombre: string;
  descripcion: string;
  createdAt: string;
  vendedorId: number;
  vendedorNombre: string;
  categoriaId: number;
  categoriaNombre: string;
  imagenes: string[];
}

export interface UsuarioBackend {
  id: number;
  nombre: string;
  email: string;
  bloqueado: boolean;
  roles: string[];
  createdAt: string;
}

export interface DisputaBackend {
  id: number;
  tipo: string;
  descripcion: string;
  resolucionAdmin: string | null;
  fechaCreacion: string;
  fechaResolucion: string | null;
  subastaId: number;
  iniciadorId: number;
  iniciadorNombre: string;
  resoltorId: number | null;
}
