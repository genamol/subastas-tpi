import api from './api';
import type { UsuarioBackend, PaginatedResponse } from '../utils/backendTypes';

export async function listarUsuarios(page = 0, size = 20) {
  const { data } = await api.get<PaginatedResponse<UsuarioBackend>>(`/api/admin/usuarios?page=${page}&size=${size}`);
  return data;
}

export async function bloquearUsuario(id: number) {
  await api.put(`/api/admin/usuarios/${id}/bloquear`);
}

export async function desbloquearUsuario(id: number) {
  await api.put(`/api/admin/usuarios/${id}/desbloquear`);
}

export async function listarSubastasAdmin(page = 0, size = 20) {
  const { data } = await api.get(`/api/admin/subastas?page=${page}&size=${size}`);
  return data;
}
