import axios, { AxiosInstance, AxiosError } from 'axios';
import type { PagedResult } from '@/types';
import { useAuthStore } from './authStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:7001/v1';

type RequestOptions = {
  method?: string;
  token?: string;
  body?: string;
  lat?: number;
  lng?: number;
};

type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: {
    message?: string;
    [key: string]: any;
  };
};

async function request<T = any>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const url = new URL(path, BASE_URL);
  if (options.lat != null && options.lng != null) {
    url.searchParams.set('lat', String(options.lat));
    url.searchParams.set('lng', String(options.lng));
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(url.toString(), {
    method: options.method ?? 'GET',
    headers,
    body: options.body,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(payload)}`);
  }

  return payload as ApiResponse<T>;
}

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}) as AxiosInstance & {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
};

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for silent token refresh
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // If 401 and we have a refresh mechanism (to be implemented with backend)
    if (error.response?.status === 401 && originalRequest) {
      // Clear auth and redirect to login
      useAuthStore.getState().clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  register: (body: Record<string, any>) =>
    apiClient.post('/auth/register', body).then((res) => res as any),

  login: (body: { email: string; password: string; role?: string }) =>
    apiClient.post('/auth/login', body).then((res) => res as any),

  verify2FA: (body: { token: string; code: string }) =>
    apiClient.post('/auth/verify-2fa', body).then((res) => res as any),

  verifyOtp: (body: { email: string; code: string }) =>
    apiClient.post('/auth/verify-otp', body).then((res) => res as any),

  me: () =>
    apiClient.get('/auth/me').then((res) => res as any),

  updateProfile: (body: unknown) =>
    apiClient.put('/auth/me/profile', body).then((res) => res as any),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }).then((res) => res as any),

  resetPassword: (body: { resetToken: string; newPassword: string }) =>
    apiClient.post('/auth/reset-password', body).then((res) => res as any),
};

// ── Incidents ──────────────────────────────────────────────────
export const incidentApi = {
  create: (body: {
    type: string;
    lat: number;
    lng: number;
    landmark?: string;
    details?: string;
    photo?: string;
  }) =>
    apiClient.post('/incidents', body).then((res) => res as any),

  getById: (id: string) =>
    apiClient.get(`/incidents/${id}`).then((res) => res as any),

  list: () =>
    apiClient.get('/incidents').then((res) => res as any),

  update: (id: string, body: unknown) =>
    apiClient.put(`/incidents/${id}`, body).then((res) => res as any),

  reportMissingPerson: (body: {
    name: string;
    age: number;
    photo?: string;
    landmark: string;
    timeLast: string;
    description?: string;
    reporterName: string;
    reporterPhone: string;
    relationship: string;
  }) =>
    apiClient.post('/incidents/missing-person', body).then((res) => res as any),

  reportParking: (body: {
    type: 'blocking' | 'relocation';
    plate: string;
    description?: string;
    landmark: string;
    contactAttempted: boolean;
  }) =>
    apiClient.post('/incidents/parking', body).then((res) => res as any),
};

// ── Responder ──────────────────────────────────────────────────
export const responderApi = {
  updateStatus: (body: { status: string; lat?: number; lng?: number }) =>
    apiClient.post('/responder/status', body).then((res) => res as any),

  acceptIncident: (incidentId: string) =>
    apiClient.post(`/responder/incidents/${incidentId}/accept`).then((res) => res as any),

  arriveAtScene: (incidentId: string) =>
    apiClient.post(`/responder/incidents/${incidentId}/arrive`).then((res) => res as any),

  requestBackup: (incidentId: string) =>
    apiClient.post(`/responder/incidents/${incidentId}/backup`).then((res) => res as any),

  completeIncident: (incidentId: string, body: { outcome: string }) =>
    apiClient.post(`/responder/incidents/${incidentId}/complete`, body).then((res) => res as any),
};

export default apiClient;

// ── Properties & Bookings ─────────────────────────────────────
export const propertyApi = {
  create: (token: string, body: unknown) =>
    request('/properties', { method: 'POST', token, body: JSON.stringify(body) }),
  list: (params?: { page?: number; pageSize?: number }) => {
    const q = new URLSearchParams({
      page: String(params?.page ?? 1),
      pageSize: String(params?.pageSize ?? 12),
    });
    return request<PagedResult<import('@/types').Property>>(`/properties?${q}`);
  },

  get: (id: string) =>
    request<import('@/types').Property>(`/properties/${id}`),

  getRoomTypes: (id: string) =>
    request<import('@/types').RoomType[]>(`/properties/${id}/room-types`),

  checkAvailability: (id: string, checkIn: string, checkOut: string) =>
    request(`/properties/${id}/availability?checkIn=${checkIn}&checkOut=${checkOut}`),
};

export const bookingApi = {
  create: (token: string, body: unknown) =>
    request<import('@/types').Booking>('/bookings', {
      method: 'POST', token, body: JSON.stringify(body),
    }),

  myBookings: (token: string, page = 1) =>
    request<PagedResult<import('@/types').Booking>>(`/bookings/mine?page=${page}`, { token }),

  get: (token: string, id: string) =>
    request<import('@/types').Booking>(`/bookings/${id}`, { token }),

  lookup: (token: string, code: string) =>
    request<import('@/types').Booking>(`/bookings/lookup/${code}`, { token }),

  checkIn: (token: string, id: string) =>
    request(`/bookings/${id}/check-in`, { method: 'POST', token }),

  // Admin
  all: (token: string, page = 1) =>
    request<PagedResult<import('@/types').Booking>>(`/admin/bookings?page=${page}`, { token }),
};

// ── Emergency ─────────────────────────────────────────────────
export const emergencyApi = {
  report: (token: string, body: unknown, lat: number, lng: number) =>
    request('/emergency/report', {
      method: 'POST', token, lat, lng, body: JSON.stringify(body),
    }),

  incidents: (token: string, page = 1) =>
    request<PagedResult<import('@/types').Incident>>(
      `/emergency/incidents?page=${page}`, { token }),

  incident: (token: string, id: string) =>
    request<import('@/types').Incident>(`/emergency/incidents/${id}`, { token }),

  updateStatus: (token: string, id: string, body: unknown) =>
    request(`/emergency/incidents/${id}/status`, {
      method: 'PUT', token, body: JSON.stringify(body),
    }),

  updateAvailability: (token: string, isAvailable: boolean) =>
    request('/emergency/officers/availability', {
      method: 'PUT', token, body: JSON.stringify({ isAvailable }),
    }),
};

// ── Missing Persons ───────────────────────────────────────────
export const alertApi = {
  list: (token: string, page = 1) =>
    request<PagedResult<import('@/types').MissingPersonAlert>>(
      `/alerts/missing-persons?page=${page}`, { token }),

  get: (token: string, id: string) =>
    request<import('@/types').MissingPersonAlert>(
      `/alerts/missing-persons/${id}`, { token }),

  create: (token: string, body: unknown, lat: number, lng: number) =>
    request('/alerts/missing-persons', {
      method: 'POST', token, lat, lng, body: JSON.stringify(body),
    }),

  updateStatus: (token: string, id: string, status: string) =>
    request(`/alerts/missing-persons/${id}/status`, {
      method: 'PUT', token, body: JSON.stringify({ status }),
    }),

  sightings: (token: string, id: string) =>
    request<import('@/types').Sighting[]>(
      `/alerts/missing-persons/${id}/sightings`, { token }),
};

// ── Admin – Properties ───────────────────────────────────────
export const adminPropertyApi = {
  list: (token: string, params?: { page?: number; pageSize?: number; status?: string }) => {
    const q = new URLSearchParams({
      page: String(params?.page ?? 1),
      pageSize: String(params?.pageSize ?? 20),
      ...(params?.status ? { status: params.status } : {}),
    });
    return request(`/admin/properties?${q}`, { token });
  },

  approve: (token: string, id: string) =>
    request(`/admin/properties/${id}/approve`, { method: 'PUT', token }),

  reject: (token: string, id: string, reason: string) =>
    request(`/admin/properties/${id}/reject`, {
      method: 'PUT', token, body: JSON.stringify({ reason }),
    }),

  supervise: (token: string, id: string, visitDate: string) =>
    request(`/admin/properties/${id}/supervise`, {
      method: 'PUT', token, body: JSON.stringify({ visitDate }),
    }),
};

// ── Admin – Geofence ──────────────────────────────────────────
export const geofenceApi = {
  getActive: () =>
    request<import('@/types').GeofenceZone>('/admin/geofence/active'),

  list: (token: string) =>
    request<import('@/types').GeofenceZone[]>('/admin/geofence', { token }),

  create: (token: string, body: unknown) =>
    request('/admin/geofence', { method: 'POST', token, body: JSON.stringify(body) }),

  update: (token: string, id: string, body: unknown) =>
    request(`/admin/geofence/${id}`, { method: 'PUT', token, body: JSON.stringify(body) }),

  activate: (token: string, id: string) =>
    request(`/admin/geofence/${id}/activate`, { method: 'PUT', token }),
};

// ── Admin – Users ─────────────────────────────────────────────
export const usersApi = {
  list: (token: string, page = 1) =>
    request(`/admin/users?page=${page}`, { token }),

  create: (token: string, body: unknown) =>
    request('/admin/users', { method: 'POST', token, body: JSON.stringify(body) }),
};

// ── Transit ───────────────────────────────────────────────────
export const transitApi = {
  nodes: () => request<import('@/types').CampNode[]>('/transit/network/nodes'),
  edges: () => request<import('@/types').CampEdge[]>('/transit/network/edges'),
  vehicles: (token: string) =>
    request<import('@/types').ShuttleVehicle[]>('/transit/vehicles/live', { token }),
  closeEdge: (token: string, id: string) =>
    request(`/transit/network/edges/${id}/close`, { method: 'PUT', token }),
  openEdge: (token: string, id: string) =>
    request(`/transit/network/edges/${id}/open`, { method: 'PUT', token }),
};

// ── Bank accounts ─────────────────────────────────────────────
export const bankApi = {
  getBanks: (token: string) =>
    request('/host/bank-accounts/banks', { token }),

  verify: (token: string, body: { bankCode: string; accountNumber: string }) =>
    request('/host/bank-accounts/verify', {
      method: 'POST', token, body: JSON.stringify(body),
    }),

  add: (token: string, body: { bankCode: string; accountNumber: string }) =>
    request('/host/bank-accounts', {
      method: 'POST', token, body: JSON.stringify(body),
    }),

  list: (token: string) =>
    request('/host/bank-accounts', { token }),

  remove: (token: string, id: string) =>
    request(`/host/bank-accounts/${id}`, { method: 'DELETE', token }),
};

// ── Transfers ─────────────────────────────────────────────────
export const transferApi = {
  // Admin can see all transfers for a booking
  forBooking: (token: string, bookingId: string) =>
    request(`/admin/bookings/${bookingId}/transfers`, { token }),
};
