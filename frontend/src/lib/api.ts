import type { ApiResponse } from "@/types";

async function getCsrfCookie(): Promise<void> {
  await fetch("/sanctum/csrf-cookie", {
    credentials: "include",
  });
}

function getXsrfToken(): string | null {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  if (!match) return null;
  return decodeURIComponent(match[1]);
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function api<T>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, headers = {} } = options;

  const isModifying = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  if (isModifying) {
    const token = getXsrfToken();
    if (!token) {
      await getCsrfCookie();
    }
  }

  const xsrfToken = getXsrfToken();
  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  if (xsrfToken) {
    requestHeaders["X-XSRF-TOKEN"] = xsrfToken;
  }

  let fetchBody: BodyInit | undefined;

  if (body instanceof FormData) {
    fetchBody = body;
  } else if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
    fetchBody = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: fetchBody,
    credentials: "include",
    redirect: "manual",
  });

  // Handle opaque redirects (302s) — treat as success since Laravel
  // redirects when already authenticated or after successful auth
  if (response.type === "opaqueredirect" || response.status === 0) {
    return { success: true, data: null as T, error: null };
  }

  const text = await response.text();
  if (!text) {
    return { success: response.ok, data: null as T, error: response.ok ? null : "Empty response" };
  }

  try {
    const data: ApiResponse<T> = JSON.parse(text);
    return data;
  } catch {
    return { success: false, data: null as T, error: "Invalid response" };
  }
}

export async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
  return api<T>(url);
}

export async function apiPost<T>(
  url: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  return api<T>(url, { method: "POST", body });
}

export async function apiPut<T>(
  url: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  return api<T>(url, { method: "PUT", body });
}

export async function apiDelete<T>(url: string): Promise<ApiResponse<T>> {
  return api<T>(url, { method: "DELETE" });
}
