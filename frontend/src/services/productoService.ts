import api from './api';
import type { ProductoBackend, PaginatedResponse } from '../utils/backendTypes';

export async function listarProductos(page = 0, size = 20) {
  const { data } = await api.get<PaginatedResponse<ProductoBackend>>(`/api/productos?page=${page}&size=${size}`);
  return data;
}

export async function obtenerProducto(id: number) {
  const { data } = await api.get<ProductoBackend>(`/api/productos/${id}`);
  return data;
}

export async function crearProducto(request: {
  nombre: string;
  descripcion?: string;
  categoriaId: number;
  imagenes?: string[];
}) {
  const { data } = await api.post<ProductoBackend>('/api/productos', request);
  return data;
}

export async function actualizarProducto(id: number, request: {
  nombre: string;
  descripcion?: string;
  categoriaId: number;
  imagenes?: string[];
}) {
  const { data } = await api.put<ProductoBackend>(`/api/productos/${id}`, request);
  return data;
}