import type { AuthResponse, User } from '../types';
import { clearToken, saveToken } from '../utils/storage';
import { api } from './apiClient';

export async function register(input: { name: string; email: string; phone: string; password: string; preferredLanguage?: 'en' | 'ta' | 'si' }) {
  const data = await api<AuthResponse>('/auth/register', { method: 'POST', body: input, auth: false });
  await saveToken(data.token);
  return data.user;
}

export async function login(email: string, password: string) {
  const data = await api<AuthResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
  await saveToken(data.token);
  return data.user;
}

export async function forgotPassword(email: string) {
  return api<{ message: string; resetToken?: string }>('/auth/forgot-password', {
    method: 'POST',
    body: { email },
    auth: false,
  });
}

export async function resetPassword(input: { email: string; token: string; password: string }) {
  return api<{ message: string }>('/auth/reset-password', { method: 'POST', body: input, auth: false });
}

export function getMe() {
  return api<User>('/auth/me');
}

export async function updateProfile(input: {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  preferredLanguage?: 'en' | 'ta' | 'si';
}) {
  return api<User>('/users/me', { method: 'PATCH', body: input });
}

export async function logout() {
  await clearToken();
}
