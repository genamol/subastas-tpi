import api from './api';
import { API_URL } from '../config';

export async function subirImagen(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/api/imagenes/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  const url: string = data.url;
  if (url.startsWith('/uploads/')) {
    return API_URL + url;
  }
  return url;
}
