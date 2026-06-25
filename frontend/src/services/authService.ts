import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
}

export interface AuthResponse {
  accessToken: string;
  email: string;
  nombre: string;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/auth/login', data);
  return response.data;
}

export async function register(data: RegisterRequest): Promise<void> {
  await api.post('/api/auth/register', data);
}

export async function refresh(): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/auth/refresh');
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post('/api/auth/logout');
  localStorage.removeItem('access_token');
}
