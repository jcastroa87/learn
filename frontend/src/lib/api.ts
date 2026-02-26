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
  });

  const data: ApiResponse<T> = await response.json();
  return data;
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
