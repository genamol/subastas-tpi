import api from './api';

export interface Categoria {
  id: number;
  nombre: string;
}

export async function listarCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>('/api/categorias');
  return data;
}

export async function crearCategoria(nombre: string): Promise<Categoria> {
  const { data } = await api.post<Categoria>('/api/categorias', { nombre });
  return data;
}

export async function actualizarCategoria(id: number, nombre: string): Promise<Categoria> {
  const { data } = await api.put<Categoria>(`/api/categorias/${id}`, { nombre });
  return data;
}

export async function eliminarCategoria(id: number): Promise<void> {
  await api.delete(`/api/categorias/${id}`);
}
