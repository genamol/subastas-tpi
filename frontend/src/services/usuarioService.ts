import api from './api';

export interface UsuarioPublico {
  id: number;
  nombre: string;
  roles: string[];
  createdAt: string;
  totalPujas: number;
  totalSubastas: number;
}

export async function obtenerPerfilPublico(id: number | string): Promise<UsuarioPublico> {
  const { data } = await api.get<UsuarioPublico>(`/api/usuarios/${id}`);
  return data;
}
