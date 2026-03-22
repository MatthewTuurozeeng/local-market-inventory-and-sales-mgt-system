const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
export const API_BASE_URL = API_URL.replace(/\/api\/?$/, "");

const getToken = () => localStorage.getItem("vendor_token");
const setToken = (token: string) => localStorage.setItem("vendor_token", token);
const clearToken = () => localStorage.removeItem("vendor_token");

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      errorBody.message ||
      (Array.isArray(errorBody.errors) ? errorBody.errors[0]?.msg : "Request failed");
    throw new Error(message);
  }

  return response.json();
};

const requestBlob = async (path: string, options: RequestInit = {}): Promise<Blob> => {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      errorBody.message ||
      (Array.isArray(errorBody.errors) ? errorBody.errors[0]?.msg : "Request failed");
    throw new Error(message);
  }

  return response.blob();
};

const requestFormData = async <T>(path: string, formData: FormData): Promise<T> => {
  const headers = new Headers();
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    body: formData,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      errorBody.message ||
      (Array.isArray(errorBody.errors) ? errorBody.errors[0]?.msg : "Request failed");
    throw new Error(message);
  }

  return response.json();
};

export type VendorProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string | null;
  businessName: string;
  location: string;
  primaryProducts: string;
  staffCount: number;
  productTypes: string[];
  otherProductTypes?: string | null;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
};

export type Sale = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  soldAt: string;
};

export type SalesSummary = {
  revenue: number;
  units: number;
  salesCount: number;
};

export const login = async (payload: { email: string; password: string }) => {
  const data = await request<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setToken(data.token);
  return data;
};

export const registerVendor = async (payload: Record<string, unknown>) => {
  const data = await request<{ token: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setToken(data.token);
  return data;
};

export const requestPasswordReset = async (email: string) =>
  request<{ message: string }>("/auth/reset", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const confirmPasswordReset = async (payload: {
  token: string;
  password: string;
}) =>
  request<{ message: string }>("/auth/reset/confirm", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getProfile = async () =>
  request<VendorProfile>("/vendors/me", { method: "GET" });

export const updateProfile = async (payload: Partial<VendorProfile>) =>
  request<VendorProfile>("/vendors/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);
  return requestFormData<{ avatarUrl: string }>("/vendors/me/avatar", formData);
};

export const getProducts = async () =>
  request<{ products: Product[] }>("/products", { method: "GET" });

export const createProduct = async (payload: Record<string, unknown>) =>
  request<{ id: string }>("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const adjustStock = async (productId: string, delta: number) =>
  request<{ message: string }>(`/products/${productId}/stock`, {
    method: "PATCH",
    body: JSON.stringify({ delta }),
  });

export const getSales = async () =>
  request<{ sales: Sale[] }>("/sales", { method: "GET" });

export const createSale = async (payload: Record<string, unknown>) =>
  request<{ id: string }>("/sales", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getSummary = async () =>
  request<{ summary: SalesSummary }>("/summary", { method: "GET" });

export const downloadSalesReport = async (payload: {
  startDate?: string;
  endDate?: string;
  fields: string[];
  format: "pdf" | "xlsx";
}) =>
  requestBlob("/reports/sales", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const logout = () => {
  clearToken();
};

export const hasToken = () => Boolean(getToken());
