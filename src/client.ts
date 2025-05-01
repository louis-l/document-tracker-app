import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
});

export type LoginPayload = {
  email: string;
  password: string;
};
export const authClient = {
  csrf: () => api.get("/sanctum/csrf-cookie"),
  login: (data: LoginPayload) => api.post("/login", data),
  logout: () => api.post("/logout"),
};

export type Document = {
  id: number;
  name: string;
  expires_at: string;
};
export type DocumentPagination = {
  current_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  last_page: number;
  path: string;
}
export type DocumentFilterValue = 'all' | 'expiring_soon' | 'already_expired';
export const documentsClient = {
  getDocuments: (params?: { page?: number; per_page?: number, filter?: DocumentFilterValue }) => api.get<{ data: Document[], meta: DocumentPagination }>("/api/documents", { params }),
  getDocument: (id: number) => api.get<{ data: Document }>(`/api/documents/${id}`),
  archiveDocument: (id: number) => api.post(`/api/documents/${id}/archive`),
  createDocument: (data: FormData) => api.post<{ data: Document }>("/api/documents", data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
