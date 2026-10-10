import { API_URL } from '../constants/config';
import { getToken } from '../utils/storage';

export class ApiError extends Error {
  status: number;
  activeAlertId?: string;

  constructor(message: string, status: number, activeAlertId?: string) {
    super(message);
    this.status = status;
    this.activeAlertId = activeAlertId;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.auth !== false) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError('Cannot reach SafeLink. Check your connection and the API address.', 0);
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message ?? 'Request failed';
    throw new ApiError(message, response.status, payload?.error?.activeAlertId);
  }

  return payload.data as T;
}
